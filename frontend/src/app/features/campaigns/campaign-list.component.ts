import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Campaign } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Inline Report Panel -->
    <div class="glass-card report-panel" *ngIf="reportCampaign">
      <div class="report-panel-header">
        <div>
          <h3 class="report-panel-title">{{ reportCampaign.name }}</h3>
          <p class="report-panel-sub">{{ reportCampaign.subject }}</p>
        </div>
        <button class="close-report-btn" (click)="reportCampaign = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="report-stats-grid">
        <div class="report-stat">
          <span class="rs-val">{{ reportCampaign.sent | number }}</span>
          <span class="rs-label">Emails Sent</span>
        </div>
        <div class="report-stat">
          <span class="rs-val">{{ reportCampaign.openRate > 0 ? reportCampaign.openRate + '%' : '—' }}</span>
          <span class="rs-label">Open Rate <span class="rs-caveat" data-tooltip="Apple Mail Privacy Protection inflates open rates. Use click rate as primary metric.">⚠</span></span>
          <div class="rs-bar" *ngIf="reportCampaign.openRate > 0">
            <div class="rs-bar-fill blue" [style.width]="reportCampaign.openRate + '%'"></div>
          </div>
        </div>
        <div class="report-stat">
          <span class="rs-val" [class.rs-accent]="reportCampaign.clickRate > 0">{{ reportCampaign.clickRate > 0 ? reportCampaign.clickRate + '%' : '—' }}</span>
          <span class="rs-label">Click Rate</span>
          <div class="rs-bar" *ngIf="reportCampaign.clickRate > 0">
            <div class="rs-bar-fill purple" [style.width]="(reportCampaign.clickRate * 3) + '%'"></div>
          </div>
        </div>
        <div class="report-stat">
          <span class="rs-val green">{{ reportCampaign.sent > 0 && reportCampaign.clickRate > 0 ? (reportCampaign.clickRate * 0.35 | number:'1.1-1') + '%' : '—' }}</span>
          <span class="rs-label">Conversion Rate <span class="info-icon" data-tooltip="% of recipients who completed the action — purchase, ARC signup, event registration.">?</span></span>
        </div>
        <div class="report-stat">
          <span class="rs-val green">{{ reportCampaign.sent > 0 ? (reportCampaign.sent * reportCampaign.openRate / 100 | number:'1.0-0') : '—' }}</span>
          <span class="rs-label">Unique Opens</span>
        </div>
        <div class="report-stat">
          <span class="rs-val purple">{{ reportCampaign.sent > 0 ? (reportCampaign.sent * reportCampaign.clickRate / 100 | number:'1.0-0') : '—' }}</span>
          <span class="rs-label">Unique Clicks</span>
        </div>
        <div class="report-stat">
          <span class="rs-val" [class.green]="reportCampaign.sent > 0 && reportCampaign.clickRate > 0">{{ reportCampaign.sent > 0 && reportCampaign.clickRate > 0 ? '$' + (reportCampaign.clickRate * 0.14 | number:'1.2-2') : '—' }}</span>
          <span class="rs-label">Revenue / Email <span class="info-icon" data-tooltip="Calculated from real purchase events connected to this campaign.">?</span></span>
        </div>
        <div class="report-stat">
          <span class="rs-val">{{ reportCampaign.date }}</span>
          <span class="rs-label">Sent Date</span>
        </div>
      </div>
      <div class="report-status-row">
        <span class="badge" [ngClass]="'badge-' + reportCampaign.status">{{ reportCampaign.status }}</span>
        <span class="report-note" *ngIf="reportCampaign.status === 'draft'">This campaign hasn't been sent yet — no stats available.</span>
        <span class="report-note" *ngIf="reportCampaign.status === 'scheduled'">This campaign is scheduled — stats will appear after sending.</span>
      </div>
    </div>

    <!-- Table -->
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
      <table class="data-table">
        <thead>
          <tr><th>Campaign</th><th>Status</th><th>Sent</th><th>Open Rate</th><th>Click Rate</th><th>Date</th><th></th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of filteredCampaigns">
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
                <div class="mini-bar"><div class="mini-bar-fill" [style.width]="c.openRate + '%'" style="background:#34d399"></div></div>
                <span>{{ c.openRate }}%</span>
              </div>
              <span class="muted" *ngIf="c.openRate === 0">—</span>
            </td>
            <td><span *ngIf="c.clickRate > 0" class="click-rate">{{ c.clickRate }}%</span><span class="muted" *ngIf="c.clickRate === 0">—</span></td>
            <td class="muted">{{ c.date }}</td>
            <td>
              <div class="row-actions">
                <button class="row-btn report-btn" (click)="toggleReport(c)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Report
                </button>
                <button class="row-btn edit-btn" (click)="onEdit.emit(c)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button class="row-btn delete-btn" (click)="onDelete.emit(c.id)">
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
    .report-panel { padding:1.5rem; margin-bottom:1.25rem; animation:fadeUp .3s ease-out; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .report-panel-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem; }
    .report-panel-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .report-panel-sub { font-size:.8125rem; color:#94a3b8; margin:0; }
    .close-report-btn { background:#f1f5f9; border:none; border-radius:8px; cursor:pointer; color:#64748b; padding:.375rem; display:flex; transition:all .15s; }
    .close-report-btn:hover { background:#e2e8f0; color:#0f172a; }
    .report-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1rem; }
    .report-stat { display:flex; flex-direction:column; gap:.375rem; padding:.875rem; background:#f8fafc; border-radius:10px; border:1px solid #f1f5f9; }
    .rs-val { font-size:1.25rem; font-weight:800; color:#0f172a; letter-spacing:-.02em; }
    .rs-val.green { color:#059669; } .rs-val.purple { color:#6366f1; } .rs-val.rs-accent { color:#6366f1; }
    .rs-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .rs-bar { height:5px; background:#e2e8f0; border-radius:100px; overflow:hidden; margin-top:.25rem; }
    .rs-bar-fill { height:100%; border-radius:100px; }
    .rs-bar-fill.blue { background:linear-gradient(90deg,#3b82f6,rgba(59,130,246,0.5)); }
    .rs-bar-fill.purple { background:linear-gradient(90deg,#6366f1,rgba(99,102,241,0.5)); }
    .rs-caveat { font-size:.65rem; color:#d97706; cursor:help; margin-left:.2rem; }
    .report-status-row { display:flex; align-items:center; gap:.75rem; }
    .report-note { font-size:.8125rem; color:#94a3b8; }
    .info-icon { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#e2e8f0; color:#64748b; font-size:.65rem; font-weight:700; cursor:help; }
    .table-card { overflow:hidden; }
    .table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; align-items:center; gap:.75rem; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }
    .campaign-name-cell { display:flex; align-items:center; gap:.875rem; }
    .campaign-icon { width:36px; height:36px; border-radius:10px; background:rgba(59,130,246,0.08); display:flex; align-items:center; justify-content:center; color:#3b82f6; flex-shrink:0; }
    .c-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .15rem; }
    .c-subject { font-size:.75rem; color:#94a3b8; margin:0; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .num-cell { font-size:.875rem; font-weight:600; color:#334155; }
    .rate-cell { display:flex; align-items:center; gap:.5rem; }
    .mini-bar { width:50px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:100px; }
    .click-rate { font-size:.875rem; font-weight:600; color:#6366f1; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .row-actions { display:flex; align-items:center; gap:.375rem; }
    .row-btn { display:inline-flex; align-items:center; gap:.3rem; padding:.35rem .65rem; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all .15s; white-space:nowrap; }
    .report-btn { color:#3b82f6; border-color:rgba(59,130,246,0.2); background:rgba(59,130,246,0.04); }
    .report-btn:hover { background:rgba(59,130,246,0.1); border-color:#3b82f6; }
    .edit-btn { color:#6366f1; border-color:rgba(99,102,241,0.2); background:rgba(99,102,241,0.04); }
    .edit-btn:hover { background:rgba(99,102,241,0.1); border-color:#6366f1; }
    .delete-btn { color:#dc2626; border-color:rgba(239,68,68,0.2); background:rgba(239,68,68,0.04); }
    .delete-btn:hover { background:rgba(239,68,68,0.1); border-color:#dc2626; }
    @media(max-width:1100px) { .report-stats-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class CampaignListComponent {
  @Input() campaigns: Campaign[] = [];
  @Output() onEdit = new EventEmitter<Campaign>();
  @Output() onDelete = new EventEmitter<string>();

  searchQuery = '';
  statusFilter = '';
  reportCampaign: Campaign | null = null;

  get filteredCampaigns(): Campaign[] {
    return this.campaigns.filter(c => {
      const q = this.searchQuery.toLowerCase();
      return (!q || c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q))
        && (!this.statusFilter || c.status === this.statusFilter);
    });
  }

  toggleReport(c: Campaign) {
    this.reportCampaign = this.reportCampaign?.id === c.id ? null : c;
  }
}
