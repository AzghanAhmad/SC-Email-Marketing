import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-scribecount-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-setup">
      <h4 class="mcs-title">How ScribeCount tracks and triggers milestone events</h4>
      <p class="mcs-sub">
        Three distinct trigger types, each drawing from a different data source. No manual calendar
        to maintain — the system handles anniversaries, birthdays, and purchase thresholds automatically.
      </p>

      <div class="mcs-triggers">
        <div class="mcs-trigger" *ngFor="let t of triggers">
          <div class="mcs-trigger-icon" [style.background]="t.bg" [style.color]="t.color">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path [attr.d]="t.icon"/>
            </svg>
          </div>
          <div class="mcs-trigger-body">
            <h5 class="mcs-trigger-name">{{ t.name }}</h5>
            <p class="mcs-trigger-desc">{{ t.desc }}</p>
            <p class="mcs-trigger-detail" *ngIf="t.detail">{{ t.detail }}</p>
          </div>
        </div>
      </div>

      <div class="mcs-dashboard">
        <h5 class="mcs-section-title">Milestone dashboard</h5>
        <p class="mcs-dash-desc">
          Reporting surfaces engagement by milestone type: open rates, click rates, reply rates,
          and offer redemption where applicable. Reply rate is the metric most worth watching —
          a high reply rate signals the email landed as genuine personal communication.
        </p>
        <div class="mcs-dash-metrics">
          <span class="mcs-dash-metric" *ngFor="let m of dashMetrics">{{ m }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mc-setup { margin-bottom: 1.25rem; }
    .mcs-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcs-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.55; }

    .mcs-triggers { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .875rem; }
    .mcs-trigger {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .75rem; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px;
    }
    .mcs-trigger-icon {
      width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .mcs-trigger-name { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcs-trigger-desc { font-size: .72rem; color: #374151; margin: 0 0 .25rem; line-height: 1.5; }
    .mcs-trigger-detail { font-size: .7rem; color: #64748b; margin: 0; line-height: 1.45; font-style: italic; }

    .mcs-dashboard {
      padding: .875rem; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px;
    }
    .mcs-section-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .4rem; }
    .mcs-dash-desc { font-size: .72rem; color: #374151; margin: 0 0 .5rem; line-height: 1.55; }
    .mcs-dash-metrics { display: flex; flex-wrap: wrap; gap: .35rem; }
    .mcs-dash-metric {
      font-size: .68rem; font-weight: 600; padding: .2rem .5rem;
      background: #fff; border: 1px solid #fde68a; border-radius: 100px; color: #92400e;
    }
  `]
})
export class McScribecountSetupComponent {
  triggers = [
    {
      name: 'Anniversary triggers',
      desc: 'Calculated from join date in subscriber record. Queues on anniversary date — one year after opt-in, automatically.',
      detail: 'Supports multiple intervals: 6 months, 1 year, 2 years, 5 years. Configure which anniversaries to celebrate.',
      bg: 'rgba(217,119,6,0.12)', color: '#d97706',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      name: 'Birthday triggers',
      desc: 'Fire based on birth month and day in profile. Arrives on birth date in reader\'s local time zone.',
      detail: 'Birth year not required or stored. Completely silent for subscribers without a birth date on file.',
      bg: 'rgba(236,72,153,0.12)', color: '#db2777',
      icon: 'M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-3.6 2.3L3 8m9 0h9m-9 0v13m0-13l-3 3m3-3l3 3',
    },
    {
      name: 'Catalog milestone triggers',
      desc: 'Purchase-based via direct store webhook — same system as post-purchase and abandoned cart flows.',
      detail: 'Purchase count across full catalog unless series-specific milestones configured separately. Review default thresholds for your catalog depth.',
      bg: 'rgba(99,102,241,0.12)', color: '#6366f1',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
  ];
  dashMetrics = ['Open rate by type', 'Click rate', 'Reply rate', 'Offer redemption', 'Anniversary interval comparison', 'Birthday vs anniversary performance'];
}
