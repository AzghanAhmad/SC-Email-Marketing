import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalyticsApiService } from '../../../core/services/analytics-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';
import { XyChartComponent, ChartSeries } from '../../../shared/components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-benchmarks',
  standalone: true,
  imports: [CommonModule, FormsModule, XyChartComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Benchmarks</h1>
          <p class="page-subtitle">Compare your performance against industry averages (refreshed daily from 2026 benchmarks)</p>
        </div>
        <div class="analytics-filters">
          <div class="filter-field">
            <label class="filter-label" for="bench-period">Time period</label>
            <select id="bench-period" class="period-select" [ngModel]="periodDays" (ngModelChange)="onPeriodChange($event)">
              <option [ngValue]="7">Last 7 days</option>
              <option [ngValue]="30">Last 30 days</option>
              <option [ngValue]="90">Last 90 days</option>
              <option [ngValue]="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div class="benchmark-grid">
        <div class="glass-card bench-card" *ngFor="let b of benchmarks">
          <h3 class="bench-metric">{{ b.metric }}</h3>
          <div class="bench-compare">
            <div class="bench-yours">
              <span class="bench-val" [style.color]="b.yourColor">{{ b.yours }}</span>
              <span class="bench-label">Your rate</span>
            </div>
            <div class="bench-vs">vs</div>
            <div class="bench-industry">
              <span class="bench-val">{{ b.industry }}</span>
              <span class="bench-label">Industry avg</span>
            </div>
          </div>
          <app-xy-chart
            type="horizontalBar"
            [labels]="['Your rate', 'Industry avg']"
            [series]="[{ name: b.metric, color: b.yourColor, values: [b.yoursNum, b.industryNum] }]"
            [height]="100"
            [showLegend]="false"
            yAxisLabel="Rate"
          />
          <span class="bench-verdict" [class.above]="b.yoursNum >= b.industryNum" [class.below]="b.yoursNum < b.industryNum">
            {{ b.yoursNum >= b.industryNum ? 'Above average' : 'Below average' }}
          </span>
        </div>
      </div>

      <div class="glass-card tips-card">
        <h3 class="tips-title">Tips to Improve</h3>
        <div class="tips-list">
          <div class="tip-item" *ngFor="let t of tips">
            <span class="nav-icon tip-icon" [innerHTML]="t.safeIcon"></span>
            <div class="tip-body">
              <h4 class="tip-name">{{ t.title }}</h4>
              <p class="tip-desc">{{ t.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .benchmark-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .bench-card { padding:1.5rem; }
    .bench-metric { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .bench-compare { display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; }
    .bench-yours, .bench-industry { display:flex; flex-direction:column; align-items:center; flex:1; }
    .bench-val { font-size:1.5rem; font-weight:800; letter-spacing:-.03em; }
    .bench-label { font-size:.65rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin-top:.15rem; }
    .bench-vs { font-size:.75rem; font-weight:600; color:#94a3b8; }
    .bench-bar-wrap { display:flex; flex-direction:column; gap:.375rem; margin-bottom:.875rem; }
    .bench-bar-track { height:6px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .bench-bar-fill { height:100%; border-radius:100px; transition:width .8s; max-width:100%; }
    .bench-verdict { font-size:.78rem; font-weight:600; }
    .bench-verdict.above { color:#059669; }
    .bench-verdict.below { color:#dc2626; }
    .tips-card { padding:1.5rem; }
    .tips-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .tips-list { display:flex; flex-direction:column; gap:.875rem; }
    .tip-item { display:flex; gap:.875rem; padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; align-items:flex-start; }
    .tip-icon { color:#64748b; flex-shrink:0; }
    .tip-icon svg { width:20px; height:20px; }
    .tip-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .25rem; }
    .tip-desc { font-size:.8rem; color:#94a3b8; margin:0; line-height:1.5; }
    @media(max-width:900px) { .benchmark-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .benchmark-grid { grid-template-columns:1fr; } }
  `]
})
export class BenchmarksComponent implements OnInit {
  private analyticsApi = inject(AnalyticsApiService);
  private sanitizer = inject(DomSanitizer);

  periodDays = 7;
  benchmarks: { metric: string; yours: string; yoursNum: number; industry: string; industryNum: number; yourColor: string }[] = [];

  tips = [
    { iconKey: 'users', title: 'Clean your list regularly', description: 'Remove inactive subscribers to improve deliverability and engagement rates.' },
    { iconKey: 'mail', title: 'Write compelling subject lines', description: 'A/B test subject lines and keep them under 60 characters for better mobile performance.' },
    { iconKey: 'calendar', title: 'Optimize send times', description: 'Send emails Tuesday–Thursday between 9–11am for highest open rates.' },
    { iconKey: 'blocks', title: 'Segment your audience', description: 'Use targeted segments to send relevant content that drives higher engagement.' },
  ].map(t => ({ ...t, safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[t.iconKey] ?? NAV_ICONS['chart']) }));

  ngOnInit() { this.load(); }

  onPeriodChange(days: number) {
    this.periodDays = days;
    this.load();
  }

  private load() {
    this.analyticsApi.getAnalytics(this.periodDays).subscribe(b => {
      this.benchmarks = b.benchmarks.map(row => ({
        metric: row.metric,
        yours: row.yours,
        yoursNum: row.yoursNum,
        industry: row.industry,
        industryNum: row.industryNum,
        yourColor: row.yourColor,
      }));
    });
  }
}
