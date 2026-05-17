import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-authorvault',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-av">
      <div class="sc-av-main">
        <div class="sc-av-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Using AuthorVault for recommendation accuracy</span>
        </div>
        <p class="sc-av-desc">
          When you build the flow email, pull your recommended title's cover image, series position,
          and metadata directly from AuthorVault rather than re-entering it manually. As your catalog
          grows and the best "read next" recommendation changes — because you've added a new series or
          completed a trilogy that makes a stronger continuation argument — updating the recommendation
          draws from updated catalog data instead of requiring a full email rewrite.
        </p>
        <div class="sc-av-features">
          <div class="sc-av-feat" *ngFor="let f of features">
            <svg viewBox="0 0 20 20" fill="#6366f1" width="11" height="11">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>{{ f }}</span>
          </div>
        </div>
      </div>

      <div class="sc-av-maint">
        <h5 class="sc-av-maint-title">Keep the flow current as your catalog grows</h5>
        <p class="sc-av-maint-desc">
          A flow you built when you had two series may need updating when you have five — the best next
          recommendation for a reader who finishes Series A may have changed now that Series D exists.
          Sending readers to the wrong next book is worse than sending no recommendation at all.
        </p>
        <div class="sc-av-maint-tip">
          <svg viewBox="0 0 20 20" fill="#3b82f6" width="12" height="12">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
          </svg>
          <span>
            ScribeCount's flow maintenance reminders prompt quarterly review — confirming recommendations
            are still your best offer, links still work, and AuthorVault metadata is accurate.
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-av { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .75rem; }

    .sc-av-main {
      background: rgba(99,102,241,0.04); border: 1.5px solid rgba(99,102,241,0.15);
      border-radius: 12px; padding: 1rem;
    }
    .sc-av-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #6366f1; margin-bottom: .5rem;
    }
    .sc-av-desc { font-size: .78rem; color: #374151; margin: 0 0 .75rem; line-height: 1.6; }
    .sc-av-features { display: flex; flex-direction: column; gap: .35rem; }
    .sc-av-feat {
      display: flex; align-items: flex-start; gap: .35rem;
      font-size: .72rem; color: #374151; line-height: 1.4;
    }

    .sc-av-maint {
      background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 1rem;
    }
    .sc-av-maint-title { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .sc-av-maint-desc { font-size: .75rem; color: #374151; margin: 0 0 .625rem; line-height: 1.55; }
    .sc-av-maint-tip {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .45rem .625rem; background: #fff; border-radius: 7px; border: 1px solid #e2e8f0;
    }
  `]
})
export class ScAuthorvaultComponent {
  features = [
    'Series position stored in AuthorVault informs automatic routing (final, mid-series, standalone)',
    'Cover images and metadata pulled directly into flow emails — no manual re-entry',
    'Purchase history cross-referenced to identify near-completers and catalog-exhausted readers',
    'Recommendation content stays current as catalog evolves without rebuilding the flow',
  ];
}
