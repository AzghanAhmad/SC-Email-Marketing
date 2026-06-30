import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`);
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${path}`, body);
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.http.patch<T>(`${environment.apiUrl}${path}`, body ?? {});
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${path}`);
  }

  static mapError(err: HttpErrorResponse): { message: string } {
    const fallback = err.message || 'Something went wrong.';
    let body: unknown = err.error;

    if (typeof body === 'string') {
      const text = body.trim();
      if (!text) return { message: fallback };
      try {
        body = JSON.parse(text);
      } catch {
        return { message: text };
      }
    }

    if (body && typeof body === 'object' && 'message' in body) {
      const message = (body as { message: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return { message: message.trim() };
      }
    }

    return { message: fallback };
  }

  static throwMapped(err: HttpErrorResponse) {
    return throwError(() => ApiService.mapError(err));
  }
}
