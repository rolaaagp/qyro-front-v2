import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chips } from '@components/chips/chips';
import type { Chip } from '@interfaces/chip.interface';
import { ChatService } from '@services/chat';
import { retry } from 'rxjs';
import { UserContextService } from '@context/user.context';
import { IChat, IMessages } from '@interfaces/chat.interface';
import { HighlightPipe } from '@pipes/highlight.pipe';

interface ChipWithMessage extends Chip {
  messages?: IMessages[];
}

type ConfirmAction = 'remove-chip' | 'delete-chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Chips, ReactiveFormsModule, CommonModule, HighlightPipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit {
  private chatService = inject(ChatService);

  chips = signal<ChipWithMessage[]>([]);
  selectedId = signal<number | null>(null);

  loadingChat: boolean = false;

  selectedMessages = computed(() => {
    const id = this.selectedId();
    if (id === null) return [];
    return this.chips().find((c) => c.id === id)?.messages ?? [];
  });

  hasMessages = computed(() => this.selectedMessages().length > 0);

  confirm = signal<{ open: boolean; id: number | null; action: ConfirmAction }>(
    { open: false, id: null, action: 'remove-chip' },
  );

  createForm = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
  });

  ngOnInit(): void {
    this.getChats();
  }

  getChats(): void {
    this.chatService
      .getAll()
      .pipe(retry(1))
      .subscribe({
        next: (res) => {
          const mapped = res.map((c: any) => ({ id: c.id, title: c.title }));
          this.chips.set(mapped);
        },
      });
  }

  onSelectChip(id: number | null): void {
    this.selectedId.set(id);
    this.refreshSelectedMessages();
  }

  createChat(): void {
    if (this.createForm.invalid || this.loadingChat) return;
    this.loadingChat = true;
    const payload = { title: this.createForm.controls.message.value };
    this.chatService
      .create({
        message: payload.title,
        username: UserContextService.user?.username as string,
      })
      .subscribe({
        next: (created) => {
          const title = created.chat?.title as string;
          this.chips.update((list) => [
            { id: created.id, title, messages: [created] },
            ...list,
          ]);
          this.createForm.reset({ message: '' });
        },
        complete: () => {
          this.loadingChat = false;
        },
      });
  }

  refreshSelectedMessages(): void {
    const id = this.selectedId();
    if (id === null) return;

    this.chatService.getAllMessages(id).subscribe({
      next: (messages: IMessages[]) => {
        this.chips.update((list) =>
          list.map((c) => (c.id === id ? { ...c, messages } : c)),
        );
      },
    });
  }

  sendMessage(): void {
    if (this.createForm.invalid || this.loadingChat) return;
    const content = this.createForm.controls.message.value.trim();
    if (!content) return;

    this.loadingChat = true;

    const sel = this.selectedId();

    if (sel !== null) {
      this.chatService
        .createMessage({ chat_id: sel, message: content })
        .subscribe({
          next: (created: IMessages) => {
            this.chips.update((list) =>
              list.map((c) =>
                c.id === sel
                  ? { ...c, messages: [...(c.messages ?? []), created] }
                  : c,
              ),
            );
            this.createForm.reset({ message: '' });
            queueMicrotask(() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
              }),
            );
          },
          complete: () => {
            this.loadingChat = false;
          },
        });
    } else {
      const username = UserContextService.user?.username ?? 'anon';
      this.chatService.create({ message: content, username }).subscribe({
        next: (created: IMessages) => {
          const chat = created.chat as IChat;
          const title = chat.title;
          const newId = chat.id;
          this.chips.update((list) => [
            { id: newId, title, messages: [created] },
            ...list,
          ]);
          this.selectedId.set(newId);
          this.createForm.reset({ message: '' });
          queueMicrotask(() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            }),
          );
        },
        complete: () => {
          this.loadingChat = false;
        },
      });
    }
  }

  onRemoveChipRequest(id: number): void {
    this.confirm.set({ open: true, id, action: 'delete-chat' });
  }

  deleteChatRequest(): void {
    const id = this.selectedId();
    if (id === null) return;
    this.confirm.set({ open: true, id, action: 'delete-chat' });
  }

  confirmNo(): void {
    this.confirm.set({ open: false, id: null, action: 'delete-chat' });
  }

  confirmYes(): void {
    const { id, action } = this.confirm();
    if (id === null) return;
    if (action === 'delete-chat') {
      this.chatService.delete(id).subscribe({
        next: () => {
          this.chips.update((list) => list.filter((c) => c.id !== id));
          this.selectedId.set(null);
          this.confirmNo();
        },
      });
    }
  }

  copyText(html: string) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    navigator.clipboard.writeText(tmp.innerText || '');
  }

  copyCode(html: string) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const codeEl = tmp.querySelector('code');
    if (codeEl) {
      navigator.clipboard.writeText(codeEl.innerText || '');
    }
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  handleEnter(e: any) {
    if (e.shiftKey) return; // Shift+Enter: nueva línea
    e.preventDefault();
    this.sendMessage();
  }
}
