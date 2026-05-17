import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-summary">
      <div class="sss-inner">
        <h4 class="sss-title">The complete picture</h4>
        <p class="sss-body">
          Your store detects what happens. It tells ScribeCount Email. ScribeCount responds with
          the right action, at the right time, for the right reader — automatically, securely, and
          always according to the rules you set.
        </p>
        <div class="sss-flow">
          <span class="sss-step">Store detects</span>
          <span class="sss-arrow">→</span>
          <span class="sss-step">Webhook sent</span>
          <span class="sss-arrow">→</span>
          <span class="sss-step">ScribeCount acts</span>
          <span class="sss-arrow">→</span>
          <span class="sss-step">Systems stay in sync</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-summary { margin-bottom: 0; }
    .sss-inner {
      padding: 1rem 1.125rem;
      background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(5,150,105,0.04) 100%);
      border: 1.5px solid rgba(59,130,246,0.2); border-radius: 12px;
    }
    .sss-title { font-size: .9375rem; font-weight: 700; color: #1e40af; margin: 0 0 .5rem; }
    .sss-body { font-size: .8125rem; color: #374151; margin: 0 0 .875rem; line-height: 1.65; }
    .sss-flow { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; }
    .sss-step {
      font-size: .72rem; font-weight: 600; padding: .25rem .5rem;
      background: #fff; border: 1px solid #dbeafe; border-radius: 6px; color: #1e40af;
    }
    .sss-arrow { font-size: .75rem; color: #94a3b8; }
  `]
})
export class ScStoreSummaryComponent {}
