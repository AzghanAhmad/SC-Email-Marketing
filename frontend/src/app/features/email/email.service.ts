import { Injectable, signal, computed } from '@angular/core';
import { parseApiDate } from './email-datetime.utils';
import { Observable, tap, map } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
  contentBase64?: string;
}

export interface AttachmentPayload {
  name: string;
  size: string;
  type: string;
  contentBase64: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'scheduled' | 'spam' | 'trash';
  attachments: EmailAttachment[];
  labels?: string[];
}

export interface ComposePayload {
  to: string;
  subject: string;
  body: string;
  attachments: EmailAttachment[];
  scheduledAt?: Date;
  messageId?: string;
}

interface EmailDto {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  folder: string;
  attachments: EmailAttachment[];
  labels?: string[];
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private _emails = signal<Email[]>([]);
  private _loaded = signal(false);

  readonly emails = this._emails.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  readonly inboxEmails = computed(() =>
    this._emails().filter(e => e.folder === 'inbox')
  );

  readonly sentEmails = computed(() =>
    this._emails().filter(e => e.folder === 'sent')
  );

  readonly draftEmails = computed(() =>
    this._emails().filter(e => e.folder === 'drafts')
  );

  readonly scheduledEmails = computed(() =>
    this._emails().filter(e => e.folder === 'scheduled')
  );

  readonly spamEmails = computed(() =>
    this._emails().filter(e => e.folder === 'spam')
  );

  readonly trashEmails = computed(() =>
    this._emails().filter(e => e.folder === 'trash')
  );

  readonly folderCounts = computed(() => {
    const emails = this._emails();
    const count = (folder: string) => emails.filter(e => e.folder === folder).length;
    return {
      all: emails.length,
      inbox: count('inbox'),
      sent: count('sent'),
      drafts: count('drafts'),
      scheduled: count('scheduled'),
      spam: count('spam'),
      trash: count('trash'),
    };
  });

  static formatFolderCount(count: number): string {
    if (count <= 0) return '';
    return count > 99 ? '99+' : String(count);
  }

  constructor(private api: ApiService) {}

  clearInbox(): void {
    this._emails.set([]);
    this._loaded.set(false);
  }

  loadMessages(): Observable<Email[]> {
    return this.api.get<EmailDto[]>('/mailbox/messages').pipe(
      map(dtos => dtos.map(d => this.mapDto(d))),
      tap(emails => {
        this._emails.set(emails);
        this._loaded.set(true);
      })
    );
  }

  getEmailsByFolder(folder: string): Email[] {
    if (folder === 'all') {
      return [...this._emails()].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    return this._emails().filter(e => e.folder === folder);
  }

  getEmailById(id: string): Email | undefined {
    return this._emails().find(e => e.id === id);
  }

  markAsRead(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, read: true } : e)
    );
    this.api.patch(`/mailbox/messages/${id}/read?read=true`).subscribe();
  }

  markAsUnread(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, read: false } : e)
    );
    this.api.patch(`/mailbox/messages/${id}/read?read=false`).subscribe();
  }

  toggleStar(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, starred: !e.starred } : e)
    );
    this.api.patch(`/mailbox/messages/${id}/star`).subscribe();
  }

  deleteEmail(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, folder: 'trash' as const } : e)
    );
    this.api.delete(`/mailbox/messages/${id}`).subscribe();
  }

  sendEmail(to: string, subject: string, body: string, attachments: EmailAttachment[] = []): Observable<void> {
    const preview = this.plainTextPreview(body);
    const payload = this.toAttachmentPayloads(attachments).filter(a => !!a.contentBase64);
    return this.api.post<void>('/mailbox/send', { to, subject, body, attachments: payload }).pipe(
      tap(() => {
        const newEmail: Email = {
          id: 'e' + Date.now(),
          from: 'You',
          fromEmail: '',
          to: to.split('@')[0] || to,
          toEmail: to,
          subject,
          preview,
          body,
          timestamp: new Date(),
          read: true,
          starred: false,
          folder: 'sent',
          attachments: attachments.map(a => ({ name: a.name, size: a.size, type: a.type })),
        };
        this._emails.update(emails => [newEmail, ...emails]);
      })
    );
  }

  scheduleEmail(
    to: string,
    subject: string,
    body: string,
    scheduledAt?: Date,
    attachments: EmailAttachment[] = []
  ): Observable<Email> {
    return this.api.post<EmailDto>('/mailbox/schedule', {
      to,
      subject,
      body,
      scheduledAt: scheduledAt?.toISOString() ?? null,
      attachments: this.toAttachmentPayloads(attachments),
    }).pipe(
      map(dto => this.mapDto(dto)),
      tap(email => this._emails.update(emails => [email, ...emails]))
    );
  }

  saveDraft(to: string, subject: string, body: string, attachments: EmailAttachment[] = []): Observable<Email> {
    return this.api.post<EmailDto>('/mailbox/drafts', {
      to,
      subject,
      body,
      attachments: this.toAttachmentPayloads(attachments),
    }).pipe(
      map(dto => this.mapDto(dto)),
      tap(email => this._emails.update(emails => [email, ...emails]))
    );
  }

  updateMessage(
    id: string,
    to: string,
    subject: string,
    body: string,
    scheduledAt: Date | undefined,
    attachments: EmailAttachment[]
  ): Observable<Email> {
    return this.api.put<EmailDto>(`/mailbox/messages/${id}`, {
      to,
      subject,
      body,
      scheduledAt: scheduledAt?.toISOString() ?? null,
      attachments: this.toAttachmentPayloads(attachments),
    }).pipe(
      map(dto => this.mapDto(dto)),
      tap(updated => this._emails.update(emails => emails.map(e => e.id === id ? updated : e)))
    );
  }

  private toAttachmentPayloads(attachments: EmailAttachment[]): AttachmentPayload[] {
    return attachments.map(a => ({
      name: a.name,
      size: a.size,
      type: a.type,
      contentBase64: a.contentBase64 ?? '',
    }));
  }

  private plainTextPreview(html: string): string {
    const text = html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 100 ? text.slice(0, 100) : text;
  }

  private mapDto = (dto: EmailDto & { fromName?: string }): Email => ({
    id: dto.id,
    from: dto.from ?? dto.fromName ?? 'Unknown',
    fromEmail: dto.fromEmail ?? '',
    to: dto.to ?? '',
    toEmail: dto.toEmail ?? '',
    subject: dto.subject,
    preview: dto.preview,
    body: dto.body,
    timestamp: parseApiDate(dto.timestamp),
    read: dto.read,
    starred: dto.starred,
    folder: (dto.folder || 'inbox').toLowerCase() as Email['folder'],
    attachments: dto.attachments ?? [],
    labels: dto.labels,
  });
}
