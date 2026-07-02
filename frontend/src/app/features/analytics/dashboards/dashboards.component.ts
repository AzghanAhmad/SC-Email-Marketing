import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalyticsApiService } from '../../../core/services/analytics-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';
import { XyChartComponent, ChartSeries } from '../../../shared/components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-analytics-dashboards',
  standalone: true,
  imports: [CommonModule, XyChartComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics Dashboards</h1>
          <p class="page-subtitle">Comprehensive analytics across campaigns, flows, and audience</p>
        </div>
        <div class="header-actions">
          <select class="period-select" [value]="periodDays" (change)="onPeriodChange($event)">
            <option [value]="7">Last 7 days</option>
            <option [value]="30">Last 30 days</option>
            <option [value]="90">Last 90 days</option>
            <option [value]="365">Last year</option>
          </select>
        </div>
      </div>

      <!-- Overview KPIs -->
      <div class="kpi-grid">
        <div class="glass-card kpi-card" *ngFor="let k of kpis">
          <span class="nav-icon" [innerHTML]="k.safeIcon"></span>
          <div class="kpi-body">
            <span class="kpi-val">{{ k.value }}</span>
            <span class="kpi-label">{{ k.label }}</span>
          </div>
          <div class="kpi-change" [class.up]="k.change > 0" [class.down]="k.change < 0">
            {{ k.change > 0 ? '+' : '' }}{{ k.change }}%
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Email Volume -->
        <div class="glass-card chart-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Email Volume</h3>
              <p class="chart-sub">Emails sent over the past 6 months</p>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot" style="background:#3b82f6"></span>Sent</span>
              <span class="legend-item"><span class="legend-dot" style="background:#10b981"></span>Delivered</span>
            </div>
          </div>
          <div class="chart-container">
            <app-xy-chart type="bar" [labels]="volumeLabels" [series]="volumeSeries" yAxisLabel="Emails" xAxisLabel="Month" [showLegend]="false"/>
          </div>
        </div>

        <!-- Engagement Trend -->
        <div class="glass-card chart-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Engagement Trend</h3>
              <p class="chart-sub">Open & click rates over time</p>
            </div>
          </div>
          <app-xy-chart type="line" [labels]="engagementLabels" [series]="engagementSeries" yAxisLabel="Rate %" xAxisLabel="Month"/>
        </div>
      </div>

      <!-- Subscriber Growth -->
      <div class="glass-card chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Subscriber Growth</h3>
            <p class="chart-sub">Total active subscribers over the past 6 months</p>
          </div>
        </div>
        <app-xy-chart type="line" [labels]="growthLabels" [series]="growthSeries" yAxisLabel="Subscribers" xAxisLabel="Month"/>
      </div>

      <!-- Engagement Donuts -->
      <div class="glass-card chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Engagement Breakdown</h3>
            <p class="chart-sub">How subscribers interact with your emails</p>
          </div>
        </div>
        <div class="engagement-grid">
          <div class="eng-item" *ngFor="let e of engBreakdown">
            <div class="eng-donut">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" stroke-width="10"/>
                <circle cx="40" cy="40" r="32" fill="none" [attr.stroke]="e.color" stroke-width="10"
                  [attr.stroke-dasharray]="(e.value / 100 * 201) + ' 201'"
                  stroke-dashoffset="50" stroke-linecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div class="eng-center">
                <span class="eng-val">{{ e.value }}%</span>
              </div>
            </div>
            <span class="eng-label">{{ e.label }}</span>
          </div>
        </div>
      </div>

      <!-- Campaign Funnel -->
      <div class="glass-card chart-card funnel-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Campaign Performance Funnel</h3>
            <p class="chart-sub">Sent → Delivered → Opens → Clicks → Purchases → Revenue</p>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Sent</th>
              <th>Delivered</th>
              <th>Opens</th>
              <th>Clicks</th>
              <th>Purchases</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="campaignFunnel.length === 0">
              <td colspan="7" class="empty-row">No sent campaigns in this period yet.</td>
            </tr>
            <tr *ngFor="let c of campaignFunnel">
              <td class="camp-name">{{ c.name }}</td>
              <td>{{ c.sent | number }}</td>
              <td>{{ c.delivered | number }}</td>
              <td>{{ c.opens | number }}</td>
              <td>{{ c.clicks | number }}</td>
              <td>{{ c.purchases }}</td>
              <td class="revenue">{{ c.revenue }}</td>
            </tr>
          </tbody>
        </table>
        <p class="open-note">
          Open rate is shown as directional only due to Apple MPP inflation. Use click rate, click-to-open, and conversion for decisions.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .header-actions { display:flex; align-items:center; gap:.75rem; }
    .period-select { padding:.55rem 1rem; background:white; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .kpi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .kpi-card { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.375rem; position:relative; }
    .nav-icon { display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#64748b; }
    .nav-icon svg { width:20px; height:20px; display:block; }
    .kpi-body { flex:1; display:flex; flex-direction:column; }
    .kpi-val { font-size:1.5rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; line-height:1.1; }
    .kpi-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin-top:.2rem; }
    .kpi-change { position:absolute; top:.875rem; right:.875rem; font-size:.7rem; font-weight:700; padding:.15rem .4rem; border-radius:5px; }
    .kpi-change.up { color:#059669; background:rgba(16,185,129,0.1); }
    .kpi-change.down { color:#dc2626; background:rgba(239,68,68,0.1); }

    .charts-row { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    .chart-card { padding:1.5rem; }
    .chart-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .chart-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .chart-sub { font-size:.78rem; color:#94a3b8; margin:0; }
    .chart-legend { display:flex; gap:.875rem; }
    .legend-item { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#64748b; font-weight:500; }
    .legend-dot { width:8px; height:8px; border-radius:50%; }

    .chart-container { width:100%; }
    .bar-group { display:flex; flex-direction:column; align-items:center; gap:.5rem; flex:1; height:100%; }
    .bars { display:flex; align-items:flex-end; gap:3px; flex:1; width:100%; }
    .bar { flex:1; border-radius:5px 5px 0 0; transition:height .8s cubic-bezier(.4,0,.2,1); min-height:4px; }
    .bar.sent { background:linear-gradient(180deg,#3b82f6,rgba(59,130,246,0.4)); }
    .bar.delivered { background:linear-gradient(180deg,#10b981,rgba(16,185,129,0.4)); }
    .bar-label { font-size:.7rem; color:#94a3b8; font-weight:500; }

    .line-chart-wrap { position:relative; }
    .line-svg { width:100%; height:120px; }
    .line-labels { display:flex; justify-content:space-between; font-size:.7rem; color:#94a3b8; margin-top:.25rem; }

    .engagement-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1.5rem; }
    .eng-item { display:flex; flex-direction:column; align-items:center; gap:.75rem; }
    .eng-donut { position:relative; width:80px; height:80px; }
    .eng-donut svg { width:100%; height:100%; }
    .eng-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
    .eng-val { font-size:.9rem; font-weight:800; color:#0f172a; }
    .eng-label { font-size:.75rem; font-weight:600; color:#64748b; text-align:center; }
    .funnel-card { margin-top:1.5rem; }
    .camp-name { font-weight:600; color:#0f172a; }
    .revenue { color:#059669; font-weight:700; }
    .open-note {
      margin-top:1rem; font-size:.75rem; color:#64748b;
      background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;
      padding:.625rem .75rem;
    }
    .empty-row { text-align:center; color:#94a3b8; padding:1.5rem !important; }

    @media(max-width:1200px) { .kpi-grid { grid-template-columns:repeat(2,1fr); } .engagement-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .charts-row { grid-template-columns:1fr; } }
    @media(max-width:600px) { .kpi-grid { grid-template-columns:1fr; } .engagement-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class AnalyticsDashboardsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private analyticsApi = inject(AnalyticsApiService);

  periodDays = 30;
  kpis: { label: string; value: string; change: number; safeIcon: SafeHtml }[] = [];
  volumeData: { label: string; sent: number; delivered: number }[] = [];
  volumeLabels: string[] = [];
  volumeSeries: ChartSeries[] = [];
  engagementLabels: string[] = [];
  engagementSeries: ChartSeries[] = [];
  engBreakdown: { label: string; value: number; color: string }[] = [];
  growthLabels: string[] = [];
  growthSeries: ChartSeries[] = [];
  campaignFunnel: { name: string; sent: number; delivered: number; opens: number; clicks: number; purchases: number; revenue: string }[] = [];

  ngOnInit() { this.loadData(); }

  onPeriodChange(ev: Event) {
    this.periodDays = Number((ev.target as HTMLSelectElement).value);
    this.loadData();
  }

  private loadData() {
    this.analyticsApi.getAnalytics(this.periodDays).subscribe(bundle => {
      this.kpis = bundle.kpis.map(k => ({
        label: k.label,
        value: k.value,
        change: k.change,
        safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[k.iconKey] ?? NAV_ICONS['chart']),
      }));
      this.volumeData = bundle.volumeData;
      this.volumeLabels = bundle.volumeData.map(d => d.label);
      this.volumeSeries = [
        { name: 'Sent', color: '#3b82f6', values: bundle.volumeData.map(d => d.sent) },
        { name: 'Delivered', color: '#10b981', values: bundle.volumeData.map(d => d.delivered) },
      ];
      this.engagementLabels = bundle.engagementTrend.map(e => e.label);
      this.engagementSeries = [
        { name: 'Open Rate', color: '#3b82f6', values: bundle.engagementTrend.map(e => e.open) },
        { name: 'Click Rate', color: '#8b5cf6', values: bundle.engagementTrend.map(e => e.click) },
      ];
      this.engBreakdown = bundle.engagementBreakdown;
      this.growthLabels = bundle.subscriberGrowth.map(d => d.label);
      this.growthSeries = [{ name: 'Subscribers', color: '#1e3a5f', values: bundle.subscriberGrowth.map(d => d.count) }];
      this.campaignFunnel = bundle.campaignFunnel;
    });
  }
}
