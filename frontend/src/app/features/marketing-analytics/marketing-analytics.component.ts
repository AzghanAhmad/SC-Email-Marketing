import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketing-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Marketing Analytics</h1>
          <p class="page-subtitle">Advanced analytics connecting email performance to business outcomes</p>
        </div>
        <select class="period-select">
          <option>Last 30 days</option><option>Last 90 days</option><option>This year</option>
        </select>
      </div>

      <!-- Business Performance Summary -->
      <div class="glass-card performance-card">
        <div class="perf-header">
          <div>
            <h3 class="perf-title">Business Performance Summary</h3>
            <p class="perf-period">Mar 9, 2026 — Apr 8, 2026</p>
          </div>
          <button class="btn-secondary btn-sm" data-tooltip="View the full analytics dashboard">View Dashboard</button>
        </div>
        <div class="perf-stats">
          <div class="perf-stat">
            <span class="ps-val">$4,280</span>
            <span class="ps-label">Total Revenue</span>
            <span class="ps-change">— 0% vs. previous period</span>
          </div>
          <div class="perf-stat">
            <span class="ps-val">$1,840</span>
            <span class="ps-label">Attributed Revenue (42.9% of total)</span>
            <span class="ps-change">— +22.7% vs. previous period</span>
          </div>
        </div>
        <div class="revenue-breakdown">
          <h4 class="rb-title">Attributed Revenue</h4>
          <div class="rb-grid">
            <div class="rb-item" *ngFor="let r of revenueBreakdown">
              <div class="rb-icon">{{ r.icon }}</div>
              <span class="rb-label">{{ r.label }}</span>
              <span class="rb-val">{{ r.value }}</span>
              <span class="rb-pct">{{ r.pct }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Attribution Charts -->
      <div class="charts-row">
        <div class="glass-card chart-card">
          <h3 class="chart-title">Revenue by Source</h3>
          <div class="source-list">
            <div class="source-item" *ngFor="let s of sources">
              <span class="source-name">{{ s.name }}</span>
              <div class="source-bar-wrap">
                <div class="source-bar"><div class="source-fill" [style.width]="s.pct + '%'" [style.background]="s.color"></div></div>
              </div>
              <span class="source-val">{{ s.value }}</span>
            </div>
          </div>
        </div>

        <div class="glass-card chart-card">
          <h3 class="chart-title">Campaign Revenue Impact</h3>
          <div class="impact-list">
            <div class="impact-item" *ngFor="let c of campaignImpact">
              <div class="impact-header">
                <span class="impact-name">{{ c.name }}</span>
                <span class="impact-rev">{{ c.revenue }}</span>
              </div>
              <div class="impact-bar"><div class="impact-fill" [style.width]="c.pct + '%'"></div></div>
              <div class="impact-meta">
                <span>{{ c.sent | number }} sent</span>
                <span>{{ c.openRate }}% open rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Link Performance -->
      <div class="glass-card link-card">
        <h3 class="chart-title">Link Click Performance by Group</h3>
        <p class="chart-sub">Performance breakdown by link destination</p>
        <div class="link-table">
          <div class="lt-header">
            <span>Link Group</span><span>Clicks</span><span>Unique Clicks</span><span>Revenue</span><span>Type</span>
          </div>
          <div class="lt-row" *ngFor="let l of linkPerformance">
            <span class="lt-name">{{ l.group }}</span>
            <span class="lt-num">{{ l.clicks | number }}</span>
            <span class="lt-num">{{ l.unique | number }}</span>
            <span class="lt-rev">{{ l.revenue }}</span>
            <span class="lt-type">
              <span class="type-indicator" [class.confirmed]="l.confirmed" [class.directional]="!l.confirmed"></span>
              {{ l.confirmed ? 'Confirmed' : 'Directional' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .period-select { padding:.55rem 1rem; background:white; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .performance-card { padding:1.75rem; margin-bottom:1.75rem; }
    .perf-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .perf-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .perf-period { font-size:.8125rem; color:#94a3b8; margin:0; }

    .perf-stats { display:grid; grid-template-columns:1fr 1fr; gap:2rem; padding:1.5rem; background:#f8fafc; border-radius:14px; margin-bottom:1.5rem; }
    .perf-stat { display:flex; flex-direction:column; }
    .ps-val { font-size:2rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .ps-label { font-size:.8125rem; color:#64748b; margin-top:.25rem; }
    .ps-change { font-size:.78rem; color:#94a3b8; margin-top:.25rem; }

    .revenue-breakdown { }
    .rb-title { font-size:.8125rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .rb-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1rem; }
    .rb-item { display:flex; flex-direction:column; align-items:center; gap:.25rem; padding:.875rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .rb-icon { font-size:1.25rem; }
    .rb-label { font-size:.72rem; font-weight:600; color:#64748b; text-align:center; }
    .rb-val { font-size:1.125rem; font-weight:800; color:#0f172a; }
    .rb-pct { font-size:.7rem; color:#94a3b8; }

    .charts-row { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    .chart-card { padding:1.5rem; }
    .chart-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .chart-sub { font-size:.78rem; color:#94a3b8; margin:-.75rem 0 1.25rem; }

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

    .link-card { padding:1.5rem; }
    .link-table { display:flex; flex-direction:column; }
    .lt-header { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1.5fr; padding:.75rem 0; border-bottom:1px solid #e2e8f0; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .lt-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1.5fr; padding:.875rem 0; border-bottom:1px solid #f1f5f9; align-items:center; }
    .lt-row:last-child { border-bottom:none; }
    .lt-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .lt-num { font-size:.875rem; color:#334155; }
    .lt-rev { font-size:.875rem; font-weight:700; color:#059669; }
    .lt-type { display:flex; align-items:center; gap:.375rem; font-size:.8rem; }
    .type-indicator { width:8px; height:8px; border-radius:50%; }
    .type-indicator.confirmed { background:#10b981; }
    .type-indicator.directional { background:#f59e0b; }

    @media(max-width:1100px) { .charts-row { grid-template-columns:1fr; } .rb-grid { grid-template-columns:repeat(3,1fr); } .perf-stats { grid-template-columns:1fr; } }
    @media(max-width:600px) { .rb-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class MarketingAnalyticsComponent {
  revenueBreakdown = [
    { icon: '👤', label: 'Per Recipient', value: '$0.17', pct: '' },
    { icon: '📧', label: 'Campaigns', value: '$2,870', pct: '67.1%' },
    { icon: '⚡', label: 'Flows', value: '$1,020', pct: '23.8%' },
    { icon: '✉️', label: 'Email', value: '$3,890', pct: '90.9%' },
    { icon: '🛒', label: 'Direct Sales', value: '$390', pct: '9.1%' },
  ];

  sources = [
    { name: 'Email Campaigns', value: '$2,870', pct: 67, color: '#3b82f6' },
    { name: 'Automation Flows', value: '$1,020', pct: 24, color: '#8b5cf6' },
    { name: 'Direct Sales', value: '$390', pct: 9, color: '#10b981' },
  ];

  campaignImpact = [
    { name: 'Book Launch: The Ember Crown', revenue: '$1,840', pct: 85, sent: 3200, openRate: 71.4 },
    { name: 'Holiday Special', revenue: '$1,410', pct: 65, sent: 5100, openRate: 62.1 },
    { name: 'March Newsletter', revenue: '$620', pct: 30, sent: 4821, openRate: 54.2 },
  ];

  linkPerformance = [
    { group: 'Direct Store', clicks: 1842, unique: 1238, revenue: '$2,120', confirmed: true },
    { group: 'Amazon', clicks: 3241, unique: 2104, revenue: '$1,480', confirmed: false },
    { group: 'Kobo', clicks: 428, unique: 312, revenue: '$340', confirmed: false },
    { group: 'Apple Books', clicks: 215, unique: 168, revenue: '$180', confirmed: false },
    { group: 'Barnes & Noble', clicks: 189, unique: 142, revenue: '$160', confirmed: false },
  ];
}
