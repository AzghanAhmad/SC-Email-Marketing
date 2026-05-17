import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-list-health-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-lh">
      <h4 class="relh-title">List Health Dashboard</h4>
      <p class="relh-sub">
        Before any re-engagement email is sent, flagged subscribers appear here. Use this view to
        monitor trends, review who is about to enter the sequence, and measure the impact of each clean.
      </p>

      <div class="relh-metrics">
        <div class="relh-metric" *ngFor="let m of dashboardMetrics">
          <span class="relh-val" [style.color]="m.color">{{ m.value }}</span>
          <span class="relh-label">{{ m.label }}</span>
          <span class="relh-desc">{{ m.desc }}</span>
        </div>
      </div>

      <div class="relh-trend">
        <h5 class="relh-trend-title">Engagement trend (last 6 months)</h5>
        <div class="relh-bars">
          <div class="relh-bar-col" *ngFor="let b of trend">
            <div class="relh-bar-stack">
              <div class="relh-bar active" [style.height.%]="b.active"></div>
              <div class="relh-bar inactive" [style.height.%]="b.inactive"></div>
            </div>
            <span class="relh-bar-label">{{ b.month }}</span>
          </div>
        </div>
        <div class="relh-legend">
          <span class="relh-leg-item"><span class="relh-dot active"></span> Active engaged</span>
          <span class="relh-leg-item"><span class="relh-dot inactive"></span> Flagged inactive</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .re-lh { margin-bottom: 1.25rem; }
    .relh-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .relh-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.55; }

    .relh-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: .5rem;
      margin-bottom: .875rem;
    }
    .relh-metric {
      padding: .75rem .625rem; background: #f8fafc;
      border: 1px solid #f1f5f9; border-radius: 9px; text-align: center;
    }
    .relh-val { display: block; font-size: 1.125rem; font-weight: 800; margin-bottom: .15rem; }
    .relh-label { display: block; font-size: .68rem; font-weight: 600; color: #0f172a; margin-bottom: .15rem; }
    .relh-desc { display: block; font-size: .62rem; color: #94a3b8; line-height: 1.35; }

    .relh-trend {
      padding: .875rem; background: #fff;
      border: 1.5px solid #e2e8f0; border-radius: 12px;
    }
    .relh-trend-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .625rem; }
    .relh-bars { display: flex; align-items: flex-end; gap: .5rem; height: 80px; margin-bottom: .5rem; }
    .relh-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: .25rem; height: 100%; }
    .relh-bar-stack { flex: 1; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; gap: 1px; }
    .relh-bar { width: 100%; border-radius: 3px 3px 0 0; min-height: 2px; transition: height .5s; }
    .relh-bar.active { background: #db2777; }
    .relh-bar.inactive { background: #e2e8f0; }
    .relh-bar-label { font-size: .6rem; color: #94a3b8; }
    .relh-legend { display: flex; gap: 1rem; }
    .relh-leg-item { display: flex; align-items: center; gap: .3rem; font-size: .68rem; color: #64748b; }
    .relh-dot { width: 8px; height: 8px; border-radius: 2px; }
    .relh-dot.active { background: #db2777; }
    .relh-dot.inactive { background: #e2e8f0; }
  `]
})
export class ReListHealthDashboardComponent {
  dashboardMetrics = [
    { label: 'Flagged inactive', value: '412', desc: 'Crossed threshold, not yet in sequence', color: '#d97706' },
    { label: 'In re-engagement', value: '89', desc: 'Currently in active sequence', color: '#db2777' },
    { label: 'Re-engaged (30d)', value: '47', desc: 'Returned to active this month', color: '#059669' },
    { label: 'Removed (30d)', value: '231', desc: 'Cleanly removed after sequence', color: '#94a3b8' },
    { label: 'Active engaged', value: '4,218', desc: 'Opened or clicked within threshold', color: '#6366f1' },
    { label: 'Inactive %', value: '8.9%', desc: 'Share of total list flagged', color: '#dc2626' },
  ];

  trend = [
    { month: 'Dec', active: 72, inactive: 28 },
    { month: 'Jan', active: 74, inactive: 26 },
    { month: 'Feb', active: 76, inactive: 24 },
    { month: 'Mar', active: 79, inactive: 21 },
    { month: 'Apr', active: 82, inactive: 18 },
    { month: 'May', active: 85, inactive: 15 },
  ];
}
