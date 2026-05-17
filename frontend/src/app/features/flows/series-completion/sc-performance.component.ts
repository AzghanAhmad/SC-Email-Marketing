import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-perf">
      <div class="sc-perf-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span class="sc-perf-title">Flow Performance</span>
        <span class="sc-perf-period">Last 90 days</span>
      </div>

      <div class="sc-metrics-grid">
        <div class="sc-metric" *ngFor="let m of metrics" [attr.data-tooltip]="m.tooltip">
          <span class="sc-metric-val" [style.color]="m.color">{{ m.value }}</span>
          <span class="sc-metric-label">{{ m.label }}</span>
          <span class="sc-metric-sub">{{ m.sub }}</span>
        </div>
      </div>

      <div class="sc-scenario-breakdown">
        <h5 class="sc-sb-title">Routing breakdown</h5>
        <div class="sc-sb-list">
          <div class="sc-sb-row" *ngFor="let s of scenarioBreakdown">
            <div class="sc-sb-dot" [style.background]="s.color"></div>
            <span class="sc-sb-name">{{ s.name }}</span>
            <div class="sc-sb-bar-wrap">
              <div class="sc-sb-bar">
                <div class="sc-sb-fill" [style.width]="s.pct + '%'" [style.background]="s.color"></div>
              </div>
              <span class="sc-sb-pct">{{ s.pct }}%</span>
            </div>
            <span class="sc-sb-conv">{{ s.conv }}% conv.</span>
          </div>
        </div>
      </div>

      <div class="sc-perf-note">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          The series completion flow is one of the most reliably profitable automations in the flow
          library because it catches readers at the moment of highest readiness — when their trust
          in you as a storyteller is freshest and their appetite for more of your work is most acute.
          Keep the recommendation current as your catalog grows.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .sc-perf {
      background: #fff; border: 1.5px solid #e2e8f0;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .sc-perf-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem; color: #64748b;
    }
    .sc-perf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .sc-perf-period { font-size: .72rem; color: #94a3b8; margin-left: auto; }

    .sc-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: .625rem;
      margin-bottom: .875rem;
    }
    .sc-metric {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .75rem .625rem; background: #f8fafc; border-radius: 9px;
      border: 1px solid #f1f5f9; text-align: center; cursor: help;
      min-width: 0;
    }
    .sc-metric-val { font-size: 1.125rem; font-weight: 800; letter-spacing: -.02em; }
    .sc-metric-label {
      font-size: .68rem; font-weight: 600; color: #64748b;
      line-height: 1.35; word-wrap: break-word; overflow-wrap: anywhere;
    }
    .sc-metric-sub { font-size: .65rem; color: #94a3b8; }

    .sc-scenario-breakdown { margin-bottom: .875rem; }
    .sc-sb-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem; }
    .sc-sb-list { display: flex; flex-direction: column; gap: .5rem; }
    .sc-sb-row { display: flex; align-items: center; gap: .625rem; }
    .sc-sb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .sc-sb-name { font-size: .72rem; color: #374151; min-width: 120px; flex-shrink: 0; }
    .sc-sb-bar-wrap { flex: 1; display: flex; align-items: center; gap: .5rem; }
    .sc-sb-bar { flex: 1; height: 6px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
    .sc-sb-fill { height: 100%; border-radius: 100px; transition: width .8s; }
    .sc-sb-pct { font-size: .72rem; color: #64748b; min-width: 30px; }
    .sc-sb-conv { font-size: .72rem; font-weight: 700; color: #059669; min-width: 60px; text-align: right; }

    .sc-perf-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px;
    }

    @media (max-width: 420px) { .sc-metrics-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class ScPerformanceComponent {
  metrics = [
    { label: 'Open Rate', value: '71.4%', sub: '178 triggered', color: '#059669', tooltip: 'Series completion emails have very high open rates — the subject line is highly relevant to what the reader just did' },
    { label: 'Next-Title Purchase Rate', value: '28.3%', sub: 'of email recipients', color: '#6366f1', tooltip: 'Percentage of readers who purchased the recommended next title after receiving the series completion email' },
    { label: 'Revenue per Trigger', value: '$8.40', sub: 'avg across all scenarios', color: '#d97706', tooltip: 'Average revenue generated per series completion flow trigger — one of the highest in the flow library' },
    { label: 'Avg Time to Purchase', value: '1.8 days', sub: 'after email opens', color: '#3b82f6', tooltip: 'Average time between opening the series completion email and completing the next purchase' },
    { label: 'Catalog Exhausted', value: '12%', sub: 'of triggers', color: '#94a3b8', tooltip: 'Percentage of triggers where the reader has read everything in the catalog — routed to relationship-deepening email' },
    { label: 'Click Rate', value: '34.1%', sub: 'next-title link', color: '#059669', tooltip: 'Percentage of recipients who clicked the recommended next title link' },
  ];

  scenarioBreakdown = [
    { name: 'Next series available', pct: 58, conv: 34.2, color: '#6366f1' },
    { name: 'Standalone recommendation', pct: 22, conv: 21.8, color: '#3b82f6' },
    { name: 'Mid-series continuation', pct: 8, conv: 41.6, color: '#059669' },
    { name: 'Catalog exhausted', pct: 12, conv: 0, color: '#94a3b8' },
  ];
}
