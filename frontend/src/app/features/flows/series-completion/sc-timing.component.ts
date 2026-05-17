import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-timing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-timing">
      <div class="sct-callout">
        <div class="sct-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <h4 class="sct-callout-title">The timing window is everything</h4>
          <p class="sct-callout-desc">
            Emotional momentum is perishable. A reader who finished your series two days ago is not
            in the same emotional state as a reader who finished it last week. The investment, the
            connection, the appetite for more — all of these diminish as the reader's attention is
            redirected toward everything else in their daily life.
          </p>
        </div>
      </div>

      <div class="sct-decay">
        <h5 class="sct-decay-title">Read-through rate decay over time</h5>
        <div class="sct-decay-bars">
          <div class="sct-bar-row" *ngFor="let d of decayData">
            <span class="sct-bar-label">{{ d.label }}</span>
            <div class="sct-bar-track">
              <div class="sct-bar-fill" [style.width]="d.pct + '%'" [style.background]="d.color"></div>
            </div>
            <span class="sct-bar-val" [style.color]="d.color">{{ d.pct }}%</span>
          </div>
        </div>
        <p class="sct-decay-note">
          A reader who buys the next book within 48 hours of finishing the current one is acting on
          momentum. A reader who waits two weeks is acting on a deliberately revisited decision that
          has to compete with every other book they've encountered in those two weeks.
        </p>
      </div>

      <div class="sct-trigger-note">
        <div class="sct-tn-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span class="sct-tn-title">Purchase-triggered, not time-delayed</span>
        </div>
        <p class="sct-tn-desc">
          The series completion flow is triggered by a purchase event — when a reader buys the final
          book in your series from your direct store, ScribeCount identifies it as a series completion
          event based on AuthorVault catalog metadata. The email does not wait for a weekly send.
          A configurable wait period (default 3–5 days) fires after purchase — long enough to finish
          reading, short enough to catch momentum before it fades. Mid-series purchases use a
          shorter wait so the next-book recommendation arrives after the reader has finished, not before.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .sc-timing { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }

    .sct-callout {
      display: flex; align-items: flex-start; gap: .875rem;
      padding: .875rem 1rem;
      background: rgba(99,102,241,0.06); border: 1.5px solid rgba(99,102,241,0.2);
      border-radius: 12px;
    }
    .sct-callout-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(99,102,241,0.12); color: #6366f1;
      display: flex; align-items: center; justify-content: center;
    }
    .sct-callout-title { font-size: .875rem; font-weight: 700; color: #3730a3; margin: 0 0 .35rem; }
    .sct-callout-desc { font-size: .78rem; color: #374151; margin: 0; line-height: 1.6; }

    .sct-decay { background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 1rem; }
    .sct-decay-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .75rem; }
    .sct-decay-bars { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .75rem; }
    .sct-bar-row { display: flex; align-items: center; gap: .75rem; }
    .sct-bar-label { font-size: .72rem; color: #374151; min-width: 90px; flex-shrink: 0; }
    .sct-bar-track { flex: 1; height: 8px; background: #e2e8f0; border-radius: 100px; overflow: hidden; }
    .sct-bar-fill { height: 100%; border-radius: 100px; transition: width .8s; }
    .sct-bar-val { font-size: .75rem; font-weight: 700; min-width: 36px; text-align: right; }
    .sct-decay-note { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.5; }

    .sct-trigger-note {
      padding: .875rem 1rem;
      background: rgba(245,158,11,0.04); border: 1.5px solid rgba(245,158,11,0.15);
      border-radius: 10px;
    }
    .sct-tn-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .375rem; color: #d97706; }
    .sct-tn-title { font-size: .78rem; font-weight: 700; color: #0f172a; }
    .sct-tn-desc { font-size: .75rem; color: #374151; margin: 0; line-height: 1.55; }
  `]
})
export class ScTimingComponent {
  decayData = [
    { label: 'Within 48 hours', pct: 82, color: '#059669' },
    { label: '3–5 days', pct: 64, color: '#3b82f6' },
    { label: '1 week', pct: 41, color: '#d97706' },
    { label: '2 weeks', pct: 22, color: '#ef4444' },
  ];
}
