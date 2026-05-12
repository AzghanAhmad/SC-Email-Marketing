import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-walkthrough-journey',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wt-section">

      <h3 class="wt-subheading">How it all works together</h3>

      <p class="wt-body">
        The best way to understand the full system is to follow one reader through it from
        beginning to end.
      </p>

      <!-- Journey timeline -->
      <div class="wt-journey">
        <div class="wt-journey-step" *ngFor="let step of journeySteps; let last = last">
          <div class="wt-journey-left">
            <div class="wt-journey-node" [ngClass]="step.color">
              <svg [attr.viewBox]="step.icon.viewBox" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <ng-container *ngIf="step.icon.id === 'discover'">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'cart'">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'purchase'">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'read'">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'followup'">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'sequel'">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'series'">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </ng-container>
                <ng-container *ngIf="step.icon.id === 'lapsed'">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </ng-container>
              </svg>
            </div>
            <div class="wt-journey-line" *ngIf="!last"></div>
          </div>
          <div class="wt-journey-content">
            <div class="wt-journey-header">
              <span class="wt-journey-title">{{ step.title }}</span>
              <span class="wt-journey-flow-badge" [ngClass]="step.color">{{ step.flowName }}</span>
            </div>
            <p class="wt-journey-desc">{{ step.desc }}</p>
            <div class="wt-journey-tag" *ngIf="step.tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Tag applied: <strong>{{ step.tag }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Closing callout -->
      <div class="wt-closing">
        <div class="wt-closing-stat">
          <span class="wt-closing-num">0</span>
          <span class="wt-closing-label">manual emails sent</span>
        </div>
        <div class="wt-closing-divider"></div>
        <p class="wt-closing-text">
          That entire reader journey — from cold browser to engaged superfan — was handled by
          your flows without a single manual email. Every message was timely, relevant, and
          personal. And while that reader was making that journey, the same system was
          simultaneously running the same logic for every other reader on your list, each on
          their own individual timeline.
        </p>
      </div>

      <div class="wt-final-callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <p>
          That is what email flows make possible. Not just automation — intelligent,
          reader-responsive marketing that works exactly as hard as you need it to, exactly
          when your readers need it most.
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

    /* Journey timeline */
    .wt-journey { display: flex; flex-direction: column; gap: 0; }
    .wt-journey-step { display: flex; gap: .875rem; }
    .wt-journey-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
    .wt-journey-node {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-journey-node.blue { background: rgba(59,130,246,.15); color: #3b82f6; }
    .wt-journey-node.amber { background: rgba(245,158,11,.15); color: #d97706; }
    .wt-journey-node.green { background: rgba(16,185,129,.15); color: #059669; }
    .wt-journey-node.purple { background: rgba(139,92,246,.15); color: #8b5cf6; }
    .wt-journey-node.indigo { background: rgba(99,102,241,.15); color: #6366f1; }
    .wt-journey-node.pink { background: rgba(236,72,153,.15); color: #db2777; }
    .wt-journey-node.teal { background: rgba(20,184,166,.15); color: #0d9488; }
    .wt-journey-node.slate { background: rgba(100,116,139,.15); color: #475569; }

    .wt-journey-line { width: 2px; flex: 1; background: #e2e8f0; min-height: 16px; }

    .wt-journey-content {
      padding-bottom: 1.25rem; flex: 1; min-width: 0;
    }
    .wt-journey-header {
      display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-bottom: .3rem;
    }
    .wt-journey-title { font-size: .875rem; font-weight: 700; color: #0f172a; }
    .wt-journey-flow-badge {
      padding: .15rem .5rem; border-radius: 20px;
      font-size: .68rem; font-weight: 700;
    }
    .wt-journey-flow-badge.blue { background: #dbeafe; color: #2563eb; }
    .wt-journey-flow-badge.amber { background: #fef3c7; color: #d97706; }
    .wt-journey-flow-badge.green { background: #dcfce7; color: #16a34a; }
    .wt-journey-flow-badge.purple { background: #ede9fe; color: #7c3aed; }
    .wt-journey-flow-badge.indigo { background: #e0e7ff; color: #4338ca; }
    .wt-journey-flow-badge.pink { background: #fce7f3; color: #be185d; }
    .wt-journey-flow-badge.teal { background: #ccfbf1; color: #0f766e; }
    .wt-journey-flow-badge.slate { background: #f1f5f9; color: #475569; }

    .wt-journey-desc { font-size: .8rem; color: #64748b; line-height: 1.5; margin: 0 0 .375rem; }
    .wt-journey-tag {
      display: inline-flex; align-items: center; gap: .3rem;
      font-size: .75rem; color: #6d28d9; background: #ede9fe;
      padding: .15rem .55rem; border-radius: 20px;
    }
    .wt-journey-tag strong { font-weight: 700; }

    /* Closing */
    .wt-closing {
      display: flex; align-items: center; gap: 1.25rem;
      padding: 1.125rem; background: #f8fafc; border-radius: 14px;
      border: 1.5px solid #e2e8f0;
    }
    .wt-closing-stat { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
    .wt-closing-num { font-size: 2.5rem; font-weight: 900; color: #3b82f6; letter-spacing: -.04em; line-height: 1; }
    .wt-closing-label { font-size: .7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; text-align: center; }
    .wt-closing-divider { width: 1px; height: 48px; background: #e2e8f0; flex-shrink: 0; }
    .wt-closing-text { font-size: .8125rem; color: #334155; line-height: 1.6; margin: 0; }

    /* Final callout */
    .wt-final-callout {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: 1rem 1.125rem; background: #f0f7ff;
      border-left: 3px solid #3b82f6; border-radius: 0 12px 12px 0;
      font-size: .875rem; color: #1e40af; line-height: 1.6;
    }
    .wt-final-callout p { margin: 0; }
    .wt-final-callout svg { flex-shrink: 0; margin-top: 2px; color: #3b82f6; }
  `]
})
export class WalkthroughJourneyComponent {
  journeySteps = [
    {
      title: 'Discovers your book via social post',
      flowName: 'No flow yet',
      color: 'slate',
      icon: { id: 'discover', viewBox: '0 0 24 24' },
      desc: 'Reader visits your store, browses, adds the book to their cart — then leaves without buying.',
      tag: null
    },
    {
      title: 'Cart abandoned',
      flowName: 'Abandoned Cart Flow',
      color: 'amber',
      icon: { id: 'cart', viewBox: '0 0 24 24' },
      desc: 'Abandoned cart flow fires automatically. A gentle reminder arrives one hour later.',
      tag: null
    },
    {
      title: 'Returns and completes purchase',
      flowName: 'Order Confirmation + Delivery',
      color: 'green',
      icon: { id: 'purchase', viewBox: '0 0 24 24' },
      desc: 'Order confirmation email and digital delivery email fire in quick succession. Download link delivered instantly.',
      tag: 'first-purchase'
    },
    {
      title: 'Finishes the book (day 3)',
      flowName: 'Post-Purchase Follow-up',
      color: 'blue',
      icon: { id: 'read', viewBox: '0 0 24 24' },
      desc: 'On day five, post-purchase follow-up fires — asking how they are enjoying it and pointing toward the next book in the series.',
      tag: null
    },
    {
      title: 'Clicks through and buys the sequel',
      flowName: 'Repeat Purchase Thank You',
      color: 'indigo',
      icon: { id: 'sequel', viewBox: '0 0 24 24' },
      desc: 'Repeat purchase thank you fires. Reader is tagged as a superfan and enters the series completion sequence.',
      tag: 'superfan'
    },
    {
      title: 'Finishes the series',
      flowName: 'Series Completion Flow',
      color: 'purple',
      icon: { id: 'series', viewBox: '0 0 24 24' },
      desc: 'Series completion flow fires — celebrating their achievement and introducing your next release.',
      tag: 'series-complete'
    },
    {
      title: 'Goes quiet six months later',
      flowName: 'Re-engagement Flow',
      color: 'pink',
      icon: { id: 'lapsed', viewBox: '0 0 24 24' },
      desc: 'Re-engagement flow reaches out with a low-pressure check-in to bring them back before they drift away permanently.',
      tag: null
    },
  ];
}
