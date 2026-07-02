import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsApiService } from '../../../core/services/analytics-api.service';
import { XyChartComponent, ChartSeries } from '../../../shared/components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-list-health',
  standalone: true,
  imports: [CommonModule, XyChartComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">List Health</h1>
          <p class="page-subtitle">
            Monitor subscriber quality, flagged inactive readers, and re-engagement flow impact
          </p>
        </div>
        <select class="period-select" [value]="periodDays" (change)="onPeriodChange($event)">
          <option [value]="7">Last 7 days</option>
          <option [value]="30">Last 30 days</option>
          <option [value]="90">Last 90 days</option>
          <option [value]="180">Last 6 months</option>
        </select>
      </div>

      <div class="lh-kpi-grid">
        <div class="glass-card lh-kpi" *ngFor="let k of kpis">
          <span class="lh-kpi-val" [style.color]="k.color">{{ k.value }}</span>
          <span class="lh-kpi-label">{{ k.label }}</span>
          <span class="lh-kpi-desc">{{ k.desc }}</span>
        </div>
      </div>

      <div class="lh-row">
        <div class="glass-card lh-chart-card">
          <div class="lh-chart-header">
            <h3 class="lh-chart-title">Engagement trend</h3>
            <p class="lh-chart-sub">Active engaged vs flagged inactive over 6 months</p>
          </div>
          <app-xy-chart type="bar" [labels]="trendLabels" [series]="trendSeries" yAxisLabel="%" xAxisLabel="Month" [height]="140" [showLegend]="false"/>
          <div class="lh-legend">
            <span><span class="lh-dot active"></span> Active engaged</span>
            <span><span class="lh-dot inactive"></span> Flagged inactive</span>
          </div>
        </div>

        <div class="glass-card lh-flow-card">
          <h3 class="lh-chart-title">Re-engagement flow ({{ periodDays }} days)</h3>
          <p class="lh-chart-sub">Outcomes from subscribers who entered the sequence</p>
          <div class="lh-outcomes">
            <div class="lh-outcome" *ngFor="let o of outcomes">
              <div class="lh-outcome-header">
                <span class="lh-outcome-name">{{ o.name }}</span>
                <span class="lh-outcome-val" [style.color]="o.color">{{ o.count }}</span>
              </div>
              <div class="lh-outcome-bar">
                <div class="lh-outcome-fill" [style.width.%]="o.pct" [style.background]="o.color"></div>
              </div>
              <span class="lh-outcome-pct">{{ o.pct }}% of sequence entries</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card lh-table-card">
        <div class="lh-table-header">
          <div>
            <h3 class="lh-chart-title">Flagged subscribers queue</h3>
            <p class="lh-chart-sub">Readers who crossed the inactivity threshold — review before sequence begins</p>
          </div>
          <select class="filter-select" [value]="statusFilter" (change)="onStatusFilter($event)">
            <option value="all">All statuses</option>
            <option value="queued">Queued</option>
            <option value="in-sequence">In sequence</option>
          </select>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Last engaged</th>
              <th>Days inactive</th>
              <th>Status</th>
              <th>Send frequency match</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filteredQueue.length === 0">
              <td colspan="5" class="empty-row">No flagged subscribers match this filter.</td>
            </tr>
            <tr *ngFor="let s of filteredQueue">
              <td class="lh-email">{{ s.email }}</td>
              <td class="muted">{{ s.lastEngaged }}</td>
              <td>{{ s.daysInactive }} days</td>
              <td><span class="lh-status" [class]="s.statusClass">{{ s.status }}</span></td>
              <td class="muted">{{ s.threshold }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="glass-card lh-note-card">
        <svg viewBox="0 0 20 20" fill="#db2777" width="14" height="14">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <p>
          ScribeCount flags subscribers when they have not opened or clicked within your defined
          threshold. Flagged subscribers appear here before any re-engagement email is sent.
          Both re-engagement and removal are successes — a cleaner list improves deliverability
          and gives you accurate metrics for every campaign you send afterward.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .period-select, .filter-select {
      padding:.55rem 1rem; background:white; border:1.5px solid #e2e8f0;
      border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer;
    }
    .lh-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .lh-kpi { padding: 1.25rem; text-align: center; }
    .lh-kpi-val { display: block; font-size: 1.75rem; font-weight: 800; margin-bottom: .25rem; }
    .lh-kpi-label { display: block; font-size: .8125rem; font-weight: 600; color: #0f172a; margin-bottom: .2rem; }
    .lh-kpi-desc { display: block; font-size: .72rem; color: #94a3b8; line-height: 1.4; }
    .lh-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
    @media (max-width: 900px) { .lh-row { grid-template-columns: 1fr; } }
    .lh-chart-card, .lh-flow-card, .lh-table-card, .lh-note-card { padding: 1.25rem; }
    .lh-chart-header, .lh-table-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
    .lh-chart-title { font-size: 1rem; font-weight: 600; color: #0f172a; margin: 0 0 .2rem; }
    .lh-chart-sub { font-size: .8125rem; color: #94a3b8; margin: 0 0 .75rem; }
    .lh-legend { display: flex; gap: 1.25rem; font-size: .78rem; color: #64748b; margin-top:.75rem; padding-top:.25rem; }
    .lh-dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: .35rem; vertical-align: middle; }
    .lh-dot.active { background: #db2777; }
    .lh-dot.inactive { background: #e2e8f0; }
    .lh-outcomes { display: flex; flex-direction: column; gap: .875rem; }
    .lh-outcome-header { display: flex; justify-content: space-between; margin-bottom: .35rem; }
    .lh-outcome-name { font-size: .8125rem; color: #374151; }
    .lh-outcome-val { font-size: .875rem; font-weight: 700; }
    .lh-outcome-bar { height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden; margin-bottom: .25rem; }
    .lh-outcome-fill { height: 100%; border-radius: 100px; transition: width .6s; }
    .lh-outcome-pct { font-size: .72rem; color: #94a3b8; }
    .lh-table-card { margin-bottom: 1.25rem; overflow-x: auto; }
    .lh-email { font-weight: 500; color: #0f172a; }
    .lh-status { font-size: .72rem; font-weight: 600; padding: .15rem .5rem; border-radius: 100px; }
    .lh-status.queued { background: rgba(217,119,6,0.12); color: #d97706; }
    .lh-status.in-sequence { background: rgba(219,39,119,0.12); color: #db2777; }
    .lh-status.re-engaged { background: rgba(16,185,129,0.12); color: #059669; }
    .lh-note-card { display: flex; align-items: flex-start; gap: .75rem; }
    .lh-note-card p { font-size: .875rem; color: #374151; margin: 0; line-height: 1.6; }
    .empty-row { text-align:center; color:#94a3b8; padding:1.5rem !important; }
  `]
})
export class ListHealthComponent implements OnInit {
  private analyticsApi = inject(AnalyticsApiService);

  periodDays = 30;
  statusFilter = 'all';
  kpis: { label: string; value: string; desc: string; color: string }[] = [];
  trendLabels: string[] = [];
  trendSeries: ChartSeries[] = [];
  outcomes: { name: string; count: number; pct: number; color: string }[] = [];
  flaggedQueue: { email: string; lastEngaged: string; daysInactive: number; status: string; statusClass: string; threshold: string }[] = [];

  get filteredQueue() {
    if (this.statusFilter === 'all') return this.flaggedQueue;
    return this.flaggedQueue.filter(s => s.statusClass === this.statusFilter);
  }

  ngOnInit() { this.load(); }

  onPeriodChange(ev: Event) {
    this.periodDays = Number((ev.target as HTMLSelectElement).value);
    this.load();
  }

  onStatusFilter(ev: Event) {
    this.statusFilter = (ev.target as HTMLSelectElement).value;
  }

  private load() {
    this.analyticsApi.getAnalytics(this.periodDays).subscribe(b => {
      this.kpis = b.listHealthKpis;
      this.trendLabels = b.listHealthTrend.map(t => t.month);
      this.trendSeries = [
        { name: 'Active engaged', color: '#db2777', values: b.listHealthTrend.map(t => t.active) },
        { name: 'Flagged inactive', color: '#cbd5e1', values: b.listHealthTrend.map(t => t.inactive) },
      ];
      this.outcomes = b.listHealthOutcomes;
      this.flaggedQueue = b.flaggedQueue;
    });
  }
}
