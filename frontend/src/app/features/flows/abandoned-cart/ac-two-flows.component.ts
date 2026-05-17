import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ac-two-flows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="two-flows">
      <h4 class="tf-title">Two Different Flows for Two Different Moments</h4>
      <p class="tf-sub">
        The difference lies in where in the purchase process the reader stopped — which tells you
        something significant about the kind of friction they encountered.
      </p>

      <div class="tf-comparison">
        <!-- Cart -->
        <div class="tf-card cart">
          <div class="tf-card-header">
            <div class="tf-card-icon cart-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <div>
              <div class="tf-card-name">Abandoned Cart</div>
              <div class="tf-card-intent">Lower intent</div>
            </div>
          </div>
          <div class="tf-card-body">
            <div class="tf-detail-row">
              <span class="tf-detail-key">What happened</span>
              <span class="tf-detail-val">Added book to cart, left without reaching checkout</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">First email</span>
              <span class="tf-detail-val tf-highlight">1 hour after abandonment</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">Emails</span>
              <span class="tf-detail-val">2 total — reminder + final nudge at 24h</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">Tone</span>
              <span class="tf-detail-val">Warm, low-pressure — helpful reminder, not a chase</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">Friction type</span>
              <span class="tf-detail-val">Distraction, price hesitation, general browsing</span>
            </div>
          </div>
        </div>

        <!-- Checkout -->
        <div class="tf-card checkout">
          <div class="tf-card-header">
            <div class="tf-card-icon checkout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div>
              <div class="tf-card-name">Abandoned Checkout</div>
              <div class="tf-card-intent high">Higher intent</div>
            </div>
          </div>
          <div class="tf-card-body">
            <div class="tf-detail-row">
              <span class="tf-detail-key">What happened</span>
              <span class="tf-detail-val">Entered payment or shipping info, stopped before completing</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">First email</span>
              <span class="tf-detail-val tf-highlight urgent">30 minutes after abandonment</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">Emails</span>
              <span class="tf-detail-val">2 total — checkout reminder + 24h follow-up</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">Tone</span>
              <span class="tf-detail-val">More direct — reader was ready to buy, not browsing</span>
            </div>
            <div class="tf-detail-row">
              <span class="tf-detail-key">Friction type</span>
              <span class="tf-detail-val">Technical issue, payment method, last-minute hesitation</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tf-escalation-note">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          ScribeCount runs both flows simultaneously and independently. A reader whose cart abandonment
          escalates to a checkout abandonment is handled by the checkout flow — because the checkout
          flow's messaging is better calibrated to where that reader stopped.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .two-flows { margin-bottom: 1.25rem; }
    .tf-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .tf-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .tf-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: .75rem; }
    .tf-card { border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0; }
    .tf-card.cart { border-color: rgba(245,158,11,0.3); }
    .tf-card.checkout { border-color: rgba(99,102,241,0.3); }

    .tf-card-header {
      display: flex; align-items: center; gap: .625rem;
      padding: .75rem .875rem;
    }
    .tf-card.cart .tf-card-header { background: rgba(245,158,11,0.06); }
    .tf-card.checkout .tf-card-header { background: rgba(99,102,241,0.06); }

    .tf-card-icon {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .cart-icon { background: rgba(245,158,11,0.12); color: #d97706; }
    .checkout-icon { background: rgba(99,102,241,0.12); color: #6366f1; }

    .tf-card-name { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .tf-card-intent {
      font-size: .65rem; font-weight: 700; padding: .1rem .4rem;
      border-radius: 100px; text-transform: uppercase; letter-spacing: .04em;
      background: rgba(148,163,184,0.15); color: #64748b; width: fit-content; margin-top: .15rem;
    }
    .tf-card-intent.high { background: rgba(99,102,241,0.1); color: #6366f1; }

    .tf-card-body { padding: .75rem .875rem; display: flex; flex-direction: column; gap: .5rem; }
    .tf-detail-row { display: flex; flex-direction: column; gap: .1rem; }
    .tf-detail-key { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; }
    .tf-detail-val { font-size: .75rem; color: #374151; line-height: 1.4; }
    .tf-highlight { font-weight: 700; color: #d97706; }
    .tf-highlight.urgent { color: #6366f1; }

    .tf-escalation-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .75rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px;
    }

    @media (max-width: 600px) { .tf-comparison { grid-template-columns: 1fr; } }
  `]
})
export class AcTwoFlowsComponent {}
