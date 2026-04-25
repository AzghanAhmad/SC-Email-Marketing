import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from './email.service';

export interface MailFolder {
  id: string;
  label: string;
  icon: string;
  route: string;
  count?: number;
}

@Component({
  selector: 'app-email-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-sidebar">
      <!-- Compose Button -->
      <button class="compose-btn" (click)="onCompose.emit()"
              data-tooltip="Create and send a new email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>Compose</span>
      </button>

      <!-- Folders -->
      <div class="folder-list">
        <button *ngFor="let folder of folders"
                class="folder-item"
                [class.active]="activeFolder === folder.id"
                (click)="onFolderSelect.emit(folder.id)">
          <span class="folder-icon" [innerHTML]="folder.icon"></span>
          <span class="folder-label">{{ folder.label }}</span>
          <span class="folder-count" *ngIf="folder.count && folder.count > 0">{{ folder.count }}</span>
        </button>
      </div>

      <!-- Labels -->
      <div class="labels-section">
        <div class="labels-header">Labels</div>
        <div class="label-item" *ngFor="let label of labels">
          <span class="label-dot" [style.background]="label.color"></span>
          <span class="label-text">{{ label.name }}</span>
        </div>
      </div>

      <!-- Storage -->
      <div class="storage-info">
        <div class="storage-bar-track">
          <div class="storage-bar-fill" style="width: 34%"></div>
        </div>
        <span class="storage-text">3.4 GB of 10 GB used</span>
      </div>
    </div>
  `,
  styles: [`
    .email-sidebar {
      width: 220px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding: 1.25rem .875rem;
      border-right: 1px solid var(--border-light);
      background: var(--surface);
      height: 100%;
      overflow-y: auto;
    }

    .compose-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      padding: .75rem 1.25rem;
      background: var(--gradient-brand);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: .875rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all .25s;
      box-shadow: 0 4px 14px rgba(22, 38, 62, 0.25);
      margin-bottom: 1.25rem;
      width: 100%;
    }
    .compose-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(22, 38, 62, 0.35);
    }
    .compose-btn svg {
      width: 16px;
      height: 16px;
    }

    .folder-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 1.5rem;
    }

    .folder-item {
      display: flex;
      align-items: center;
      gap: .625rem;
      padding: .55rem .75rem;
      border-radius: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: .8125rem;
      font-weight: 500;
      font-family: inherit;
      color: var(--text-secondary);
      transition: all .2s;
      text-align: left;
      width: 100%;
    }
    .folder-item:hover {
      background: var(--bg-subtle);
      color: var(--text-primary);
    }
    .folder-item.active {
      background: rgba(59, 130, 246, 0.08);
      color: #2563eb;
      font-weight: 600;
    }
    .folder-icon {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .folder-icon :global(svg) { width: 16px; height: 16px; }
    .folder-label { flex: 1; white-space: nowrap; }
    .folder-count {
      font-size: .7rem;
      font-weight: 700;
      background: rgba(59, 130, 246, 0.12);
      color: #2563eb;
      padding: .15rem .45rem;
      border-radius: 100px;
      min-width: 20px;
      text-align: center;
    }

    .labels-section {
      margin-bottom: 1.5rem;
    }
    .labels-header {
      font-size: .65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--text-muted);
      padding: .25rem .75rem .5rem;
    }
    .label-item {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .4rem .75rem;
      font-size: .78rem;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: 8px;
      transition: background .15s;
    }
    .label-item:hover { background: var(--bg-subtle); }
    .label-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .label-text { white-space: nowrap; }

    .storage-info {
      margin-top: auto;
      padding: .75rem;
      border-radius: 10px;
      background: var(--bg-subtle);
    }
    .storage-bar-track {
      height: 4px;
      background: var(--border);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: .5rem;
    }
    .storage-bar-fill {
      height: 100%;
      background: var(--gradient-accent);
      border-radius: 100px;
      transition: width .5s;
    }
    .storage-text {
      font-size: .7rem;
      color: var(--text-muted);
    }
  `]
})
export class EmailSidebarComponent {
  @Input() activeFolder = 'inbox';
  @Output() onFolderSelect = new EventEmitter<string>();
  @Output() onCompose = new EventEmitter<void>();

  constructor(private emailService: EmailService) {}

  folders: MailFolder[] = [
    { id: 'inbox', label: 'Inbox', route: '/email/inbox', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>' },
    { id: 'sent', label: 'Sent', route: '/email/sent', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' },
    { id: 'drafts', label: 'Drafts', route: '/email/drafts', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
    { id: 'scheduled', label: 'Scheduled', route: '/email/scheduled', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { id: 'spam', label: 'Spam', route: '/email/spam', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
    { id: 'trash', label: 'Trash', route: '/email/trash', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' },
  ];

  labels = [
    { name: 'Important', color: '#ef4444' },
    { name: 'Work', color: '#3b82f6' },
    { name: 'Personal', color: '#10b981' },
    { name: 'Updates', color: '#f59e0b' },
  ];

  get inboxCount(): number {
    return this.emailService.unreadCount();
  }

  ngOnInit() {
    // Set inbox count dynamically
    const inboxFolder = this.folders.find(f => f.id === 'inbox');
    if (inboxFolder) inboxFolder.count = this.inboxCount;
  }
}
