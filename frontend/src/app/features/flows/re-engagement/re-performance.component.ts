import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-perf">
      <div class="repf-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span class="repf-title">Flow Performance</span>
        <span class="repf-period">Last 90 days</span>
      </div>

      <div class="repf-metrics-grid">
        <div class="repf-metric" *ngFor="let m of metrics" [attr.data-tooltip]="m.tooltip">
          <span class="repf-metric-val" [style.color]="m.color">{{ m.value }}</span>
          <span class="repf-metric-label">{{ m.label }}</span>
          <span class="repf-metric-sub">{{ m.sub }}</span>
        </div>
      </div>

      <div class="repf-outcomes">
        <h5 class="repf-ob-title">Sequence outcomes</h5>
        <div class="repf-ob-list">
          <div class="repf-ob-row" *ngFor="let o of outcomes">
            <div class="repf-ob-dot" [style.background]="o.color"></div>
            <span class="repf-ob-name">{{ o.name }}</span>
            <div class="repf-ob-bar-wrap">
              <div class="repf-ob-bar">
                <div class="repf-ob-fill" [style.width]="o.pct + '%'" [style.background]="o.color"></div>
              </div>
              <span class="repf-ob-pct">{{ o.pct }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="repf-note">
        <svg viewBox="0 0 20 20" fill="#db2777" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Re-engagement is not primarily a revenue flow — it is a list hygiene flow. The real payoff
          is improved deliverability and accurate metrics for every campaign you send afterward.
          Track re-engagement rate and removal rate together; both are signs the flow is working.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .re-perf {
      background: #fff; border: 1.5px solid #e2e8f0;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .repf-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem; color: #64748b;
    }
    .repf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .repf-period { font-size: .72rem; color: #94a3b8; margin-left: auto; }

    .repf-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: .625rem;
      margin-bottom: .875rem;
    }
    .repf-metric {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .75rem .625rem; background: #fdf2f8; border-radius: 9px;
      border: 1px solid #fce7f3; text-align: center; cursor: help; min-width: 0;
    }
    .repf-metric-val { font-size: 1.125rem; font-weight: 800; letter-spacing: -.02em; }
    .repf-metric-label {
      font-size: .68rem; font-weight: 600; color: #64748b;
      line-height: 1.35; word-wrap: break-word; overflow-wrap: anywhere;
    }
    .repf-metric-sub { font-size: .65rem; color: #94a3b8; }

    .repf-outcomes { margin-bottom: .875rem; }
    .repf-ob-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem; }
    .repf-ob-list { display: flex; flex-direction: column; gap: .5rem; }
    .repf-ob-row { display: flex; align-items: center; gap: .625rem; }
    .repf-ob-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .repf-ob-name { font-size: .72rem; color: #374151; min-width: 140px; flex-shrink: 0; }
    .repf-ob-bar-wrap { flex: 1; display: flex; align-items: center; gap: .5rem; }
    .repf-ob-bar { flex: 1; height: 6px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
    .repf-ob-fill { height: 100%; border-radius: 100px; transition: width .8s; }
    .repf-ob-pct { font-size: .72rem; color: #64748b; min-width: 30px; }

    .repf-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(219,39,119,0.04); border-radius: 7px;
    }

    @media (max-width: 420px) { .repf-metrics-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class RePerformanceComponent {
  metrics = [
    { label: 'Email 1 Open Rate', value: '38.2%', sub: '89 triggered', color: '#db2777', tooltip: 'Warm check-in emails often outperform regular newsletters because the subject line signals personal attention' },
    { label: 'Re-engagement Rate', value: '14.6%', sub: 'of flagged subs', color: '#059669', tooltip: 'Percentage of inactive subscribers who opened or clicked and were returned to active status' },
    { label: 'Removal Rate', value: '71.2%', sub: 'completed sequence', color: '#64748b', tooltip: 'Subscribers who completed the sequence without engaging and were cleanly removed' },
    { label: 'Preference Adjusted', value: '4.1%', sub: 'chose Email 3 path', color: '#3b82f6', tooltip: 'Readers who reduced frequency rather than unsubscribing — retained on list at lower cadence' },
    { label: 'Post-Clean Open Rate Lift', value: '+6.8%', sub: 'vs prior 30 days', color: '#d97706', tooltip: 'Average open rate improvement across campaigns in the 30 days after a list clean' },
    { label: 'Re-subscribe Rate', value: '2.3%', sub: 'within 90 days', color: '#6366f1', tooltip: 'Removed subscribers who re-subscribed via the Author\'s Choice removal email link' },
  ];

  outcomes = [
    { name: 'Re-engaged (goal exit)', pct: 15, color: '#059669' },
    { name: 'Preference adjusted', pct: 4, color: '#3b82f6' },
    { name: 'Cleanly removed', pct: 71, color: '#94a3b8' },
    { name: 'Still in sequence', pct: 10, color: '#db2777' },
  ];
}
