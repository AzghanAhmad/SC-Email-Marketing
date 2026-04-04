import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ greeting }}. Here's what's happening.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/campaigns" class="btn-secondary btn-sm" data-tooltip="View all campaigns">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            New Campaign
          </a>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card anim-up d1" *ngFor="let stat of stats; let i = index">
          <div class="stat-icon" [style.background]="stat.iconBg">
            <span [innerHTML]="stat.icon"></span>
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
          <div class="bar-chart">
            <div class="bar-group" *ngFor="let d of campaignData">
              <div class="bars">
                <div class="bar sent" [style.height]="(d.sent / maxSent * 100) + '%'" [attr.data-tooltip]="d.sent + ' sent'"></div>
                <div class="bar opened" [style.height]="(d.opened / maxSent * 100) + '%'" [attr.data-tooltip]="d.opened + ' opened'"></div>
              </div>
              <span class="bar-label">{{ d.label }}</span>
            </div>
          </div>
        </div>

        <!-- Subscriber Growth -->
        <div class="glass-card chart-card anim-up d3">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Subscriber Growth</h3>
              <p class="chart-sub">Total subscribers over time</p>
            </div>
          </div>
          <div class="line-chart-wrap">
            <svg class="line-svg" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <polygon [attr.points]="growthAreaPoints" fill="url(#lineGrad)"/>
              <polyline [attr.points]="growthLinePoints" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
              <circle *ngFor="let pt of growthDots" [attr.cx]="pt.x" [attr.cy]="pt.y" r="3" fill="#60a5fa" stroke="rgba(16,28,46,0.8)" stroke-width="1.5"/>
            </svg>
            <div class="line-labels">
              <span *ngFor="let d of growthData">{{ d.label }}</span>
            </div>
          </div>
          <div class="growth-footer">
            <span class="growth-current">{{ growthData[growthData.length-1].count | number }}</span>
            <span class="growth-label">total subscribers</span>
          </div>
        </div>
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
              <span class="activity-icon">{{ item.icon }}</span>
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
            <a routerLink="/audience" class="quick-action" data-tooltip="Add a new subscriber to your list">
              <div class="qa-icon" style="background:rgba(139,92,246,0.1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              </div>
              <div class="qa-body">
                <span class="qa-title">Add Subscriber</span>
                <span class="qa-sub">Grow your audience</span>
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
            <a routerLink="/reports" class="quick-action" data-tooltip="View detailed analytics and reports">
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
    </div>
  `,
  styles: [`
    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .stat-card {
      background:#ffffff; border:1px solid #f1f5f9;
      border-radius:18px; padding:1.375rem 1.5rem;
      display:flex; align-items:center; gap:1rem;
      position:relative; transition:all .3s; overflow:hidden;
      box-shadow:0 1px 3px rgba(0,0,0,0.06);
    }
    .stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
    .stat-icon { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .stat-icon :global(svg) { width:22px; height:22px; }
    .stat-body { flex:1; display:flex; flex-direction:column; }
    .stat-value { font-size:1.625rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; line-height:1.1; }
    .stat-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin-top:.2rem; }
    .stat-trend { display:flex; align-items:center; gap:.2rem; font-size:.75rem; font-weight:700; padding:.25rem .5rem; border-radius:6px; position:absolute; top:1rem; right:2.5rem; }
    .stat-trend.up { color:#059669; background:rgba(16,185,129,0.1); }
    .stat-trend.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .stat-tooltip { position:absolute; top:1rem; right:.875rem; color:#cbd5e1; cursor:help; }

    .charts-row { display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
    .chart-card { padding:1.5rem; }
    .chart-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .chart-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .chart-sub { font-size:.78rem; color:#94a3b8; margin:0; }
    .chart-legend { display:flex; gap:.875rem; }
    .legend-item { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#64748b; font-weight:500; }
    .legend-dot { width:8px; height:8px; border-radius:50%; }

    .bar-chart { display:flex; align-items:flex-end; gap:.75rem; height:140px; padding-bottom:1.5rem; position:relative; }
    .bar-group { display:flex; flex-direction:column; align-items:center; gap:.5rem; flex:1; height:100%; }
    .bars { display:flex; align-items:flex-end; gap:3px; flex:1; width:100%; }
    .bar { flex:1; border-radius:5px 5px 0 0; transition:height .8s cubic-bezier(.4,0,.2,1); min-height:4px; cursor:pointer; }
    .bar:hover { opacity:.8; }
    .bar.sent { background:linear-gradient(180deg,#3b82f6,rgba(59,130,246,0.4)); }
    .bar.opened { background:linear-gradient(180deg,#8b5cf6,rgba(139,92,246,0.4)); }
    .bar-label { font-size:.7rem; color:#94a3b8; font-weight:500; }

    .line-chart-wrap { position:relative; margin-bottom:.75rem; }
    .line-svg { width:100%; height:120px; }
    .line-labels { display:flex; justify-content:space-between; font-size:.7rem; color:#94a3b8; margin-top:.25rem; }
    .growth-footer { display:flex; align-items:baseline; gap:.5rem; }
    .growth-current { font-size:1.75rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .growth-label { font-size:.8rem; color:#94a3b8; }

    .bottom-row { display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem; }
    .activity-card { padding:1.5rem; }
    .quick-card { padding:1.5rem; }
    .card-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
    .view-all-link { font-size:.75rem; color:#3b82f6; font-weight:600; cursor:pointer; }

    .activity-list { display:flex; flex-direction:column; gap:.125rem; }
    .activity-item { display:flex; align-items:flex-start; gap:.875rem; padding:.75rem; border-radius:10px; transition:background .15s; }
    .activity-item:hover { background:#f8fafc; }
    .activity-icon { font-size:1.25rem; flex-shrink:0; margin-top:.1rem; }
    .activity-body { display:flex; flex-direction:column; gap:.2rem; }
    .activity-msg { font-size:.8125rem; color:#334155; line-height:1.4; margin:0; }
    .activity-time { font-size:.7rem; color:#94a3b8; }

    .quick-actions { display:flex; flex-direction:column; gap:.5rem; }
    .quick-action { display:flex; align-items:center; gap:.875rem; padding:.875rem 1rem; border-radius:12px; background:#f8fafc; border:1.5px solid #f1f5f9; text-decoration:none; transition:all .2s; cursor:pointer; }
    .quick-action:hover { background:#f0f7ff; border-color:#bfdbfe; transform:translateX(3px); }
    .qa-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .qa-icon svg { width:18px; height:18px; }
    .qa-body { flex:1; display:flex; flex-direction:column; }
    .qa-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .qa-sub { font-size:.75rem; color:#94a3b8; }
    .qa-arrow { color:#cbd5e1; transition:transform .2s; }
    .quick-action:hover .qa-arrow { transform:translateX(3px); color:#3b82f6; }

    @media(max-width:1200px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:900px) { .charts-row,.bottom-row { grid-template-columns:1fr; } }
    @media(max-width:600px) { .stats-grid { grid-template-columns:1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  greeting = '';
  stats: any[] = [];
  campaignData: any[] = [];
  growthData: any[] = [];
  activity: any[] = [];
  maxSent = 1;
  growthLinePoints = '';
  growthAreaPoints = '';
  growthDots: { x: number; y: number }[] = [];

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const s = this.mockData.getDashboardStats();
    this.stats = [
      { label:'Total Subscribers', value: s.totalSubscribers.toLocaleString(), growth: s.subscriberGrowth, iconBg:'rgba(59,130,246,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', tooltip:'Total active subscribers on your list' },
      { label:'Emails Sent', value: s.emailsSent.toLocaleString(), growth: s.emailsGrowth, iconBg:'rgba(99,102,241,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', tooltip:'Total emails sent this month' },
      { label:'Open Rate', value: s.openRate + '%', growth: s.openRateGrowth, iconBg:'rgba(16,185,129,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', tooltip:'Percentage of emails opened by recipients' },
      { label:'Revenue', value: '$' + s.revenue.toLocaleString(), growth: s.revenueGrowth, iconBg:'rgba(245,158,11,0.1)', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', tooltip:'Estimated revenue attributed to email campaigns' },
    ];

    this.campaignData = this.mockData.getCampaignChartData();
    this.maxSent = Math.max(...this.campaignData.map(d => d.sent));
    this.growthData = this.mockData.getSubscriberGrowthData();
    this.activity = this.mockData.getRecentActivity();
    this.buildGrowthChart();
  }

  buildGrowthChart() {
    const data = this.growthData;
    const max = Math.max(...data.map(d => d.count));
    const min = Math.min(...data.map(d => d.count));
    const range = max - min || 1;
    const W = 300, H = 120, PAD = 10;
    const pts = data.map((d, i) => ({
      x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
      y: H - PAD - ((d.count - min) / range) * (H - PAD * 2)
    }));
    this.growthDots = pts;
    this.growthLinePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
    this.growthAreaPoints = `${pts[0].x},${H} ${pts.map(p => `${p.x},${p.y}`).join(' ')} ${pts[pts.length-1].x},${H}`;
  }
}
