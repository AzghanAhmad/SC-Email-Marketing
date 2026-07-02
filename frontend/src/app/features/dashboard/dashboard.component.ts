import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardApiService, DashboardData } from '../../core/services/dashboard-api.service';
import { XyChartComponent, ChartSeries } from '../../shared/components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, XyChartComponent],
  template: `
    <div class="page-wrapper">
      <!-- Welcome Header -->
      <div class="welcome-section">
        <div class="welcome-text">
          <h1 class="welcome-title">Overview</h1>
          <p class="welcome-sub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Welcome back, {{ welcomeName }}. <a routerLink="/settings" class="welcome-link">Update Profile</a>
          </p>
        </div>
      </div>

      <!-- Conversion Metric -->
      <div class="conversion-section">
        <div class="conv-header">
          <h3 class="conv-label">Conversion metric</h3>
          <div class="conv-controls">
            <select class="conv-select" [value]="conversionMetric" (change)="onConversionChange($event)">
              <option value="placed_order">Placed Order</option>
              <option value="clicked_link">Clicked Link</option>
              <option value="opened_email">Opened Email</option>
            </select>
            <select class="conv-select" [value]="periodDays" (change)="onPeriodChange($event)">
              <option [value]="7">Last 7 days</option>
              <option [value]="30">Last 30 days</option>
              <option [value]="90">Last 90 days</option>
              <option [value]="365">Last year</option>
            </select>
          </div>
          <span class="conv-date-range">{{ periodStart }} — {{ periodEnd }} compared to previous period</span>
        </div>
        <div class="conv-display" *ngIf="activeConversion">
          <span class="conv-value">{{ activeConversion.value }}</span>
          <span class="conv-change" [class.up]="activeConversion.change > 0" [class.down]="activeConversion.change < 0">
            {{ activeConversion.change > 0 ? '+' : '' }}{{ activeConversion.change }}% vs previous period
          </span>
          <p class="conv-desc">{{ activeConversion.description }}</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="!loading()">
        <div class="stat-card anim-up d1" *ngFor="let stat of stats">
          <div class="stat-icon" [style.color]="stat.color">
            <svg *ngIf="stat.icon === 'subscribers'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <svg *ngIf="stat.icon === 'emails'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <svg *ngIf="stat.icon === 'open-rate'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg *ngIf="stat.icon === 'revenue'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
          <div class="stat-trend" [class.up]="stat.growth > 0" [class.down]="stat.growth < 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12">
              <polyline *ngIf="stat.growth > 0" points="18 15 12 9 6 15"/>
              <polyline *ngIf="stat.growth < 0" points="6 9 12 15 18 9"/>
            </svg>
            {{ stat.growth > 0 ? '+' : '' }}{{ stat.growth }}%
          </div>
          <div class="stat-tooltip" [attr.data-tooltip]="stat.tooltip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        </div>
      </div>
      <div class="loading-state" *ngIf="loading()">Loading dashboard...</div>

      <ng-container *ngIf="!loading()">
      <div class="glass-card perf-summary anim-up d2">
        <div class="perf-header">
          <div>
            <h3 class="perf-title">Business Performance Summary</h3>
            <p class="perf-period">{{ performance.periodLabel }}</p>
          </div>
          <a routerLink="/analytics/dashboards" class="btn-secondary btn-sm" data-tooltip="View full analytics dashboard">View Dashboard</a>
        </div>
        <div class="perf-kpi-row">
          <div class="perf-kpi">
            <span class="pk-val">{{ formatCurrency(performance.totalRevenue) }}</span>
            <span class="pk-label">Total Revenue</span>
            <span class="pk-change">— {{ performance.totalRevenueChange }}% vs. previous period</span>
          </div>
          <div class="perf-kpi">
            <span class="pk-val">{{ formatCurrency(performance.attributedRevenue) }}</span>
            <span class="pk-label">Attributed Revenue</span>
            <span class="pk-change">— {{ performance.attributedRevenueChange > 0 ? '+' : '' }}{{ performance.attributedRevenueChange }}% vs. previous period</span>
          </div>
        </div>
        <div class="attr-row">
          <h4 class="attr-title">Attributed Revenue</h4>
          <div class="attr-grid">
            <div class="attr-item" *ngFor="let a of attributionData">
              <div class="attr-svg-icon">
                <svg *ngIf="a.icon === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <svg *ngIf="a.icon === 'campaign'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <svg *ngIf="a.icon === 'flow'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <svg *ngIf="a.icon === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <svg *ngIf="a.icon === 'cart'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <span class="attr-label">{{ a.label }}</span>
              <span class="attr-val">{{ a.value }}</span>
              <span class="attr-pct">{{ a.pct }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Campaign Performance -->
        <div class="glass-card chart-card anim-up d2">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Campaign Performance</h3>
              <p class="chart-sub">Emails sent vs opened per month</p>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot" style="background:#60a5fa"></span>Sent</span>
              <span class="legend-item"><span class="legend-dot" style="background:#a78bfa"></span>Opened</span>
            </div>
          </div>
          <div class="chart-container">
            <app-xy-chart type="bar" [labels]="campaignLabels" [series]="campaignSeries" yAxisLabel="Count" xAxisLabel="Month" [showLegend]="false"/>
          </div>
        </div>

        <!-- Subscriber Growth -->
        <div class="glass-card chart-card anim-up d3">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Subscriber Growth</h3>
              <p class="chart-sub">Total active subscribers over time</p>
            </div>
          </div>
          <app-xy-chart type="line" [labels]="growthLabels" [series]="growthSeries" yAxisLabel="Subscribers" xAxisLabel="Month"/>
          <div class="growth-footer">
            <span class="growth-current">{{ growthData.length ? (growthData[growthData.length - 1].count | number) : '0' }}</span>
            <span class="growth-label">total subscribers</span>
            <span class="growth-change up">+{{ subscriberGrowthPct }}% vs last period</span>
          </div>
        </div>
      </div>

      <!-- Campaign Performance Funnel -->
      <div class="glass-card funnel-card anim-up d3" *ngIf="campaignFunnel.length > 0">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Campaign Performance Funnel</h3>
            <p class="chart-sub">Sent → Delivered → Opens → Clicks → Purchases → Revenue</p>
          </div>
          <a routerLink="/analytics/dashboards" class="btn-secondary btn-sm">Full analytics</a>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Campaign</th><th>Sent</th><th>Delivered</th><th>Opens</th><th>Clicks</th><th>Purchases</th><th>Revenue</th></tr>
          </thead>
          <tbody>
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
      </div>

      <!-- Bottom Row -->
      <div class="bottom-row">
        <!-- Recent Activity -->
        <div class="glass-card activity-card anim-up d3">
          <div class="card-header-row">
            <h3 class="chart-title">Recent Activity</h3>
            <span class="view-all-link" data-tooltip="View full activity log">Live feed</span>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let item of activity">
              <div class="activity-icon-wrap" [class]="'act-' + item.icon">
                <svg *ngIf="item.icon === 'campaign'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <svg *ngIf="item.icon === 'subscriber'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                <svg *ngIf="item.icon === 'flow'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <svg *ngIf="item.icon === 'scheduled'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div class="activity-body">
                <p class="activity-msg">{{ item.message }}</p>
                <span class="activity-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card quick-card anim-up d4">
          <h3 class="chart-title" style="margin-bottom:1.25rem">Quick Actions</h3>
          <div class="quick-actions">
            <a routerLink="/campaigns" class="quick-action" data-tooltip="Create and send a new email campaign">
              <div class="qa-icon" style="background:rgba(59,130,246,0.1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div class="qa-body">
                <span class="qa-title">New Campaign</span>
                <span class="qa-sub">Send to your list</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="qa-arrow"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a routerLink="/audience/growth-tools" class="quick-action" data-tooltip="Grow your subscriber list">
              <div class="qa-icon" style="background:rgba(139,92,246,0.1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              </div>
              <div class="qa-body">
                <span class="qa-title">Grow Audience</span>
                <span class="qa-sub">Growth tools & forms</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="qa-arrow"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a routerLink="/flows" class="quick-action" data-tooltip="Set up an automated email flow">
              <div class="qa-icon" style="background:rgba(16,185,129,0.1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div class="qa-body">
                <span class="qa-title">Create Flow</span>
                <span class="qa-sub">Automate emails</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="qa-arrow"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a routerLink="/analytics/dashboards" class="quick-action" data-tooltip="View detailed analytics and reports">
              <div class="qa-icon" style="background:rgba(245,158,11,0.1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div class="qa-body">
                <span class="qa-title">View Reports</span>
                <span class="qa-sub">Analytics & insights</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="qa-arrow"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
        </div>
      </div>
      </ng-container>
    </div>
  `,
  styles: [`
    /* Welcome Section */
    .welcome-section { margin-bottom:1.5rem; }
    .welcome-title { font-size:1.75rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; margin:0 0 .35rem; }
    .welcome-sub { display:flex; align-items:center; gap:.375rem; font-size:.8125rem; color:#64748b; margin:0; }
    .welcome-link { color:#3b82f6; text-decoration:none; font-weight:500; }
    .welcome-link:hover { text-decoration:underline; }

    /* Conversion Section */
    .conversion-section { margin-bottom:1.5rem; }
    .conv-header { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .conv-label { font-size:.875rem; font-weight:600; color:#0f172a; margin:0; }
    .conv-display { margin-top:.75rem; display:flex; flex-wrap:wrap; align-items:baseline; gap:.75rem 1.25rem; }
    .conv-value { font-size:1.75rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .conv-change { font-size:.8125rem; font-weight:600; padding:.2rem .55rem; border-radius:6px; background:#f1f5f9; color:#64748b; }
    .conv-change.up { color:#059669; background:rgba(16,185,129,0.1); }
    .conv-change.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .conv-desc { width:100%; font-size:.8125rem; color:#94a3b8; margin:0; }
    .conv-controls { display:flex; align-items:center; gap:.5rem; }
    .conv-select { padding:.4rem .75rem; background:white; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.8rem; font-family:inherit; color:#334155; outline:none; cursor:pointer; }
    .conv-period-btn { display:flex; align-items:center; gap:.375rem; padding:.4rem .75rem !important; border:1.5px solid #e2e8f0 !important; border-radius:8px !important; font-size:.8rem !important; }
    .conv-date-range { font-size:.78rem; color:#64748b; margin-left:auto; }

    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .stat-card {
      background:#ffffff; border:1px solid #f1f5f9;
      border-radius:18px; padding:1.375rem 1.5rem;
      display:flex; align-items:center; gap:1rem;
      position:relative; transition:all .3s; overflow:hidden;
      box-shadow:0 1px 3px rgba(0,0,0,0.06);
    }
    .stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
    .stat-icon {
      width:22px; height:22px; display:flex; align-items:center; justify-content:center;
      flex-shrink:0; opacity:.9;
    }
    .stat-icon svg { width:22px; height:22px; }
    .loading-state { padding:2rem; text-align:center; color:#64748b; font-size:.9rem; }
    .stat-body { flex:1; display:flex; flex-direction:column; }
    .stat-value { font-size:1.625rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; line-height:1.1; }
    .stat-label { font-size:.75rem; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.06em; margin-top:.2rem; }
    .stat-trend { display:flex; align-items:center; gap:.2rem; font-size:.75rem; font-weight:700; padding:.25rem .5rem; border-radius:6px; position:absolute; top:1rem; right:2.5rem; }
    .stat-trend.up { color:#059669; background:rgba(16,185,129,0.1); }
    .stat-trend.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .stat-tooltip { position:absolute; top:1rem; right:.875rem; color:#cbd5e1; cursor:help; }

    /* Performance Summary */
    .perf-summary { padding:1.75rem; margin-bottom:1.75rem; }
    .perf-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .perf-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .perf-period { font-size:.8125rem; color:#64748b; margin:0; }
    .perf-kpi-row { display:grid; grid-template-columns:1fr 1fr; gap:2rem; padding:1.5rem; background:#f8fafc; border-radius:14px; margin-bottom:1.5rem; }
    .perf-kpi { display:flex; flex-direction:column; }
    .pk-val { font-size:2rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .pk-label { font-size:.8125rem; color:#64748b; margin-top:.25rem; }
    .pk-change { font-size:.78rem; color:#64748b; margin-top:.25rem; }
    .attr-title { font-size:.8125rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .attr-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1rem; }
    .attr-item { display:flex; flex-direction:column; align-items:center; gap:.25rem; padding:.875rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .attr-svg-icon { width:28px; height:28px; display:flex; align-items:center; justify-content:center; color:#64748b; }
    .attr-svg-icon svg { width:18px; height:18px; }
    .attr-label { font-size:.72rem; font-weight:600; color:#64748b; text-align:center; }
    .attr-val { font-size:1.0625rem; font-weight:800; color:#0f172a; }
    .attr-pct { font-size:.7rem; color:#64748b; }

    .charts-row { display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    .chart-card { padding:1.5rem; }
    .chart-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .chart-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .chart-sub { font-size:.78rem; color:#64748b; margin:0; }
    .chart-legend { display:flex; gap:.875rem; }
    .legend-item { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#64748b; font-weight:500; }
    .legend-dot { width:8px; height:8px; border-radius:50%; }

    .chart-container { width:100%; }

    .line-chart-wrap { position:relative; margin-bottom:.75rem; }
    .line-svg { width:100%; height:120px; }
    .line-labels { display:flex; justify-content:space-between; font-size:.7rem; color:#64748b; margin-top:.25rem; }
    .growth-legend { display:flex; gap:.875rem; }
    .growth-chart-container { display:flex; gap:.5rem; margin-bottom:.75rem; }
    .growth-y-axis { display:flex; flex-direction:column; justify-content:space-between; text-align:right; font-size:.65rem; color:#64748b; font-weight:500; width:38px; padding-bottom:1.5rem; flex-shrink:0; }
    .growth-chart-inner { flex:1; position:relative; }
    .growth-svg { width:100%; height:160px; display:block; }
    .growth-x-labels { display:flex; justify-content:space-between; font-size:.68rem; color:#64748b; margin-top:.25rem; padding:0 2px; }
    .growth-footer { display:flex; align-items:baseline; gap:.625rem; margin-top:.5rem; }
    .growth-current { font-size:1.625rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .growth-label { font-size:.8rem; color:#64748b; }
    .growth-change { font-size:.75rem; font-weight:700; padding:.2rem .5rem; border-radius:6px; }
    .funnel-card { padding:1.5rem; margin-bottom:1.5rem; }
    .camp-name { font-weight:600; color:#0f172a; }
    .revenue { color:#059669; font-weight:700; }
    .activity-card { padding:1.5rem; }
    .quick-card { padding:1.5rem; }
    .card-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
    .view-all-link { font-size:.75rem; color:#3b82f6; font-weight:600; cursor:pointer; }

    .activity-list { display:flex; flex-direction:column; gap:.125rem; }
    .activity-item { display:flex; align-items:flex-start; gap:.875rem; padding:.75rem; border-radius:10px; transition:background .15s; }
    .activity-item:hover { background:#f8fafc; }
    .activity-icon-wrap { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .act-campaign { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .act-subscriber { background:rgba(16,185,129,0.1); color:#059669; }
    .act-flow { background:rgba(139,92,246,0.1); color:#8b5cf6; }
    .act-scheduled { background:rgba(245,158,11,0.1); color:#d97706; }
    .activity-body { display:flex; flex-direction:column; gap:.2rem; }
    .activity-msg { font-size:.8125rem; color:#334155; line-height:1.4; margin:0; }
    .activity-time { font-size:.7rem; color:#64748b; }

    .quick-actions { display:flex; flex-direction:column; gap:.5rem; }
    .quick-action { display:flex; align-items:center; gap:.875rem; padding:.875rem 1rem; border-radius:12px; background:#f8fafc; border:1.5px solid #f1f5f9; text-decoration:none; transition:all .2s; cursor:pointer; }
    .quick-action:hover { background:#f0f7ff; border-color:#bfdbfe; transform:translateX(3px); }
    .qa-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .qa-icon svg { width:18px; height:18px; }
    .qa-body { flex:1; display:flex; flex-direction:column; }
    .qa-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .qa-sub { font-size:.75rem; color:#64748b; }
    .qa-arrow { color:#cbd5e1; transition:transform .2s; }
    .quick-action:hover .qa-arrow { transform:translateX(3px); color:#3b82f6; }

    @media(max-width:1200px) { .stats-grid { grid-template-columns:repeat(2,1fr); } .attr-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .charts-row,.bottom-row { grid-template-columns:1fr; } .perf-kpi-row { grid-template-columns:1fr; } }
    @media(max-width:768px) {
      .welcome-title { font-size:1.35rem; }
      .conv-header { flex-direction:column; align-items:flex-start; gap:.5rem; }
      .conv-date-range { margin-left:0; font-size:.72rem; }
      .perf-summary { padding:1.25rem; }
      .perf-kpi-row { padding:1rem; }
      .pk-val { font-size:1.5rem; }
      .attr-grid { grid-template-columns:repeat(3,1fr); }
    }
    @media(max-width:600px) { .stats-grid { grid-template-columns:repeat(2,1fr); } .attr-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:480px) {
      .stats-grid { grid-template-columns:1fr; }
      .stat-card { padding:1rem 1.125rem; }
      .stat-value { font-size:1.375rem; }
      .conv-date-range { display:none; }
      .attr-grid { grid-template-columns:repeat(2,1fr); }
      .bar-chart { height:100px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  welcomeName = 'there';
  periodStart = '';
  periodEnd = '';
  periodDays = 30;
  conversionMetric = 'opened_email';
  conversionMetrics: { key: string; label: string; value: string; change: number; description: string }[] = [];
  subscriberGrowthPct = 0;

  get activeConversion() {
    return this.conversionMetrics.find(m => m.key === this.conversionMetric) ?? this.conversionMetrics[0];
  }

  stats: { label: string; value: string; growth: number; icon: string; color: string; tooltip: string }[] = [];
  performance = { totalRevenue: 0, totalRevenueChange: 0, attributedRevenue: 0, attributedRevenueChange: 0, periodLabel: '' };
  campaignData: { label: string; sent: number; opened: number }[] = [];
  campaignLabels: string[] = [];
  campaignSeries: ChartSeries[] = [];
  growthData: { label: string; count: number }[] = [];
  growthLabels: string[] = [];
  growthSeries: ChartSeries[] = [];
  campaignFunnel: { name: string; sent: number; delivered: number; opens: number; clicks: number; purchases: number; revenue: string }[] = [];
  activity: { id: string; type: string; message: string; time: string; icon: string }[] = [];

  attributionData: { label: string; value: string; pct: string; icon: string }[] = [];

  constructor(private dashboardApi: DashboardApiService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  onPeriodChange(ev: Event) {
    this.periodDays = Number((ev.target as HTMLSelectElement).value);
    this.loadDashboard();
  }

  onConversionChange(ev: Event) {
    this.conversionMetric = (ev.target as HTMLSelectElement).value;
  }

  private loadDashboard() {
    this.loading.set(true);
    this.dashboardApi.getDashboard(this.periodDays).subscribe({
      next: (data) => this.applyDashboard(data),
      error: () => this.loading.set(false)
    });
  }

  private applyDashboard(data: DashboardData) {
    const s = data.stats;
    this.welcomeName = data.welcomeName;
    this.periodStart = data.periodStart;
    this.periodEnd = data.periodEnd;
    this.conversionMetrics = data.conversionMetrics ?? [];
    this.subscriberGrowthPct = s.subscriberGrowth;
    this.performance = data.performance;

    this.stats = [
      { label: 'Total Subscribers', value: s.totalSubscribers.toLocaleString(), growth: s.subscriberGrowth, icon: 'subscribers', color: '#3b82f6', tooltip: 'Total active subscribers on your list' },
      { label: 'Emails Sent', value: s.emailsSent.toLocaleString(), growth: s.emailsGrowth, icon: 'emails', color: '#6366f1', tooltip: 'Total emails sent this period' },
      { label: 'Open Rate', value: s.openRate + '%', growth: s.openRateGrowth, icon: 'open-rate', color: '#059669', tooltip: 'Percentage of emails opened by recipients' },
      { label: 'Revenue', value: '$' + s.revenue.toLocaleString(), growth: s.revenueGrowth, icon: 'revenue', color: '#d97706', tooltip: 'Estimated revenue attributed to email campaigns' },
    ];

    this.attributionData = data.attribution;
    this.campaignData = data.campaignChart;
    this.campaignLabels = data.campaignChart.map(d => d.label);
    this.campaignSeries = [
      { name: 'Sent', color: '#60a5fa', values: data.campaignChart.map(d => d.sent) },
      { name: 'Opened', color: '#a78bfa', values: data.campaignChart.map(d => d.opened) },
    ];
    this.growthData = data.growthChart;
    this.growthLabels = data.growthChart.map(d => d.label);
    this.growthSeries = [{ name: 'Subscribers', color: '#1e3a5f', values: data.growthChart.map(d => d.count) }];
    this.campaignFunnel = data.campaignFunnel ?? [];
    this.activity = data.recentActivity;
    this.loading.set(false);
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}
