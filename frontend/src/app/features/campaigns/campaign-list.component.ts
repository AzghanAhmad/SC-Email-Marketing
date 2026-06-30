import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Campaign } from '../../core/models/campaign.models';

type SortField = 'status' | 'sent' | 'openRate' | 'clickRate' | 'date' | 'name';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card table-card">
      <div class="table-toolbar">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" placeholder="Search campaigns..." [(ngModel)]="searchQuery" />
        </div>
        <div class="filter-row">
          <select class="filter-select" [(ngModel)]="statusFilter">
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <div class="empty-state" *ngIf="campaigns.length === 0">
        <p>No campaigns yet. Create your first campaign to get started.</p>
      </div>

      <table class="data-table" *ngIf="campaigns.length > 0">
        <thead>
          <tr>
            <th><button type="button" class="sort-btn" (click)="setSort('name')">Campaign {{ sortIcon('name') }}</button></th>
            <th><button type="button" class="sort-btn" (click)="setSort('status')">Status {{ sortIcon('status') }}</button></th>
            <th><button type="button" class="sort-btn" (click)="setSort('sent')">Sent {{ sortIcon('sent') }}</button></th>
            <th><button type="button" class="sort-btn" (click)="setSort('openRate')">Open Rate {{ sortIcon('openRate') }}</button></th>
            <th><button type="button" class="sort-btn" (click)="setSort('clickRate')">Click Rate {{ sortIcon('clickRate') }}</button></th>
            <th><button type="button" class="sort-btn" (click)="setSort('date')">Date {{ sortIcon('date') }}</button></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of sortedCampaigns">
            <td>
              <div class="campaign-name-cell">
                <div class="campaign-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div><p class="c-name">{{ c.name }}</p><p class="c-subject">{{ c.subject }}</p></div>
              </div>
            </td>
            <td><span class="badge" [ngClass]="'badge-' + c.status">{{ c.status }}</span></td>
            <td class="num-cell">{{ c.sent > 0 ? (c.sent | number) : '—' }}</td>
            <td>
              <div class="rate-cell" *ngIf="c.openRate > 0">
                <div class="mini-bar"><div class="mini-bar-fill" [style.width.%]="c.openRate" style="background:#34d399"></div></div>
                <span>{{ c.openRate }}%</span>
              </div>
              <span class="muted" *ngIf="c.openRate <= 0">—</span>
            </td>
            <td><span *ngIf="c.clickRate > 0" class="click-rate">{{ c.clickRate }}%</span><span class="muted" *ngIf="c.clickRate <= 0">—</span></td>
            <td class="muted">{{ c.date || '—' }}</td>
            <td>
              <div class="row-actions">
                <button class="row-btn report-btn" type="button" (click)="openReport(c)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Report
                </button>
                <button class="row-btn edit-btn" type="button" (click)="onEdit.emit(c)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button class="row-btn delete-btn" type="button" (click)="onDelete.emit(c.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-card { overflow: hidden; }
    .table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; gap: .75rem; }
    .filter-row { display: flex; align-items: center; gap: .75rem; }
    .filter-select { padding: .55rem .875rem; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; color: #334155; font-size: .8125rem; font-family: inherit; outline: none; cursor: pointer; }
    .empty-state { padding: 2.5rem 1.5rem; text-align: center; color: #94a3b8; font-size: .875rem; }
    .sort-btn { background: none; border: none; padding: 0; font: inherit; font-size: .75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .04em; cursor: pointer; }
    .sort-btn:hover { color: #2563eb; }
    .campaign-name-cell { display: flex; align-items: center; gap: .875rem; }
    .campaign-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(59,130,246,0.08); display: flex; align-items: center; justify-content: center; color: #3b82f6; flex-shrink: 0; }
    .c-name { font-size: .875rem; font-weight: 600; color: #0f172a; margin: 0 0 .15rem; }
    .c-subject { font-size: .75rem; color: #94a3b8; margin: 0; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .num-cell { font-size: .875rem; font-weight: 600; color: #334155; }
    .rate-cell { display: flex; align-items: center; gap: .5rem; }
    .mini-bar { width: 50px; height: 5px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
    .mini-bar-fill { height: 100%; border-radius: 100px; }
    .click-rate { font-size: .875rem; font-weight: 600; color: #6366f1; }
    .muted { color: #94a3b8; font-size: .8125rem; }
    .row-actions { display: flex; align-items: center; gap: .375rem; }
    .row-btn { display: inline-flex; align-items: center; gap: .3rem; padding: .35rem .65rem; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: .75rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap; }
    .report-btn { color: #3b82f6; border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.04); }
    .report-btn:hover { background: rgba(59,130,246,0.1); border-color: #3b82f6; }
    .edit-btn { color: #6366f1; border-color: rgba(99,102,241,0.2); background: rgba(99,102,241,0.04); }
    .edit-btn:hover { background: rgba(99,102,241,0.1); border-color: #6366f1; }
    .delete-btn { color: #dc2626; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.04); }
    .delete-btn:hover { background: rgba(239,68,68,0.1); border-color: #dc2626; }
    .badge { display: inline-block; padding: .2rem .55rem; border-radius: 100px; font-size: .7rem; font-weight: 700; text-transform: capitalize; }
    .badge-sent { background: rgba(16,185,129,.1); color: #059669; }
    .badge-draft { background: #f1f5f9; color: #64748b; }
    .badge-scheduled { background: rgba(59,130,246,.1); color: #2563eb; }
    @media(max-width:768px) {
      .table-toolbar { padding: .875rem 1rem; }
      .table-card { overflow-x: auto; }
      .data-table { min-width: 700px; }
    }
  `]
})
export class CampaignListComponent {
  @Input() campaigns: Campaign[] = [];
  @Output() onEdit = new EventEmitter<Campaign>();
  @Output() onDelete = new EventEmitter<string>();

  searchQuery = '';
  statusFilter = '';
  sortField: SortField = 'date';
  sortDir: SortDir = 'desc';

  constructor(private router: Router) {}

  get filteredCampaigns(): Campaign[] {
    return this.campaigns.filter(c => {
      const q = this.searchQuery.toLowerCase();
      return (!q || c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q))
        && (!this.statusFilter || c.status === this.statusFilter);
    });
  }

  get sortedCampaigns(): Campaign[] {
    const list = [...this.filteredCampaigns];
    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      switch (this.sortField) {
        case 'name': return a.name.localeCompare(b.name) * dir;
        case 'status': return a.status.localeCompare(b.status) * dir;
        case 'sent': return (a.sent - b.sent) * dir;
        case 'openRate': return (a.openRate - b.openRate) * dir;
        case 'clickRate': return (a.clickRate - b.clickRate) * dir;
        case 'date': return (this.dateSortKey(a) - this.dateSortKey(b)) * dir;
        default: return 0;
      }
    });
    return list;
  }

  setSort(field: SortField) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = field === 'name' ? 'asc' : 'desc';
    }
  }

  sortIcon(field: SortField): string {
    if (this.sortField !== field) return '';
    return this.sortDir === 'asc' ? '↑' : '↓';
  }

  openReport(c: Campaign) {
    void this.router.navigate(['/campaigns', c.id, 'report']);
  }

  private dateSortKey(c: Campaign): number {
    const raw = c.sentAt ?? c.scheduledAt;
    if (raw) return new Date(raw).getTime();
    return Date.parse(c.date) || 0;
  }
}
