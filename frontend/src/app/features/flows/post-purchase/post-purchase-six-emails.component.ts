import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EmailSummary {
  num: number;
  name: string;
  timing: string;
  job: string;
  priority: 'essential' | 'important' | 'compound';
  priorityLabel: string;
}

@Component({
  selector: 'app-post-purchase-six-emails',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="six-emails">
      <h4 class="six-title">Six Emails, One Reader Journey</h4>
      <p class="six-sub">Build in this order — have the infrastructure in place before you need it.</p>
      <div class="six-list">
        <div class="six-item" *ngFor="let e of emails">
          <div class="six-num">{{ e.num }}</div>
          <div class="six-body">
            <div class="six-header-row">
              <span class="six-name">{{ e.name }}</span>
              <span class="six-priority" [ngClass]="'priority-' + e.priority">{{ e.priorityLabel }}</span>
            </div>
            <span class="six-timing">{{ e.timing }}</span>
            <span class="six-job">{{ e.job }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .six-emails {
      background: #f8fafc; border: 1.5px solid #f1f5f9;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .six-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .six-sub { font-size: .75rem; color: #94a3b8; margin: 0 0 .875rem; }
    .six-list { display: flex; flex-direction: column; gap: .5rem; }
    .six-item { display: flex; align-items: flex-start; gap: .75rem; }
    .six-num {
      width: 22px; height: 22px; border-radius: 50%;
      background: #1e3a5f; color: #fff;
      font-size: .68rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      margin-top: .1rem;
    }
    .six-body { flex: 1; display: flex; flex-direction: column; gap: .15rem; }
    .six-header-row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
    .six-name { font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .six-priority {
      font-size: .65rem; font-weight: 700; padding: .15rem .45rem;
      border-radius: 100px; text-transform: uppercase; letter-spacing: .04em;
    }
    .priority-essential { background: rgba(16,185,129,0.1); color: #059669; }
    .priority-important { background: rgba(59,130,246,0.1); color: #2563eb; }
    .priority-compound { background: rgba(139,92,246,0.1); color: #7c3aed; }
    .six-timing { font-size: .72rem; color: #64748b; font-style: italic; }
    .six-job { font-size: .75rem; color: #374151; line-height: 1.4; }
  `]
})
export class PostPurchaseSixEmailsComponent {
  emails: EmailSummary[] = [
    {
      num: 1, name: 'Order Confirmation',
      timing: 'Fires within seconds of purchase',
      job: 'Official receipt — eliminates purchase anxiety immediately',
      priority: 'essential', priorityLabel: 'Essential'
    },
    {
      num: 2, name: 'Digital Delivery',
      timing: 'Fires alongside or immediately after confirmation',
      job: 'Download link goes first — puts the book in the reader\'s hands',
      priority: 'essential', priorityLabel: 'Essential'
    },
    {
      num: 3, name: 'Post-Purchase Thank You',
      timing: 'Fires immediately for first-time buyers',
      job: 'Makes the reader feel genuinely recognized, not processed',
      priority: 'important', priorityLabel: 'Pre-Store'
    },
    {
      num: 4, name: 'Post-Purchase Follow-Up',
      timing: '3–5 days after purchase',
      job: 'Review invitation + next book suggestion while the story is still vivid',
      priority: 'important', priorityLabel: 'Pre-Store'
    },
    {
      num: 5, name: 'Review Request',
      timing: '4–7 days after purchase',
      job: 'Dedicated standalone ask — one job, one link, maximum conversion',
      priority: 'compound', priorityLabel: 'Compounds'
    },
    {
      num: 6, name: 'Repeat Purchase Thank You',
      timing: 'Fires instead of standard thank you for returning buyers',
      job: 'Acknowledges loyalty — warmer, more personal, rewards the return',
      priority: 'compound', priorityLabel: 'Compounds'
    },
  ];
}
