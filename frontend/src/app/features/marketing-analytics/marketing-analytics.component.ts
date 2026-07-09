import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalyticsApiService, MarketingAnalytics } from '../../core/services/analytics-api.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';
import { XyChartComponent, ChartSeries } from '../../shared/components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-marketing-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, XyChartComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Marketing Analytics</h1>
          <p class="page-subtitle">Advanced analytics connecting email performance to business outcomes</p>
        </div>
        <div class="analytics-filters">
          <div class="filter-field">
            <label class="filter-label" for="mkt-period">Time period</label>
            <select id="mkt-period" class="period-select" [ngModel]="periodDays" (ngModelChange)="onPeriodChange($event)">
              <option [ngValue]="7">Last 7 days</option>
              <option [ngValue]="30">Last 30 days</option>
              <option [ngValue]="90">Last 90 days</option>
              <option [ngValue]="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div class="glass-card performance-card" *ngIf="data">
        <div class="perf-header">
          <div>
            <h3 class="perf-title">Business Performance Summary</h3>
            <p class="perf-period">{{ data.periodStart }} — {{ data.periodEnd }}</p>
          </div>
          <a routerLink="/analytics/dashboards" class="btn-secondary btn-sm">View Dashboard</a>
        </div>
        <div class="perf-stats">
          <div class="perf-stat">
            <span class="ps-val">{{ formatMoney(data.performance.totalRevenue) }}</span>
            <span class="ps-label">Total Revenue</span>
            <span class="ps-change" [class.up]="data.performance.totalRevenueChange > 0">
              {{ data.performance.totalRevenueChange > 0 ? '+' : '' }}{{ data.performance.totalRevenueChange | number:'1.0-1' }}% vs. previous period
            </span>
          </div>
          <div class="perf-stat">
            <span class="ps-val">{{ formatMoney(data.performance.attributedRevenue) }}</span>
            <span class="ps-label">Attributed Revenue ({{ attrPct }}% of total)</span>
            <span class="ps-change" [class.up]="data.performance.attributedRevenueChange > 0">
              {{ data.performance.attributedRevenueChange > 0 ? '+' : '' }}{{ data.performance.attributedRevenueChange | number:'1.0-1' }}% vs. previous period
            </span>
          </div>
        </div>
        <div class="revenue-breakdown">
          <h4 class="rb-title">Attributed Revenue</h4>
          <div class="rb-grid">
            <div class="rb-item" *ngFor="let r of attribution">
              <span class="nav-icon" [innerHTML]="r.safeIcon"></span>
              <span class="rb-label">{{ r.label }}</span>
              <span class="rb-val">{{ r.value }}</span>
              <span class="rb-pct">{{ r.pct }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-row" *ngIf="data">
        <div class="glass-card chart-card">
          <h3 class="chart-title">Email Volume</h3>
          <app-xy-chart type="bar" [labels]="volumeLabels" [series]="volumeSeries" yAxisLabel="Emails" xAxisLabel="Month"/>
        </div>
        <div class="glass-card chart-card">
          <h3 class="chart-title">Engagement Trend</h3>
          <app-xy-chart type="line" [labels]="engagementLabels" [series]="engagementSeries" yAxisLabel="Rate %" xAxisLabel="Month"/>
        </div>
      </div>

      <div class="charts-row" *ngIf="data">
        <div class="glass-card chart-card">
          <h3 class="chart-title">Revenue by Source</h3>
          <app-xy-chart
            *ngIf="revenueLabels.length"
            type="horizontalBar"
            [labels]="revenueLabels"
            [series]="revenueSeries"
            [height]="chartHeight(revenueLabels.length, 44, 160)"
            [showLegend]="false"
            xAxisLabel="Source"
            yAxisLabel="Revenue ($)"
          />
          <p class="empty-note" *ngIf="!revenueLabels.length">No revenue data in this period.</p>
        </div>

        <div class="glass-card chart-card">
          <h3 class="chart-title">Campaign Revenue Impact</h3>
          <app-xy-chart
            *ngIf="impactLabels.length"
            type="horizontalBar"
            [labels]="impactLabels"
            [series]="impactSeries"
            [height]="chartHeight(impactLabels.length, 48, 160)"
            [showLegend]="false"
            xAxisLabel="Campaign"
            yAxisLabel="Share %"
          />
          <p class="empty-note" *ngIf="!impactLabels.length">No sent campaigns in this period yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .performance-card { padding:1.75rem; margin-bottom:1.75rem; }
    .perf-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .perf-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .perf-period { font-size:.8125rem; color:#94a3b8; margin:0; }
    .perf-stats { display:grid; grid-template-columns:1fr 1fr; gap:2rem; padding:1.5rem; background:#f8fafc; border-radius:14px; margin-bottom:1.5rem; }
    .perf-stat { display:flex; flex-direction:column; }
    .ps-val { font-size:2rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .ps-label { font-size:.8125rem; color:#64748b; margin-top:.25rem; }
    .ps-change { font-size:.78rem; color:#94a3b8; margin-top:.25rem; }
    .ps-change.up { color:#059669; }
    .rb-title { font-size:.8125rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .rb-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1rem; }
    .rb-item { display:flex; flex-direction:column; align-items:center; gap:.25rem; padding:.875rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .nav-icon { display:flex; align-items:center; justify-content:center; color:#64748b; }
    .nav-icon svg { width:18px; height:18px; }
    .rb-label { font-size:.72rem; font-weight:600; color:#64748b; text-align:center; }
    .rb-val { font-size:1.125rem; font-weight:800; color:#0f172a; }
    .rb-pct { font-size:.7rem; color:#94a3b8; }
    .charts-row { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    .chart-card { padding:1.5rem; }
    .chart-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .source-list { display:flex; flex-direction:column; gap:1rem; }
    .source-item { display:flex; align-items:center; gap:.875rem; }
    .source-name { font-size:.875rem; font-weight:600; color:#0f172a; min-width:100px; }
    .source-bar-wrap { flex:1; }
    .source-bar { height:8px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .source-fill { height:100%; border-radius:100px; transition:width .8s; }
    .source-val { font-size:.875rem; font-weight:700; color:#0f172a; min-width:70px; text-align:right; }
    .impact-list { display:flex; flex-direction:column; gap:1.25rem; }
    .impact-item { padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .impact-header { display:flex; justify-content:space-between; margin-bottom:.5rem; }
    .impact-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .impact-rev { font-size:.875rem; font-weight:700; color:#059669; }
    .impact-bar { height:5px; background:#e2e8f0; border-radius:100px; overflow:hidden; margin-bottom:.5rem; }
    .impact-fill { height:100%; background:linear-gradient(90deg,#60a5fa,#818cf8); border-radius:100px; transition:width .8s; }
    .impact-meta { display:flex; gap:1rem; font-size:.75rem; color:#94a3b8; }
    .empty-note { font-size:.875rem; color:#94a3b8; margin:0; }
    @media(max-width:1100px) { .charts-row { grid-template-columns:1fr; } .rb-grid { grid-template-columns:repeat(3,1fr); } .perf-stats { grid-template-columns:1fr; } }
    @media(max-width:600px) { .rb-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class MarketingAnalyticsComponent implements OnInit {
  private analyticsApi = inject(AnalyticsApiService);
  private sanitizer = inject(DomSanitizer);

  periodDays = 7;
  data: MarketingAnalytics | null = null;
  attribution: { label: string; value: string; pct: string; safeIcon: SafeHtml }[] = [];
  volumeLabels: string[] = [];
  volumeSeries: ChartSeries[] = [];
  engagementLabels: string[] = [];
  engagementSeries: ChartSeries[] = [];
  revenueLabels: string[] = [];
  revenueSeries: ChartSeries[] = [];
  impactLabels: string[] = [];
  impactSeries: ChartSeries[] = [];

  chartHeight(count: number, rowHeight: number, min: number): number {
    return Math.max(min, count * rowHeight);
  }

  get attrPct(): number {
    if (!this.data || this.data.performance.totalRevenue === 0) return 0;
    return Math.round(this.data.performance.attributedRevenue / this.data.performance.totalRevenue * 1000) / 10;
  }

  ngOnInit() { this.load(); }

  onPeriodChange(days: number) {
    this.periodDays = days;
    this.load();
  }

  formatMoney(n: number): string {
    return n > 0 ? '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '$0';
  }

  private load() {
    this.analyticsApi.getMarketingAnalytics(this.periodDays).subscribe(d => {
      this.data = d;
      this.attribution = d.attribution.map(r => ({
        ...r,
        safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[r.icon] ?? NAV_ICONS['chart']),
      }));
      this.volumeLabels = d.volumeData.map(v => v.label);
      this.volumeSeries = [
        { name: 'Sent', color: '#3b82f6', values: d.volumeData.map(v => v.sent) },
        { name: 'Delivered', color: '#10b981', values: d.volumeData.map(v => v.delivered) },
      ];
      this.engagementLabels = d.engagementTrend.map(e => e.label);
      this.engagementSeries = [
        { name: 'Open Rate', color: '#3b82f6', values: d.engagementTrend.map(e => e.open) },
        { name: 'Click Rate', color: '#8b5cf6', values: d.engagementTrend.map(e => e.click) },
      ];
      this.revenueLabels = d.revenueBySource.map(s => s.name);
      this.revenueSeries = [{
        name: 'Revenue',
        color: '#3b82f6',
        values: d.revenueBySource.map(s => this.parseMoney(s.value)),
      }];
      this.impactLabels = d.campaignImpact.map(c => c.name);
      this.impactSeries = [{
        name: 'Revenue share',
        color: '#818cf8',
        values: d.campaignImpact.map(c => c.pct),
      }];
    });
  }

  private parseMoney(value: string): number {
    return Number(String(value).replace(/[^0-9.-]/g, '')) || 0;
  }
}
