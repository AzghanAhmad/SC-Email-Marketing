import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-dashboards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics Dashboards</h1>
          <p class="page-subtitle">Comprehensive analytics across campaigns, flows, and audience</p>
        </div>
        <div class="header-actions">
          <select class="period-select">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      <!-- Overview KPIs -->
      <div class="kpi-grid">
        <div class="glass-card kpi-card" *ngFor="let k of kpis">
          <div class="kpi-icon" [style.background]="k.iconBg">
            <span [innerHTML]="k.icon"></span>
          </div>
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
          <div class="bar-chart">
            <div class="bar-group" *ngFor="let d of volumeData">
              <div class="bars">
                <div class="bar sent" [style.height]="(d.sent / maxVol * 100) + '%'"></div>
                <div class="bar delivered" [style.height]="(d.delivered / maxVol * 100) + '%'"></div>
              </div>
              <span class="bar-label">{{ d.label }}</span>
            </div>
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
          <div class="line-chart-wrap">
            <svg class="line-svg" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="engGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.01"/>
                </linearGradient>
                <linearGradient id="engGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.01"/>
                </linearGradient>
              </defs>
              <polygon [attr.points]="openAreaPts" fill="url(#engGrad1)"/>
              <polyline [attr.points]="openLinePts" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
              <polygon [attr.points]="clickAreaPts" fill="url(#engGrad2)"/>
              <polyline [attr.points]="clickLinePts" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
            <div class="line-labels">
              <span *ngFor="let d of engagementData">{{ d.label }}</span>
            </div>
          </div>
          <div class="chart-legend" style="margin-top:.75rem">
            <span class="legend-item"><span class="legend-dot" style="background:#3b82f6"></span>Open Rate</span>
            <span class="legend-item"><span class="legend-dot" style="background:#8b5cf6"></span>Click Rate</span>
          </div>
        </div>
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
    </div>
  `,
  styles: [`
    .header-actions { display:flex; align-items:center; gap:.75rem; }
    .period-select { padding:.55rem 1rem; background:white; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .kpi-card { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.375rem; position:relative; }
    .kpi-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .kpi-icon :global(svg) { width:20px; height:20px; }
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

    .bar-chart { display:flex; align-items:flex-end; gap:.75rem; height:140px; padding-bottom:1.5rem; }
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

    @media(max-width:1200px) { .kpi-grid { grid-template-columns:repeat(2,1fr); } .engagement-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .charts-row { grid-template-columns:1fr; } }
    @media(max-width:600px) { .kpi-grid { grid-template-columns:1fr; } .engagement-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class AnalyticsDashboardsComponent {
  kpis = [
    { label: 'Emails Sent', value: '24,830', change: 8.1, iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { label: 'Open Rate', value: '54.2%', change: 3.2, iconBg: 'rgba(16,185,129,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
    { label: 'Click Rate', value: '12.8%', change: 1.4, iconBg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
    { label: 'Revenue', value: '$4,280', change: 22.7, iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  ];

  volumeData = [
    { label: 'Oct', sent: 3800, delivered: 3720 },
    { label: 'Nov', sent: 4200, delivered: 4100 },
    { label: 'Dec', sent: 5100, delivered: 5020 },
    { label: 'Jan', sent: 3200, delivered: 3140 },
    { label: 'Feb', sent: 4650, delivered: 4560 },
    { label: 'Mar', sent: 4821, delivered: 4712 },
  ];
  maxVol = Math.max(...[3800, 4200, 5100, 3200, 4650, 4821]);

  engagementData = [
    { label: 'Oct', open: 48, click: 9 },
    { label: 'Nov', open: 51, click: 11 },
    { label: 'Dec', open: 62, click: 18 },
    { label: 'Jan', open: 54, click: 13 },
    { label: 'Feb', open: 49, click: 9 },
    { label: 'Mar', open: 54, click: 13 },
  ];

  openLinePts = '';
  openAreaPts = '';
  clickLinePts = '';
  clickAreaPts = '';

  engBreakdown = [
    { label: 'Opened', value: 54, color: '#60a5fa' },
    { label: 'Clicked', value: 13, color: '#818cf8' },
    { label: 'Replied', value: 4, color: '#a78bfa' },
    { label: 'Forwarded', value: 2, color: '#34d399' },
    { label: 'Unsubscribed', value: 0.4, color: '#f87171' },
  ];

  constructor() {
    this.buildCharts();
  }

  buildCharts() {
    const W = 300, H = 120, PAD = 10;
    const buildLine = (data: number[], maxVal: number) => {
      const pts = data.map((v, i) => ({
        x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
        y: H - PAD - (v / maxVal) * (H - PAD * 2)
      }));
      const line = pts.map(p => `${p.x},${p.y}`).join(' ');
      const area = `${pts[0].x},${H} ${line} ${pts[pts.length - 1].x},${H}`;
      return { line, area };
    };

    const openData = this.engagementData.map(d => d.open);
    const clickData = this.engagementData.map(d => d.click);
    const maxE = Math.max(...openData);

    const openRes = buildLine(openData, maxE);
    this.openLinePts = openRes.line;
    this.openAreaPts = openRes.area;

    const clickRes = buildLine(clickData, maxE);
    this.clickLinePts = clickRes.line;
    this.clickAreaPts = clickRes.area;
  }
}
