import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-purchase-conditional-routing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="routing-panel">
      <div class="routing-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span class="routing-title">Conditional Routing — Automatic</span>
        <span class="routing-badge">Built-in</span>
      </div>
      <p class="routing-desc">
        When a purchase event arrives, ScribeCount checks the reader's purchase history in real time
        and routes them to the correct thank you flow automatically. No manual list management or
        duplicate suppression required.
      </p>
      <div class="routing-diagram">
        <div class="rd-trigger">
          <div class="rd-trigger-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <span>Purchase completed</span>
        </div>
        <div class="rd-arrow-down"></div>
        <div class="rd-condition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          First purchase on record?
        </div>
        <div class="rd-branches">
          <div class="rd-branch yes">
            <div class="rd-branch-label yes-label">Yes — first-time buyer</div>
            <div class="rd-branch-arrow"></div>
            <div class="rd-outcome first">
              <span class="rd-outcome-name">Post-Purchase Thank You</span>
              <span class="rd-outcome-desc">Warm welcome, genuine appreciation, one soft next step</span>
            </div>
          </div>
          <div class="rd-branch no">
            <div class="rd-branch-label no-label">No — returning buyer</div>
            <div class="rd-branch-arrow"></div>
            <div class="rd-outcome repeat">
              <span class="rd-outcome-name">Repeat Purchase Thank You</span>
              <span class="rd-outcome-desc">Warmer, more personal, acknowledges loyalty explicitly</span>
            </div>
          </div>
        </div>
      </div>
      <div class="routing-note">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          For authors with multiple series, the conditional logic can be further refined: a reader
          buying within the same series for the second time gets a different message than a reader
          crossing into a new series for the first time.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .routing-panel {
      background: rgba(59,130,246,0.04);
      border: 1.5px solid rgba(59,130,246,0.15);
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .routing-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; color: #3b82f6;
    }
    .routing-title { font-size: .875rem; font-weight: 700; color: #0f172a; }
    .routing-badge {
      font-size: .65rem; font-weight: 700; padding: .15rem .45rem;
      background: rgba(59,130,246,0.1); color: #3b82f6;
      border-radius: 100px; text-transform: uppercase; letter-spacing: .04em; margin-left: .25rem;
    }
    .routing-desc { font-size: .78rem; color: #64748b; margin: 0 0 1rem; line-height: 1.55; }

    .routing-diagram { display: flex; flex-direction: column; align-items: center; gap: 0; margin-bottom: .875rem; }
    .rd-trigger {
      display: flex; align-items: center; gap: .5rem;
      padding: .5rem .875rem; background: #fff;
      border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: .78rem; font-weight: 600; color: #0f172a;
    }
    .rd-trigger-icon {
      width: 24px; height: 24px; border-radius: 6px;
      background: rgba(16,185,129,0.1); color: #059669;
      display: flex; align-items: center; justify-content: center;
    }
    .rd-arrow-down {
      width: 2px; height: 20px; background: #e2e8f0; margin: 0 auto;
    }
    .rd-condition {
      display: flex; align-items: center; gap: .4rem;
      padding: .45rem .875rem; background: rgba(139,92,246,0.08);
      border: 1.5px solid rgba(139,92,246,0.2); border-radius: 8px;
      font-size: .78rem; font-weight: 600; color: #7c3aed;
    }
    .rd-branches {
      display: grid; grid-template-columns: 1fr 1fr; gap: .75rem;
      width: 100%; margin-top: .5rem;
    }
    .rd-branch { display: flex; flex-direction: column; align-items: center; gap: 0; }
    .rd-branch-label {
      font-size: .7rem; font-weight: 700; padding: .2rem .55rem;
      border-radius: 100px; margin-bottom: .375rem;
    }
    .yes-label { background: rgba(16,185,129,0.1); color: #059669; }
    .no-label { background: rgba(59,130,246,0.1); color: #2563eb; }
    .rd-branch-arrow {
      width: 2px; height: 16px; background: #e2e8f0;
    }
    .rd-outcome {
      width: 100%; padding: .625rem .75rem; border-radius: 8px;
      display: flex; flex-direction: column; gap: .2rem; margin-top: .375rem;
    }
    .rd-outcome.first { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); }
    .rd-outcome.repeat { background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.2); }
    .rd-outcome-name { font-size: .78rem; font-weight: 700; color: #0f172a; }
    .rd-outcome-desc { font-size: .7rem; color: #64748b; line-height: 1.4; }

    .routing-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .75rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px;
    }
  `]
})
export class PostPurchaseConditionalRoutingComponent {}
