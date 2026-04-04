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

      <!-- Summary Row -->
      <div class="summary-row">
        <div class="glass-card summary-card" *ngFor="let s of summaryStats">
          <div class="sc-icon" [style.background]="s.iconBg" [innerHTML]="s.icon"></div>
          <div class="sc-body">
            <span class="sc-val">{{ s.value }}</span>
            <span class="sc-label">{{ s.label }}</span>
          </div>
          <div class="sc-change" [class.up]="s.change > 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11">
              <polyline *ngIf="s.change > 0" points="18 15 12 9 6 15"/>
              <polyline *ngIf="s.change < 0" points="6 9 12 15 18 9"/>
            </svg>
            {{ s.change > 0 ? '+' : '' }}{{ s.change }}%
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
    .summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .summary-card { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.375rem; position:relative; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
    .sc-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sc-icon :global(svg) { width:20px; height:20px; }
    .sc-body { flex:1; display:flex; flex-direction:column; }
    .sc-val { font-size:1.5rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; line-height:1.1; }
    .sc-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin-top:.2rem; }
    .sc-change { display:flex; align-items:center; gap:.2rem; font-size:.75rem; font-weight:700; padding:.2rem .45rem; border-radius:6px; position:absolute; top:.875rem; right:.875rem; }
    .sc-change.up { color:#059669; background:rgba(16,185,129,0.1); }

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
    .fp-bar-wrap { }
    .fp-bar { height:5px; background:#e2e8f0; border-radius:100px; overflow:hidden; }
    .fp-bar-fill { height:100%; border-radius:100px; transition:width .8s; }

    .engagement-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1.5rem; }
    .eng-item { display:flex; flex-direction:column; align-items:center; gap:.75rem; }
    .eng-donut { position:relative; width:80px; height:80px; }
    .eng-donut svg { width:100%; height:100%; }
    .eng-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
    .eng-val { font-size:.9rem; font-weight:800; color:#0f172a; }
    .eng-label { font-size:.75rem; font-weight:600; color:#64748b; text-align:center; }

    @media(max-width:1200px) { .summary-row { grid-template-columns:repeat(2,1fr); } .engagement-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .charts-row { grid-template-columns:1fr; } .perf-row { grid-template-columns:2fr 1fr 1fr; } .perf-row span:nth-child(4),.perf-row span:nth-child(5) { display:none; } }
    @media(max-width:600px) { .summary-row { grid-template-columns:1fr; } .engagement-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class ReportsComponent implements OnInit {
  summaryStats: any[] = [];
  campaignPerf: any[] = [];
  growthMonthly: any[] = [];
  flowPerf: any[] = [];
  engagementData: any[] = [];
  maxNew = 1;

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    const s = this.mockData.getDashboardStats();
    this.summaryStats = [
      { label:'Total Emails Sent', value: '24,830', change: 8.1, iconBg:'rgba(59,130,246,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
      { label:'Avg Open Rate', value: '54.2%', change: 3.2, iconBg:'rgba(16,185,129,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
      { label:'Avg Click Rate', value: '12.8%', change: 1.4, iconBg:'rgba(99,102,241,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
      { label:'Unsubscribe Rate', value: '0.4%', change: -0.1, iconBg:'rgba(239,68,68,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' },
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
      { label:'Opened', value:54, color:'#60a5fa' },
      { label:'Clicked', value:13, color:'#818cf8' },
      { label:'Replied', value:4, color:'#a78bfa' },
      { label:'Forwarded', value:2, color:'#34d399' },
      { label:'Unsubscribed', value:0.4, color:'#f87171' },
    ];
  }
}
