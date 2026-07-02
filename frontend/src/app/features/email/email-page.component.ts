import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmailService, Email, ComposePayload } from './email.service';
import { AuthService } from '../../core/services/auth.service';
import { MailboxApiService } from '../../core/services/mailbox-api.service';
import { EmailSidebarComponent } from './email-sidebar.component';
import { EmailListComponent } from './email-list.component';
import { EmailViewComponent } from './email-view.component';
import { ComposeModalComponent } from './compose-modal.component';
import { EmailTipsComponent } from './email-tips.component';
import { buildQuotedHtml } from './email-quote';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-email-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EmailSidebarComponent,
    EmailListComponent,
    EmailViewComponent,
    ComposeModalComponent,
    EmailTipsComponent,
  ],
  template: `
    <div class="email-page">
      <div class="mailbox-banner" *ngIf="showMailboxBanner">
        <div>
          <strong>Connect your email inbox</strong>
          <p>Link your Gmail, Outlook, or other mailbox to see real messages here. Go to Settings → Inbox Connection to get started.</p>
        </div>
        <a routerLink="/settings" [queryParams]="{ tab: 'inbox' }" class="banner-btn">Connect inbox</a>
      </div>
      <!-- Email Sidebar -->
      <div class="sync-banner loading" *ngIf="syncing && !showMailboxBanner">
        <span class="sync-spinner" aria-hidden="true"></span>
        Syncing messages from your mailbox — please wait…
      </div>
      <div class="sync-banner" *ngIf="syncNotice && !showMailboxBanner && !syncing">
        {{ syncNotice }}
      </div>
      <div class="sync-banner error" *ngIf="syncError && !showMailboxBanner && !syncing">
        <span class="sync-error-text">{{ syncError }}</span>
        <div class="sync-error-actions">
          <a routerLink="/settings" [queryParams]="{ tab: 'inbox' }" class="sync-retry-btn">Update credentials</a>
          <button type="button" class="sync-retry-btn" (click)="refreshMailbox()" [disabled]="syncing">Retry sync</button>
        </div>
      </div>

      <!-- Page toolbar -->
      <div class="email-toolbar" *ngIf="!showMailboxBanner">
        <div class="toolbar-left">
          <h1 class="toolbar-title">{{ getFolderTitle() }}</h1>
        </div>
        <button type="button"
                class="toolbar-refresh-btn"
                [disabled]="syncing"
                (click)="refreshMailbox()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               [class.spinning]="syncing">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          {{ syncing ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>

      <div class="email-content-row">
      <app-email-sidebar
        [activeFolder]="currentFolder"
        [mailboxConnected]="!showMailboxBanner"
        [connectedEmail]="connectedEmail"
        (onFolderSelect)="navigateToFolder($event)"
        (onCompose)="openCompose()"
        (onDisconnect)="disconnectInbox()"
      />

      <!-- Email List -->
      <app-email-list
        [emails]="currentEmails"
        [emailsKey]="emailsListKey"
        [selectedEmailId]="selectedEmailId"
        [loading]="loading || syncing"
        [refreshing]="syncing"
        [mailboxConnected]="!showMailboxBanner"
        (onSelectEmail)="selectEmail($event)"
        (onToggleStar)="toggleStar($event)"
        (onRefresh)="refreshMailbox()"
      />

      <!-- Email View -->
      <app-email-view
        [email]="selectedEmail"
        (onReply)="replyToEmail()"
        (onForward)="forwardEmail()"
        (onEdit)="editEmail()"
        (onSendNow)="sendScheduledNow($event)"
        (onDelete)="deleteEmail($event)"
        (onMarkUnread)="markUnread($event)"
      />

      <!-- Compose Modal -->
      <app-compose-modal
        *ngIf="showCompose"
        [initialTo]="composeTo"
        [initialSubject]="composeSubject"
        [initialBody]="composeBody"
        [initialQuotedHtml]="composeQuotedHtml"
        [initialAttachments]="composeAttachments"
        [editingMessageId]="editingMessageId"
        [initialScheduledAt]="composeScheduledAt"
        [composeTitle]="composeTitle"
        [actionBusy]="composeActionBusy"
        [openSession]="composeSession"
        (onClose)="closeCompose()"
        (onSend)="sendEmail($event)"
        (onSaveDraft)="saveDraft($event)"
        (onSchedule)="scheduleEmail($event)"
      />

      <!-- Best Practices Button -->
      <button class="tips-fab" (click)="showTips = true" title="Email Best Practices">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>

      <!-- Tips Panel -->
      <app-email-tips *ngIf="showTips" (onClose)="showTips = false" />

      <!-- Toast -->
      <div class="toast" [class.show]="showToast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        {{ toastMessage }}
      </div>
      </div>
    </div>
  `,
  styles: [`
    .email-page {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px);
      overflow: hidden;
      animation: fadeIn .3s ease-out;
      position: relative;
      width: 100%;
    }
    .mailbox-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: .875rem 1.25rem;
      background: linear-gradient(90deg, #eff6ff, #f0fdf4);
      border-bottom: 1px solid #dbeafe;
      flex-shrink: 0;
    }
    .mailbox-banner p { margin: .25rem 0 0; font-size: .8125rem; color: #64748b; }
    .banner-btn {
      padding: .5rem 1rem;
      background: #3b82f6;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-size: .8125rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .sync-banner {
      padding: .75rem 1.25rem;
      background: #ecfdf5;
      border-bottom: 1px solid #bbf7d0;
      color: #047857;
      font-size: .8125rem;
      display: flex;
      align-items: center;
      gap: .75rem;
      flex-shrink: 0;
    }
    .sync-banner.loading {
      background: #eff6ff;
      border-bottom-color: #bfdbfe;
      color: #1d4ed8;
    }
    .sync-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid #93c5fd;
      border-top-color: #1d4ed8;
      border-radius: 50%;
      animation: spin .8s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .sync-banner.error {
      background: #fef2f2;
      border-bottom-color: #fecaca;
      color: #b91c1c;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .sync-error-text { flex: 1; min-width: 200px; line-height: 1.45; }
    .sync-error-actions { display: flex; gap: .5rem; flex-shrink: 0; margin-left: auto; }
    .sync-retry-btn {
      padding: .35rem .75rem;
      border: 1px solid currentColor;
      border-radius: 8px;
      background: white;
      color: inherit;
      font-size: .75rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }
    .sync-retry-btn:disabled { opacity: .6; cursor: not-allowed; }
    .email-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: .75rem 1.25rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border-light);
      flex-shrink: 0;
    }
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: .75rem;
      min-width: 0;
    }
    .toolbar-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: capitalize;
    }
    .toolbar-refresh-btn {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      padding: .5rem 1rem;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      background: #eff6ff;
      color: #2563eb;
      font-size: .8125rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all .2s;
      flex-shrink: 0;
    }
    .toolbar-refresh-btn:hover:not(:disabled) {
      background: #dbeafe;
      border-color: #93c5fd;
      color: #1d4ed8;
    }
    .toolbar-refresh-btn:disabled {
      opacity: .7;
      cursor: not-allowed;
    }
    .toolbar-refresh-btn svg {
      width: 16px;
      height: 16px;
    }
    .toolbar-refresh-btn svg.spinning {
      animation: spin .8s linear infinite;
    }
    .email-content-row {
      display: flex;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }
    app-email-sidebar {
      display: block;
      height: 100%;
      flex-shrink: 0;
    }
    app-email-list {
      display: block;
      height: 100%;
      flex: 1;
      max-width: 420px;
      min-width: 320px;
    }
    app-email-view {
      display: block;
      height: 100%;
      flex: 1.5;
      min-width: 0;
    }
    .tips-fab {
      position: absolute;
      bottom: 1.25rem;
      right: 1.25rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #818cf8, #6366f1);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
      transition: all .2s;
      z-index: 50;
    }
    .tips-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
    }
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .875rem 1.25rem;
      background: #0f172a;
      color: white;
      border-radius: 14px;
      font-size: .875rem;
      font-weight: 500;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      transform: translateY(100px);
      opacity: 0;
      transition: all .3s cubic-bezier(.4, 0, .2, 1);
      z-index: 3000;
      pointer-events: none;
    }
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    .toast svg {
      width: 18px;
      height: 18px;
      color: #34d399;
      flex-shrink: 0;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .email-page { height: auto; min-height: calc(100vh - 64px); overflow: auto; }
      .email-content-row { flex-direction: column; overflow: visible; height: auto; }
      app-email-sidebar { display: none; }
      app-email-list { max-width: none; min-width: 0; width: 100%; height: auto; min-height: 300px; }
      app-email-view { width: 100%; flex: none; height: auto; min-height: 400px; }
      .toolbar-refresh-btn span { display: none; }
      .mailbox-banner { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 480px) {
      .email-toolbar { padding: .625rem .875rem; }
      .toolbar-title { font-size: .9375rem; }
      .tips-fab { bottom: .875rem; right: .875rem; width: 40px; height: 40px; }
    }
  `]
})
export class EmailPageComponent implements OnInit, OnDestroy {
  currentFolder = 'inbox';
  selectedEmailId: string | null = null;
  selectedEmail: Email | null = null;
  currentEmails: Email[] = [];
  emailsListKey = 0;
  loading = false;
  showCompose = false;
  showTips = false;
  composeTitle = 'New Message';
  composeTo = '';
  composeSubject = '';
  composeBody = '';
  composeQuotedHtml = '';
  composeAttachments: Email['attachments'] = [];
  editingMessageId: string | null = null;
  composeScheduledAt = '';
  editingFolder: 'drafts' | 'scheduled' | null = null;
  composeActionBusy = false;
  composeSession = 0;
  showToast = false;
  toastMessage = '';
  showMailboxBanner = false;
  syncNotice = '';
  syncError = '';
  syncing = false;
  connectedEmail = '';
  private routeSub: Subscription | null = null;
  private messagesLoaded = false;

  constructor(
    private emailService: EmailService,
    private auth: AuthService,
    private mailboxApi: MailboxApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.auth.whenReady().pipe(
      switchMap(() => this.auth.refreshProfile())
    ).subscribe(() => this.runInZone(() => this.bootstrapInbox()));

    this.routeSub = this.route.params.subscribe(params => {
      if (!this.messagesLoaded) return;
      this.loadFolder(params['folder'] || 'inbox');
    });
  }

  private bootstrapInbox() {
    this.loading = true;
    this.mailboxApi.getConnection().subscribe({
      next: (conn) => {
        const linked = this.isMailboxLinked(conn);
        this.showMailboxBanner = !linked;
        this.connectedEmail = linked ? (conn.emailAddress || '') : '';
        if (linked) {
          this.auth.updateCachedUser({ mailboxConnected: true });
          this.runSyncAndLoad();
        } else {
          this.loadMessagesFromApi();
        }
      },
      error: () => {
        this.showMailboxBanner = true;
        this.connectedEmail = '';
        this.loadMessagesFromApi();
      }
    });
  }

  disconnectInbox() {
    if (this.showMailboxBanner) return;
    this.mailboxApi.disconnect().subscribe({
      next: () => {
        this.runInZone(() => {
          this.auth.updateCachedUser({ mailboxConnected: false });
          this.auth.refreshProfile().subscribe();
          this.showMailboxBanner = true;
          this.connectedEmail = '';
          this.syncNotice = '';
          this.syncError = '';
          this.syncing = false;
          this.loading = false;
          this.emailService.clearInbox();
          this.selectedEmailId = null;
          this.selectedEmail = null;
          this.currentEmails = [];
          this.emailsListKey++;
          this.flushView();
        });
      },
      error: (err) => {
        this.runInZone(() => {
          this.syncError = err.message || 'Could not disconnect inbox.';
          this.flushView();
        });
      }
    });
  }

  refreshMailbox() {
    if (this.showMailboxBanner) return;
    this.syncing = true;
    this.syncError = '';
    this.runSyncAndLoad(true);
  }

  private runSyncAndLoad(fromRetry = false) {
    this.syncing = true;
    this.syncError = '';
    this.cdr.detectChanges();
    this.mailboxApi.sync().subscribe({
      next: (res) => {
        this.runInZone(() => {
          this.syncNotice = res.message;
          this.syncError = '';
          this.loadMessagesFromApi(fromRetry);
        });
      },
      error: (err) => {
        this.runInZone(() => {
          this.syncError = err.message || 'Could not sync mailbox.';
          this.syncNotice = '';
          this.loadMessagesFromApi(fromRetry);
        });
      }
    });
  }

  private loadMessagesFromApi(fromRetry = false) {
    this.emailService.loadMessages().subscribe({
      next: () => {
        this.runInZone(() => {
          this.loading = false;
          this.syncing = false;
          this.messagesLoaded = true;
          const folder = this.route.snapshot.params['folder'] || 'inbox';
          this.applyFolderEmails(folder);
          if (!this.showMailboxBanner && this.currentEmails.length === 0 && !this.syncError) {
            this.syncNotice = 'Mailbox connected. No messages in this folder yet — try Retry sync.';
          }
          this.flushView();
        });
      },
      error: (err) => {
        this.runInZone(() => {
          this.loading = false;
          this.syncing = false;
          this.messagesLoaded = true;
          this.syncError = err.message || 'Could not load messages.';
          this.applyFolderEmails(this.route.snapshot.params['folder'] || 'inbox');
          this.flushView();
        });
      }
    });
  }

  private runInZone(fn: () => void) {
    this.ngZone.run(fn);
  }

  private flushView() {
    this.cdr.detectChanges();
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  private applyFolderEmails(folder: string) {
    this.selectedEmailId = null;
    this.selectedEmail = null;
    this.currentFolder = folder;
    this.currentEmails = [...this.emailService.getEmailsByFolder(folder)];
    this.emailsListKey++;
  }

  private isMailboxLinked(conn: { isConnected: boolean; emailAddress?: string }): boolean {
    return conn.isConnected || !!conn.emailAddress?.trim();
  }

  private updateMailboxBanner() {
    this.showMailboxBanner = !this.auth.user()?.mailboxConnected;
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  loadFolder(folder: string) {
    this.loading = false;
    this.applyFolderEmails(folder);
    this.flushView();
  }

  navigateToFolder(folder: string) {
    this.router.navigate(['/email', folder]);
  }

  selectEmail(id: string) {
    this.selectedEmailId = id;
    this.selectedEmail = this.emailService.getEmailById(id) || null;
    if (this.selectedEmail && !this.selectedEmail.read) {
      this.emailService.markAsRead(id);
      // Refresh list
      this.currentEmails = this.emailService.getEmailsByFolder(this.currentFolder);
    }
  }

  toggleStar(id: string) {
    this.emailService.toggleStar(id);
    this.currentEmails = this.emailService.getEmailsByFolder(this.currentFolder);
    if (this.selectedEmailId === id) {
      this.selectedEmail = this.emailService.getEmailById(id) || null;
    }
  }

  deleteEmail(id: string) {
    this.emailService.deleteEmail(id);
    this.currentEmails = this.emailService.getEmailsByFolder(this.currentFolder);
    this.selectedEmailId = null;
    this.selectedEmail = null;
    this.showNotification('Email moved to Trash');
  }

  markUnread(id: string) {
    this.emailService.markAsUnread(id);
    this.currentEmails = this.emailService.getEmailsByFolder(this.currentFolder);
    this.selectedEmail = this.emailService.getEmailById(id) || null;
    this.showNotification('Marked as unread');
  }

  sendEmail(data: ComposePayload) {
    const attachments = data.attachments ?? [];
    const draftId = this.editingMessageId;
    const wasDraft = this.editingFolder === 'drafts';
    const wasScheduled = this.editingFolder === 'scheduled';
    this.composeActionBusy = true;

    if (draftId && wasScheduled) {
      this.emailService.updateMessage(
        draftId,
        data.to,
        data.subject,
        data.body,
        undefined,
        attachments
      ).subscribe({
        next: () => {
          this.emailService.sendScheduledNow(draftId).subscribe({
            next: () => this.afterSendSuccess('Email sent successfully'),
            error: (err) => {
              this.composeActionBusy = false;
              this.showNotification(err.message || 'Failed to send scheduled email');
            },
          });
        },
        error: (err) => {
          this.composeActionBusy = false;
          this.showNotification(err.message || 'Failed to update scheduled email');
        },
      });
      return;
    }

    this.emailService.sendEmail(data.to, data.subject, data.body, attachments).subscribe({
      next: () => {
        if (draftId && wasDraft) {
          this.emailService.deleteEmail(draftId);
        }
        this.afterSendSuccess('Email sent successfully');
      },
      error: (err) => {
        this.composeActionBusy = false;
        this.showNotification(err.message || 'Failed to send email');
      },
    });
  }

  saveDraft(data: ComposePayload) {
    const attachments = data.attachments ?? [];
    this.composeActionBusy = true;
    if (data.messageId) {
      this.emailService.updateMessage(
        data.messageId,
        data.to,
        data.subject,
        data.body,
        undefined,
        attachments
      ).subscribe({
        next: (updated) => {
          this.composeActionBusy = false;
          this.closeCompose();
          this.showNotification('Draft updated');
          if (this.selectedEmailId === updated.id) {
            this.selectedEmail = updated;
          }
          this.refreshCurrentFolder();
        },
        error: (err) => {
          this.composeActionBusy = false;
          this.showNotification(err.message || 'Failed to update draft');
        },
      });
      return;
    }
    this.emailService.saveDraft(data.to, data.subject, data.body, attachments).subscribe({
      next: () => {
        this.composeActionBusy = false;
        this.closeCompose();
        this.showNotification('Draft saved');
        this.refreshCurrentFolder();
      },
      error: (err) => {
        this.composeActionBusy = false;
        this.showNotification(err.message || 'Failed to save draft');
      },
    });
  }

  scheduleEmail(data: ComposePayload) {
    const attachments = data.attachments ?? [];
    this.composeActionBusy = true;
    if (data.messageId) {
      this.emailService.updateMessage(
        data.messageId,
        data.to,
        data.subject,
        data.body,
        data.scheduledAt,
        attachments
      ).subscribe({
        next: (updated) => {
          this.composeActionBusy = false;
          this.closeCompose();
          this.showNotification('Scheduled email updated');
          if (this.selectedEmailId === updated.id) {
            this.selectedEmail = updated;
          }
          this.refreshCurrentFolder();
        },
        error: (err) => {
          this.composeActionBusy = false;
          this.showNotification(err.message || 'Failed to update scheduled email');
        },
      });
      return;
    }
    this.emailService.scheduleEmail(data.to, data.subject, data.body, data.scheduledAt, attachments).subscribe({
      next: () => {
        this.composeActionBusy = false;
        this.closeCompose();
        this.showNotification('Email scheduled');
        this.refreshCurrentFolder();
      },
      error: (err) => {
        this.composeActionBusy = false;
        this.showNotification(err.message || 'Failed to schedule email');
      },
    });
  }

  sendScheduledNow(id: string) {
    this.composeActionBusy = true;
    this.emailService.sendScheduledNow(id).subscribe({
      next: () => {
        this.composeActionBusy = false;
        if (this.currentFolder === 'scheduled') {
          this.currentEmails = this.emailService.getEmailsByFolder('scheduled');
          this.selectedEmailId = null;
          this.selectedEmail = null;
        } else {
          this.refreshCurrentFolder();
        }
        this.showNotification('Email sent successfully');
      },
      error: (err) => {
        this.composeActionBusy = false;
        this.showNotification(err.message || 'Failed to send scheduled email');
      },
    });
  }

  closeCompose() {
    this.showCompose = false;
    this.composeActionBusy = false;
    this.editingMessageId = null;
    this.editingFolder = null;
    this.composeAttachments = [];
    this.composeScheduledAt = '';
  }

  editEmail() {
    if (!this.selectedEmail) return;
    const email = this.selectedEmail;
    const folder = email.folder?.toLowerCase();
    if (folder !== 'drafts' && folder !== 'scheduled') return;

    this.showCompose = false;
    this.composeTitle = folder === 'scheduled' ? 'Edit scheduled email' : 'Edit draft';
    this.composeTo = email.toEmail || '';
    this.composeSubject = email.subject || '';
    this.composeBody = email.body || '';
    this.composeQuotedHtml = '';
    this.composeAttachments = [...(email.attachments || [])];
    this.editingMessageId = email.id;
    this.editingFolder = folder as 'drafts' | 'scheduled';
    this.composeScheduledAt = folder === 'scheduled'
      ? this.toLocalDatetimeInput(email.timestamp)
      : '';
    this.composeSession++;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showCompose = true;
      this.cdr.detectChanges();
    }, 0);
  }

  getFolderTitle(): string {
    const titles: Record<string, string> = {
      all: 'All Mail',
      inbox: 'Inbox',
      sent: 'Sent',
      drafts: 'Drafts',
      scheduled: 'Scheduled',
      spam: 'Spam',
      trash: 'Trash',
    };
    return titles[this.currentFolder] || this.currentFolder;
  }

  private afterSendSuccess(message: string) {
    this.composeActionBusy = false;
    this.closeCompose();
    this.selectedEmailId = null;
    this.selectedEmail = null;
    if (this.currentFolder !== 'inbox') {
      this.navigateToFolder('inbox');
    } else {
      this.currentEmails = this.emailService.getEmailsByFolder('inbox');
    }
    this.showNotification(message);
    this.cdr.detectChanges();
  }

  private toLocalDatetimeInput(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private refreshCurrentFolder() {
    this.currentEmails = [...this.emailService.getEmailsByFolder(this.currentFolder)];
    this.emailsListKey++;
    this.flushView();
  }

  openCompose() {
    this.composeTitle = 'New Message';
    this.composeTo = '';
    this.composeSubject = '';
    this.composeBody = '';
    this.composeQuotedHtml = '';
    this.composeAttachments = [];
    this.editingMessageId = null;
    this.editingFolder = null;
    this.composeScheduledAt = '';
    this.composeSession++;
    this.showCompose = true;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  replyToEmail() {
    if (this.selectedEmail) {
      this.composeTitle = 'Reply';
      this.composeTo = this.selectedEmail.fromEmail;
      this.composeSubject = this.selectedEmail.subject.startsWith('Re:')
        ? this.selectedEmail.subject
        : `Re: ${this.selectedEmail.subject}`;
      this.composeBody = '';
      this.composeQuotedHtml = buildQuotedHtml(this.selectedEmail, 'reply');
    } else {
      this.composeTitle = 'Reply';
      this.composeTo = '';
      this.composeSubject = '';
      this.composeBody = '';
      this.composeQuotedHtml = '';
    }
    this.composeAttachments = [];
    this.editingMessageId = null;
    this.editingFolder = null;
    this.composeScheduledAt = '';
    this.composeSession++;
    this.showCompose = true;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  forwardEmail() {
    if (this.selectedEmail) {
      this.composeTitle = 'Forward';
      this.composeTo = '';
      this.composeSubject = this.selectedEmail.subject.startsWith('Fwd:')
        ? this.selectedEmail.subject
        : `Fwd: ${this.selectedEmail.subject}`;
      this.composeBody = '';
      this.composeQuotedHtml = buildQuotedHtml(this.selectedEmail, 'forward');
    } else {
      this.composeTitle = 'Forward';
      this.composeTo = '';
      this.composeSubject = '';
      this.composeBody = '';
      this.composeQuotedHtml = '';
    }
    this.composeAttachments = [];
    this.editingMessageId = null;
    this.editingFolder = null;
    this.composeScheduledAt = '';
    this.composeSession++;
    this.showCompose = true;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  private showNotification(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3500);
  }
}
