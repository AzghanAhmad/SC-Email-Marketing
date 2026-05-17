import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-inactivity-threshold',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-threshold">
      <h4 class="ret-title">When to flag a subscriber as inactive</h4>
      <p class="ret-sub">
        The threshold depends on how frequently you send. The question is always: given my normal
        sending frequency, how long is a reasonable period of silence before something has changed?
      </p>

      <div class="ret-table">
        <div class="ret-row header">
          <span>Send frequency</span><span>Recommended threshold</span><span>Rationale</span>
        </div>
        <div class="ret-row" *ngFor="let t of thresholds">
          <span class="ret-freq">{{ t.freq }}</span>
          <span class="ret-days">{{ t.days }}</span>
          <span class="ret-rationale">{{ t.rationale }}</span>
        </div>
      </div>

      <div class="ret-note">
        <svg viewBox="0 0 20 20" fill="#db2777" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          ScribeCount flags subscribers when they have not opened or clicked within your defined
          threshold (typically 90–180 days). Flagged subscribers appear in your list health dashboard
          before any action is taken, giving you visibility before the re-engagement sequence begins.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .re-threshold { margin-bottom: 1.25rem; }
    .ret-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .ret-sub { font-size: .75rem; color: #64748b; margin: 0 0 .75rem; line-height: 1.5; }

    .ret-table { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: .75rem; }
    .ret-row {
      display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: .5rem;
      padding: .6rem .75rem; font-size: .72rem; border-bottom: 1px solid #f1f5f9;
    }
    .ret-row:last-child { border-bottom: none; }
    .ret-row.header {
      background: #f8fafc; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; color: #94a3b8; font-size: .65rem;
    }
    .ret-freq { font-weight: 600; color: #0f172a; }
    .ret-days { font-weight: 700; color: #db2777; }
    .ret-rationale { color: #64748b; line-height: 1.4; }

    .ret-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: #fdf2f8; border-radius: 8px;
    }

    @media (max-width: 500px) {
      .ret-row { grid-template-columns: 1fr; gap: .2rem; }
      .ret-row.header { display: none; }
    }
  `]
})
export class ReInactivityThresholdComponent {
  thresholds = [
    { freq: 'Weekly', days: '90 days', rationale: 'Thirteen weekly emails without engagement is a clear pattern.' },
    { freq: 'Biweekly', days: '120 days', rationale: 'Six biweekly sends without engagement indicates genuine disengagement.' },
    { freq: 'Monthly', days: '180 days', rationale: 'Six monthly sends allows natural reader rhythms without premature flagging.' },
  ];
}
