import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Email } from './email.service';
import { EmailListItem, groupEmailsIntoThreads } from './email-thread';

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
                 [(ngModel)]="searchQuery" (input)="onSearchChange()">
        </div>
        <button type="button"
                class="header-refresh-btn"
                [disabled]="refreshing"
                (click)="onRefresh.emit()"
                aria-label="Refresh emails">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               [class.spinning]="refreshing">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          <span class="refresh-label">{{ refreshing ? '…' : 'Refresh' }}</span>
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button class="filter-tab" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All</button>
        <button class="filter-tab" [class.active]="activeFilter === 'unread'" (click)="setFilter('unread')">Unread</button>
        <button class="filter-tab" [class.active]="activeFilter === 'starred'" (click)="setFilter('starred')">Starred</button>
      </div>

      <ng-container *ngIf="!loading && filteredListItems.length > 0">
        <ng-container *ngTemplateOutlet="paginationBar"></ng-container>
      </ng-container>

      <!-- Email rows -->
      <div class="email-rows" *ngIf="!loading && paginatedItems.length > 0">
        <ng-container *ngFor="let item of paginatedItems; trackBy: trackByListItem">
          <!-- Single email -->
          <div class="email-row"
               *ngIf="item.type === 'single'"
               [class.unread]="!item.email.read"
               [class.active]="selectedEmailId === item.email.id"
               (click)="onSelectEmail.emit(item.email.id)">
            <ng-container *ngTemplateOutlet="emailRowInner; context: { $implicit: item.email }"></ng-container>
          </div>

          <!-- Thread group -->
          <div class="thread-wrap" *ngIf="item.type === 'thread'">
            <div class="email-row thread-head"
                 [class.unread]="item.unreadCount > 0"
                 [class.active]="selectedEmailId === item.latest.id"
                 [class.expanded]="isThreadExpanded(item.threadId)"
                 (click)="onSelectEmail.emit(item.latest.id)">
              <button type="button"
                      class="thread-toggle"
                      [attr.aria-expanded]="isThreadExpanded(item.threadId)"
                      (click)="toggleThread(item.threadId); $event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     [class.rotated]="isThreadExpanded(item.threadId)">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span class="thread-count">{{ item.emails.length }}</span>
              </button>
              <ng-container *ngTemplateOutlet="emailRowInner; context: { $implicit: item.latest, threadPreview: true, threadSize: item.emails.length }"></ng-container>
            </div>
            <div class="thread-children" *ngIf="isThreadExpanded(item.threadId)">
              <div class="email-row thread-child"
                   *ngFor="let email of item.emails"
                   [class.unread]="!email.read"
                   [class.active]="selectedEmailId === email.id"
                   (click)="onSelectEmail.emit(email.id); $event.stopPropagation()">
                <span class="thread-child-spacer"></span>
                <ng-container *ngTemplateOutlet="emailRowInner; context: { $implicit: email, compact: true }"></ng-container>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

      <ng-template #emailRowInner let-email let-threadPreview="threadPreview" let-threadSize="threadSize" let-compact="compact">
        <button class="star-btn" (click)="onToggleStar.emit(email.id); $event.stopPropagation()"
                [class.starred]="email.starred">
          <svg viewBox="0 0 24 24" [attr.fill]="email.starred ? '#f59e0b' : 'none'" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
        <div class="email-content">
          <div class="email-top-row">
            <span class="email-sender" [class.bold]="!email.read">{{ email.from }}</span>
            <span class="email-time">{{ formatTime(email.timestamp) }}</span>
          </div>
          <span class="email-subject" [class.bold]="!email.read">
            <span class="thread-label" *ngIf="threadPreview">{{ threadSize }} messages · </span>
            {{ email.subject }}
          </span>
          <span class="email-preview" *ngIf="!compact">{{ email.preview }}</span>
        </div>
        <div class="attachment-indicator" *ngIf="email.attachments.length > 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </div>
      </ng-template>

      <ng-container *ngIf="!loading && filteredListItems.length > 0">
        <ng-container *ngTemplateOutlet="paginationBar"></ng-container>
      </ng-container>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredListItems.length === 0">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
        </div>
        <h3>No emails found</h3>
        <p>{{ getEmptyMessage() }}</p>
        <button type="button" class="refresh-btn" *ngIf="mailboxConnected" (click)="onRefresh.emit()">Sync inbox</button>
      </div>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="loading-card">
          <div class="loading-orbit">
            <div class="loading-orbit-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="28" height="28">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
              </svg>
            </div>
          </div>
          <h3>Loading your messages</h3>
          <p>Syncing mail from your inbox — this won't take long.</p>
          <div class="loading-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <ng-template #paginationBar>
      <div class="pagination-bar" *ngIf="filteredListItems.length > 0">
        <div class="pagination-size">
          <label for="pageSize">Show</label>
          <select id="pageSize" [ngModel]="pageSize" (ngModelChange)="setPageSize($event)">
            <option *ngFor="let size of pageSizeOptions" [ngValue]="size">{{ size }}</option>
          </select>
        </div>
        <div class="pagination-info">
          {{ rangeStart }}–{{ rangeEnd }} of {{ filteredListItems.length }}
        </div>
        <div class="pagination-actions">
          <button type="button" class="page-btn" (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1" aria-label="Previous page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span class="page-label">Page {{ currentPage }} / {{ totalPages }}</span>
          <button type="button" class="page-btn" (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages" aria-label="Next page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </ng-template>
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
      display: flex;
      align-items: center;
      gap: .5rem;
    }
    .list-header .search-wrap {
      flex: 1;
      min-width: 0;
    }
    .header-refresh-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      height: 36px;
      padding: 0 .65rem;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all .2s;
      font-size: .75rem;
      font-weight: 600;
      font-family: inherit;
    }
    .header-refresh-btn:hover:not(:disabled) {
      background: #eff6ff;
      border-color: #bfdbfe;
      color: #2563eb;
    }
    .header-refresh-btn:disabled {
      opacity: .6;
      cursor: not-allowed;
    }
    .header-refresh-btn svg {
      width: 18px;
      height: 18px;
    }
    .header-refresh-btn svg.spinning {
      animation: spin .8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
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

    .thread-wrap {
      border-bottom: 1px solid var(--border-light);
    }
    .thread-head.expanded {
      background: rgba(59, 130, 246, 0.04);
    }
    .thread-toggle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .1rem;
      border: none;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 8px;
      padding: .2rem .35rem;
      cursor: pointer;
      flex-shrink: 0;
      margin-top: .1rem;
    }
    .thread-toggle svg {
      width: 14px;
      height: 14px;
      transition: transform .2s;
    }
    .thread-toggle svg.rotated {
      transform: rotate(90deg);
    }
    .thread-count {
      font-size: .62rem;
      font-weight: 700;
      line-height: 1;
    }
    .thread-label {
      color: #2563eb;
      font-weight: 600;
    }
    .thread-children {
      background: #f8fafc;
      border-top: 1px dashed #e2e8f0;
    }
    .thread-child {
      padding-left: .5rem;
      background: transparent;
    }
    .thread-child-spacer {
      width: 34px;
      flex-shrink: 0;
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
      text-align: center;
    }
    .empty-state svg { color: var(--text-muted); }
    .refresh-btn {
      margin-top: 1rem;
      padding: .5rem 1rem;
      border: 1.5px solid #bfdbfe;
      border-radius: 8px;
      background: #eff6ff;
      color: #2563eb;
      font-size: .8125rem;
      font-weight: 600;
      cursor: pointer;
    }
    .refresh-btn:hover { background: #dbeafe; }

    .loading-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 320px;
      padding: 2rem 1.5rem;
    }
    .loading-card {
      text-align: center;
      max-width: 280px;
      padding: 2rem 1.5rem;
      border-radius: 20px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
      border: 1px solid #dbeafe;
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.12);
    }
    .loading-orbit {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.25rem;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #3b82f6, #818cf8, #3b82f6);
      animation: spin 1.2s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
    }
    .loading-orbit-core {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }
    .loading-card h3 {
      margin: 0 0 .4rem;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .loading-card p {
      margin: 0;
      font-size: .8125rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .loading-dots {
      display: flex;
      justify-content: center;
      gap: .35rem;
      margin-top: 1rem;
    }
    .loading-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #60a5fa;
      animation: pulse 1.2s ease-in-out infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: .15s; }
    .loading-dots span:nth-child(3) { animation-delay: .3s; }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 80%, 100% { opacity: .35; transform: scale(.85); }
      40% { opacity: 1; transform: scale(1); }
    }

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

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      padding: .65rem 1rem;
      border-bottom: 1px solid var(--border-light);
      background: #fafbfc;
      flex-shrink: 0;
    }
    .pagination-size {
      display: flex;
      align-items: center;
      gap: .4rem;
      font-size: .75rem;
      color: var(--text-muted);
    }
    .pagination-size select {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: .2rem .45rem;
      font-size: .75rem;
      font-family: inherit;
      background: white;
      color: var(--text-primary);
    }
    .pagination-info {
      font-size: .75rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }
    .pagination-actions {
      display: flex;
      align-items: center;
      gap: .35rem;
    }
    .page-btn {
      width: 28px;
      height: 28px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: white;
      color: var(--text-secondary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .page-btn svg { width: 14px; height: 14px; }
    .page-btn:disabled {
      opacity: .45;
      cursor: not-allowed;
    }
    .page-label {
      font-size: .72rem;
      color: var(--text-muted);
      min-width: 72px;
      text-align: center;
    }
  `]
})
export class EmailListComponent implements OnChanges, OnInit {
  @Input() set emails(value: Email[]) {
    this._emails = value ?? [];
    this.rebuildList();
  }
  get emails(): Email[] {
    return this._emails;
  }
  private _emails: Email[] = [];
  @Input() emailsKey = 0;
  @Input() selectedEmailId: string | null = null;
  @Input() loading = false;
  @Input() refreshing = false;
  @Input() mailboxConnected = false;
  @Output() onSelectEmail = new EventEmitter<string>();
  @Output() onToggleStar = new EventEmitter<string>();
  @Output() onRefresh = new EventEmitter<void>();

  searchQuery = '';
  activeFilter: 'all' | 'unread' | 'starred' = 'all';
  filteredEmails: Email[] = [];
  filteredListItems: EmailListItem[] = [];
  paginatedItems: EmailListItem[] = [];
  expandedThreadIds = new Set<string>();
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.rebuildList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emailsKey']) {
      this.currentPage = 1;
      this.rebuildList();
      return;
    }

    if (changes['loading'] || changes['refreshing']) {
      const wasRefreshing = changes['refreshing']?.previousValue === true;
      const refreshEnded = wasRefreshing && !this.refreshing && !this.loading;
      if (refreshEnded) {
        this.rebuildList();
        return;
      }
      this.cdr.detectChanges();
    }
  }

  private rebuildList() {
    this.filterEmails();
    this.cdr.detectChanges();
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  private refreshList() {
    this.rebuildList();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredListItems.length / this.pageSize));
  }

  get rangeStart(): number {
    if (this.filteredListItems.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredListItems.length);
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.applyPagination();
  }

  goToPage(page: number) {
    const next = Math.min(Math.max(page, 1), this.totalPages);
    if (next === this.currentPage) return;
    this.currentPage = next;
    this.applyPagination();
  }

  setFilter(filter: 'all' | 'unread' | 'starred') {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.filterEmails();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.filterEmails();
  }

  filterEmails() {
    let result = [...this._emails];

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
    this.filteredListItems = groupEmailsIntoThreads(result);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.applyPagination();
  }

  private applyPagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = this.filteredListItems.slice(start, start + this.pageSize);
  }

  isThreadExpanded(threadId: string): boolean {
    return this.expandedThreadIds.has(threadId);
  }

  toggleThread(threadId: string) {
    if (this.expandedThreadIds.has(threadId)) {
      this.expandedThreadIds.delete(threadId);
    } else {
      this.expandedThreadIds.add(threadId);
    }
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

  trackByListItem(index: number, item: EmailListItem): string {
    return item.type === 'single' ? item.email.id : item.threadId;
  }
}
