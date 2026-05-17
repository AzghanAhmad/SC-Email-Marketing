import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ac-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ac-perf">
      <div class="ac-perf-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span class="ac-perf-title">Flow Performance</span>
        <span class="ac-perf-period">Last 30 days</span>
      </div>

      <div class="ac-perf-flows">

        <!-- Cart flow stats -->
        <div class="ac-flow-stats">
          <div class="ac-flow-stats-header">
            <div class="ac-flow-stats-icon cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <span class="ac-flow-stats-name">Abandoned Cart</span>
            <span class="ac-flow-stats-triggers">203 triggered</span>
          </div>
          <div class="ac-metrics-grid">
            <div class="ac-metric" data-tooltip="Percentage of abandonment events that resulted in a completed purchase within the flow window — the primary success metric">
              <span class="ac-metric-val green">11.3%</span>
              <span class="ac-metric-label">Recovery Rate</span>
            </div>
            <div class="ac-metric" data-tooltip="Open rate on Email 1 — the 1-hour reminder">
              <span class="ac-metric-val">58.4%</span>
              <span class="ac-metric-label">Email 1 Opens</span>
            </div>
            <div class="ac-metric" data-tooltip="Open rate on Email 2 — the 24-hour final nudge">
              <span class="ac-metric-val">34.1%</span>
              <span class="ac-metric-label">Email 2 Opens</span>
            </div>
            <div class="ac-metric" data-tooltip="Revenue recovered by this flow in the last 30 days">
              <span class="ac-metric-val green">$412</span>
              <span class="ac-metric-label">Revenue Recovered</span>
            </div>
          </div>
        </div>

        <!-- Checkout flow stats -->
        <div class="ac-flow-stats">
          <div class="ac-flow-stats-header">
            <div class="ac-flow-stats-icon checkout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <span class="ac-flow-stats-name">Abandoned Checkout</span>
            <span class="ac-flow-stats-triggers">87 triggered</span>
          </div>
          <div class="ac-metrics-grid">
            <div class="ac-metric" data-tooltip="Recovery rate is higher for checkout abandonment because intent was higher to begin with">
              <span class="ac-metric-val green">18.4%</span>
              <span class="ac-metric-label">Recovery Rate</span>
            </div>
            <div class="ac-metric" data-tooltip="Open rate on Email 1 — the 30-minute checkout reminder">
              <span class="ac-metric-val">71.2%</span>
              <span class="ac-metric-label">Email 1 Opens</span>
            </div>
            <div class="ac-metric" data-tooltip="Open rate on Email 2 — the 24-hour follow-up">
              <span class="ac-metric-val">41.8%</span>
              <span class="ac-metric-label">Email 2 Opens</span>
            </div>
            <div class="ac-metric" data-tooltip="Revenue recovered by this flow in the last 30 days">
              <span class="ac-metric-val green">$318</span>
              <span class="ac-metric-label">Revenue Recovered</span>
            </div>
          </div>
        </div>

      </div>

      <div class="ac-perf-insight">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Recovery rate is the primary metric for these flows — the percentage of abandonment events
          that resulted in a completed purchase. An improving rate over time tells you your copy is
          getting better calibrated to your audience. The attribution data also shows which traffic
          sources produce the most abandoned carts, informing where you focus store traffic acquisition.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .ac-perf {
      background: #fff; border: 1.5px solid #e2e8f0;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .ac-perf-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem; color: #64748b;
    }
    .ac-perf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .ac-perf-period { font-size: .72rem; color: #94a3b8; margin-left: auto; }

    .ac-perf-flows { display: flex; flex-direction: column; gap: .75rem; margin-bottom: .875rem; }

    .ac-flow-stats {
      background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: .875rem;
    }
    .ac-flow-stats-header {
      display: flex; align-items: center; gap: .625rem; margin-bottom: .75rem;
    }
    .ac-flow-stats-icon {
      width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .ac-flow-stats-icon.cart { background: rgba(245,158,11,0.1); color: #d97706; }
    .ac-flow-stats-icon.checkout { background: rgba(99,102,241,0.1); color: #6366f1; }
    .ac-flow-stats-name { font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .ac-flow-stats-triggers { font-size: .72rem; color: #94a3b8; margin-left: auto; }

    .ac-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: .5rem;
    }
    .ac-metric {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .625rem .5rem; background: #fff; border-radius: 8px;
      border: 1px solid #f1f5f9; text-align: center; cursor: help; min-width: 0;
    }
    .ac-metric-val { font-size: 1.0625rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
    .ac-metric-val.green { color: #059669; }
    .ac-metric-label { font-size: .65rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; line-height: 1.3; }

    .ac-perf-insight {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px;
    }

    @media (max-width: 500px) { .ac-metrics-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class AcPerformanceComponent {}
