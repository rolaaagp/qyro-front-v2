import { HttpInterceptorFn } from '@angular/common/http';
import { UserContextService } from '@context/user.context';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  try {
    if (typeof window !== 'undefined') {
      token = UserContextService.user?.token as string;
    }
  } catch {}

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: 'Token ' + token } })
    : req;

  return next(authReq);
};
