import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PerfMetric {
  label: string;
  value: string;
  sub: string;
  color: string;
  tooltip: string;
}

@Component({
  selector: 'app-post-purchase-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pp-perf">
      <div class="pp-perf-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span class="pp-perf-title">Sequence Performance</span>
        <span class="pp-perf-period">Last 30 days</span>
      </div>
      <div class="pp-perf-grid">
        <div class="pp-metric" *ngFor="let m of metrics" [attr.data-tooltip]="m.tooltip">
          <span class="pp-metric-val" [style.color]="m.color">{{ m.value }}</span>
          <span class="pp-metric-label">{{ m.label }}</span>
          <span class="pp-metric-sub">{{ m.sub }}</span>
        </div>
      </div>
      <div class="pp-perf-note">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Performance data flows back into ScribeCount's reporting dashboard. Open rates, click rates,
          review link clicks, and next-book link clicks — all connected to your royalty reports and
          campaign performance in one view.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .pp-perf {
      background: #fff; border: 1.5px solid #e2e8f0;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .pp-perf-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem; color: #64748b;
    }
    .pp-perf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .pp-perf-period { font-size: .72rem; color: #94a3b8; margin-left: auto; }

    .pp-perf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: .75rem;
      margin-bottom: .875rem;
    }
    .pp-metric {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .75rem; background: #f8fafc; border-radius: 9px;
      border: 1px solid #f1f5f9; cursor: help; min-width: 0;
    }
    .pp-metric-val { font-size: 1.25rem; font-weight: 800; letter-spacing: -.02em; line-height: 1.2; }
    .pp-metric-label {
      font-size: .7rem; font-weight: 600; color: #64748b;
      line-height: 1.35; word-wrap: break-word; overflow-wrap: anywhere;
    }
    .pp-metric-sub { font-size: .68rem; color: #94a3b8; }

    .pp-perf-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px;
    }
  `]
})
export class PostPurchasePerformanceComponent {
  metrics: PerfMetric[] = [
    {
      label: 'Confirmation Open Rate',
      value: '94.1%',
      sub: '621 triggered',
      color: '#059669',
      tooltip: 'Order confirmation emails have the highest open rate of any email you send — readers are actively looking for them'
    },
    {
      label: 'Review Link Clicks',
      value: '18.4%',
      sub: 'of follow-up recipients',
      color: '#3b82f6',
      tooltip: 'Percentage of readers who clicked a review link in the Post-Purchase Follow-Up or Review Request'
    },
    {
      label: 'Next-Book Clicks',
      value: '11.2%',
      sub: 'of follow-up recipients',
      color: '#8b5cf6',
      tooltip: 'Percentage of readers who clicked the next-book suggestion in the follow-up — soft sell working'
    },
    {
      label: 'Repeat Purchase Rate',
      value: '23.7%',
      sub: 'within 90 days',
      color: '#d97706',
      tooltip: 'Percentage of first-time buyers who made a second purchase within 90 days — the sequence\'s long-term metric'
    },
    {
      label: 'Delivery Open Rate',
      value: '88.6%',
      sub: '621 delivered',
      color: '#059669',
      tooltip: 'Digital delivery emails are opened at very high rates — readers want their book'
    },
    {
      label: 'Review Request CTR',
      value: '22.1%',
      sub: 'dedicated flow',
      color: '#3b82f6',
      tooltip: 'Click-through rate on the standalone Review Request flow — higher than the buried ask in the follow-up'
    },
  ];
}
