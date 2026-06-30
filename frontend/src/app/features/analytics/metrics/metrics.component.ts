import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsApiService } from '../../../core/services/analytics-api.service';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Metrics</h1>
          <p class="page-subtitle">Track your key email marketing performance metrics over time</p>
        </div>
        <select class="period-select" [value]="periodDays" (change)="onPeriodChange($event)">
          <option [value]="7">Last 7 days</option><option [value]="30">Last 30 days</option><option [value]="90">Last 90 days</option>
        </select>
      </div>

      <div class="metrics-grid">
        <div class="glass-card metric-card" *ngFor="let m of metrics">
          <div class="mc-header">
            <span class="mc-label">{{ m.label }}</span>
            <span class="mc-change" [class.up]="m.change > 0" [class.down]="m.change < 0">
              {{ m.change > 0 ? '+' : '' }}{{ m.change }}%
            </span>
          </div>
          <span class="mc-val">{{ m.value }}</span>
          <div class="mc-sparkline">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
              <polyline [attr.points]="m.sparkline" fill="none" [attr.stroke]="m.color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="mc-period">vs previous period</span>
        </div>
      </div>

      <div class="glass-card detail-card">
        <h3 class="detail-title">Metric Details</h3>
        <table class="data-table">
          <thead><tr><th>Metric</th><th>Current</th><th>Previous</th><th>Change</th><th>Trend</th></tr></thead>
          <tbody>
            <tr *ngFor="let m of detailMetrics">
              <td class="metric-name">{{ m.name }}</td>
              <td class="metric-current">{{ m.current }}</td>
              <td class="muted">{{ m.previous }}</td>
              <td>
                <span class="change-badge" [class.up]="m.changeNum > 0" [class.down]="m.changeNum < 0">
                  {{ m.changeNum > 0 ? '+' : '' }}{{ m.changeNum }}%
                </span>
              </td>
              <td>
                <div class="spark-mini">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none">
                    <polyline [attr.points]="m.spark" fill="none" [attr.stroke]="m.changeNum >= 0 ? '#10b981' : '#ef4444'" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="glass-card detail-card">
        <h3 class="detail-title">Flow Step Performance</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Flow Step</th>
              <th>Entered</th>
              <th>Completed</th>
              <th>Delivered</th>
              <th>Opens</th>
              <th>Clicks</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="flowSteps.length === 0">
              <td colspan="7" class="empty-row">No active flows yet.</td>
            </tr>
            <tr *ngFor="let s of flowSteps">
              <td class="metric-name">{{ s.step }}</td>
              <td>{{ s.entered }}</td>
              <td>{{ s.completed }}</td>
              <td>{{ s.delivered }}</td>
              <td>{{ s.opens }}</td>
              <td>{{ s.clicks }}</td>
              <td class="rev">{{ s.revenue }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="glass-card detail-card">
        <h3 class="detail-title">Flow Goal Exit Rate</h3>
        <div class="goal-grid">
          <div class="goal-item" *ngFor="let g of goalExitRates">
            <span class="goal-name">{{ g.name }}</span>
            <span class="goal-rate">{{ g.rate }}%</span>
            <span class="goal-note">{{ g.note }}</span>
          </div>
        </div>
      </div>

      <div class="glass-card detail-card">
        <h3 class="detail-title">Why Did This Send (Audit Log)</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Flow</th>
              <th>Step</th>
              <th>Reason</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="sendAuditRows.length === 0">
              <td colspan="5" class="empty-row">No send audit entries yet.</td>
            </tr>
            <tr *ngFor="let row of sendAuditRows">
              <td>{{ row.subscriber }}</td>
              <td>{{ row.flow }}</td>
              <td>{{ row.step }}</td>
              <td class="muted">{{ row.reason }}</td>
              <td class="muted">{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .period-select { padding:.55rem 1rem; background:white; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .metrics-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .metric-card { padding:1.375rem; }
    .mc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; }
    .mc-label { font-size:.75rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
    .mc-change { font-size:.7rem; font-weight:700; padding:.15rem .4rem; border-radius:5px; }
    .mc-change.up { color:#059669; background:rgba(16,185,129,0.1); }
    .mc-change.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .mc-val { font-size:1.75rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .mc-sparkline { height:30px; margin:.5rem 0 .25rem; }
    .mc-sparkline svg { width:100%; height:100%; }
    .mc-period { font-size:.7rem; color:#94a3b8; }

    .detail-card { padding:1.5rem; margin-bottom:1.25rem; }
    .detail-card:last-child { margin-bottom:0; }
    .detail-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .metric-name { font-weight:600; color:#0f172a; }
    .metric-current { font-weight:700; color:#0f172a; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .change-badge { font-size:.75rem; font-weight:700; padding:.2rem .5rem; border-radius:5px; }
    .change-badge.up { color:#059669; background:rgba(16,185,129,0.1); }
    .change-badge.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .spark-mini { width:60px; height:20px; }
    .spark-mini svg { width:100%; height:100%; }
    .rev { color:#059669; font-weight:700; }
    .goal-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .goal-item { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:.9rem; display:flex; flex-direction:column; gap:.25rem; }
    .goal-name { font-size:.82rem; font-weight:600; color:#0f172a; }
    .goal-rate { font-size:1.3rem; font-weight:800; color:#3b82f6; }
    .goal-note { font-size:.72rem; color:#64748b; }
    .empty-row { text-align:center; color:#94a3b8; padding:1.5rem !important; }

    @media(max-width:900px) { .metrics-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .metrics-grid { grid-template-columns:1fr; } .goal-grid { grid-template-columns:1fr; } }
  `]
})
export class MetricsComponent implements OnInit {
  private analyticsApi = inject(AnalyticsApiService);
  periodDays = 30;
  metrics: { label: string; value: string; change: number; color: string; sparkline: string }[] = [];
  detailMetrics: { name: string; current: string; previous: string; changeNum: number; spark: string }[] = [];
  flowSteps: { step: string; entered: number; completed: number; delivered: number; opens: number; clicks: number; revenue: string }[] = [];
  goalExitRates: { name: string; rate: number; note: string }[] = [];
  sendAuditRows: { subscriber: string; flow: string; step: string; reason: string; time: string }[] = [];

  ngOnInit() { this.loadData(); }

  onPeriodChange(ev: Event) {
    this.periodDays = Number((ev.target as HTMLSelectElement).value);
    this.loadData();
  }

  private loadData() {
    this.analyticsApi.getAnalytics(this.periodDays).subscribe(b => {
      this.metrics = b.metrics.map(m => ({ label: m.label, value: m.value, change: m.change, color: m.color, sparkline: m.sparkline }));
      this.detailMetrics = b.metricDetails.map(d => ({ name: d.name, current: d.current, previous: d.previous, changeNum: d.changeNum, spark: d.spark }));
      this.flowSteps = b.flowSteps.map(s => ({ step: s.step, entered: s.entered, completed: s.completed, delivered: s.delivered, opens: s.opens, clicks: s.clicks, revenue: s.revenue }));
      this.goalExitRates = b.goalExitRates;
      this.sendAuditRows = b.sendAuditRows;
    });
  }
}
