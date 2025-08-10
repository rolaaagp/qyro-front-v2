import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserContextService } from '../context/user.context';
import { lastValueFrom } from 'rxjs';
import { AuthQyroService } from '@services/auth/authQyro.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userContext = inject(UserContextService);

  const currentUser = userContext.currentUser.user;
  if (currentUser) return true;

  if (typeof window === 'undefined')
    return router.createUrlTree(['/auth/login']);

  const email = window.localStorage.getItem('email');
  if (!email) return router.createUrlTree(['/auth/login']);

  try {
    const userService = inject(AuthQyroService);
    const res = await lastValueFrom(userService.checkEmail(email));
    if (res?.exists && res?.user) {
      userContext.currentUser = {
        user: {
          ...res.user,
          token: res.token as string,
        },
      };
      console.log(userContext.currentUser);
      return true;
    }
  } catch {
    return router.createUrlTree(['/auth/login']);
  }

  return router.createUrlTree(['/auth/login']);
};
