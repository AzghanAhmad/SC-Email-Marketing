import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-flow-path',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-path">
      <h4 class="rep-title">Flow path</h4>
      <p class="rep-sub">From inactivity trigger through re-engagement or clean removal</p>

      <div class="rep-steps">
        <div class="rep-step" *ngFor="let step of steps; let i = index">
          <div class="rep-step-num">{{ i + 1 }}</div>
          <div class="rep-step-body">
            <div class="rep-step-header">
              <span class="rep-step-type" [class]="step.type">{{ step.typeLabel }}</span>
              <span class="rep-step-name">{{ step.name }}</span>
            </div>
            <p class="rep-step-detail">{{ step.detail }}</p>
          </div>
        </div>
      </div>

      <div class="rep-goal">
        <svg viewBox="0 0 20 20" fill="#db2777" width="12" height="12">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
        </svg>
        <span><strong>Goal exit:</strong> Reader opens or clicks any re-engagement email — tagged re-engaged and returned to active list.</span>
      </div>
    </div>
  `,
  styles: [`
    .re-path { margin-bottom: 1.25rem; }
    .rep-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .2rem; }
    .rep-sub { font-size: .72rem; color: #94a3b8; margin: 0 0 .75rem; }

    .rep-steps { display: flex; flex-direction: column; gap: .375rem; margin-bottom: .75rem; }
    .rep-step {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .625rem .75rem; background: #fdf2f8;
      border: 1px solid #fce7f3; border-radius: 9px;
    }
    .rep-step-num {
      width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
      background: #fbcfe8; color: #9d174d; font-size: .65rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .rep-step-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .2rem; flex-wrap: wrap; }
    .rep-step-type {
      font-size: .6rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; padding: .1rem .35rem; border-radius: 4px;
    }
    .rep-step-type.trigger { background: rgba(219,39,119,0.12); color: #db2777; }
    .rep-step-type.wait { background: rgba(245,158,11,0.12); color: #d97706; }
    .rep-step-type.condition { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .rep-step-type.email { background: rgba(16,185,129,0.12); color: #059669; }
    .rep-step-type.goal-exit { background: rgba(219,39,119,0.2); color: #9d174d; }
    .rep-step-name { font-size: .75rem; font-weight: 600; color: #0f172a; }
    .rep-step-detail { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.45; }

    .rep-goal {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(219,39,119,0.05); border-radius: 8px;
    }
  `]
})
export class ReFlowPathComponent {
  steps = [
    { type: 'trigger', typeLabel: 'Trigger', name: 'Inactivity threshold crossed', detail: 'No open or click within your defined window (90, 120, or 180 days depending on send frequency).' },
    { type: 'email', typeLabel: 'Email', name: 'Email 1 — Warm check-in', detail: 'Low-pressure check-in. One clear CTA to confirm they want to stay on the list.' },
    { type: 'wait', typeLabel: 'Wait', name: 'Wait 5–7 days', detail: 'Gives the reader time to respond without feeling rushed.' },
    { type: 'condition', typeLabel: 'Condition', name: 'Engaged?', detail: 'If opened or clicked — goal exit, re-engaged tag applied. If not — continue.' },
    { type: 'email', typeLabel: 'Email', name: 'Email 2 — Last chance', detail: 'Shorter, matter-of-fact. Reader knows this is the last email before removal.' },
    { type: 'wait', typeLabel: 'Wait', name: 'Wait 2–3 days', detail: 'Brief pause before optional preference offer or removal.' },
    { type: 'condition', typeLabel: 'Condition', name: 'Still silent?', detail: 'Branch: send optional Email 3 (preference offer) or proceed to removal.' },
    { type: 'email', typeLabel: 'Email', name: 'Email 3 (optional) — Preference offer', detail: 'Offers frequency adjustment before binary stay-or-go. Best for weekly senders.' },
    { type: 'email', typeLabel: 'Email', name: "Author's Choice removal email", detail: 'Transparent notification of removal due to inactivity with re-subscribe path.' },
    { type: 'goal-exit', typeLabel: 'Goal Exit', name: 'Re-engaged or removed', detail: 'Engaged readers exit early. Unresponsive readers removed cleanly from active list.' },
  ];
}
