import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-walkthrough-flow-logic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wt-section">

      <!-- Wait times -->
      <h3 class="wt-subheading">Wait times and dwell periods</h3>

      <p class="wt-body">
        A wait time — also called a dwell period — is the pause built into a flow between one step
        and the next. It is the "then wait this long before doing the next thing" instruction that
        gives your automation a human rhythm rather than a robotic one.
      </p>

      <p class="wt-body">Wait times exist for a simple reason: readers need time.</p>

      <div class="wt-wait-examples">
        <div class="wt-wait-item" *ngFor="let w of waitExamples">
          <div class="wt-wait-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <span class="wt-wait-timing">{{ w.timing }}</span>
            <span class="wt-wait-reason">{{ w.reason }}</span>
          </div>
        </div>
      </div>

      <div class="wt-callout amber">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>
          Sending the next email too soon feels aggressive. Waiting too long loses the moment entirely.
          Every wait time shown in a flow is a recommended default based on best practices in reader
          marketing — and every single default is configurable. A thriller author with a fast-paced
          readership may find tighter timing works better. A literary fiction author may prefer longer
          gaps. The system gives you a smart starting point; you tune it to fit.
        </p>
      </div>

      <!-- Conditions -->
      <h3 class="wt-subheading">Conditions</h3>

      <p class="wt-body">
        A condition is a rule the system checks before deciding what to do next. Conditions are how
        your flows become intelligent rather than just sequential. Instead of sending every reader
        the same next email, the system pauses, evaluates something it knows about that reader,
        and then chooses the appropriate path.
      </p>

      <p class="wt-body">Conditions are always expressed as a question:</p>

      <div class="wt-conditions-grid">
        <div class="wt-condition-q" *ngFor="let q of conditionQuestions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          {{ q }}
        </div>
      </div>

      <p class="wt-body">
        The answer to that question determines which branch of the flow the reader follows.
        In the flow diagrams throughout this system, conditions appear as decision points.
        Every decision point has at least two exits: one for when the condition is met, and one
        for when it is not. This is what makes a flow adaptive rather than mechanical.
      </p>

      <!-- Branches -->
      <h3 class="wt-subheading">Branches</h3>

      <p class="wt-body">
        A branch is the path a reader takes after a condition is evaluated. Every decision point
        in a flow splits into at least two branches — typically a YES branch and a NO branch,
        though more complex flows can have additional paths.
      </p>

      <div class="wt-branches">
        <div class="wt-branch yes">
          <div class="wt-branch-header">
            <span class="wt-branch-badge yes">YES</span>
            <span class="wt-branch-title">Condition met</span>
          </div>
          <ul class="wt-branch-list">
            <li>A reader who clicked your call-to-action gets tagged as an engaged reader</li>
            <li>A subscriber who downloaded their file within 48 hours enters your standard post-purchase sequence</li>
          </ul>
        </div>
        <div class="wt-branch no">
          <div class="wt-branch-header">
            <span class="wt-branch-badge no">NO</span>
            <span class="wt-branch-title">Condition not met</span>
          </div>
          <ul class="wt-branch-list">
            <li>A reader who did not click your call-to-action follows into your standard broadcast list</li>
            <li>A subscriber who has not downloaded their file after 48 hours enters a delivery reminder flow</li>
          </ul>
        </div>
      </div>

      <div class="wt-callout blue">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <p>
          Branches are what allow a single flow to serve readers appropriately regardless of what
          they do. You build the logic once, and the system routes each individual reader to the
          experience that fits their behavior — automatically, at scale, without you making
          individual decisions about anyone.
        </p>
      </div>

    </div>
  `,
  styles: [`
    .wt-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .wt-body { font-size: .875rem; color: #334155; line-height: 1.65; margin: 0; }
    .wt-subheading {
      font-size: .8rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .07em; margin: 0;
    }

    /* Wait examples */
    .wt-wait-examples { display: flex; flex-direction: column; gap: .5rem; }
    .wt-wait-item {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .625rem .875rem; background: #f8fafc; border-radius: 10px;
      border: 1px solid #f1f5f9;
    }
    .wt-wait-icon { color: #64748b; flex-shrink: 0; margin-top: 1px; }
    .wt-wait-timing { font-size: .8125rem; font-weight: 700; color: #0f172a; margin-right: .375rem; }
    .wt-wait-reason { font-size: .8125rem; color: #64748b; }

    /* Callouts */
    .wt-callout {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: 1rem 1.125rem; border-radius: 0 12px 12px 0;
      font-size: .875rem; line-height: 1.6;
    }
    .wt-callout p { margin: 0; }
    .wt-callout svg { flex-shrink: 0; margin-top: 2px; }
    .wt-callout.amber {
      background: #fffbeb; border-left: 3px solid #f59e0b; color: #92400e;
    }
    .wt-callout.amber svg { color: #d97706; }
    .wt-callout.blue {
      background: #f0f7ff; border-left: 3px solid #3b82f6; color: #1e40af;
    }
    .wt-callout.blue svg { color: #3b82f6; }

    /* Conditions */
    .wt-conditions-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: .5rem;
    }
    @media (max-width: 600px) { .wt-conditions-grid { grid-template-columns: 1fr; } }
    .wt-condition-q {
      display: flex; align-items: center; gap: .5rem;
      padding: .5rem .75rem; background: #f8fafc; border-radius: 8px;
      border: 1px solid #e2e8f0; font-size: .8rem; color: #334155;
    }
    .wt-condition-q svg { flex-shrink: 0; color: #8b5cf6; }

    /* Branches */
    .wt-branches { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
    @media (max-width: 600px) { .wt-branches { grid-template-columns: 1fr; } }
    .wt-branch {
      padding: .875rem; border-radius: 12px; border: 1.5px solid;
    }
    .wt-branch.yes { background: #f0fdf4; border-color: #bbf7d0; }
    .wt-branch.no { background: #fff7ed; border-color: #fed7aa; }
    .wt-branch-header { display: flex; align-items: center; gap: .5rem; margin-bottom: .625rem; }
    .wt-branch-badge {
      padding: .15rem .5rem; border-radius: 6px;
      font-size: .7rem; font-weight: 800; letter-spacing: .05em;
    }
    .wt-branch-badge.yes { background: #dcfce7; color: #16a34a; }
    .wt-branch-badge.no { background: #ffedd5; color: #c2410c; }
    .wt-branch-title { font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .wt-branch-list {
      margin: 0; padding-left: 1.125rem;
      font-size: .8rem; color: #334155; line-height: 1.55;
      display: flex; flex-direction: column; gap: .375rem;
    }
  `]
})
export class WalkthroughFlowLogicComponent {
  waitExamples = [
    { timing: '1–2 days', reason: 'after welcome email — subscriber needs time to absorb before you send your author story' },
    { timing: '3–5 days', reason: 'after purchase — reader needs time to start reading before you ask for a review' },
    { timing: '1 hour', reason: 'after cart abandonment — reader needs time to decide they made a mistake before you remind them' },
    { timing: '7 days', reason: 'after re-engagement email — give them a full week to see and respond' },
  ];

  conditionQuestions = [
    'Has this reader purchased a book before?',
    'Did they click the call-to-action in the last email?',
    'Have they downloaded their file within the past 48 hours?',
    'Is their subscription on an annual or monthly plan?',
    'Have they opened any email in the last 90 days?',
    'Did they complete the checkout?',
  ];
}
