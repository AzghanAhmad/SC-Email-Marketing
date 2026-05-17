import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-privacy">
      <h4 class="ssp-title">Your data and your readers' privacy</h4>
      <p class="ssp-body">
        ScribeCount stores only what is necessary to deliver the right message to the right reader
        at the right time: email address, name if provided, purchase history, engagement history,
        and tags or segments you create.
      </p>
      <div class="ssp-grid">
        <div class="ssp-card stored">
          <span class="ssp-card-label">Stored in ScribeCount</span>
          <ul>
            <li *ngFor="let s of stored">{{ s }}</li>
          </ul>
        </div>
        <div class="ssp-card never">
          <span class="ssp-card-label">Never enters ScribeCount</span>
          <ul>
            <li *ngFor="let n of never">{{ n }}</li>
          </ul>
        </div>
      </div>
      <p class="ssp-compliance">
        All email sending complies with CAN-SPAM, GDPR, and CASL — including unsubscribe handling,
        sender identification, and consent management. When a reader unsubscribes, that preference
        is honored immediately and propagated across both systems.
      </p>
    </div>
  `,
  styles: [`
    .sc-privacy { margin-bottom: 1.25rem; }
    .ssp-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; }
    .ssp-body { font-size: .8125rem; color: #374151; margin: 0 0 .875rem; line-height: 1.6; }
    .ssp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; margin-bottom: .875rem; }
    @media (max-width: 600px) { .ssp-grid { grid-template-columns: 1fr; } }
    .ssp-card { padding: .875rem; border-radius: 10px; font-size: .78rem; }
    .ssp-card.stored { background: rgba(59,130,246,0.06); border: 1.5px solid rgba(59,130,246,0.2); }
    .ssp-card.never { background: rgba(239,68,68,0.05); border: 1.5px solid rgba(239,68,68,0.15); }
    .ssp-card-label { display: block; font-size: .68rem; font-weight: 700; text-transform: uppercase; margin-bottom: .4rem; }
    .ssp-card.stored .ssp-card-label { color: #1e40af; }
    .ssp-card.never .ssp-card-label { color: #dc2626; }
    .ssp-card ul { margin: 0; padding-left: 1rem; color: #374151; line-height: 1.5; }
    .ssp-compliance { font-size: .8125rem; color: #64748b; margin: 0; line-height: 1.55; }
  `]
})
export class ScStorePrivacyComponent {
  stored = ['Email address and name', 'Purchase history', 'Engagement history', 'Tags and segments'];
  never = ['Card numbers', 'Billing addresses', 'Bank details', 'Any payment information'];
}
