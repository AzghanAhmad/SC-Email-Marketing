import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Deep analytics for campaigns, flows, and subscriber growth</p>
        </div>
        <button class="btn-secondary" data-tooltip="Export all reports as CSV">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      <!-- Metrics Chart Panel -->
      <div class="glass-card metrics-panel">
        <div class="metrics-header">
          <div>
            <h3 class="metrics-title">Metrics</h3>
            <p class="metrics-sub">Track your key email marketing performance metrics over time</p>
          </div>
          <div class="period-tabs">
            <button class="period-tab" [class.active]="activePeriod === '7d'" (click)="setPeriod('7d')">Last 7 days</button>
            <button class="period-tab" [class.active]="activePeriod === '30d'" (click)="setPeriod('30d')">Last 30 days</button>
            <button class="period-tab" [class.active]="activePeriod === '90d'" (click)="setPeriod('90d')">Last 90 days</button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="metrics-kpi-row">
          <div class="metric-kpi" *ngFor="let m of metricCards" [class.active]="activeMetric === m.key" (click)="setMetric(m.key)">
            <div class="mkpi-top">
              <span class="mkpi-label">{{ m.label }}</span>
              <span class="mkpi-change" [class.up]="m.change > 0" [class.down]="m.change < 0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10">
                  <polyline *ngIf="m.change > 0" points="18 15 12 9 6 15"/>
                  <polyline *ngIf="m.change < 0" points="6 9 12 15 18 9"/>
                </svg>
                {{ m.change > 0 ? '+' : '' }}{{ m.change }}%
              </span>
            </div>
            <span class="mkpi-value">{{ m.value }}</span>
            <span class="mkpi-period">vs previous period</span>
          </div>
        </div>

        <!-- Line Chart -->
        <div class="metrics-chart-wrap">
          <div class="metrics-y-axis">
            <span *ngFor="let y of metricsYLabels">{{ y }}</span>
          </div>
          <div class="metrics-chart-inner">
            <svg class="metrics-svg" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#1e3a5f" stop-opacity="0.1"/>
                  <stop offset="100%" stop-color="#1e3a5f" stop-opacity="0.01"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line *ngFor="let gl of metricsGridLines" x1="0" [attr.y1]="gl" x2="600" [attr.y2]="gl" stroke="#f1f5f9" stroke-width="1"/>
              <!-- Area -->
              <polygon [attr.points]="metricsAreaPoints" fill="url(#mGrad)"/>
              <!-- Line -->
              <polyline [attr.points]="metricsLinePoints" fill="none" stroke="#1e3a5f" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- Dots -->
              <g *ngFor="let pt of metricsDots">
                <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="5" fill="white" stroke="#1e3a5f" stroke-width="2"/>
                <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="2.5" fill="#1e3a5f"/>
              </g>
            </svg>
            <div class="metrics-x-labels">
              <span *ngFor="let l of metricsXLabels">{{ l }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Campaign Performance -->
      <div class="glass-card report-card">
        <div class="report-header">
          <div>
            <h3 class="report-title">Campaign Performance</h3>
            <p class="report-sub">Open rates and click rates per campaign</p>
          </div>
          <div class="report-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#60a5fa"></span>Open Rate</span>
            <span class="legend-item"><span class="legend-dot" style="background:#a78bfa"></span>Click Rate</span>
          </div>
        </div>
        <div class="campaign-perf-table">
          <div class="perf-row header-row">
            <span>Campaign</span>
            <span>Sent</span>
            <span>Open Rate</span>
            <span>Click Rate</span>
            <span>Revenue</span>
          </div>
          <div class="perf-row" *ngFor="let c of campaignPerf">
            <span class="perf-name">{{ c.name }}</span>
            <span class="perf-num">{{ c.sent | number }}</span>
            <div class="perf-rate-cell">
              <div class="perf-bar"><div class="perf-bar-fill blue" [style.width]="c.openRate + '%'"></div></div>
              <span>{{ c.openRate }}%</span>
            </div>
            <div class="perf-rate-cell">
              <div class="perf-bar"><div class="perf-bar-fill purple" [style.width]="(c.clickRate * 3) + '%'"></div></div>
              <span>{{ c.clickRate }}%</span>
            </div>
            <span class="perf-rev">{{ '$' + (c.revenue | number) }}</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Subscriber Growth -->
        <div class="glass-card report-card">
          <div class="report-header">
            <div>
              <h3 class="report-title">Subscriber Growth</h3>
              <p class="report-sub">Monthly new subscribers</p>
            </div>
          </div>
          <div class="growth-bars">
            <div class="growth-bar-col" *ngFor="let d of growthMonthly">
              <span class="gb-val">+{{ d.new }}</span>
              <div class="gb-track">
                <div class="gb-fill" [style.height]="(d.new / maxNew * 100) + '%'"></div>
              </div>
              <span class="gb-label">{{ d.label }}</span>
            </div>
          </div>
        </div>

        <!-- Flow Performance -->
        <div class="glass-card report-card">
          <div class="report-header">
            <div>
              <h3 class="report-title">Flow Performance</h3>
              <p class="report-sub">Automation flow metrics</p>
            </div>
          </div>
          <div class="flow-perf-list">
            <div class="fp-item" *ngFor="let f of flowPerf">
              <div class="fp-header">
                <span class="fp-name">{{ f.name }}</span>
                <span class="badge" [ngClass]="f.status === 'active' ? 'badge-active' : 'badge-paused'">{{ f.status }}</span>
              </div>
              <div class="fp-stats">
                <div class="fp-stat" data-tooltip="Total times this flow was triggered">
                  <span class="fps-val">{{ f.triggered | number }}</span>
                  <span class="fps-label">Triggered</span>
                </div>
                <div class="fp-stat" data-tooltip="Percentage of emails in this flow that were opened">
                  <span class="fps-val">{{ f.openRate }}%</span>
                  <span class="fps-label">Open Rate</span>
                </div>
                <div class="fp-stat" data-tooltip="Percentage of subscribers who completed the full flow">
                  <span class="fps-val">{{ f.completion }}%</span>
                  <span class="fps-label">Completion</span>
                </div>
              </div>
              <div class="fp-bar-wrap">
                <div class="fp-bar"><div class="fp-bar-fill" [style.width]="f.openRate + '%'" style="background:linear-gradient(90deg,#60a5fa,#818cf8)"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Engagement Breakdown -->
      <div class="glass-card report-card">
        <div class="report-header">
          <div>
            <h3 class="report-title">Engagement Breakdown</h3>
            <p class="report-sub">How subscribers interact with your emails</p>
          </div>
        </div>
        <div class="engagement-grid">
          <div class="eng-item" *ngFor="let e of engagementData">
            <div class="eng-donut">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
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
    </div>
  `,
  styles: [`
    /* Metrics Panel */
    .metrics-panel { padding:1.75rem; margin-bottom:1.75rem; }
    .metrics-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
    .metrics-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .metrics-sub { font-size:.8rem; color:#94a3b8; margin:0; }
    .period-tabs { display:flex; gap:.25rem; background:#f1f5f9; border-radius:10px; padding:.25rem; }
    .period-tab { padding:.4rem .875rem; border-radius:8px; border:none; background:transparent; font-size:.8rem; font-weight:500; font-family:inherit; color:#64748b; cursor:pointer; transition:all .2s; }
    .period-tab.active { background:white; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }

    .metrics-kpi-row { display:grid; grid-template-columns:repeat(6,1fr); gap:1rem; margin-bottom:1.75rem; }
    .metric-kpi { padding:1rem; border-radius:12px; border:1.5px solid #f1f5f9; cursor:pointer; transition:all .2s; background:#fafafa; }
    .metric-kpi:hover { border-color:#bfdbfe; background:#f0f7ff; }
    .metric-kpi.active { border-color:#1e3a5f; background:white; box-shadow:0 2px 8px rgba(30,58,95,0.1); }
    .mkpi-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; }
    .mkpi-label { font-size:.72rem; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.04em; }
    .mkpi-change { display:flex; align-items:center; gap:.15rem; font-size:.72rem; font-weight:700; padding:.15rem .4rem; border-radius:5px; }
    .mkpi-change.up { color:#059669; background:rgba(16,185,129,0.1); }
    .mkpi-change.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .mkpi-value { display:block; font-size:1.375rem; font-weight:800; color:#0f172a; letter-spacing:-.02em; line-height:1.1; margin-bottom:.2rem; }
    .mkpi-period { font-size:.7rem; color:#94a3b8; }

    .metrics-chart-wrap { display:flex; gap:.5rem; }
    .metrics-y-axis { display:flex; flex-direction:column; justify-content:space-between; text-align:right; font-size:.65rem; color:#94a3b8; font-weight:500; width:36px; padding-bottom:1.5rem; flex-shrink:0; }
    .metrics-chart-inner { flex:1; position:relative; }
    .metrics-svg { width:100%; height:180px; display:block; }
    .metrics-x-labels { display:flex; justify-content:space-between; font-size:.68rem; color:#94a3b8; margin-top:.25rem; padding:0 2px; }

    .report-card { padding:1.5rem; margin-bottom:1.5rem; }
    .report-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .report-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .report-sub { font-size:.78rem; color:#94a3b8; margin:0; }
    .report-legend { display:flex; gap:.875rem; }
    .legend-item { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#64748b; font-weight:500; }
    .legend-dot { width:8px; height:8px; border-radius:50%; }

    .campaign-perf-table { display:flex; flex-direction:column; gap:0; }
    .perf-row { display:grid; grid-template-columns:2fr 1fr 2fr 2fr 1fr; gap:1rem; padding:.875rem 0; border-bottom:1px solid #f1f5f9; align-items:center; }
    .perf-row:last-child { border-bottom:none; }
    .header-row { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; padding-bottom:.75rem; }
    .perf-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .perf-num { font-size:.875rem; color:#64748b; }
    .perf-rate-cell { display:flex; align-items:center; gap:.625rem; }
    .perf-bar { flex:1; height:6px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .perf-bar-fill { height:100%; border-radius:100px; transition:width .8s; }
    .perf-bar-fill.blue { background:linear-gradient(90deg,#3b82f6,rgba(59,130,246,0.5)); }
    .perf-bar-fill.purple { background:linear-gradient(90deg,#8b5cf6,rgba(139,92,246,0.5)); }
    .perf-rev { font-size:.875rem; font-weight:600; color:#059669; }

    .charts-row { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    .charts-row .report-card { margin-bottom:0; }

    .growth-bars { display:flex; align-items:flex-end; gap:.875rem; height:140px; padding-bottom:1.5rem; }
    .growth-bar-col { display:flex; flex-direction:column; align-items:center; gap:.375rem; flex:1; height:100%; }
    .gb-val { font-size:.7rem; font-weight:700; color:#3b82f6; }
    .gb-track { flex:1; width:100%; background:#f1f5f9; border-radius:6px 6px 0 0; overflow:hidden; display:flex; align-items:flex-end; }
    .gb-fill { width:100%; background:linear-gradient(180deg,#3b82f6,rgba(59,130,246,0.4)); border-radius:6px 6px 0 0; transition:height .8s cubic-bezier(.4,0,.2,1); min-height:4px; }
    .gb-label { font-size:.7rem; color:#94a3b8; }

    .flow-perf-list { display:flex; flex-direction:column; gap:1.125rem; }
    .fp-item { padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .fp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.875rem; }
    .fp-name { font-size:.9rem; font-weight:600; color:#0f172a; }
    .fp-stats { display:flex; gap:1.5rem; margin-bottom:.75rem; }
    .fp-stat { display:flex; flex-direction:column; cursor:help; }
    .fps-val { font-size:1.0625rem; font-weight:700; color:#0f172a; }
    .fps-label { font-size:.7rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .fp-bar { height:5px; background:#e2e8f0; border-radius:100px; overflow:hidden; }
    .fp-bar-fill { height:100%; border-radius:100px; transition:width .8s; }

    .engagement-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1.5rem; }
    .eng-item { display:flex; flex-direction:column; align-items:center; gap:.75rem; }
    .eng-donut { position:relative; width:80px; height:80px; }
    .eng-donut svg { width:100%; height:100%; }
    .eng-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
    .eng-val { font-size:.9rem; font-weight:800; color:#0f172a; }
    .eng-label { font-size:.75rem; font-weight:600; color:#64748b; text-align:center; }

    @media(max-width:1200px) { .metrics-kpi-row { grid-template-columns:repeat(3,1fr); } .engagement-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .charts-row { grid-template-columns:1fr; } .perf-row { grid-template-columns:2fr 1fr 1fr; } .metrics-kpi-row { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .metrics-kpi-row { grid-template-columns:1fr 1fr; } .engagement-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class ReportsComponent implements OnInit {
  summaryStats: any[] = [];
  campaignPerf: any[] = [];
  growthMonthly: any[] = [];
  flowPerf: any[] = [];
  engagementData: any[] = [];
  maxNew = 1;

  activePeriod = '30d';
  activeMetric = 'openRate';
  metricCards: any[] = [];
  metricsLinePoints = '';
  metricsAreaPoints = '';
  metricsDots: { x: number; y: number }[] = [];
  metricsYLabels: string[] = [];
  metricsGridLines: number[] = [];
  metricsXLabels: string[] = [];

  private metricsData: Record<string, Record<string, number[]>> = {
    '7d': {
      openRate:   [48, 52, 50, 55, 53, 57, 54],
      clickRate:  [10, 11, 10, 13, 12, 14, 13],
      bounceRate: [2.8, 2.6, 2.7, 2.5, 2.6, 2.4, 2.5],
      unsubRate:  [0.5, 0.4, 0.5, 0.4, 0.4, 0.3, 0.4],
      revEmail:   [0.12, 0.14, 0.13, 0.16, 0.15, 0.18, 0.17],
      listGrowth: [60, 80, 75, 90, 85, 95, 100],
    },
    '30d': {
      openRate:   [46, 49, 51, 48, 53, 50, 55, 52, 54, 51, 56, 54],
      clickRate:  [9, 10, 11, 10, 12, 11, 13, 12, 13, 11, 13, 13],
      bounceRate: [3.1, 2.9, 2.8, 2.9, 2.7, 2.8, 2.6, 2.7, 2.5, 2.6, 2.5, 2.5],
      unsubRate:  [0.6, 0.5, 0.5, 0.4, 0.5, 0.4, 0.4, 0.4, 0.3, 0.4, 0.4, 0.4],
      revEmail:   [0.10, 0.11, 0.12, 0.11, 0.13, 0.12, 0.14, 0.13, 0.15, 0.14, 0.16, 0.17],
      listGrowth: [320, 380, 350, 410, 390, 430, 420, 460, 440, 480, 500, 521],
    },
    '90d': {
      openRate:   [42, 44, 46, 45, 48, 47, 50, 49, 51, 50, 53, 52, 54, 53, 54],
      clickRate:  [7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13],
      bounceRate: [3.5, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8, 2.8, 2.7, 2.6, 2.6, 2.5, 2.5, 2.5, 2.5],
      unsubRate:  [0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
      revEmail:   [0.08, 0.09, 0.09, 0.10, 0.10, 0.11, 0.11, 0.12, 0.12, 0.13, 0.14, 0.14, 0.15, 0.16, 0.17],
      listGrowth: [200, 240, 280, 310, 340, 370, 390, 420, 440, 460, 480, 490, 500, 510, 521],
    }
  };

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.metricCards = [
      { key:'openRate',   label:'Open Rate',        value:'54.2%', change:3.2  },
      { key:'clickRate',  label:'Click Rate',        value:'12.8%', change:1.4  },
      { key:'bounceRate', label:'Bounce Rate',       value:'2.5%',  change:-0.3 },
      { key:'unsubRate',  label:'Unsubscribe Rate',  value:'0.4%',  change:-0.1 },
      { key:'revEmail',   label:'Revenue/Email',     value:'$0.17', change:12.4 },
      { key:'listGrowth', label:'List Growth',       value:'+521',  change:6.2  },
    ];

    this.campaignPerf = [
      { name:'Book Launch: The Ember Crown', sent:3200, openRate:71.4, clickRate:28.3, revenue:1840 },
      { name:'March Newsletter', sent:4821, openRate:54.2, clickRate:12.8, revenue:620 },
      { name:'February Roundup', sent:4650, openRate:48.9, clickRate:9.1, revenue:410 },
      { name:'Holiday Special', sent:5100, openRate:62.1, clickRate:18.5, revenue:1410 },
    ];

    this.growthMonthly = [
      { label:'Oct', new:320 }, { label:'Nov', new:410 }, { label:'Dec', new:680 },
      { label:'Jan', new:520 }, { label:'Feb', new:490 }, { label:'Mar', new:521 },
    ];
    this.maxNew = Math.max(...this.growthMonthly.map(d => d.new));

    this.flowPerf = [
      { name:'Welcome Flow', status:'active', triggered:1842, openRate:68, completion:74 },
      { name:'Book Launch Flow', status:'active', triggered:634, openRate:81, completion:62 },
      { name:'Winback Flow', status:'paused', triggered:89, openRate:24, completion:18 },
    ];

    this.engagementData = [
      { label:'Opened', value:54, color:'#3b82f6' },
      { label:'Clicked', value:13, color:'#6366f1' },
      { label:'Replied', value:4, color:'#8b5cf6' },
      { label:'Forwarded', value:2, color:'#059669' },
      { label:'Unsubscribed', value:0.4, color:'#dc2626' },
    ];

    this.buildMetricsChart();
  }

  setPeriod(p: string) {
    this.activePeriod = p;
    this.buildMetricsChart();
  }

  setMetric(key: string) {
    this.activeMetric = key;
    this.buildMetricsChart();
  }

  buildMetricsChart() {
    const raw = this.metricsData[this.activePeriod][this.activeMetric] || [];
    const W = 600, H = 180, PAD_T = 12, PAD_B = 8, PAD_L = 4, PAD_R = 4;
    const chartH = H - PAD_T - PAD_B;
    const chartW = W - PAD_L - PAD_R;
    const max = Math.max(...raw);
    const min = Math.min(...raw);
    const range = max - min || 1;
    const steps = 4;

    this.metricsYLabels = [];
    this.metricsGridLines = [];
    for (let i = steps; i >= 0; i--) {
      const val = min + (i / steps) * range;
      this.metricsYLabels.push(val >= 100 ? val.toFixed(0) : val.toFixed(1));
      this.metricsGridLines.push(PAD_T + ((steps - i) / steps) * chartH);
    }

    const pts = raw.map((v, i) => ({
      x: PAD_L + (i / (raw.length - 1)) * chartW,
      y: PAD_T + (1 - (v - min) / range) * chartH
    }));
    this.metricsDots = pts;
    this.metricsLinePoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    this.metricsAreaPoints = `${pts[0].x},${H - PAD_B} ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} ${pts[pts.length - 1].x},${H - PAD_B}`;

    // X labels — show ~6 evenly spaced
    const step = Math.max(1, Math.floor(raw.length / 6));
    this.metricsXLabels = raw.map((_, i) => {
      if (i % step === 0 || i === raw.length - 1) return `Day ${i + 1}`;
      return '';
    }).filter((_, i) => i % step === 0 || i === raw.length - 1);
  }
}
