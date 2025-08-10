import { Injectable } from '@angular/core';
import type { UserWithToken } from '@interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private static _user: UserWithToken | null = null;

  get currentUser(): { user: UserWithToken | null } {
    return { user: UserContextService._user };
  }

  set currentUser(data: { user: UserWithToken }) {
    UserContextService._user = data.user;
  }

  static get user(): UserWithToken | null {
    return UserContextService._user;
  }

  static set user(value: UserWithToken | null) {
    UserContextService._user = value;
  }

  clear(): void {
    UserContextService._user = null;
  }
}
