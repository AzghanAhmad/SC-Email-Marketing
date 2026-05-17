import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preorder-three-phases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="three-phases">
      <h4 class="tp-title">Three Connected Phases</h4>
      <p class="tp-sub">Together they transform a long silent gap into an experience that deepens the reader's investment before they've read a single page.</p>

      <div class="tp-timeline">
        <div class="tp-phase" *ngFor="let phase of phases; let last = last">
          <div class="tp-phase-left">
            <div class="tp-phase-dot" [style.background]="phase.color"></div>
            <div class="tp-phase-line" *ngIf="!last"></div>
          </div>
          <div class="tp-phase-body">
            <div class="tp-phase-header">
              <span class="tp-phase-name">{{ phase.name }}</span>
              <span class="tp-phase-timing">{{ phase.timing }}</span>
            </div>
            <p class="tp-phase-desc">{{ phase.desc }}</p>
            <div class="tp-phase-job">
              <svg viewBox="0 0 20 20" fill="#059669" width="11" height="11">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
              </svg>
              <span>{{ phase.job }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tp-anchor-note">
        <div class="tp-anchor-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="tp-anchor-title">Release date as the flow's anchor</span>
        </div>
        <p class="tp-anchor-desc">
          Unlike post-purchase and abandoned cart flows — which are triggered by events and measured
          in hours — the preorder nurture sequence is anchored to your release date. ScribeCount
          calculates the send schedule for every nurture email relative to that anchor. If your
          release date changes, updating it automatically reschedules every email in the sequence.
          You change the anchor; the flow adjusts with it.
        </p>
        <div class="tp-late-joiner">
          <svg viewBox="0 0 20 20" fill="#3b82f6" width="12" height="12">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
          </svg>
          <span>
            <strong>Late-joiner positioning:</strong> A reader who preorders 6 weeks before release
            receives the full nurture sequence. A reader who preorders 2 weeks before release enters
            the flow at the correct point — receiving only the emails that haven't already sent to
            day-one preorders. ScribeCount handles this automatically.
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .three-phases { margin-bottom: 1.25rem; }
    .tp-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .tp-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .tp-timeline { display: flex; flex-direction: column; margin-bottom: .875rem; }
    .tp-phase { display: flex; gap: .75rem; }
    .tp-phase-left { display: flex; flex-direction: column; align-items: center; width: 16px; flex-shrink: 0; }
    .tp-phase-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; margin-top: .25rem; }
    .tp-phase-line { width: 2px; flex: 1; background: #e2e8f0; margin: .25rem 0; min-height: 20px; }

    .tp-phase-body { flex: 1; padding-bottom: 1rem; }
    .tp-phase-header { display: flex; align-items: center; gap: .625rem; margin-bottom: .3rem; flex-wrap: wrap; }
    .tp-phase-name { font-size: .875rem; font-weight: 700; color: #0f172a; }
    .tp-phase-timing { font-size: .7rem; color: #94a3b8; font-style: italic; }
    .tp-phase-desc { font-size: .78rem; color: #374151; margin: 0 0 .375rem; line-height: 1.5; }
    .tp-phase-job {
      display: flex; align-items: flex-start; gap: .35rem;
      font-size: .72rem; color: #059669; line-height: 1.4;
    }

    .tp-anchor-note {
      background: rgba(59,130,246,0.04); border: 1.5px solid rgba(59,130,246,0.15);
      border-radius: 12px; padding: .875rem 1rem;
    }
    .tp-anchor-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .375rem; color: #3b82f6; }
    .tp-anchor-title { font-size: .78rem; font-weight: 700; color: #0f172a; }
    .tp-anchor-desc { font-size: .75rem; color: #374151; margin: 0 0 .625rem; line-height: 1.55; }
    .tp-late-joiner {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .45rem .625rem; background: #fff;
      border-radius: 7px; border: 1px solid #e2e8f0;
    }
    .tp-late-joiner strong { color: #0f172a; }
  `]
})
export class PreorderThreePhasesComponent {
  phases = [
    {
      name: 'Phase 1 — Preorder Confirmation',
      timing: 'Fires within seconds of preorder',
      color: '#6366f1',
      desc: 'Confirms the transaction, clarifies billing timing, acknowledges the reader\'s advance commitment, and sets expectations for what comes next. "Preorder readers hear from me before anyone else does."',
      job: 'Honors the commitment the moment it\'s made — transforms a receipt into the opening of a personal correspondence'
    },
    {
      name: 'Phase 2 — Nurture Sequence',
      timing: '7 weeks → 1 week before release',
      color: '#3b82f6',
      desc: 'Two to four emails anchored to the release date: Behind-the-Scenes (exclusive personal note), Excerpt (first chapter or scene), Cover Story (design process and insider detail), Countdown (drumroll before the payoff).',
      job: 'Keeps enthusiasm actively engaged through the wait — prevents the reader drift that turns a preorder into a forgotten charge'
    },
    {
      name: 'Phase 3 — Preorder Fulfillment',
      timing: 'Release day — before general public',
      color: '#059669',
      desc: 'Celebration-first email delivering the book. Acknowledges the reader\'s role in the launch. Plants the review seed. Transitions reader to the standard post-purchase flow.',
      job: 'Delivers the payoff in a way that makes the wait feel completely worthwhile — and turns a preorder reader into a lifelong fan'
    },
  ];
}
