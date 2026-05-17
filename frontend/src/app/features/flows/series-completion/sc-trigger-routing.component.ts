import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-trigger-routing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-route">
      <h4 class="scr-title">How ScribeCount triggers and routes the flow</h4>
      <p class="scr-sub">
        The series completion flow is purchase-triggered, AuthorVault-informed, and routed by
        catalog position — not by a generic one-size-fits-all send.
      </p>

      <div class="scr-steps">
        <div class="scr-step" *ngFor="let step of triggerSteps; let last = last">
          <div class="scr-step-line" *ngIf="!last"></div>
          <div class="scr-step-icon" [style.background]="step.color">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
              <path [attr.d]="step.icon"/>
            </svg>
          </div>
          <div class="scr-step-body">
            <span class="scr-step-label">{{ step.label }}</span>
            <p class="scr-step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <div class="scr-routing-grid">
        <h5 class="scr-grid-title">Conditional routing by series position</h5>
        <div class="scr-route-card" *ngFor="let r of routes">
          <div class="scr-route-header">
            <span class="scr-route-dot" [style.background]="r.color"></span>
            <span class="scr-route-name">{{ r.purchase }}</span>
          </div>
          <p class="scr-route-action">{{ r.routesTo }}</p>
          <span class="scr-route-wait">{{ r.wait }}</span>
        </div>
      </div>

      <div class="scr-footnote">
        <svg viewBox="0 0 20 20" fill="#94a3b8" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Most direct store platforms track purchase events, not reading completion. Purchase of
          the final installment is the primary trigger. Reading-progress triggers are supported
          where your store integration provides that data.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .sc-route { margin-bottom: 1.25rem; }
    .scr-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .scr-sub { font-size: .75rem; color: #64748b; margin: 0 0 1rem; line-height: 1.5; }

    .scr-steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 1rem; }
    .scr-step { display: flex; align-items: flex-start; gap: .75rem; position: relative; padding-bottom: .875rem; }
    .scr-step:last-child { padding-bottom: 0; }
    .scr-step-line {
      position: absolute; left: 11px; top: 28px; bottom: 0;
      width: 2px; background: #e2e8f0;
    }
    .scr-step-icon {
      width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; z-index: 1;
      color: #fff; display: flex; align-items: center; justify-content: center;
    }
    .scr-step-label { font-size: .78rem; font-weight: 700; color: #0f172a; display: block; margin-bottom: .2rem; }
    .scr-step-desc { font-size: .72rem; color: #374151; margin: 0; line-height: 1.5; }

    .scr-routing-grid { margin-bottom: .875rem; }
    .scr-grid-title {
      font-size: .72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem;
    }
    .scr-route-card {
      padding: .625rem .75rem; margin-bottom: .375rem;
      background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 9px;
    }
    .scr-route-card:last-child { margin-bottom: 0; }
    .scr-route-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .25rem; }
    .scr-route-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .scr-route-name { font-size: .75rem; font-weight: 600; color: #0f172a; }
    .scr-route-action { font-size: .72rem; color: #374151; margin: 0 0 .2rem; line-height: 1.45; }
    .scr-route-wait { font-size: .68rem; color: #6366f1; font-weight: 600; }

    .scr-footnote {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .7rem; color: #64748b; line-height: 1.5;
      padding: .5rem .625rem; background: #f8fafc; border-radius: 8px;
    }
  `]
})
export class ScTriggerRoutingComponent {
  triggerSteps = [
    {
      label: 'Purchase event fires',
      desc:
        'When a reader buys a book from your direct store, ScribeCount receives the purchase in real time and identifies the title\'s series position from AuthorVault metadata — final installment, mid-series, or standalone.',
      color: '#6366f1',
      icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    },
    {
      label: 'Wait period (dwell)',
      desc:
        'Default: 3–5 days after final-book purchase — long enough to finish reading, short enough to catch momentum. Mid-series purchases use a shorter wait. Both are configurable in the flow builder.',
      color: '#3b82f6',
      icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
    },
    {
      label: 'Catalog position check',
      desc:
        'ScribeCount cross-references purchase history against your AuthorVault catalog structure to determine which of the four scenario emails to send.',
      color: '#d97706',
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    },
    {
      label: 'Goal exit on purchase',
      desc:
        'If the reader purchases the recommended next title, the flow exits cleanly and the post-purchase sequence handles the new purchase. If not, they return to your standard newsletter and campaign audience.',
      color: '#059669',
      icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    },
  ];

  routes = [
    {
      purchase: 'Final book + more series in catalog',
      routesTo: 'Next-series recommendation email with shared-world or tonal bridge',
      wait: 'Wait: 3–5 days (configurable)',
      color: '#6366f1',
    },
    {
      purchase: 'Final book + only standalones remain',
      routesTo: 'Standalone recommendation — lead with emotional register continuity',
      wait: 'Wait: 3–5 days (configurable)',
      color: '#3b82f6',
    },
    {
      purchase: 'Mid-series book (non-final)',
      routesTo: 'In-series continuation — direct next-book recommendation',
      wait: 'Wait: shorter than series-end (few days after purchase)',
      color: '#059669',
    },
    {
      purchase: 'Final book + catalog exhausted',
      routesTo: 'Relationship-deepening email — no purchase ask',
      wait: 'Wait: 3–5 days (configurable)',
      color: '#d97706',
    },
  ];
}
