import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { environment } from '@environments/environment';
import { AuthQyroService } from './authQyro.service';
import { ToastService } from '@services/toast/toast.service';
import { SpinnerService } from '@services/spinners/spinner-overlay.service';
import { UserContextService } from '@context/user.context';
import { User, UserWithToken } from '@interfaces/user.interface';
import { Router } from '@angular/router';

declare global {
  interface Window {
    google: any;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    private authQyroService: AuthQyroService,
    private readonly spinnerService: SpinnerService,
    private userContext: UserContextService,
  ) {}

  async loadGoogleScript(): Promise<void> {
    if (!this.isBrowser) return;
    if ((window as any).google?.accounts) return;

    const existing = this.doc.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      await new Promise<void>((res) =>
        existing.addEventListener('load', () => res()),
      );
      return;
    }

    await new Promise<void>((resolve) => {
      const script = this.doc.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      this.doc.head.appendChild(script);
    });
  }

  initGoogleLogin(callback: (response: any) => void): void {
    if (!this.isBrowser) return;

    const el = this.doc.getElementById('googleBtn');
    (window as any).google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback,
      cancel_on_tap_outside: false,
    });

    if (el && el.children.length === 0) {
      (window as any).google.accounts.id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        width: 240,
      });
    }
    (window as any).google.accounts.id.prompt();
  }

  async handleGoogleCredentialResponse(response: any): Promise<void> {
    if (!this.isBrowser) return;
    if (!response?.credential) return;

    const tokenGoogle = response.credential;
    let email: string | undefined;

    try {
      const payload = JSON.parse(atob(tokenGoogle.split('.')[1]));
      email = payload?.email;
      if (!email) throw new Error('Email no presente en token');
    } catch {
      this.toastService.show({
        message: 'Token inválido recibido de Google.',
        duration: 10000,
        position: { horizontal: 'center', vertical: 'top' },
        type: 'warning',
      });
      return;
    }

    this.spinnerService.show();
    this.authQyroService.checkEmail(email).subscribe({
      next: (res) => {
        if (!res.exists || !res.user) {
          this.toastService.show({
            message: 'Usuario no encontrado. Contacte con un administrador.',
            duration: 5000,
            position: { horizontal: 'center', vertical: 'top' },
            type: 'warning',
          });
          this.spinnerService.hide();
          return;
        }

        if (!res.user.is_active) {
          this.toastService.show({
            message: 'Usuario no activo. Contacte con un administrador.',
            duration: 5000,
            position: { horizontal: 'center', vertical: 'top' },
            type: 'warning',
          });
          this.spinnerService.hide();
          return;
        }

        this.storeTokenUser({
          user: { ...res.user, tokenGoogle, token: res.token as string },
        });
      },
      error: () => {
        this.toastService.show({
          message: 'Error al validar el usuario en el servidor.',
          duration: 3000,
          position: { horizontal: 'center', vertical: 'top' },
          type: 'warning',
        });
        this.spinnerService.hide();
      },
      complete: () => this.spinnerService.hide(),
    });
  }

  storeTokenUser(data: { user: UserWithToken }): void {
    this.userContext.currentUser = { user: data.user };
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('token', data.user.token as string);
    this.loginRedirect();
  }

  loginRedirect(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      this.router.navigate(['/chats']);
    }, 0);
  }

  logout(): void {
    if (!this.isBrowser) return;
    this.userContext.clear();
    localStorage.removeItem('theme-preference');
    this.router.navigate(['/auth/login']);
  }
}
