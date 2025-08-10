import {
  Component,
  Input,
  signal,
  computed,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  label: string;
  route?: string | any[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Output() widthChange = new EventEmitter<string>();
  menu: MenuItem[] = [
    { label: 'Chats', route: '/chats' },
    {
      label: 'Chats IA',
      children: [
        { label: 'Chats', route: '/finances/chat' },
        { label: 'Cuenta', route: '/settings/account' },
      ],
    },
  ];

  section = signal<Record<string, boolean>>({});
  open = signal(false);
  width = computed(() => (this.open() ? '16rem' : '4rem')); // 256px / 64px en desktop
  mm = window.matchMedia('(min-width: 1024px)'); // lg

  ngOnInit() {
    const apply = () => {
      const w = this.mm.matches ? this.width() : '0px'; // móvil: flota, no empuja
      document.documentElement.style.setProperty('--sbw', w);
      this.widthChange.emit(w);
    };
    apply();
    this.mm.addEventListener('change', apply);
    (this as any)._apply = apply;
  }
  ngOnDestroy() {
    try {
      this.mm.removeEventListener('change', (this as any)._apply);
    } catch {}
  }
  toggle() {
    this.open.update((v) => !v);
    const w = this.mm.matches ? this.width() : '0px';
    document.documentElement.style.setProperty('--sbw', w);
    this.widthChange.emit(w);
  }

  toggleSection(key: string) {
    const s = { ...this.section() };
    s[key] = !s[key];
    this.section.set(s);
  }
}
