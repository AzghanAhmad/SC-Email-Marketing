import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flow-building-blocks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="blocks-panel">
      <h3 class="panel-title">How a Flow Works</h3>
      <p class="panel-intro">Every flow is made of four building blocks. Understanding them helps you design flows intentionally.</p>

      <div class="blocks-list">

        <div class="block-item" *ngFor="let block of blocks">
          <div class="block-icon" [ngClass]="'icon-' + block.type">
            <svg *ngIf="block.type === 'trigger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <svg *ngIf="block.type === 'wait'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <svg *ngIf="block.type === 'condition'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <svg *ngIf="block.type === 'goal-exit'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg *ngIf="block.type === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div class="block-text">
            <p class="block-name">{{ block.name }}</p>
            <p class="block-desc">{{ block.desc }}</p>
          </div>
        </div>

      </div>

      <!-- Quiet hours note -->
      <div class="quiet-hours-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <span><strong>Quiet hours</strong> are applied to all flows by default — a flow that triggers at midnight sends at a reasonable morning hour.</span>
      </div>

      <!-- Campaigns vs Flows callout -->
      <div class="callout-block">
        <p class="callout-text">Campaigns deliver shared moments to your whole list at once. Flows deliver personal moments to each reader at exactly the right point in their individual journey.</p>
      </div>

      <!-- Start Small guidance -->
      <div class="start-small">
        <p class="start-small-title">Start Small, Build Deliberately</p>
        <p class="start-small-body">A flow that runs well is worth more than six flows that run poorly. Build in this order:</p>
        <div class="start-small-items">
          <div class="start-small-item" *ngFor="let item of startSmallItems">
            <span class="start-small-badge" [ngClass]="'priority-' + item.priority">{{ item.label }}</span>
            <span class="start-small-desc">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blocks-panel {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.375rem;
    }
    .panel-title {
      font-size: .75rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .07em; margin: 0 0 .5rem;
    }
    .panel-intro {
      font-size: .8rem; color: #64748b; margin: 0 0 1.25rem; line-height: 1.5;
    }

    .blocks-list { display: flex; flex-direction: column; gap: .625rem; margin-bottom: 1.25rem; }

    .block-item {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .625rem; border-radius: 10px; background: #f8fafc;
      border: 1px solid #f1f5f9; transition: background .15s, border-color .15s;
    }
    .block-item:hover { background: #f0f7ff; border-color: #bfdbfe; }

    .block-icon {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-trigger { background: rgba(245,158,11,.1); color: #d97706; }
    .icon-wait { background: #f1f5f9; color: #64748b; }
    .icon-condition { background: rgba(139,92,246,.1); color: #8b5cf6; }
    .icon-goal-exit { background: rgba(16,185,129,.1); color: #059669; }
    .icon-email { background: rgba(59,130,246,.1); color: #3b82f6; }

    .block-name { font-size: .8125rem; font-weight: 600; color: #0f172a; margin: 0 0 .15rem; }
    .block-desc { font-size: .75rem; color: #94a3b8; margin: 0; line-height: 1.4; }

    .quiet-hours-note {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .625rem .75rem; border-radius: 10px;
      background: rgba(99,102,241,.06); border: 1px solid rgba(99,102,241,.15);
      font-size: .75rem; color: #4338ca; line-height: 1.45; margin-bottom: 1rem;
    }
    .quiet-hours-note svg { flex-shrink: 0; margin-top: 1px; }
    .quiet-hours-note strong { font-weight: 700; }

    .callout-block {
      padding: .875rem 1rem; border-left: 3px solid #3b82f6;
      background: #f0f7ff; border-radius: 0 10px 10px 0;
    }
    .callout-text {
      font-size: .8rem; color: #1e40af; font-style: italic;
      margin: 0; line-height: 1.55;
    }

    /* Start Small */
    .start-small {
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: .875rem; display: flex; flex-direction: column; gap: .625rem;
    }
    .start-small-title {
      font-size: .75rem; font-weight: 700; color: #0f172a; margin: 0;
    }
    .start-small-body {
      font-size: .75rem; color: #64748b; margin: 0; line-height: 1.4;
    }
    .start-small-items { display: flex; flex-direction: column; gap: .375rem; }
    .start-small-item {
      display: flex; align-items: flex-start; gap: .5rem; font-size: .75rem;
    }
    .start-small-badge {
      padding: .15rem .5rem; border-radius: 20px; flex-shrink: 0;
      font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    }
    .priority-day-one { background: #fef9c3; color: #ca8a04; }
    .priority-pre-store { background: #dcfce7; color: #16a34a; }
    .priority-pre-launch { background: #dbeafe; color: #2563eb; }
    .priority-mature { background: #f3e8ff; color: #7c3aed; }
    .start-small-desc { color: #64748b; line-height: 1.4; }
  `]
})
export class FlowBuildingBlocksComponent {
  blocks = [
    {
      type: 'trigger',
      name: 'Trigger',
      desc: 'The event that starts the flow for a specific reader. Can be list-side (new subscriber, link click), purchase-side (completed order, abandoned cart, preorder), or time-based (renewal date, subscriber anniversary). Connects the flow to real reader behavior.'
    },
    {
      type: 'wait',
      name: 'Wait',
      desc: 'The pause between steps that gives a flow its timing intelligence. An abandoned cart reminder sent 3 hours after abandonment is a well-timed nudge. The same reminder sent 3 seconds after feels surveillance-like; sent 3 days later, it feels disconnected.'
    },
    {
      type: 'condition',
      name: 'Condition',
      desc: 'A decision point that checks what the reader did and routes them differently depending on the answer. Did they click the link? Buy the book? Stay silent through the whole re-engagement sequence? Conditions make flows adaptive rather than linear.'
    },
    {
      type: 'goal-exit',
      name: 'Goal Exit',
      desc: 'The condition that tells a flow its work is finished for a specific reader and removes them from the sequence. Prevents flows from becoming awkward or redundant — readers who take the desired action move on rather than continuing to receive emails for a situation that no longer applies.'
    },
  ];

  startSmallItems = [
    { priority: 'day-one', label: 'Day One', desc: 'Welcome Sequence — highest open rates you will ever see' },
    { priority: 'pre-store', label: 'Pre-Store', desc: 'Order Confirmation, Digital Delivery, Abandoned Cart' },
    { priority: 'pre-launch', label: 'Pre-Launch', desc: 'Preorder Confirmation, Fulfillment, Review Request' },
    { priority: 'mature', label: 'Mature List', desc: 'Re-engagement + Milestone flows as your list grows' },
  ];
}
