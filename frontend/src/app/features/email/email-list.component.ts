import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Email } from './email.service';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="email-list-panel">
      <!-- Header -->
      <div class="list-header">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="search-input list-search" placeholder="Search emails..."
                 [(ngModel)]="searchQuery" (input)="filterEmails()">
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button class="filter-tab" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All</button>
        <button class="filter-tab" [class.active]="activeFilter === 'unread'" (click)="setFilter('unread')">Unread</button>
        <button class="filter-tab" [class.active]="activeFilter === 'starred'" (click)="setFilter('starred')">Starred</button>
      </div>

      <!-- Email rows -->
      <div class="email-rows" *ngIf="filteredEmails.length > 0">
        <div class="email-row"
             *ngFor="let email of filteredEmails; trackBy: trackByEmail"
             [class.unread]="!email.read"
             [class.active]="selectedEmailId === email.id"
             (click)="onSelectEmail.emit(email.id)">
          <!-- Star -->
          <button class="star-btn" (click)="onToggleStar.emit(email.id); $event.stopPropagation()"
                  [class.starred]="email.starred">
            <svg viewBox="0 0 24 24" [attr.fill]="email.starred ? '#f59e0b' : 'none'" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>

          <!-- Content -->
          <div class="email-content">
            <div class="email-top-row">
              <span class="email-sender" [class.bold]="!email.read">{{ email.from }}</span>
              <span class="email-time">{{ formatTime(email.timestamp) }}</span>
            </div>
            <span class="email-subject" [class.bold]="!email.read">{{ email.subject }}</span>
            <span class="email-preview">{{ email.preview }}</span>
          </div>

          <!-- Attachment indicator -->
          <div class="attachment-indicator" *ngIf="email.attachments.length > 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredEmails.length === 0">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
        </div>
        <h3>No emails found</h3>
        <p>{{ getEmptyMessage() }}</p>
      </div>

      <!-- Loading skeletons -->
      <div class="skeleton-list" *ngIf="loading">
        <div class="skeleton-row" *ngFor="let s of [1,2,3,4,5]">
          <div class="skeleton" style="width:24px;height:24px;border-radius:50%"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton" style="width:40%;height:12px"></div>
            <div class="skeleton" style="width:70%;height:10px"></div>
            <div class="skeleton" style="width:90%;height:10px"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .email-list-panel {
      flex: 1;
      min-width: 320px;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-light);
      background: var(--surface);
      height: 100%;
      overflow: hidden;
    }

    .list-header {
      padding: .875rem 1rem;
      border-bottom: 1px solid var(--border-light);
    }
    .list-search {
      width: 100% !important;
    }

    .filter-tabs {
      display: flex;
      padding: .5rem 1rem;
      gap: .25rem;
      border-bottom: 1px solid var(--border-light);
    }
    .filter-tab {
      padding: .4rem .875rem;
      border: none;
      border-radius: 100px;
      background: transparent;
      font-size: .78rem;
      font-weight: 500;
      font-family: inherit;
      color: var(--text-muted);
      cursor: pointer;
      transition: all .2s;
    }
    .filter-tab:hover {
      background: var(--bg-subtle);
      color: var(--text-secondary);
    }
    .filter-tab.active {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
      font-weight: 600;
    }

    .email-rows {
      flex: 1;
      overflow-y: auto;
    }

    .email-row {
      display: flex;
      align-items: flex-start;
      gap: .625rem;
      padding: .875rem 1rem;
      border-bottom: 1px solid var(--border-light);
      cursor: pointer;
      transition: all .2s;
      position: relative;
      animation: fadeIn .3s ease-out;
    }
    .email-row:hover {
      background: #f8fafc;
    }
    .email-row.active {
      background: rgba(59, 130, 246, 0.06);
      border-left: 3px solid #3b82f6;
    }
    .email-row.unread {
      background: rgba(59, 130, 246, 0.03);
    }
    .email-row.unread::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #3b82f6;
    }
    .email-row.active.unread::before {
      display: none;
    }

    .star-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: .15rem;
      color: var(--text-muted);
      transition: all .2s;
      flex-shrink: 0;
      margin-top: .1rem;
    }
    .star-btn svg { width: 16px; height: 16px; }
    .star-btn:hover { color: #f59e0b; transform: scale(1.15); }
    .star-btn.starred { color: #f59e0b; }

    .email-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: .15rem;
    }
    .email-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .5rem;
    }
    .email-sender {
      font-size: .8125rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .email-time {
      font-size: .7rem;
      color: var(--text-muted);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .email-subject {
      font-size: .8125rem;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .email-preview {
      font-size: .75rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
    }
    .bold {
      font-weight: 700 !important;
      color: var(--text-primary) !important;
    }

    .attachment-indicator {
      flex-shrink: 0;
      color: var(--text-muted);
      margin-top: .2rem;
    }
    .attachment-indicator svg { width: 14px; height: 14px; }

    .empty-state {
      padding: 3rem 1.5rem;
    }
    .empty-state svg { color: var(--text-muted); }

    .skeleton-list {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .skeleton-row {
      display: flex;
      align-items: flex-start;
      gap: .75rem;
      padding: .5rem 0;
    }
  `]
})
export class EmailListComponent implements OnChanges {
  @Input() emails: Email[] = [];
  @Input() selectedEmailId: string | null = null;
  @Input() loading = false;
  @Output() onSelectEmail = new EventEmitter<string>();
  @Output() onToggleStar = new EventEmitter<string>();

  searchQuery = '';
  activeFilter: 'all' | 'unread' | 'starred' = 'all';
  filteredEmails: Email[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emails']) {
      this.filterEmails();
    }
  }

  setFilter(filter: 'all' | 'unread' | 'starred') {
    this.activeFilter = filter;
    this.filterEmails();
  }

  filterEmails() {
    let result = [...this.emails];

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(e =>
        e.from.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.preview.toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (this.activeFilter === 'unread') {
      result = result.filter(e => !e.read);
    } else if (this.activeFilter === 'starred') {
      result = result.filter(e => e.starred);
    }

    // Sort by timestamp desc
    result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    this.filteredEmails = result;
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (diff < 0) {
      // Scheduled (future)
      return 'Scheduled';
    }
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getEmptyMessage(): string {
    if (this.searchQuery) return 'No emails match your search.';
    if (this.activeFilter === 'unread') return 'All caught up! No unread emails.';
    if (this.activeFilter === 'starred') return 'No starred emails yet.';
    return 'This folder is empty.';
  }

  trackByEmail(index: number, email: Email): string {
    return email.id;
  }
}
