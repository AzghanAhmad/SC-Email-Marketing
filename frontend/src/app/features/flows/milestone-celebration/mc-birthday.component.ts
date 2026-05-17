import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-birthday',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-birthday">
      <h4 class="mcb-title">Milestone 2: Birthday Email</h4>
      <p class="mcb-sub">
        The most personal milestone — and the most conditional. Only works if you have the reader's
        birth month and day, collected consensually at opt-in or through a preference form.
      </p>

      <div class="mcb-collection">
        <h5 class="mcb-section-title">Collecting birthday data</h5>
        <p>Include month and day only (year unnecessary). Frame honestly: "If you'd like to receive a birthday message from me, add your birth month and day here." Readers who add their birthday actively choose the email.</p>
      </div>

      <div class="mcb-example">
        <span class="mcb-ex-label">Example opening</span>
        <span class="mcb-ex-text">"Happy birthday, [First Name]. I hope your day is exactly the kind of day you want it to be."</span>
      </div>

      <div class="mcb-section">
        <h5 class="mcb-section-title">Birthday gift ideas</h5>
        <ul class="mcb-list">
          <li *ngFor="let g of gifts">{{ g }}</li>
        </ul>
      </div>

      <div class="mcb-privacy">
        <svg viewBox="0 0 20 20" fill="#d97706" width="12" height="12">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
        </svg>
        <div>
          <strong>Birthday data and privacy</strong>
          <p>Stored securely, used only for the annual birthday message — never shared, sold, or used in other targeting. Be explicit in your preference form. Transparency builds more trust than the email itself if mishandled.</p>
        </div>
      </div>

      <p class="mcb-timing-note">
        ScribeCount triggers birthday emails on the reader's actual birth date, or the morning before
        if same-day delivery might be unreliable across time zones. An email three days late feels
        like you forgot, not remembered.
      </p>
    </div>
  `,
  styles: [`
    .mc-birthday { margin-bottom: 1.25rem; }
    .mcb-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcb-sub { font-size: .75rem; color: #64748b; margin: 0 0 .75rem; line-height: 1.55; }

    .mcb-collection {
      padding: .75rem; margin-bottom: .75rem;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
    }
    .mcb-collection p { font-size: .72rem; color: #374151; margin: .35rem 0 0; line-height: 1.5; }
    .mcb-section-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0; }

    .mcb-example {
      display: flex; flex-direction: column; gap: .15rem; margin-bottom: .75rem;
      padding: .5rem .625rem; background: rgba(217,119,6,0.05); border-radius: 7px;
    }
    .mcb-ex-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; color: #d97706; }
    .mcb-ex-text { font-size: .75rem; color: #0f172a; font-style: italic; line-height: 1.5; }

    .mcb-section { margin-bottom: .75rem; }
    .mcb-list { margin: 0; padding-left: 1.1rem; font-size: .72rem; color: #374151; line-height: 1.55; }

    .mcb-privacy {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .75rem; background: #fffbeb; border: 1.5px solid #fde68a;
      border-radius: 9px; margin-bottom: .5rem;
    }
    .mcb-privacy strong { display: block; font-size: .75rem; color: #92400e; margin-bottom: .25rem; }
    .mcb-privacy p { font-size: .72rem; color: #374151; margin: 0; line-height: 1.5; }

    .mcb-timing-note { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.45; font-style: italic; }
  `]
})
export class McBirthdayComponent {
  gifts = [
    '10–20% catalog discount — higher use rate than generic promos because context feels personal',
    'Free short story or novella delivered as a birthday gift',
    'Early access to your next book\'s first chapter',
    'Reply invitation: "Tell me one book you loved this year that isn\'t mine — I\'d genuinely love to know"',
  ];
}
