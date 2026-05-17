import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-perf">
      <div class="mcpf-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span class="mcpf-title">Flow Performance</span>
        <span class="mcpf-period">Last 90 days</span>
      </div>

      <div class="mcpf-metrics-grid">
        <div class="mcpf-metric" *ngFor="let m of metrics" [attr.data-tooltip]="m.tooltip">
          <span class="mcpf-metric-val" [style.color]="m.color">{{ m.value }}</span>
          <span class="mcpf-metric-label">{{ m.label }}</span>
          <span class="mcpf-metric-sub">{{ m.sub }}</span>
        </div>
      </div>

      <div class="mcpf-by-type">
        <h5 class="mcpf-bt-title">Performance by milestone type</h5>
        <div class="mcpf-bt-list">
          <div class="mcpf-bt-row" *ngFor="let t of byType">
            <div class="mcpf-bt-dot" [style.background]="t.color"></div>
            <span class="mcpf-bt-name">{{ t.name }}</span>
            <span class="mcpf-bt-open">{{ t.open }}% open</span>
            <span class="mcpf-bt-reply">{{ t.reply }}% reply</span>
          </div>
        </div>
      </div>

      <div class="mcpf-note">
        <svg viewBox="0 0 20 20" fill="#d97706" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Reply rate is the clearest signal that milestone emails landed as genuine personal
          communication. Over time, compare which anniversary intervals and catalog thresholds
          generate the most engagement to refine what you celebrate.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .mc-perf {
      background: #fff; border: 1.5px solid #e2e8f0;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .mcpf-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem; color: #64748b;
    }
    .mcpf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .mcpf-period { font-size: .72rem; color: #94a3b8; margin-left: auto; }

    .mcpf-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: .625rem;
      margin-bottom: .875rem;
    }
    .mcpf-metric {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .75rem .625rem; background: #fffbeb; border-radius: 9px;
      border: 1px solid #fde68a; text-align: center; cursor: help; min-width: 0;
    }
    .mcpf-metric-val { font-size: 1.125rem; font-weight: 800; letter-spacing: -.02em; }
    .mcpf-metric-label {
      font-size: .68rem; font-weight: 600; color: #64748b;
      line-height: 1.35; word-wrap: break-word; overflow-wrap: anywhere;
    }
    .mcpf-metric-sub { font-size: .65rem; color: #94a3b8; }

    .mcpf-by-type { margin-bottom: .875rem; }
    .mcpf-bt-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem; }
    .mcpf-bt-list { display: flex; flex-direction: column; gap: .5rem; }
    .mcpf-bt-row { display: flex; align-items: center; gap: .625rem; flex-wrap: wrap; }
    .mcpf-bt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .mcpf-bt-name { font-size: .72rem; color: #374151; min-width: 140px; }
    .mcpf-bt-open { font-size: .72rem; font-weight: 600; color: #059669; }
    .mcpf-bt-reply { font-size: .72rem; font-weight: 700; color: #d97706; margin-left: auto; }

    .mcpf-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(217,119,6,0.04); border-radius: 7px;
    }

    @media (max-width: 420px) { .mcpf-metrics-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class McPerformanceComponent {
  metrics = [
    { label: 'Overall Open Rate', value: '62.4%', sub: '67 triggered', color: '#d97706', tooltip: 'Milestone emails often outperform newsletters because subject lines signal personal recognition' },
    { label: 'Reply Rate', value: '8.7%', sub: 'highest in program', color: '#059669', tooltip: 'Clearest signal the email landed as genuine personal communication — watch this metric most closely' },
    { label: 'Click Rate', value: '18.2%', sub: 'gift/offer links', color: '#6366f1', tooltip: 'Clicks on optional gift links — birthday discounts often outperform generic promos' },
    { label: 'Offer Redemption', value: '24.1%', sub: 'where offer included', color: '#3b82f6', tooltip: 'Readers who used milestone gift discounts — context makes offers feel personal' },
    { label: 'Anniversary Triggers', value: '41', sub: '1-year anniversaries', color: '#d97706', tooltip: 'Most common milestone type — every subscriber has a join date' },
    { label: 'Catalog Milestones', value: '12', sub: '5th purchase threshold', color: '#6366f1', tooltip: 'Purchase-triggered celebrations — highest community invitation conversion' },
  ];

  byType = [
    { name: 'Subscriber anniversary', open: 64.2, reply: 9.1, color: '#d97706' },
    { name: 'Birthday', open: 71.8, reply: 11.4, color: '#db2777' },
    { name: 'Catalog milestone', open: 58.3, reply: 6.2, color: '#6366f1' },
  ];
}
