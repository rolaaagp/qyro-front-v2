import { Injectable, signal } from '@angular/core';
import { Toast } from '@interfaces/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);
  toasts$ = this.toasts.asReadonly();

  show(data: {
    message: string;
    type?: Toast['type'];
    duration?: number;
    position?: Toast['position'];
  }) {
    const id = crypto.randomUUID();
    const toast: Toast = {
      id,
      message: data.message,
      type: data.type ?? 'info',
      duration: data.duration ?? 4000,
      position: data.position ?? { vertical: 'top', horizontal: 'right' },
      visible: true,
    };

    this.toasts.update((prev) => [...prev, toast]);
    setTimeout(() => this.dismiss(id), toast.duration);
  }

  dismiss(id: string) {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }

  get currentToasts(): Toast[] {
    return this.toasts();
  }
}
