import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chips } from '@components/chips/chips';
import type { Chip } from '@interfaces/chip.interface';
import { ChatService } from '@services/chat';
import { retry } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Chips, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit {
  private chatService = inject(ChatService);

  chips = signal<Chip[]>([]);
  createForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
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
          const mapped = res.map(c => ({ id: c.id, title: c.title }));
          this.chips.set(mapped);
        },
      });
  }

  onRemoveChip(id: number): void {
    this.chips.update(list => list.filter(c => c.id !== id));
  }

  createChat(): void {
    if (this.createForm.invalid) return;
    const payload = { title: this.createForm.controls.title.value };
    this.chatService.create(payload).subscribe({
      next: (created) => {
        this.chips.update(list => [{ id: created.id, title: created.title }, ...list]);
        this.createForm.reset({ title: '' });
      },
    });
  }
}
