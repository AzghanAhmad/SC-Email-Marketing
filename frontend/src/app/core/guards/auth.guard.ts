import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const loginRedirect = () =>
    router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  return auth.whenReady().pipe(
    switchMap(() => {
      if (auth.hasValidSession()) {
        if (!auth.isLoggedIn() && auth.getToken()) {
          return auth.refreshProfile().pipe(
            map(() => (auth.hasValidSession() ? true : loginRedirect()))
          );
        }
        return of(true);
      }
      return of(loginRedirect());
    })
  );
};
