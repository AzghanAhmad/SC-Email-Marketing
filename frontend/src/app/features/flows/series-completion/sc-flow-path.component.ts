import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-flow-path',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-path">
      <h4 class="scp-title">Flow path</h4>
      <p class="scp-sub">Nine steps from purchase trigger to goal exit</p>

      <div class="scp-steps">
        <div class="scp-step" *ngFor="let step of steps; let i = index">
          <div class="scp-step-num">{{ i + 1 }}</div>
          <div class="scp-step-body">
            <div class="scp-step-header">
              <span class="scp-step-type" [class]="step.type">{{ step.typeLabel }}</span>
              <span class="scp-step-name">{{ step.name }}</span>
            </div>
            <p class="scp-step-detail">{{ step.detail }}</p>
          </div>
        </div>
      </div>

      <div class="scp-goal">
        <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
        </svg>
        <span><strong>Goal exit:</strong> Reader purchases the recommended next title — catalog read-through extended.</span>
      </div>
    </div>
  `,
  styles: [`
    .sc-path { margin-bottom: 1.25rem; }
    .scp-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .2rem; }
    .scp-sub { font-size: .72rem; color: #94a3b8; margin: 0 0 .75rem; }

    .scp-steps { display: flex; flex-direction: column; gap: .375rem; margin-bottom: .75rem; }
    .scp-step {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .625rem .75rem; background: #f8fafc;
      border: 1px solid #f1f5f9; border-radius: 9px;
    }
    .scp-step-num {
      width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
      background: #e2e8f0; color: #64748b; font-size: .65rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .scp-step-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .2rem; flex-wrap: wrap; }
    .scp-step-type {
      font-size: .6rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; padding: .1rem .35rem; border-radius: 4px;
    }
    .scp-step-type.trigger { background: rgba(99,102,241,0.12); color: #6366f1; }
    .scp-step-type.wait { background: rgba(245,158,11,0.12); color: #d97706; }
    .scp-step-type.condition { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .scp-step-type.email { background: rgba(16,185,129,0.12); color: #059669; }
    .scp-step-type.goal-exit { background: rgba(16,185,129,0.2); color: #047857; }
    .scp-step-name { font-size: .75rem; font-weight: 600; color: #0f172a; }
    .scp-step-detail { font-size: .7rem; color: #64748b; margin: 0; line-height: 1.45; }

    .scp-goal {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(16,185,129,0.06);
      border: 1px solid rgba(16,185,129,0.15); border-radius: 8px;
    }
  `]
})
export class ScFlowPathComponent {
  steps = [
    {
      type: 'trigger', typeLabel: 'Trigger',
      name: 'Series purchase detected',
      detail: 'Reader purchases a book from your direct store. ScribeCount identifies series position from AuthorVault metadata.',
    },
    {
      type: 'wait', typeLabel: 'Wait',
      name: 'Wait 3–5 days',
      detail: 'Configurable dwell period. Long enough to finish reading; short enough to catch emotional momentum. Mid-series uses a shorter wait.',
    },
    {
      type: 'condition', typeLabel: 'Condition',
      name: 'Catalog position check',
      detail: 'Cross-references purchase history against AuthorVault to route to one of four scenario emails.',
    },
    {
      type: 'email', typeLabel: 'Email',
      name: 'Scenario 1 — Next series recommendation',
      detail: 'Final book + more series available. Acknowledge milestone, single targeted next-series recommendation, one CTA.',
    },
    {
      type: 'email', typeLabel: 'Email',
      name: 'Scenario 2 — Standalone recommendation',
      detail: 'Final book + only standalones remain. Lead with emotional register continuity, not format difference.',
    },
    {
      type: 'email', typeLabel: 'Email',
      name: 'Scenario 3 — In-series continuation',
      detail: 'Mid-series purchase. Direct next-book recommendation without spoilers. Shorter wait than series-end.',
    },
    {
      type: 'email', typeLabel: 'Email',
      name: 'Scenario 4 — Catalog complete',
      detail: 'Reader has read everything. Relationship deepening — what\'s coming, community invite, exclusive content.',
    },
    {
      type: 'condition', typeLabel: 'Condition',
      name: 'Purchased next title?',
      detail: 'If yes — goal exit. If no — reader returns to standard newsletter and campaign audience.',
    },
    {
      type: 'goal-exit', typeLabel: 'Goal Exit',
      name: 'Read-through extended',
      detail: 'Reader purchased recommended next title. Post-purchase sequence handles the new purchase.',
    },
  ];
}
