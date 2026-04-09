import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deliverability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Deliverability</h1>
          <p class="page-subtitle">Monitor your sending reputation and inbox placement</p>
        </div>
      </div>

      <!-- Channel Tabs -->
      <div class="channel-tabs">
        <button class="channel-tab active">Email</button>
      </div>

      <!-- Sub-tabs -->
      <div class="sub-tabs">
        <button class="sub-tab" [class.active]="activeSubTab() === 'score'" (click)="activeSubTab.set('score')">Score</button>
        <button class="sub-tab" [class.active]="activeSubTab() === 'reports'" (click)="activeSubTab.set('reports')">Reports</button>
        <button class="sub-tab" [class.active]="activeSubTab() === 'bounce'" (click)="activeSubTab.set('bounce')">Bounce Details</button>
      </div>

      <!-- Score View -->
      <div *ngIf="activeSubTab() === 'score'">
        <div class="score-layout">
          <!-- Score Card -->
          <div class="glass-card score-card">
            <div class="score-header">
              <div>
                <h3 class="score-section-title">Deliverability Score</h3>
                <p class="score-section-sub">Based on last 30 days of data</p>
              </div>
              <div class="score-toggle">
                <button class="toggle-btn" [class.active]="scoreView() === 'factors'" (click)="scoreView.set('factors')">Factors</button>
                <button class="toggle-btn" [class.active]="scoreView() === 'time'" (click)="scoreView.set('time')">Over time</button>
              </div>
            </div>

            <div class="score-main" *ngIf="scoreView() === 'factors'">
              <div class="score-gauge">
                <svg viewBox="0 0 120 120" class="gauge-svg">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" stroke-width="12"/>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" stroke-width="12"
                    [attr.stroke-dasharray]="(scorePercent / 100 * 327) + ' 327'"
                    stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 60 60)"/>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#ef4444"/>
                      <stop offset="50%" stop-color="#f59e0b"/>
                      <stop offset="100%" stop-color="#10b981"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="gauge-center">
                  <span class="gauge-value">{{ deliverabilityScore }}</span>
                </div>
              </div>
              <div class="score-status">
                <div class="score-label-row">
                  <span>Your score is</span>
                  <span class="score-rating" [ngClass]="scoreRatingClass">{{ scoreRating }}</span>
                </div>
                <div class="score-change" [class.down]="scoreChange < 0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12">
                    <polyline *ngIf="scoreChange < 0" points="6 9 12 15 18 9"/>
                    <polyline *ngIf="scoreChange >= 0" points="18 15 12 9 6 15"/>
                  </svg>
                  {{ scoreChange > 0 ? '+' : '' }}{{ scoreChange }} over the previous 30 days
                </div>
              </div>
            </div>

            <!-- Over Time Chart -->
            <div class="score-time-chart" *ngIf="scoreView() === 'time'">
              <div class="time-chart">
                <svg viewBox="0 0 400 140" preserveAspectRatio="none" class="time-svg">
                  <defs>
                    <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2"/>
                      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <polygon [attr.points]="timeAreaPoints" fill="url(#timeGrad)"/>
                  <polyline [attr.points]="timeLinePoints" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                  <circle *ngFor="let pt of timeDots" [attr.cx]="pt.x" [attr.cy]="pt.y" r="4" fill="#3b82f6" stroke="white" stroke-width="2"/>
                </svg>
                <div class="time-labels">
                  <span *ngFor="let d of scoreHistory">{{ d.label }}</span>
                </div>
              </div>
            </div>

            <!-- Metrics Table -->
            <div class="metrics-table" *ngIf="scoreView() === 'factors'">
              <div class="mt-header">
                <span>Metrics</span>
                <span>Rate</span>
                <span>Recommended</span>
              </div>
              <div class="mt-row" *ngFor="let m of metrics">
                <div class="mt-name">
                  <span class="mt-indicator" [ngClass]="m.statusClass"></span>
                  {{ m.name }}
                </div>
                <span class="mt-rate">{{ m.rate }}</span>
                <span class="mt-rec">{{ m.recommended }}</span>
              </div>
            </div>
          </div>

          <!-- Action Center -->
          <div class="glass-card action-card">
            <h3 class="action-title">Action Center</h3>
            <p class="action-sub">Learn how to improve your score</p>

            <div class="action-item" *ngFor="let action of actions">
              <div class="action-icon">{{ action.icon }}</div>
              <div class="action-body">
                <h4 class="ai-title">{{ action.title }}</h4>
                <p class="ai-desc">{{ action.description }}</p>
                <div class="ai-actions">
                  <button class="btn-primary btn-sm" *ngIf="action.primaryBtn">{{ action.primaryBtn }}</button>
                  <button class="btn-ghost btn-sm" *ngIf="action.secondaryBtn">{{ action.secondaryBtn }}</button>
                </div>
                <a class="ai-link" *ngIf="action.link">{{ action.link }} ↗</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports View -->
      <div *ngIf="activeSubTab() === 'reports'">
        <div class="glass-card report-section">
          <h3 class="rs-title">Recent Campaign Deliverability</h3>
          <table class="data-table">
            <thead>
              <tr><th>Campaign</th><th>Sent</th><th>Delivered</th><th>Bounced</th><th>Delivery Rate</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of deliveryReports">
                <td class="camp-name">{{ r.name }}</td>
                <td>{{ r.sent | number }}</td>
                <td class="success-text">{{ r.delivered | number }}</td>
                <td class="error-text">{{ r.bounced }}</td>
                <td>
                  <div class="rate-cell">
                    <div class="mini-bar"><div class="mini-bar-fill" [style.width]="r.rate + '%'" [style.background]="r.rate > 98 ? '#10b981' : r.rate > 95 ? '#f59e0b' : '#ef4444'"></div></div>
                    <span>{{ r.rate }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bounce Details -->
      <div *ngIf="activeSubTab() === 'bounce'">
        <div class="glass-card report-section">
          <h3 class="rs-title">Bounce Breakdown</h3>
          <div class="bounce-grid">
            <div class="bounce-card" *ngFor="let b of bounceData">
              <div class="bounce-icon" [style.background]="b.iconBg">
                <span [innerHTML]="b.icon"></span>
              </div>
              <span class="bounce-val">{{ b.value }}</span>
              <span class="bounce-label">{{ b.label }}</span>
              <span class="bounce-pct">{{ b.pct }}% of total</span>
            </div>
          </div>
        </div>
        <div class="glass-card report-section">
          <h3 class="rs-title">Recent Bounced Addresses</h3>
          <table class="data-table">
            <thead><tr><th>Email</th><th>Type</th><th>Reason</th><th>Date</th></tr></thead>
            <tbody>
              <tr *ngFor="let b of bouncedEmails">
                <td class="email-cell">{{ b.email }}</td>
                <td><span class="badge" [ngClass]="'badge-' + b.type">{{ b.type }}</span></td>
                <td class="muted">{{ b.reason }}</td>
                <td class="muted">{{ b.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .channel-tabs { display:flex; gap:.5rem; margin-bottom:.75rem; }
    .channel-tab { padding:.5rem 1rem; border-radius:10px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; }
    .channel-tab.active { border-bottom:2px solid #0f172a; border-radius:0; color:#0f172a; font-weight:600; }

    .sub-tabs { display:flex; gap:0; margin-bottom:1.5rem; border-bottom:1px solid #e2e8f0; }
    .sub-tab { padding:.625rem 1.25rem; border:none; background:transparent; color:#64748b; font-size:.8125rem; font-weight:500; font-family:inherit; cursor:pointer; border-bottom:2px solid transparent; transition:all .2s; }
    .sub-tab:hover { color:#0f172a; }
    .sub-tab.active { color:#3b82f6; border-bottom-color:#3b82f6; font-weight:600; }

    .score-layout { display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem; align-items:start; }
    .score-card { padding:1.75rem; }
    .score-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:2rem; }
    .score-section-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .score-section-sub { font-size:.8125rem; color:#94a3b8; margin:0; }
    .score-toggle { display:flex; background:#f1f5f9; border-radius:10px; padding:.2rem; }
    .toggle-btn { padding:.45rem .875rem; border:none; background:transparent; color:#64748b; font-size:.8rem; font-weight:500; font-family:inherit; cursor:pointer; border-radius:8px; transition:all .2s; }
    .toggle-btn.active { background:white; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }

    .score-main { display:flex; align-items:center; gap:2rem; margin-bottom:2rem; }
    .score-gauge { position:relative; width:120px; height:120px; flex-shrink:0; }
    .gauge-svg { width:100%; height:100%; }
    .gauge-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
    .gauge-value { font-size:2.25rem; font-weight:800; color:#0f172a; }
    .score-status { display:flex; flex-direction:column; gap:.5rem; }
    .score-label-row { display:flex; align-items:center; gap:.5rem; font-size:.9rem; color:#334155; }
    .score-rating { font-weight:700; padding:.2rem .6rem; border-radius:6px; }
    .score-rating.poor { color:#dc2626; background:rgba(239,68,68,0.1); }
    .score-rating.fair { color:#d97706; background:rgba(245,158,11,0.1); }
    .score-rating.good { color:#059669; background:rgba(16,185,129,0.1); }
    .score-change { display:flex; align-items:center; gap:.375rem; font-size:.8125rem; color:#d97706; }
    .score-change.down { color:#dc2626; }

    .score-time-chart { margin-bottom:2rem; }
    .time-chart { position:relative; }
    .time-svg { width:100%; height:140px; }
    .time-labels { display:flex; justify-content:space-between; font-size:.7rem; color:#94a3b8; margin-top:.375rem; }

    .metrics-table { }
    .mt-header { display:grid; grid-template-columns:2fr 1fr 1.5fr; padding:.75rem 0; border-bottom:1px solid #e2e8f0; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .mt-row { display:grid; grid-template-columns:2fr 1fr 1.5fr; padding:.875rem 0; border-bottom:1px solid #f1f5f9; align-items:center; font-size:.875rem; }
    .mt-row:last-child { border-bottom:none; }
    .mt-name { display:flex; align-items:center; gap:.5rem; font-weight:500; color:#334155; }
    .mt-indicator { width:10px; height:10px; border-radius:3px; flex-shrink:0; }
    .mt-indicator.warning { background:#f59e0b; }
    .mt-indicator.danger { background:#ef4444; }
    .mt-indicator.success { background:#10b981; }
    .mt-rate { font-weight:600; color:#0f172a; }
    .mt-rec { font-size:.8125rem; color:#94a3b8; }

    .action-card { padding:1.75rem; position:sticky; top:80px; }
    .action-title { font-size:1.0625rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .action-sub { font-size:.8125rem; color:#94a3b8; margin:0 0 1.5rem; }
    .action-item { margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid #f1f5f9; }
    .action-item:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }
    .action-icon { font-size:1.25rem; margin-bottom:.5rem; }
    .ai-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .ai-desc { font-size:.8125rem; color:#94a3b8; margin:0 0 .875rem; line-height:1.5; }
    .ai-actions { display:flex; gap:.5rem; margin-bottom:.5rem; }
    .ai-link { font-size:.8rem; color:#3b82f6; text-decoration:none; font-weight:500; }
    .ai-link:hover { text-decoration:underline; }

    .report-section { padding:1.5rem; margin-bottom:1.5rem; }
    .rs-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .camp-name { font-weight:600; color:#0f172a; }
    .success-text { color:#059669; font-weight:600; }
    .error-text { color:#dc2626; font-weight:600; }
    .rate-cell { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:600; }
    .mini-bar { width:60px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:100px; }
    .email-cell { color:#64748b; font-size:.8125rem; }
    .muted { color:#94a3b8; font-size:.8125rem; }

    .bounce-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .bounce-card { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.25rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; text-align:center; }
    .bounce-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
    .bounce-icon :global(svg) { width:18px; height:18px; }
    .bounce-val { font-size:1.5rem; font-weight:800; color:#0f172a; }
    .bounce-label { font-size:.78rem; font-weight:600; color:#334155; }
    .bounce-pct { font-size:.7rem; color:#94a3b8; }

    .badge-hard { background:rgba(239,68,68,0.1); color:#dc2626; }
    .badge-soft { background:rgba(245,158,11,0.1); color:#d97706; }

    @media(max-width:1100px) { .score-layout { grid-template-columns:1fr; } .action-card { position:static; } }
    @media(max-width:800px) { .bounce-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class DeliverabilityComponent {
  activeSubTab = signal('score');
  scoreView = signal<'factors' | 'time'>('factors');

  deliverabilityScore = 72;
  scorePercent = 72;
  scoreRating = 'Fair';
  scoreRatingClass = 'fair';
  scoreChange = -2;

  scoreHistory = [
    { label: 'Week 1', score: 68 },
    { label: 'Week 2', score: 71 },
    { label: 'Week 3', score: 74 },
    { label: 'Week 4', score: 72 },
    { label: 'Week 5', score: 69 },
    { label: 'Week 6', score: 72 },
  ];

  timeLinePoints = '';
  timeAreaPoints = '';
  timeDots: { x: number; y: number }[] = [];

  metrics = [
    { name: 'Open rate', rate: '24.2%', recommended: 'greater than 33.0%', statusClass: 'warning' },
    { name: 'Click rate', rate: '0.16%', recommended: 'greater than 1.20%', statusClass: 'danger' },
    { name: 'Bounce rate', rate: '2.54%', recommended: 'less than 1.00%', statusClass: 'danger' },
    { name: 'Unsubscribe rate', rate: '0.75%', recommended: 'less than 0.30%', statusClass: 'warning' },
    { name: 'Spam complaint rate', rate: '0.09%', recommended: 'less than 0.01%', statusClass: 'danger' },
  ];

  actions = [
    {
      icon: '✨', title: 'Create a "Never engaged" segment',
      description: 'Use this segment to improve your deliverability score by removing subscribers that have shown no engagement',
      primaryBtn: 'Create segment', secondaryBtn: 'Mark done', link: 'Create a "Never engaged" segment'
    },
    {
      icon: '🧹', title: 'Clean your list',
      description: 'Boost email deliverability and sender reputation with inbox providers by cleaning your list to exclude unengaged profiles, reducing unsubscribe rates, and enhancing open and click rates.',
      primaryBtn: 'Start cleaning', secondaryBtn: 'Mark done', link: 'Understanding list cleaning in ScribeCount'
    },
  ];

  deliveryReports = [
    { name: 'March Newsletter', sent: 4821, delivered: 4712, bounced: 109, rate: 97.7 },
    { name: 'Book Launch: The Ember Crown', sent: 3200, delivered: 3168, bounced: 32, rate: 99.0 },
    { name: 'February Roundup', sent: 4650, delivered: 4534, bounced: 116, rate: 97.5 },
    { name: 'Holiday Special', sent: 5100, delivered: 5049, bounced: 51, rate: 99.0 },
  ];

  bounceData = [
    { label: 'Hard Bounces', value: '127', pct: '0.51', iconBg: 'rgba(239,68,68,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' },
    { label: 'Soft Bounces', value: '308', pct: '1.24', iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' },
    { label: 'Suppressed', value: '45', pct: '0.18', iconBg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M18.36 6.64a9 9 0 0 1 .22 12.73M1 1l22 22"/></svg>' },
    { label: 'Complaints', value: '12', pct: '0.05', iconBg: 'rgba(239,68,68,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  ];

  bouncedEmails = [
    { email: 'old_addr@expired.com', type: 'hard', reason: 'Mailbox does not exist', date: 'Apr 3, 2026' },
    { email: 'full_inbox@example.com', type: 'soft', reason: 'Mailbox full', date: 'Apr 2, 2026' },
    { email: 'temp_error@mail.com', type: 'soft', reason: 'Temporary server error', date: 'Mar 30, 2026' },
    { email: 'blocked@domain.net', type: 'hard', reason: 'Domain not found', date: 'Mar 28, 2026' },
  ];

  constructor() {
    this.buildTimeChart();
  }

  buildTimeChart() {
    const data = this.scoreHistory;
    const max = Math.max(...data.map(d => d.score));
    const min = Math.min(...data.map(d => d.score));
    const range = max - min || 1;
    const W = 400, H = 140, PAD = 15;
    const pts = data.map((d, i) => ({
      x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
      y: H - PAD - ((d.score - min) / range) * (H - PAD * 2)
    }));
    this.timeDots = pts;
    this.timeLinePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
    this.timeAreaPoints = `${pts[0].x},${H} ${pts.map(p => `${p.x},${p.y}`).join(' ')} ${pts[pts.length - 1].x},${H}`;
  }
}
