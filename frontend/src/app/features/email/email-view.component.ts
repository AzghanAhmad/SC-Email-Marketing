import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Email } from './email.service';

@Component({
  selector: 'app-email-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-view-panel" [class.has-email]="!!email">
      <!-- Action Bar -->
      <div class="view-actions">
        <div class="action-left">
          <button class="action-btn"
                  [disabled]="!email"
                  (click)="email && onReply.emit()"
                  data-tooltip="Reply to this email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
            <span>Reply</span>
          </button>
          <button class="action-btn"
                  [disabled]="!email"
                  (click)="email && onForward.emit()"
                  data-tooltip="Forward this email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg>
            <span>Forward</span>
          </button>
        </div>
        <div class="action-right">
          <button class="action-btn"
                  [disabled]="!email"
                  (click)="email && onMarkUnread.emit(email.id)"
                  data-tooltip="Mark this email as unread">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <button class="action-btn danger"
                  [disabled]="!email"
                  (click)="email && onDelete.emit(email.id)"
                  data-tooltip="Move this email to trash">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div class="view-empty" *ngIf="!email">
        <div class="empty-hero">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3>Select an email to view details</h3>
          <p>Pick any message from the list to read the full content, attachments, and reply actions.</p>
        </div>
        <div class="empty-hints">
          <div class="hint-row"><span class="dot"></span> Use filters to quickly find unread or starred emails.</div>
          <div class="hint-row"><span class="dot"></span> Open a message to enable Reply, Forward, and Delete actions.</div>
        </div>
      </div>

      <!-- Email Content -->
      <div class="view-content" *ngIf="email">
        <h1 class="view-subject">{{ email.subject }}</h1>

        <div class="view-meta">
          <div class="sender-avatar">{{ getInitials(email.from) }}</div>
          <div class="meta-details">
            <div class="meta-top">
              <span class="meta-sender">{{ email.from }}</span>
              <span class="meta-email">&lt;{{ email.fromEmail }}&gt;</span>
            </div>
            <div class="meta-bottom">
              <span class="meta-to">To: {{ email.to }} &lt;{{ email.toEmail }}&gt;</span>
            </div>
          </div>
          <span class="meta-date">{{ formatDate(email.timestamp) }}</span>
        </div>

        <!-- Body -->
        <div class="view-body" [innerHTML]="email.body"></div>

        <!-- Attachments -->
        <div class="attachments-section" *ngIf="email.attachments.length > 0">
          <div class="attachments-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            <span>{{ email.attachments.length }} Attachment{{ email.attachments.length > 1 ? 's' : '' }}</span>
          </div>
          <div class="attachments-grid">
            <div class="attachment-card" *ngFor="let att of email.attachments">
              <div class="att-icon" [class]="'att-' + att.type">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="att-info">
                <span class="att-name">{{ att.name }}</span>
                <span class="att-size">{{ att.size }}</span>
              </div>
              <button class="att-download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .email-view-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      height: 100%;
      overflow-y: auto;
      min-width: 0;
    }
    .email-view-panel.has-email {
      animation: fadeIn .35s ease-out;
    }

    .view-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      padding: 2rem;
      gap: 1.25rem;
    }
    .empty-hero {
      width: 100%;
      max-width: none;
      border: 1px solid var(--border-light);
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      padding: 2.25rem 2rem;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .empty-icon {
      width: 68px;
      height: 68px;
      border-radius: 18px;
      margin: 0 auto 1rem;
      background: linear-gradient(135deg, rgba(96,165,250,0.18), rgba(167,139,250,0.18));
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-icon svg {
      width: 34px;
      height: 34px;
    }
    .empty-hero h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: .5rem;
    }
    .empty-hero p {
      font-size: .875rem;
      color: var(--text-muted);
      max-width: 340px;
      margin: 0 auto;
    }
    .empty-hints {
      width: 100%;
      display: grid;
      gap: .6rem;
    }
    .hint-row {
      display: flex;
      align-items: center;
      gap: .55rem;
      font-size: .8rem;
      color: var(--text-secondary);
      background: var(--surface);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      padding: .65rem .8rem;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
      background: #60a5fa;
    }

    .view-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .75rem 1.25rem;
      border-bottom: 1px solid var(--border-light);
      background: var(--surface);
    }
    .action-left, .action-right {
      display: flex;
      align-items: center;
      gap: .375rem;
      flex-wrap: nowrap;
    }
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .375rem;
      padding: .45rem .75rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: .78rem;
      font-weight: 500;
      font-family: inherit;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all .2s;
      min-height: 34px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .action-btn:hover {
      background: var(--bg-subtle);
      border-color: var(--text-muted);
      color: var(--text-primary);
    }
    .action-btn:disabled {
      opacity: .55;
      cursor: not-allowed;
      background: #f8fafc;
      border-color: var(--border-light);
      color: var(--text-muted);
    }
    .action-btn svg { width: 15px; height: 15px; }
    .view-actions [data-tooltip]::after {
      top: 130%;
      bottom: auto;
      z-index: 500;
    }
    .action-btn.danger:hover {
      border-color: #fca5a5;
      background: rgba(239, 68, 68, 0.06);
      color: #dc2626;
    }

    .view-content {
      flex: 1;
      padding: 1.5rem 2rem;
    }

    .view-subject {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -.03em;
      margin: 0 0 1.25rem;
      line-height: 1.3;
    }

    .view-meta {
      display: flex;
      align-items: flex-start;
      gap: .875rem;
      padding: 1rem 1.25rem;
      background: var(--surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      margin-bottom: 1.5rem;
    }
    .sender-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .8rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .meta-details {
      flex: 1;
      min-width: 0;
    }
    .meta-top {
      display: flex;
      align-items: center;
      gap: .375rem;
      flex-wrap: wrap;
    }
    .meta-sender {
      font-size: .875rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .meta-email {
      font-size: .75rem;
      color: var(--text-muted);
    }
    .meta-bottom {
      margin-top: .2rem;
    }
    .meta-to {
      font-size: .75rem;
      color: var(--text-muted);
    }
    .meta-date {
      font-size: .75rem;
      color: var(--text-muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .view-body {
      font-size: .9rem;
      line-height: 1.7;
      color: var(--text-secondary);
      padding: 1.5rem;
      background: var(--surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      margin-bottom: 1.5rem;
    }
    .view-body :global(p) { margin-bottom: .75rem; }
    .view-body :global(ul), .view-body :global(ol) { padding-left: 1.5rem; margin-bottom: .75rem; }
    .view-body :global(li) { margin-bottom: .35rem; }
    .view-body :global(strong) { color: var(--text-primary); font-weight: 600; }
    .view-body :global(a) { color: #3b82f6; text-decoration: none; }
    .view-body :global(code) { padding: .15rem .4rem; background: var(--bg-subtle); border-radius: 4px; font-size: .85em; }

    .attachments-section {
      margin-top: .5rem;
    }
    .attachments-header {
      display: flex;
      align-items: center;
      gap: .5rem;
      font-size: .8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: .75rem;
    }
    .attachments-header svg { color: var(--text-muted); }
    .attachments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: .75rem;
    }
    .attachment-card {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: .75rem 1rem;
      background: var(--surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      transition: all .2s;
    }
    .attachment-card:hover {
      border-color: var(--border);
      box-shadow: var(--shadow-sm);
    }
    .att-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .att-icon svg { width: 18px; height: 18px; }
    .att-pdf { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
    .att-xlsx { background: rgba(16, 185, 129, 0.1); color: #059669; }
    .att-fig { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
    .att-zip { background: rgba(245, 158, 11, 0.1); color: #d97706; }
    .att-docx { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .att-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .att-name {
      font-size: .8125rem;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .att-size {
      font-size: .7rem;
      color: var(--text-muted);
    }
    .att-download {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: .35rem;
      border-radius: 6px;
      transition: all .2s;
    }
    .att-download:hover {
      background: var(--bg-subtle);
      color: #3b82f6;
    }
  `]
})
export class EmailViewComponent {
  @Input() email: Email | null = null;
  @Output() onReply = new EventEmitter<void>();
  @Output() onForward = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onMarkUnread = new EventEmitter<string>();

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
