import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmailService, Email } from './email.service';
import { EmailSidebarComponent } from './email-sidebar.component';
import { EmailListComponent } from './email-list.component';
import { EmailViewComponent } from './email-view.component';
import { ComposeModalComponent } from './compose-modal.component';
import { EmailTipsComponent } from './email-tips.component';
import { Subscription } from 'rxjs';

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
      <!-- Email Sidebar -->
      <app-email-sidebar
        [activeFolder]="currentFolder"
        (onFolderSelect)="navigateToFolder($event)"
        (onCompose)="openCompose()"
      />

      <!-- Email List -->
      <app-email-list
        [emails]="currentEmails"
        [selectedEmailId]="selectedEmailId"
        [loading]="loading"
        (onSelectEmail)="selectEmail($event)"
        (onToggleStar)="toggleStar($event)"
      />

      <!-- Email View -->
      <app-email-view
        [email]="selectedEmail"
        (onReply)="replyToEmail()"
        (onForward)="forwardEmail()"
        (onDelete)="deleteEmail($event)"
        (onMarkUnread)="markUnread($event)"
      />

      <!-- Compose Modal -->
      <app-compose-modal
        *ngIf="showCompose"
        [initialTo]="composeTo"
        [initialSubject]="composeSubject"
        [initialBody]="composeBody"
        [composeTitle]="composeTitle"
        (onClose)="showCompose = false"
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
  `,
  styles: [`
    .email-page {
      display: flex;
      height: calc(100vh - 64px);
      overflow: hidden;
      animation: fadeIn .3s ease-out;
      position: relative;
      width: 100%;
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
  `]
})
export class EmailPageComponent implements OnInit, OnDestroy {
  currentFolder = 'inbox';
  selectedEmailId: string | null = null;
  selectedEmail: Email | null = null;
  currentEmails: Email[] = [];
  loading = false;
  showCompose = false;
  showTips = false;
  composeTitle = 'New Message';
  composeTo = '';
  composeSubject = '';
  composeBody = '';
  showToast = false;
  toastMessage = '';
  private routeSub: Subscription | null = null;

  constructor(
    private emailService: EmailService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Subscribe to route changes
    this.routeSub = this.route.params.subscribe(params => {
      const folder = params['folder'] || 'inbox';
      this.currentFolder = folder;
      this.loadFolder(folder);
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  loadFolder(folder: string) {
    this.loading = false;
    this.selectedEmailId = null;
    this.selectedEmail = null;
    this.currentEmails = this.emailService.getEmailsByFolder(folder);
    this.cdr.detectChanges();
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

  sendEmail(data: { to: string; subject: string; body: string }) {
    this.emailService.sendEmail(data.to, data.subject, data.body);
    this.showCompose = false;
    this.showNotification('Email sent successfully');
    if (this.currentFolder === 'sent') {
      this.currentEmails = this.emailService.getEmailsByFolder('sent');
    }
  }

  saveDraft(data: { to: string; subject: string; body: string }) {
    this.emailService.saveDraft(data.to, data.subject, data.body);
    this.showCompose = false;
    this.showNotification('Draft saved');
    if (this.currentFolder === 'drafts') {
      this.currentEmails = this.emailService.getEmailsByFolder('drafts');
    }
  }

  scheduleEmail(data: { to: string; subject: string; body: string }) {
    this.emailService.scheduleEmail(data.to, data.subject, data.body);
    this.showCompose = false;
    this.showNotification('Email scheduled');
    if (this.currentFolder === 'scheduled') {
      this.currentEmails = this.emailService.getEmailsByFolder('scheduled');
    }
  }

  openCompose() {
    this.composeTitle = 'New Message';
    this.composeTo = '';
    this.composeSubject = '';
    this.composeBody = '';
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
      this.composeBody = `\n\n--- Original message ---\nFrom: ${this.selectedEmail.from} <${this.selectedEmail.fromEmail}>\nDate: ${this.selectedEmail.timestamp.toLocaleString()}\nSubject: ${this.selectedEmail.subject}\n\n${this.stripHtml(this.selectedEmail.body)}`;
    } else {
      this.composeTitle = 'Reply';
      this.composeTo = '';
      this.composeSubject = '';
      this.composeBody = '';
    }
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
      this.composeBody = `\n\n--- Forwarded message ---\nFrom: ${this.selectedEmail.from} <${this.selectedEmail.fromEmail}>\nDate: ${this.selectedEmail.timestamp.toLocaleString()}\nSubject: ${this.selectedEmail.subject}\n\n${this.stripHtml(this.selectedEmail.body)}`;
    } else {
      this.composeTitle = 'Forward';
      this.composeTo = '';
      this.composeSubject = '';
      this.composeBody = '';
    }
    this.showCompose = true;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6)>/gi, '\n')
      .replace(/<li>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private showNotification(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
