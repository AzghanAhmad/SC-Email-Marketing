import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-walkthrough-triggers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wt-section">

      <!-- Store connection -->
      <h3 class="wt-subheading">How flows connect to your store and delivery service</h3>

      <p class="wt-body">
        ScribeCount email flows are designed to work in direct communication with your author
        website store and your digital delivery service, creating a seamless end-to-end experience
        for your reader from the moment they discover your book to the moment they download it.
      </p>

      <!-- Store chain diagram -->
      <div class="wt-chain">
        <div class="wt-chain-step" *ngFor="let step of storeChain; let last = last">
          <div class="wt-chain-node" [ngClass]="step.color">
            <svg [attr.viewBox]="step.icon.viewBox" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <ng-container *ngIf="step.icon.id === 'cart'">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </ng-container>
              <ng-container *ngIf="step.icon.id === 'purchase'">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </ng-container>
              <ng-container *ngIf="step.icon.id === 'delivery'">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </ng-container>
              <ng-container *ngIf="step.icon.id === 'followup'">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </ng-container>
            </svg>
          </div>
          <div class="wt-chain-text">
            <span class="wt-chain-label">{{ step.label }}</span>
            <span class="wt-chain-desc">{{ step.desc }}</span>
          </div>
          <div class="wt-chain-arrow" *ngIf="!last">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>

      <p class="wt-body">
        Every step in that chain — cart, purchase, delivery, follow-up — is connected. No manual
        handoff is required. The three systems talk to each other through a set of signals called
        <strong>triggers</strong>, which are the engine that makes the entire flow run.
      </p>

      <!-- Triggers -->
      <h3 class="wt-subheading">Triggers</h3>

      <p class="wt-body">
        A trigger is the event that starts a flow. It is the "if this happens" in the logic of your
        email automation. Without a trigger, nothing fires. Every flow in the ScribeCount system
        begins with a trigger, and that trigger is always connected to something a reader does —
        or stops doing.
      </p>

      <p class="wt-body">Triggers fall into three broad categories:</p>

      <div class="wt-triggers-list">
        <div class="wt-trigger-card" *ngFor="let t of triggerTypes">
          <div class="wt-trigger-header">
            <div class="wt-trigger-icon" [ngClass]="t.color">
              <svg [attr.viewBox]="t.icon.viewBox" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <ng-container *ngIf="t.icon.id === 'action'">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </ng-container>
                <ng-container *ngIf="t.icon.id === 'time'">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </ng-container>
                <ng-container *ngIf="t.icon.id === 'inaction'">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </ng-container>
              </svg>
            </div>
            <div>
              <p class="wt-trigger-name">{{ t.name }}</p>
              <p class="wt-trigger-tagline">{{ t.tagline }}</p>
            </div>
          </div>
          <p class="wt-trigger-desc">{{ t.desc }}</p>
          <div class="wt-trigger-examples">
            <span class="wt-trigger-example" *ngFor="let ex of t.examples">{{ ex }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .wt-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .wt-body { font-size: .875rem; color: #334155; line-height: 1.65; margin: 0; }
    .wt-body strong { font-weight: 700; color: #0f172a; }
    .wt-subheading {
      font-size: .8rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .07em; margin: 0;
    }

    /* Store chain */
    .wt-chain {
      display: flex; align-items: stretch; gap: 0;
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: 1rem; flex-wrap: wrap; gap: .5rem;
    }
    .wt-chain-step {
      display: flex; align-items: center; gap: .5rem; flex: 1; min-width: 140px;
    }
    .wt-chain-node {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-chain-node.blue { background: rgba(59,130,246,.1); color: #3b82f6; }
    .wt-chain-node.green { background: rgba(16,185,129,.1); color: #059669; }
    .wt-chain-node.purple { background: rgba(139,92,246,.1); color: #8b5cf6; }
    .wt-chain-node.amber { background: rgba(245,158,11,.1); color: #d97706; }
    .wt-chain-text { display: flex; flex-direction: column; gap: .1rem; flex: 1; }
    .wt-chain-label { font-size: .8rem; font-weight: 700; color: #0f172a; }
    .wt-chain-desc { font-size: .72rem; color: #94a3b8; line-height: 1.3; }
    .wt-chain-arrow { color: #cbd5e1; flex-shrink: 0; }

    /* Trigger cards */
    .wt-triggers-list { display: flex; flex-direction: column; gap: .75rem; }
    .wt-trigger-card {
      padding: 1rem; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
      display: flex; flex-direction: column; gap: .625rem;
    }
    .wt-trigger-header { display: flex; align-items: flex-start; gap: .75rem; }
    .wt-trigger-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-trigger-icon.amber { background: rgba(245,158,11,.1); color: #d97706; }
    .wt-trigger-icon.blue { background: rgba(59,130,246,.1); color: #3b82f6; }
    .wt-trigger-icon.rose { background: rgba(244,63,94,.1); color: #e11d48; }
    .wt-trigger-name { font-size: .875rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .wt-trigger-tagline { font-size: .75rem; color: #94a3b8; margin: 0; }
    .wt-trigger-desc { font-size: .8125rem; color: #334155; line-height: 1.55; margin: 0; }
    .wt-trigger-examples { display: flex; flex-wrap: wrap; gap: .375rem; }
    .wt-trigger-example {
      padding: .2rem .6rem; background: #f1f5f9; border-radius: 20px;
      font-size: .72rem; color: #64748b; font-weight: 500;
    }
  `]
})
export class WalkthroughTriggersComponent {
  storeChain = [
    {
      label: 'Cart',
      desc: 'Reader adds book, store records action',
      color: 'blue',
      icon: { id: 'cart', viewBox: '0 0 24 24' }
    },
    {
      label: 'Purchase',
      desc: 'Completion triggers order confirmation + delivery signal',
      color: 'green',
      icon: { id: 'purchase', viewBox: '0 0 24 24' }
    },
    {
      label: 'Delivery',
      desc: 'File ready — unique download link sent instantly',
      color: 'purple',
      icon: { id: 'delivery', viewBox: '0 0 24 24' }
    },
    {
      label: 'Follow-up',
      desc: 'If link not clicked in 48 hrs, reminder fires automatically',
      color: 'amber',
      icon: { id: 'followup', viewBox: '0 0 24 24' }
    },
  ];

  triggerTypes = [
    {
      name: 'Action Triggers',
      tagline: 'Fire when a reader takes a specific step',
      color: 'amber',
      icon: { id: 'action', viewBox: '0 0 24 24' },
      desc: 'The most common triggers in a well-built author system because they respond directly to reader intent — the reader did something that signals where they are in their journey, and the flow responds accordingly.',
      examples: ['Subscribes to list', 'Completes a purchase', 'Clicks a link', 'Downloads a file', 'Joins reader community']
    },
    {
      name: 'Time-Based Triggers',
      tagline: 'Fire on a specific date or after a period has elapsed',
      color: 'blue',
      icon: { id: 'time', viewBox: '0 0 24 24' },
      desc: 'Powerful because they let you reach readers at precisely the right moment without having to track the calendar yourself. A book launch email scheduled for release day. A renewal reminder sent seven days before a billing date. A re-engagement email sent 90 days after a reader last opened one of your messages.',
      examples: ['Release day broadcast', 'Renewal reminder 7 days out', 'Re-engagement at 90 days', 'Anniversary milestone']
    },
    {
      name: 'Inaction Triggers',
      tagline: 'Fire when a reader does NOT do something within a defined window',
      color: 'rose',
      icon: { id: 'inaction', viewBox: '0 0 24 24' },
      desc: 'Especially important for list hygiene and cart recovery because they catch readers who slipped through the cracks without requiring manual monitoring. If a reader receives a digital delivery email but has not clicked the download link after 48 hours, that inaction triggers a follow-up.',
      examples: ['Download not clicked in 48 hrs', 'No open in 180 days', 'Cart abandoned', 'Checkout not completed']
    },
  ];
}
