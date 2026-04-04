import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>({
    id: '1', name: 'Jane Austen', email: 'jane@scribecount.com'
  });

  user = this._user.asReadonly();

  isLoggedIn(): boolean {
    return !!this._user();
  }

  login(email: string, password: string): Observable<User> {
    if (!email || !password) return throwError(() => ({ message: 'Invalid credentials' }));
    const user: User = { id: '1', name: 'Jane Austen', email };
    this._user.set(user);
    return of(user).pipe(delay(800));
  }

  register(name: string, email: string, password: string): Observable<User> {
    const user: User = { id: '1', name, email };
    this._user.set(user);
    return of(user).pipe(delay(1000));
  }

  logout(): void {
    this._user.set(null);
  }

  updateCachedUser(partial: Partial<User>): void {
    const u = this._user();
    if (u) this._user.set({ ...u, ...partial });
  }

  changePassword(current: string, next: string): Observable<void> {
    return of(undefined).pipe(delay(600));
  }
}
