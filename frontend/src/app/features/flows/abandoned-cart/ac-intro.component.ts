import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ac-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ac-intro">
      <div class="ac-intro-callout">
        <div class="ac-intro-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <div class="ac-intro-body">
          <h4 class="ac-intro-title">Revenue you've already earned, waiting to be collected</h4>
          <p class="ac-intro-desc">
            A reader who added your book to their cart has already made the hardest decision in any
            purchase journey: they decided they want the book. Your abandoned cart email doesn't need
            to sell them on the book. It just needs to remove whatever small obstacle stopped them
            from completing what they'd already decided to do.
          </p>
        </div>
      </div>

      <div class="ac-stat-row">
        <div class="ac-stat">
          <span class="ac-stat-val">70–80%</span>
          <span class="ac-stat-label">of online carts are abandoned before purchase</span>
        </div>
        <div class="ac-stat-divider"></div>
        <div class="ac-stat">
          <span class="ac-stat-val">5–15%</span>
          <span class="ac-stat-label">recovery rate on well-built abandoned cart emails</span>
        </div>
        <div class="ac-stat-divider"></div>
        <div class="ac-stat">
          <span class="ac-stat-val">Build once</span>
          <span class="ac-stat-label">runs automatically for as long as your store is active</span>
        </div>
      </div>

      <div class="ac-reasons">
        <h5 class="ac-reasons-title">Why readers abandon — and why most are recoverable</h5>
        <div class="ac-reasons-grid">
          <div class="ac-reason recoverable">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>Got distracted or interrupted mid-checkout</span>
          </div>
          <div class="ac-reason recoverable">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>Wanted to "save" the book to consider later</span>
          </div>
          <div class="ac-reason recoverable">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>Had a question they didn't know how to answer</span>
          </div>
          <div class="ac-reason recoverable">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>Hesitated on price — wasn't sure about value</span>
          </div>
          <div class="ac-reason recoverable">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>Technical issue with checkout form or payment</span>
          </div>
          <div class="ac-reason not-recoverable">
            <svg viewBox="0 0 20 20" fill="#94a3b8" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/>
            </svg>
            <span class="muted">Genuinely decided not to buy (rare)</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ac-intro { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }

    .ac-intro-callout {
      display: flex; align-items: flex-start; gap: .875rem;
      padding: .875rem 1rem;
      background: rgba(245,158,11,0.06); border: 1.5px solid rgba(245,158,11,0.2);
      border-radius: 12px;
    }
    .ac-intro-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(245,158,11,0.12); color: #d97706;
      display: flex; align-items: center; justify-content: center;
    }
    .ac-intro-title { font-size: .875rem; font-weight: 700; color: #92400e; margin: 0 0 .35rem; }
    .ac-intro-desc { font-size: .78rem; color: #374151; margin: 0; line-height: 1.6; }

    .ac-stat-row {
      display: flex; align-items: center; gap: 0;
      background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px;
      overflow: hidden;
    }
    .ac-stat {
      flex: 1; display: flex; flex-direction: column; gap: .2rem;
      padding: .875rem 1rem; text-align: center;
    }
    .ac-stat-val { font-size: 1.25rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
    .ac-stat-label { font-size: .7rem; color: #64748b; line-height: 1.4; }
    .ac-stat-divider { width: 1px; background: #e2e8f0; align-self: stretch; }

    .ac-reasons { }
    .ac-reasons-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .625rem; }
    .ac-reasons-grid { display: flex; flex-direction: column; gap: .35rem; }
    .ac-reason {
      display: flex; align-items: center; gap: .5rem;
      font-size: .78rem; color: #374151; line-height: 1.4;
    }
    .ac-reason.not-recoverable { opacity: .6; }
    .muted { color: #94a3b8; }
  `]
})
export class AcIntroComponent {}
