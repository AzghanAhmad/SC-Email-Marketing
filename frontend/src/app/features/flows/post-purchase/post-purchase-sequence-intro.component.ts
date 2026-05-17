import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-purchase-sequence-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pp-intro">
      <div class="pp-intro-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      </div>
      <div class="pp-intro-body">
        <h4 class="pp-intro-title">The Post-Purchase Sequence</h4>
        <p class="pp-intro-desc">
          A reader buying your book is not the end of a sale — it's the beginning of a relationship.
          The moment a reader completes a purchase is one of the highest-attention, highest-openness
          moments in their entire experience. What you do with that moment determines whether this
          reader buys once and drifts away or becomes a returning fan.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .pp-intro {
      display: flex; align-items: flex-start; gap: .875rem;
      padding: .875rem 1rem;
      background: rgba(16,185,129,0.06);
      border: 1.5px solid rgba(16,185,129,0.2);
      border-radius: 12px;
      margin-bottom: 1.25rem;
    }
    .pp-intro-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(16,185,129,0.12); color: #059669;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .pp-intro-title {
      font-size: .875rem; font-weight: 700; color: #065f46; margin: 0 0 .35rem;
    }
    .pp-intro-desc {
      font-size: .78rem; color: #374151; margin: 0; line-height: 1.6;
    }
  `]
})
export class PostPurchaseSequenceIntroComponent {}
