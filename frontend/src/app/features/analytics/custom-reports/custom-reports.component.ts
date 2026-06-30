import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalyticsApiService } from '../../../core/services/analytics-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';

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

      <div class="reports-grid" *ngIf="reports.length > 0">
        <div class="glass-card report-card" *ngFor="let r of reports">
          <span class="nav-icon" [innerHTML]="r.safeIcon"></span>
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

      <div class="glass-card empty-prompt" *ngIf="reports.length === 0">
        <span class="nav-icon ep-icon-svg" [innerHTML]="emptyIcon"></span>
        <h3 class="ep-title">No Custom Reports Yet</h3>
        <p class="ep-desc">Build reports combining campaign, flow, and audience data. Export as CSV or schedule automated delivery.</p>
        <button class="btn-secondary" data-tooltip="Learn how to create custom reports">Learn More</button>
      </div>
    </div>
  `,
  styles: [`
    .reports-grid { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
    .report-card { display:flex; align-items:center; gap:1.25rem; padding:1.375rem 1.5rem; }
    .nav-icon { display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#64748b; }
    .nav-icon svg { width:20px; height:20px; display:block; }
    .ep-icon-svg { margin-bottom:.75rem; color:#94a3b8; }
    .rc-body { flex:1; }
    .rc-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .rc-desc { font-size:.8125rem; color:#94a3b8; margin:0 0 .5rem; }
    .rc-meta { display:flex; align-items:center; gap:.75rem; }
    .rc-type { padding:.2rem .55rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .rc-updated { font-size:.72rem; color:#94a3b8; }
    .rc-actions { display:flex; align-items:center; gap:.5rem; }

    .empty-prompt { padding:2.5rem; text-align:center; display:flex; flex-direction:column; align-items:center; }
    .ep-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .5rem; }
    .ep-desc { font-size:.875rem; color:#94a3b8; margin:0 0 1.25rem; max-width:420px; line-height:1.5; }
  `]
})
export class CustomReportsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private analyticsApi = inject(AnalyticsApiService);

  reports: { name: string; type: string; description: string; lastUpdated: string; safeIcon: SafeHtml }[] = [];
  emptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['chart']);

  ngOnInit() {
    this.analyticsApi.getAnalytics(30).subscribe(b => {
      this.reports = b.customReports.map(r => ({
        name: r.name,
        type: r.type,
        description: r.description,
        lastUpdated: r.lastUpdated,
        safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[r.iconKey] ?? NAV_ICONS['chart']),
      }));
    });
  }
}
