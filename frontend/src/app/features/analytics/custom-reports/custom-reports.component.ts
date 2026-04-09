import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Custom Reports</h1>
          <p class="page-subtitle">Build and save custom reports tailored to your needs</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a new custom report">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Report
        </button>
      </div>

      <div class="reports-grid">
        <div class="glass-card report-card" *ngFor="let r of reports">
          <div class="rc-icon" [style.background]="r.iconBg">
            <span [innerHTML]="r.icon"></span>
          </div>
          <div class="rc-body">
            <h3 class="rc-name">{{ r.name }}</h3>
            <p class="rc-desc">{{ r.description }}</p>
            <div class="rc-meta">
              <span class="rc-type">{{ r.type }}</span>
              <span class="rc-updated">Updated {{ r.lastUpdated }}</span>
            </div>
          </div>
          <div class="rc-actions">
            <button class="btn-primary btn-sm" data-tooltip="View this report">View</button>
            <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card empty-prompt" *ngIf="reports.length > 0">
        <div class="ep-icon">📊</div>
        <h3 class="ep-title">Create Custom Reports</h3>
        <p class="ep-desc">Build reports combining campaign, flow, and audience data. Export as CSV or schedule automated delivery.</p>
        <button class="btn-secondary" data-tooltip="Learn how to create custom reports">Learn More</button>
      </div>
    </div>
  `,
  styles: [`
    .reports-grid { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
    .report-card { display:flex; align-items:center; gap:1.25rem; padding:1.375rem 1.5rem; }
    .rc-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rc-icon :global(svg) { width:20px; height:20px; }
    .rc-body { flex:1; }
    .rc-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .rc-desc { font-size:.8125rem; color:#94a3b8; margin:0 0 .5rem; }
    .rc-meta { display:flex; align-items:center; gap:.75rem; }
    .rc-type { padding:.2rem .55rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .rc-updated { font-size:.72rem; color:#94a3b8; }
    .rc-actions { display:flex; align-items:center; gap:.5rem; }

    .empty-prompt { padding:2.5rem; text-align:center; display:flex; flex-direction:column; align-items:center; }
    .ep-icon { font-size:2.5rem; margin-bottom:.75rem; }
    .ep-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .5rem; }
    .ep-desc { font-size:.875rem; color:#94a3b8; margin:0 0 1.25rem; max-width:420px; line-height:1.5; }
  `]
})
export class CustomReportsComponent {
  reports = [
    { name: 'Monthly Performance Summary', type: 'Scheduled', description: 'Comprehensive monthly report of campaign and flow performance', lastUpdated: 'Apr 1, 2026', iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
    { name: 'Revenue Attribution Report', type: 'Manual', description: 'Track revenue attributed to email campaigns and flows', lastUpdated: 'Mar 28, 2026', iconBg: 'rgba(16,185,129,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
    { name: 'List Growth Analysis', type: 'Weekly', description: 'New subscriber sources, engagement quality, and list health metrics', lastUpdated: 'Apr 5, 2026', iconBg: 'rgba(139,92,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { name: 'Book Launch ROI', type: 'Manual', description: 'Compare email performance across different book launches', lastUpdated: 'Mar 15, 2026', iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  ];
}
