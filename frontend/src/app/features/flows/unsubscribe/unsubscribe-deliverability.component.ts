import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unsubscribe-deliverability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="deliv-panel">

      <!-- Spam vs Unsubscribe -->
      <div class="deliv-comparison">
        <div class="deliv-item good">
          <div class="deliv-item-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Clean Unsubscribe</span>
          </div>
          <ul class="deliv-list">
            <li>Reader leaves your list cleanly</li>
            <li>Engagement metrics improve</li>
            <li>No damage to sender reputation</li>
            <li>Door left open for return</li>
          </ul>
        </div>
        <div class="deliv-item bad">
          <div class="deliv-item-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span>Spam Complaint</span>
          </div>
          <ul class="deliv-list">
            <li>Damages sender reputation directly</li>
            <li>Affects deliverability for all subscribers</li>
            <li>Inbox providers penalize your domain</li>
            <li>Far worse than any unsubscribe</li>
          </ul>
        </div>
      </div>

      <div class="deliv-callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
          <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>
          A spam complaint is not the same as an unsubscribe. It is worse in every sense that
          matters for deliverability. Every practice that makes unsubscribing easier and clearer
          is a practice that protects your ability to reach the readers who actually want your emails.
        </p>
      </div>

      <!-- Inbox providers -->
      <div class="deliv-providers">
        <p class="deliv-providers-label">Inbox providers evaluate your program on:</p>
        <div class="deliv-provider-item" *ngFor="let item of providerSignals">
          <div class="deliv-provider-dot" [ngClass]="item.color"></div>
          <span>{{ item.signal }}</span>
        </div>
      </div>

      <!-- Legal compliance -->
      <div class="deliv-legal">
        <div class="deliv-legal-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Legal Compliance
        </div>
        <div class="deliv-legal-items">
          <div class="deliv-legal-item" *ngFor="let law of legalItems">
            <span class="deliv-legal-badge" [ngClass]="law.color">{{ law.name }}</span>
            <span class="deliv-legal-desc">{{ law.desc }}</span>
          </div>
        </div>
        <p class="deliv-legal-note">
          ScribeCount processes unsubscribes immediately and stores removed addresses in a
          suppression list — not deleted — so you can verify removal if ever required, and
          prevent re-imported lists from accidentally re-adding opted-out addresses.
        </p>
      </div>

    </div>
  `,
  styles: [`
    .deliv-panel { display: flex; flex-direction: column; gap: 1rem; }

    /* Comparison */
    .deliv-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; }
    @media (max-width: 500px) { .deliv-comparison { grid-template-columns: 1fr; } }
    .deliv-item {
      padding: .75rem; border-radius: 10px; border: 1.5px solid;
    }
    .deliv-item.good { background: #f0fdf4; border-color: #bbf7d0; }
    .deliv-item.bad { background: #fff1f2; border-color: #fecdd3; }
    .deliv-item-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .78rem; font-weight: 700; margin-bottom: .5rem;
    }
    .deliv-item.good .deliv-item-header { color: #16a34a; }
    .deliv-item.bad .deliv-item-header { color: #e11d48; }
    .deliv-list {
      margin: 0; padding-left: 1rem;
      font-size: .75rem; line-height: 1.5;
      display: flex; flex-direction: column; gap: .2rem;
    }
    .deliv-item.good .deliv-list { color: #166534; }
    .deliv-item.bad .deliv-list { color: #9f1239; }

    /* Callout */
    .deliv-callout {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .875rem 1rem; background: #fff7ed;
      border-left: 3px solid #f59e0b; border-radius: 0 10px 10px 0;
      font-size: .78rem; color: #92400e; line-height: 1.55;
    }
    .deliv-callout svg { flex-shrink: 0; margin-top: 1px; color: #d97706; }
    .deliv-callout p { margin: 0; }

    /* Provider signals */
    .deliv-providers { display: flex; flex-direction: column; gap: .375rem; }
    .deliv-providers-label { font-size: .75rem; font-weight: 600; color: #334155; margin: 0 0 .375rem; }
    .deliv-provider-item {
      display: flex; align-items: center; gap: .5rem;
      font-size: .75rem; color: #334155;
    }
    .deliv-provider-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .deliv-provider-dot.blue { background: #3b82f6; }
    .deliv-provider-dot.green { background: #10b981; }
    .deliv-provider-dot.amber { background: #f59e0b; }

    /* Legal */
    .deliv-legal {
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px;
      padding: .875rem; display: flex; flex-direction: column; gap: .625rem;
    }
    .deliv-legal-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
      color: #64748b;
    }
    .deliv-legal-header svg { color: #64748b; }
    .deliv-legal-items { display: flex; flex-direction: column; gap: .4rem; }
    .deliv-legal-item { display: flex; align-items: flex-start; gap: .5rem; font-size: .75rem; }
    .deliv-legal-badge {
      padding: .15rem .5rem; border-radius: 6px;
      font-size: .68rem; font-weight: 700; flex-shrink: 0;
    }
    .deliv-legal-badge.us { background: #dbeafe; color: #2563eb; }
    .deliv-legal-badge.eu { background: #ede9fe; color: #7c3aed; }
    .deliv-legal-badge.ca { background: #dcfce7; color: #16a34a; }
    .deliv-legal-desc { color: #64748b; line-height: 1.45; }
    .deliv-legal-note { font-size: .72rem; color: #94a3b8; line-height: 1.45; margin: 0; }
  `]
})
export class UnsubscribeDeliverabilityComponent {
  providerSignals = [
    { signal: 'How many people unsubscribe', color: 'blue' },
    { signal: 'How easy it is to unsubscribe', color: 'green' },
    { signal: 'Whether people mark emails as spam instead of unsubscribing', color: 'amber' },
  ];

  legalItems = [
    {
      name: 'CAN-SPAM',
      color: 'us',
      desc: 'US law requires unsubscribe requests honored within 10 business days. ScribeCount processes immediately.'
    },
    {
      name: 'GDPR',
      color: 'eu',
      desc: 'EU/UK law gives subscribers the right to withdraw consent at any time.'
    },
    {
      name: 'CASL',
      color: 'ca',
      desc: 'Canadian law requires an unsubscribe mechanism in every commercial message and mandates prompt honoring of opt-out requests.'
    },
  ];
}
