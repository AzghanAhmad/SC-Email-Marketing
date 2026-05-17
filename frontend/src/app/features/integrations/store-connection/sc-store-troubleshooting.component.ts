import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-troubleshooting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-troubleshoot">
      <h4 class="sst-title">If something looks wrong</h4>
      <p class="sst-body">
        Every webhook your store sends, and every action ScribeCount takes, is logged in your
        account activity record with a timestamp, event type, and outcome.
      </p>
      <div class="sst-steps">
        <div class="sst-step" *ngFor="let s of steps; let i = index">
          <span class="sst-step-num">{{ i + 1 }}</span>
          <span class="sst-step-text">{{ s }}</span>
        </div>
      </div>
      <div class="sst-fix">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="14" height="14">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <p>
          If the log shows a failed webhook delivery, reconnecting your store integration from
          Settings or this Integrations page will re-establish the connection and replay any missed
          events from the past 24 hours.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .sc-troubleshoot { margin-bottom: 1.25rem; }
    .sst-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; }
    .sst-body { font-size: .8125rem; color: #374151; margin: 0 0 .75rem; line-height: 1.6; }
    .sst-steps { display: flex; flex-direction: column; gap: .4rem; margin-bottom: .875rem; }
    .sst-step {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .625rem .75rem; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;
    }
    .sst-step-num {
      width: 20px; height: 20px; border-radius: 50%; background: #e2e8f0; color: #64748b;
      font-size: .65rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .sst-step-text { font-size: .8125rem; color: #374151; line-height: 1.5; }
    .sst-fix {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .875rem; background: rgba(59,130,246,0.06); border: 1.5px solid rgba(59,130,246,0.15); border-radius: 10px;
    }
    .sst-fix p { font-size: .8125rem; color: #374151; margin: 0; line-height: 1.55; }
  `]
})
export class ScStoreTroubleshootingComponent {
  steps = [
    'Check the activity log first — it shows exactly what the system received and what it did',
    'Most issues are timing questions: a dwell period not elapsed yet, or a suppression rule preventing duplicate sends',
    'Rare true errors appear as failed webhook delivery in the log',
  ];
}
