import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.html',
})
export class Auth implements AfterViewInit {
  constructor(
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.auth.loadGoogleScript();
    this.auth.initGoogleLogin((resp) =>
      this.auth.handleGoogleCredentialResponse(resp),
    );
  }
}
