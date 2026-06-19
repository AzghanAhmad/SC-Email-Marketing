import { Injectable, signal } from '@angular/core';
import { Observable, of, tap, catchError, map, throwError, filter, take, finalize } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { ApiService } from './api.service';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mailboxConnected?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = 'scribecount_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private _initialized = signal(false);

  user = this._user.asReadonly();
  initialized = this._initialized.asReadonly();

  constructor(private api: ApiService) {
    this.restoreSession();
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this._user();
  }

  whenReady(): Observable<void> {
    if (this._initialized()) return of(undefined);
    return toObservable(this._initialized).pipe(
      filter(initialized => initialized),
      take(1),
      map(() => undefined)
    );
  }

  refreshProfile(): Observable<User | null> {
    if (!this.getToken()) {
      this._user.set(null);
      return of(null);
    }
    return this.api.get<User>('/auth/me').pipe(
      tap(user => this._user.set(user)),
      catchError(() => {
        this._user.set(null);
        return of(null);
      })
    );
  }

  restoreSession(): void {
    if (!this.getToken()) {
      this._initialized.set(true);
      return;
    }
    this.api.get<User>('/auth/me').pipe(
      tap(user => this._user.set(user)),
      catchError(() => {
        this._user.set(null);
        return of(null);
      }),
      finalize(() => this._initialized.set(true))
    ).subscribe();
  }

  hasValidSession(): boolean {
    return this.isLoggedIn() || !!this.getToken();
  }

  clearSession(): void {
    this._user.set(null);
    this.clearToken();
  }

  login(email: string, password: string): Observable<User> {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(res => this.persistAuth(res)),
      map(res => res.user),
      catchError(err => throwError(() => err))
    );
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.api.post<AuthResponse>('/auth/register', { name, email, password }).pipe(
      tap(res => this.persistAuth(res)),
      map(res => res.user),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    this.clearSession();
  }

  updateCachedUser(partial: Partial<User>): void {
    const u = this._user();
    if (u) this._user.set({ ...u, ...partial });
  }

  changePassword(current: string, next: string): Observable<void> {
    return this.api.post<void>('/auth/change-password', { currentPassword: current, newPassword: next });
  }

  private persistAuth(res: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, res.token);
    }
    this._user.set(res.user);
  }

  private clearToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
}
