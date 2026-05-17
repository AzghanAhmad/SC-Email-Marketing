import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preorder-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="po-perf">
      <div class="po-perf-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span class="po-perf-title">Sequence Performance</span>
        <span class="po-perf-period">Current preorder window</span>
      </div>

      <div class="po-metrics-grid">
        <div class="po-metric" *ngFor="let m of metrics" [attr.data-tooltip]="m.tooltip">
          <span class="po-metric-val" [style.color]="m.color">{{ m.value }}</span>
          <span class="po-metric-label">{{ m.label }}</span>
          <span class="po-metric-sub">{{ m.sub }}</span>
        </div>
      </div>

      <div class="po-nurture-engagement">
        <h5 class="po-ne-title">Nurture Email Engagement</h5>
        <div class="po-ne-list">
          <div class="po-ne-row" *ngFor="let e of nurtureEngagement">
            <span class="po-ne-name">{{ e.name }}</span>
            <div class="po-ne-bar-wrap">
              <div class="po-ne-bar">
                <div class="po-ne-bar-fill" [style.width]="e.rate + '%'" [style.background]="e.color"></div>
              </div>
              <span class="po-ne-rate">{{ e.rate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="po-perf-note">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Over multiple preorder windows, the data builds a picture of what your preorder readers
          respond to most strongly — which nurture email generates the highest engagement, whether
          your countdown email actually spikes open rates, whether your fulfillment email's download
          click rate is consistent or whether there are device or format issues affecting access.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .po-perf {
      background: #fff; border: 1.5px solid #e2e8f0;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
      min-width: 0; max-width: 100%; box-sizing: border-box;
    }
    .po-perf-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem;
      color: #64748b; flex-wrap: wrap;
    }
    .po-perf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .po-perf-period { font-size: .72rem; color: #94a3b8; margin-left: auto; white-space: nowrap; }

    .po-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: .625rem;
      margin-bottom: .875rem;
    }
    .po-metric {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .75rem .625rem; background: #f8fafc; border-radius: 9px;
      border: 1px solid #f1f5f9; text-align: center; cursor: help;
      min-width: 0;
    }
    .po-metric-val { font-size: 1.125rem; font-weight: 800; letter-spacing: -.02em; line-height: 1.2; }
    .po-metric-label {
      font-size: .68rem; font-weight: 600; color: #64748b;
      line-height: 1.35; word-wrap: break-word; overflow-wrap: anywhere;
    }
    .po-metric-sub { font-size: .65rem; color: #94a3b8; line-height: 1.3; }

    .po-nurture-engagement { margin-bottom: .875rem; }
    .po-ne-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem; }
    .po-ne-list { display: flex; flex-direction: column; gap: .5rem; }
    .po-ne-row { display: flex; align-items: center; gap: .75rem; }
    .po-ne-name { font-size: .75rem; color: #374151; min-width: 0; flex: 0 1 110px; }
    .po-ne-bar-wrap { flex: 1; display: flex; align-items: center; gap: .5rem; }
    .po-ne-bar { flex: 1; height: 6px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
    .po-ne-bar-fill { height: 100%; border-radius: 100px; transition: width .8s; }
    .po-ne-rate { font-size: .75rem; font-weight: 700; color: #0f172a; min-width: 36px; text-align: right; }

    .po-perf-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px;
    }

    @media (max-width: 420px) {
      .po-metrics-grid { grid-template-columns: 1fr 1fr; }
      .po-ne-row { flex-wrap: wrap; }
      .po-ne-name { flex: 1 1 100%; margin-bottom: .25rem; }
    }
  `]
})
export class PreorderPerformanceComponent {
  metrics = [
    { label: 'Confirmation Open Rate', value: '91.4%', sub: '312 triggered', color: '#059669', tooltip: 'Preorder confirmation emails have extremely high open rates — readers are actively looking for them' },
    { label: 'Fulfillment Click Rate', value: '84.2%', sub: 'download link clicks', color: '#3b82f6', tooltip: 'Percentage of fulfillment email recipients who clicked the download link' },
    { label: 'Launch-Day Reviews', value: '34', sub: 'from preorder readers', color: '#d97706', tooltip: 'Reviews posted on or within 48 hours of release day by preorder readers — the social proof that makes your book credible to new readers' },
    { label: 'Avg Nurture Open Rate', value: '74.8%', sub: 'across all 4 emails', color: '#6366f1', tooltip: 'Average open rate across the four nurture emails — significantly higher than standard campaign averages because these readers are highly engaged' },
    { label: 'Preorder Readers', value: '312', sub: 'current window', color: '#0f172a', tooltip: 'Total readers currently in the preorder flow for the active preorder title' },
    { label: 'Suppressed from Broadcast', value: '312', sub: 'auto-applied', color: '#dc2626', tooltip: 'Preorder readers automatically suppressed from the general launch broadcast — they receive the dedicated fulfillment email instead' },
  ];

  nurtureEngagement = [
    { name: 'Behind the Scenes', rate: 81, color: '#6366f1' },
    { name: 'First Chapter', rate: 76, color: '#3b82f6' },
    { name: 'Cover Story', rate: 68, color: '#8b5cf6' },
    { name: 'Countdown', rate: 88, color: '#059669' },
  ];
}
