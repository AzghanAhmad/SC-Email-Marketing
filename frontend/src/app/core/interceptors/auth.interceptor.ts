import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const isPublicAuthRoute = req.url.includes('/auth/login')
        || req.url.includes('/auth/register');

      if (err.status === 401 && !isPublicAuthRoute) {
        auth.clearSession();
      }

      return ApiService.throwMapped(err);
    })
  );
};
