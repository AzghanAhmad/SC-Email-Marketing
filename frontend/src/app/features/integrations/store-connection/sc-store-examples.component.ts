import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-examples',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-examples">
      <h4 class="ssex-title">Common scenarios</h4>
      <div class="ssex-list">
        <div class="ssex-item" *ngFor="let ex of examples" [class.open]="openId() === ex.id">
          <button class="ssex-header" (click)="toggle(ex.id)">
            <span class="ssex-num">{{ ex.num }}</span>
            <span class="ssex-name">{{ ex.title }}</span>
            <svg class="ssex-chevron" [class.rotated]="openId() === ex.id"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="ssex-body" [class.open]="openId() === ex.id">
            <p class="ssex-trigger"><strong>Store sends:</strong> {{ ex.trigger }}</p>
            <p class="ssex-action"><strong>ScribeCount does:</strong> {{ ex.action }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-examples { margin-bottom: 1.25rem; }
    .ssex-title { font-size: .875rem; font-weight: 700; color: #0f172a; margin: 0 0 .75rem; }
    .ssex-list { display: flex; flex-direction: column; gap: .375rem; }
    .ssex-item { border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    .ssex-item.open { border-color: #bfdbfe; }
    .ssex-header {
      width: 100%; display: flex; align-items: center; gap: .625rem;
      padding: .75rem .875rem; background: #f8fafc; border: none; cursor: pointer; font-family: inherit; text-align: left;
    }
    .ssex-item.open .ssex-header { background: #eff6ff; border-bottom: 1px solid #dbeafe; }
    .ssex-num {
      width: 22px; height: 22px; border-radius: 50%; background: #3b82f6; color: #fff;
      font-size: .68rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ssex-name { flex: 1; font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .ssex-chevron { color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
    .ssex-chevron.rotated { transform: rotate(180deg); }
    .ssex-body { max-height: 0; overflow: hidden; transition: max-height .3s; padding: 0 .875rem; }
    .ssex-body.open { max-height: 200px; padding: .875rem; }
    .ssex-trigger, .ssex-action { font-size: .78rem; color: #374151; margin: 0 0 .5rem; line-height: 1.55; }
    .ssex-action { margin-bottom: 0; }
    .ssex-trigger strong, .ssex-action strong { color: #1e40af; }
  `]
})
export class ScStoreExamplesComponent {
  openId = signal<string | null>('ex1');
  toggle(id: string) { this.openId.set(this.openId() === id ? null : id); }

  examples = [
    {
      id: 'ex1', num: 1, title: 'Reader completes a purchase',
      trigger: 'Webhook with email, title purchased, order amount, and timestamp.',
      action: 'Identifies completed order, checks purchase history, sends first-time or repeat thank-you flow. Digital products also trigger delivery email with unique access link.',
    },
    {
      id: 'ex2', num: 2, title: 'Reader abandons cart',
      trigger: 'Abandonment detected after configured inactivity period.',
      action: 'Waits your configured dwell time, then sends abandoned cart email. If reader completes purchase first, order webhook cancels abandonment email and sends purchase flow instead.',
    },
    {
      id: 'ex3', num: 3, title: 'Reader abandons checkout',
      trigger: 'Checkout abandonment after payment details entered but transaction not completed.',
      action: 'Applies shorter dwell time for higher-intent abandonment and fires distinct abandoned checkout email — separate timing and urgency from cart abandonment.',
    },
    {
      id: 'ex4', num: 4, title: 'Paid subscriber cancels membership',
      trigger: 'Cancellation event from subscription platform.',
      action: 'Identifies subscriber and plan type, sends appropriate end-subscription email — confirms cancellation, states access end date, presents configured win-back offer if one exists.',
    },
  ];
}
