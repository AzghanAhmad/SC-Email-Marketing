import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-sendback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-sendback">
      <h4 class="ssb-title">What ScribeCount Email sends back</h4>
      <p class="ssb-body">
        The connection is not one-directional. When ScribeCount takes an action — sending an email,
        applying a tag, updating a subscriber's status — it can report that action back to your store
        so both systems stay in sync.
      </p>
      <div class="ssb-examples">
        <div class="ssb-ex" *ngFor="let e of examples">
          <svg viewBox="0 0 20 20" fill="#059669" width="11" height="11">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
          </svg>
          <span>{{ e }}</span>
        </div>
      </div>
      <p class="ssb-note">
        This two-way synchronization means your store and email system always share the same
        understanding of who each reader is, what they have done, and what they should receive next.
      </p>
    </div>
  `,
  styles: [`
    .sc-sendback { margin-bottom: 1.25rem; }
    .ssb-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; }
    .ssb-body { font-size: .8125rem; color: #374151; margin: 0 0 .75rem; line-height: 1.6; }
    .ssb-examples { display: flex; flex-direction: column; gap: .4rem; margin-bottom: .75rem; }
    .ssb-ex { display: flex; align-items: flex-start; gap: .35rem; font-size: .8125rem; color: #374151; line-height: 1.5; }
    .ssb-note { font-size: .8125rem; color: #64748b; margin: 0; line-height: 1.55; font-style: italic; }
  `]
})
export class ScStoreSendbackComponent {
  examples = [
    'Unsubscribe updates your store customer record to reflect that preference',
    'Third-order purchase qualifies reader for superfan segment — tag applied immediately',
    'No waiting for your next campaign send to recognize what changed',
  ];
}
