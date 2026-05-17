import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-three-emails',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-emails">
      <h4 class="ree-title">The re-engagement sequence</h4>
      <p class="ree-sub">
        Two to three emails over one to two weeks. Two possible outcomes: the reader re-engages and
        returns to your active list, or they are cleanly removed. Both outcomes are successes.
      </p>

      <div class="ree-list">
        <div class="ree-item" *ngFor="let e of emails" [class.open]="openId() === e.id">
          <button class="ree-header" (click)="toggle(e.id)">
            <div class="ree-header-left">
              <span class="ree-num" [style.background]="e.color">{{ e.num }}</span>
              <div>
                <span class="ree-name">{{ e.name }}</span>
                <span class="ree-timing">{{ e.timing }}</span>
              </div>
            </div>
            <svg class="ree-chevron" [class.rotated]="openId() === e.id"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="ree-body" [class.open]="openId() === e.id">
            <p class="ree-desc">{{ e.desc }}</p>
            <div class="ree-example" *ngIf="e.example">
              <span class="ree-ex-label">Example framing</span>
              <span class="ree-ex-text">"{{ e.example }}"</span>
            </div>
            <div class="ree-subjects">
              <span class="ree-subjects-label">Subject lines</span>
              <div class="ree-subject" *ngFor="let s of e.subjects">
                <span class="ree-subject-line">"{{ s.line }}"</span>
                <span class="ree-subject-why">{{ s.why }}</span>
              </div>
            </div>
            <p class="ree-note" *ngIf="e.note">{{ e.note }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .re-emails { margin-bottom: 1.25rem; }
    .ree-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .ree-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .ree-list { display: flex; flex-direction: column; gap: .375rem; }
    .ree-item { border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    .ree-item.open { border-color: #fbcfe8; }

    .ree-header {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: .75rem .875rem; background: #f8fafc; border: none; cursor: pointer; font-family: inherit;
    }
    .ree-item.open .ree-header { background: #fdf2f8; border-bottom: 1px solid #fce7f3; }
    .ree-header-left { display: flex; align-items: center; gap: .625rem; text-align: left; }
    .ree-num {
      width: 22px; height: 22px; border-radius: 50%; color: #fff;
      font-size: .68rem; font-weight: 700; display: flex; align-items: center; justify-content: center;
    }
    .ree-name { display: block; font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .ree-timing { display: block; font-size: .7rem; color: #94a3b8; }
    .ree-chevron { color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
    .ree-chevron.rotated { transform: rotate(180deg); }

    .ree-body { max-height: 0; overflow: hidden; transition: max-height .3s; padding: 0 .875rem; }
    .ree-body.open { max-height: 800px; padding: .875rem; }
    .ree-desc { font-size: .75rem; color: #374151; margin: 0 0 .625rem; line-height: 1.55; }
    .ree-example {
      display: flex; flex-direction: column; gap: .15rem; margin-bottom: .625rem;
      padding: .5rem .625rem; background: rgba(219,39,119,0.05); border-radius: 7px;
    }
    .ree-ex-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; color: #db2777; }
    .ree-ex-text { font-size: .75rem; color: #0f172a; font-style: italic; line-height: 1.5; }
    .ree-subjects { margin-bottom: .5rem; }
    .ree-subjects-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: .35rem; }
    .ree-subject { margin-bottom: .35rem; }
    .ree-subject-line { display: block; font-size: .78rem; font-weight: 600; color: #0f172a; font-style: italic; }
    .ree-subject-why { display: block; font-size: .7rem; color: #64748b; }
    .ree-note { font-size: .72rem; color: #64748b; margin: 0; font-style: italic; line-height: 1.45; }
  `]
})
export class ReThreeEmailsComponent {
  openId = signal<string | null>('e1');
  toggle(id: string) { this.openId.set(this.openId() === id ? null : id); }

  emails = [
    {
      id: 'e1', num: 1, color: '#db2777', name: 'Email 1: The warm check-in', timing: 'Sent when inactivity threshold is crossed',
      desc: 'Not a win-back campaign — a genuine, low-key check-in. Warm without being needy, honest without guilt, brief enough that reading it does not feel like work. Avoid "We miss you!" followed by promotional content.',
      example: 'I have noticed you have been quiet lately, and I just wanted to check in. Life gets full, inboxes get overwhelming — I get it. If you would like to keep getting my emails, just click the link below. If not, no hard feelings at all.',
      subjects: [
        { line: 'Are you still there?', why: 'Direct and slightly vulnerable — signals human presence. Consistently high open rates.' },
        { line: 'I just wanted to check in', why: 'Warm and low-pressure. Feels personal rather than broadcast.' },
        { line: 'Do you still want to hear from me?', why: 'Gives the reader agency and signals genuine respect.' },
        { line: 'Hey — it has been a while', why: 'Casual and honest. Works for conversational newsletter voices.' },
      ],
      note: 'One clear CTA: "Yes, keep me on the list." When clicked, ScribeCount tags them re-engaged and the goal exit fires.',
    },
    {
      id: 'e2', num: 2, color: '#be185d', name: 'Email 2: The last chance', timing: '5–7 days after Email 1 if no engagement',
      desc: 'Shorter and more direct. Matter-of-fact rather than dramatic — no guilt, no manufactured urgency. The reader knows this is the last email before removal and can stay with one click.',
      example: 'This is the last email I will send before I remove you from my list. I would love to keep you here if you are interested — just click the link below. If not, no hard feelings, and the door is always open.',
      subjects: [
        { line: 'This is the last one', why: 'Completely honest — mild urgency without manufacturing it.' },
        { line: 'Stay or go — your call', why: 'Full agency tends to generate more genuine re-engagements than pressure.' },
        { line: 'I am about to let you go', why: 'Personable and honest — avoids making the reader feel processed.' },
      ],
      note: 'Incentives can work here but often produce click-once-then-quiet-again subscribers. If used, make the offer serve an active reader, not just reward a click.',
    },
    {
      id: 'e3', num: 3, color: '#9d174d', name: 'Email 3 (optional): Preference offer', timing: '2–3 days after Email 2 if still no engagement',
      desc: 'Offers a preference adjustment rather than binary stay-or-go. Some readers are inactive because frequency does not fit their life, not because they lost interest in your books.',
      example: 'Would you rather receive fewer emails? A once-a-month summary instead of weekly updates? New release announcements only? One click to adjust what you receive.',
      subjects: [
        { line: 'Too many emails from me?', why: 'Addresses frequency as the problem, not interest.' },
        { line: 'Want fewer emails instead of none?', why: 'Offers a middle path before removal.' },
      ],
      note: 'Best for weekly or biweekly senders. Monthly senders may skip Email 3. Preference update removes them from the re-engagement flow.',
    },
  ];
}
