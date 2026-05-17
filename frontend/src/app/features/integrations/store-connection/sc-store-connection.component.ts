import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-conn">
      <h4 class="ssc-title">The connection itself</h4>
      <p class="ssc-body">
        ScribeCount Email connects to your store through a secure channel called an API — a dedicated,
        private line between your store and your email system. When something happens in your store,
        your store tells ScribeCount instantly and ScribeCount responds with the appropriate automated action.
      </p>
      <div class="ssc-callout">
        <p>
          The connection is established once during setup using encrypted credentials only your store
          and ScribeCount account can read. No customer payment data passes through — only event data:
          what happened, who it happened to, and when.
        </p>
      </div>
      <ul class="ssc-list">
        <li *ngFor="let item of points">{{ item }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .sc-conn { margin-bottom: 1.25rem; }
    .ssc-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; }
    .ssc-body { font-size: .8125rem; color: #374151; margin: 0 0 .75rem; line-height: 1.6; }
    .ssc-callout {
      padding: .875rem 1rem; margin-bottom: .75rem;
      background: rgba(59,130,246,0.06); border-left: 3px solid #3b82f6;
      border-radius: 0 10px 10px 0;
    }
    .ssc-callout p { font-size: .8125rem; color: #1e40af; margin: 0; line-height: 1.55; font-weight: 500; }
    .ssc-list { margin: 0; padding-left: 1.1rem; font-size: .8125rem; color: #64748b; line-height: 1.55; }
  `]
})
export class ScStoreConnectionComponent {
  points = [
    'No third party has access to the connection line',
    'Your store handles all financial transactions independently',
    'ScribeCount never sees, stores, or touches card numbers or bank details',
  ];
}
