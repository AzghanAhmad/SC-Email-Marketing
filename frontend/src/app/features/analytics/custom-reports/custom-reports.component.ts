import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalyticsApiService, CustomReport } from '../../../core/services/analytics-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';
import { XyChartComponent, ChartSeries } from '../../../shared/components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-custom-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, XyChartComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Custom Reports</h1>
          <p class="page-subtitle">Build and save custom reports tailored to your needs</p>
        </div>
        <div class="header-actions analytics-filters">
          <div class="filter-field">
            <label class="filter-label" for="cr-period">Time period</label>
            <select id="cr-period" class="period-select" [ngModel]="periodDays" (ngModelChange)="onPeriodChange($event)">
              <option [ngValue]="7">Last 7 days</option>
              <option [ngValue]="30">Last 30 days</option>
              <option [ngValue]="90">Last 90 days</option>
              <option [ngValue]="365">Last year</option>
            </select>
          </div>
          <button class="btn-primary" (click)="showCreate.set(true)" data-tooltip="Create a new custom report">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Report
          </button>
        </div>
      </div>

      <div class="glass-card summary-chart" *ngIf="engagementLabels.length">
        <div class="summary-header">
          <div>
            <h3 class="summary-title">Report Period Overview</h3>
            <p class="summary-sub">Engagement trend for the selected time period</p>
          </div>
        </div>
        <app-xy-chart type="line" [labels]="engagementLabels" [series]="engagementSeries" yAxisLabel="Rate %" xAxisLabel="Month"/>
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
            <button class="btn-primary btn-sm" (click)="viewReport(r)" data-tooltip="View this report">View</button>
            <button class="btn-ghost btn-sm btn-icon" (click)="openRoute(r)" [attr.data-tooltip]="routeFor(r) ? 'Open related page' : 'No linked page'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card empty-prompt" *ngIf="reports.length === 0">
        <span class="nav-icon ep-icon-svg" [innerHTML]="emptyIcon"></span>
        <h3 class="ep-title">No Custom Reports Yet</h3>
        <p class="ep-desc">Build reports combining campaign, flow, and audience data. Export as CSV or schedule automated delivery.</p>
        <button class="btn-secondary" (click)="showCreate.set(true)">Create your first report</button>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="selectedReport()" (click)="selectedReport.set(null)">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <h3 class="modal-title">{{ selectedReport()!.name }}</h3>
        <p class="modal-type">{{ selectedReport()!.type }} report</p>
        <p class="modal-desc">{{ selectedReport()!.description }}</p>
        <p class="modal-updated">Last updated {{ selectedReport()!.lastUpdated }}</p>
        <div class="modal-actions">
          <button class="btn-secondary" (click)="selectedReport.set(null)">Close</button>
          <button class="btn-primary" *ngIf="routeFor(selectedReport()!)" (click)="openRoute(selectedReport()!)">Open full view</button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showCreate()" (click)="showCreate.set(false)">
      <div class="modal glass-card" (click)="$event.stopPropagation()">
        <h3 class="modal-title">New Custom Report</h3>
        <p class="modal-desc">Choose a report type to generate from your current account data.</p>
        <div class="create-options">
          <button class="create-opt" *ngFor="let opt of createOptions" (click)="createReport(opt)">
            <span class="nav-icon" [innerHTML]="opt.safeIcon"></span>
            <span>{{ opt.label }}</span>
          </button>
        </div>
        <button class="btn-ghost" (click)="showCreate.set(false)">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .summary-chart { padding:1.5rem; margin-bottom:1.5rem; }
    .summary-header { margin-bottom:1.25rem; }
    .summary-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .summary-sub { font-size:.78rem; color:#94a3b8; margin:0; }
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
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; }
    .modal { width:min(480px,100%); padding:1.5rem; }
    .modal-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .modal-type { font-size:.75rem; font-weight:600; color:#3b82f6; text-transform:uppercase; letter-spacing:.05em; margin:0 0 .75rem; }
    .modal-desc { font-size:.875rem; color:#64748b; line-height:1.5; margin:0 0 .5rem; }
    .modal-updated { font-size:.75rem; color:#94a3b8; margin:0 0 1.25rem; }
    .modal-actions { display:flex; gap:.75rem; justify-content:flex-end; }
    .create-options { display:flex; flex-direction:column; gap:.5rem; margin:1rem 0; }
    .create-opt { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc; cursor:pointer; font-size:.875rem; font-weight:600; color:#334155; }
    .create-opt:hover { border-color:#3b82f6; background:white; }
  `]
})
export class CustomReportsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private analyticsApi = inject(AnalyticsApiService);
  private router = inject(Router);

  reports: (CustomReport & { safeIcon: SafeHtml })[] = [];
  periodDays = 7;
  engagementLabels: string[] = [];
  engagementSeries: ChartSeries[] = [];
  emptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['chart']);
  selectedReport = signal<(CustomReport & { safeIcon: SafeHtml }) | null>(null);
  showCreate = signal(false);

  createOptions = [
    { label: 'Campaign Performance', type: 'Campaign', iconKey: 'campaign' },
    { label: 'Audience Growth', type: 'Audience', iconKey: 'users' },
    { label: 'Engagement Summary', type: 'Engagement', iconKey: 'chart' },
  ].map(o => ({ ...o, safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[o.iconKey]) }));

  ngOnInit() { this.loadReports(); }

  onPeriodChange(days: number) {
    this.periodDays = days;
    this.loadReports();
  }

  viewReport(r: CustomReport & { safeIcon: SafeHtml }) {
    this.selectedReport.set(r);
  }

  routeFor(r: CustomReport): string | null {
    const t = r.type.toLowerCase();
    if (t === 'campaign') return '/analytics/dashboards';
    if (t === 'audience') return '/analytics/list-health';
    if (t === 'engagement') return '/analytics/metrics';
    return null;
  }

  openRoute(r: CustomReport) {
    const route = this.routeFor(r);
    if (route) {
      this.selectedReport.set(null);
      this.router.navigateByUrl(route);
    }
  }

  createReport(opt: { label: string; type: string; iconKey: string }) {
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const report: CustomReport & { safeIcon: SafeHtml } = {
      id: crypto.randomUUID(),
      name: opt.label,
      type: opt.type,
      description: `Generated ${opt.label.toLowerCase()} report from your account data.`,
      lastUpdated: now,
      iconKey: opt.iconKey,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[opt.iconKey] ?? NAV_ICONS['chart']),
    };
    this.reports = [report, ...this.reports.filter(r => r.name !== opt.label)];
    this.showCreate.set(false);
    this.selectedReport.set(report);
  }

  private loadReports() {
    this.analyticsApi.getAnalytics(this.periodDays).subscribe(b => {
      this.reports = b.customReports.map(r => ({
        ...r,
        safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[r.iconKey] ?? NAV_ICONS['chart']),
      }));
      this.engagementLabels = b.engagementTrend.map(d => d.label);
      this.engagementSeries = [
        { name: 'Open rate', color: '#3b82f6', values: b.engagementTrend.map(d => d.open) },
        { name: 'Click rate', color: '#8b5cf6', values: b.engagementTrend.map(d => d.click) },
      ];
    });
  }
}
