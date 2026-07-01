import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface MailboxConnection {
  emailAddress: string;
  imapHost: string;
  imapPort: number;
  imapUseSsl: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUseSsl: boolean;
  username: string;
  provider: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export interface MailboxSetupInstructions {
  title: string;
  providers: {
    provider: string;
    imapHost: string;
    imapPort: number;
    smtpHost: string;
    smtpPort: number;
    steps: string[];
  }[];
  generalSteps: string[];
}

export interface SaveMailboxConnectionRequest {
  emailAddress: string;
  imapHost: string;
  imapPort: number;
  imapUseSsl: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUseSsl: boolean;
  username: string;
  password: string;
  provider: string;
}

@Injectable({ providedIn: 'root' })
export class MailboxApiService {
  constructor(private api: ApiService) {}

  getSetupInstructions(): Observable<MailboxSetupInstructions> {
    return this.api.get<MailboxSetupInstructions>('/mailbox/setup-instructions');
  }

  getConnection(): Observable<MailboxConnection> {
    return this.api.get<MailboxConnection>('/mailbox/connection');
  }

  testConnection(request: SaveMailboxConnectionRequest): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/mailbox/test', request);
  }

  connect(request: SaveMailboxConnectionRequest): Observable<{ connection: MailboxConnection; message: string; smtpAvailable?: boolean }> {
    return this.api.post<{ connection: MailboxConnection; message: string; smtpAvailable?: boolean }>('/mailbox/connect', request);
  }

  getHostingInfo(): Observable<{ smtpRestricted: boolean; message?: string }> {
    return this.api.get<{ smtpRestricted: boolean; message?: string }>('/mailbox/hosting-info');
  }

  disconnect(): Observable<MailboxConnection> {
    return this.api.post<MailboxConnection>('/mailbox/disconnect', {});
  }

  sync(): Observable<{ synced: number; message: string }> {
    return this.api.post<{ synced: number; message: string }>('/mailbox/sync', {});
  }
}
