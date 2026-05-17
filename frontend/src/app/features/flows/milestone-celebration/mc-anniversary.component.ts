import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-anniversary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-anniversary">
      <h4 class="mca-title">Milestone 1: Subscriber Anniversary</h4>
      <p class="mca-sub">
        Triggers when a reader completes one year on your list. Primary job: make them feel genuinely
        recognized. Secondary job: offer something that rewards loyalty — only after recognition is established.
      </p>

      <div class="mca-jobs">
        <div class="mca-job primary">
          <span class="mca-job-label">Primary</span>
          <span>Recognition first — not "thanks for a year, here's a discount." The recognition is the point.</span>
        </div>
        <div class="mca-job secondary">
          <span class="mca-job-label">Secondary</span>
          <span>Optional gift that deepens connection: exclusive content, early access, or thank-you discount.</span>
        </div>
      </div>

      <div class="mca-example">
        <span class="mca-ex-label">Example opening</span>
        <span class="mca-ex-text">"One year ago today, you joined my list. I don't take that lightly."</span>
      </div>

      <div class="mca-section">
        <h5 class="mca-section-title">What to offer (optional)</h5>
        <ul class="mca-list">
          <li *ngFor="let o of offers">{{ o }}</li>
        </ul>
        <p class="mca-note">Works perfectly well with no offer at all. The absence of a commercial ask is part of what makes it genuine.</p>
      </div>

      <div class="mca-section">
        <h5 class="mca-section-title">Subject lines</h5>
        <div class="mca-subject" *ngFor="let s of subjects">
          <span class="mca-subject-line">"{{ s.line }}"</span>
          <span class="mca-subject-why">{{ s.why }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mc-anniversary { margin-bottom: 1.25rem; }
    .mca-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mca-sub { font-size: .75rem; color: #64748b; margin: 0 0 .75rem; line-height: 1.55; }

    .mca-jobs { display: flex; flex-direction: column; gap: .4rem; margin-bottom: .75rem; }
    .mca-job { padding: .625rem .75rem; border-radius: 8px; font-size: .72rem; line-height: 1.45; color: #374151; }
    .mca-job.primary { background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.2); }
    .mca-job.secondary { background: #f8fafc; border: 1px solid #f1f5f9; }
    .mca-job-label { display: block; font-size: .62rem; font-weight: 700; text-transform: uppercase; color: #d97706; margin-bottom: .2rem; }

    .mca-example {
      display: flex; flex-direction: column; gap: .15rem; margin-bottom: .75rem;
      padding: .5rem .625rem; background: rgba(217,119,6,0.05); border-radius: 7px;
    }
    .mca-ex-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; color: #d97706; }
    .mca-ex-text { font-size: .75rem; color: #0f172a; font-style: italic; line-height: 1.5; }

    .mca-section { margin-bottom: .75rem; }
    .mca-section-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .4rem; }
    .mca-list { margin: 0 0 .5rem; padding-left: 1.1rem; font-size: .72rem; color: #374151; line-height: 1.55; }
    .mca-note { font-size: .72rem; color: #64748b; margin: 0; font-style: italic; line-height: 1.45; }

    .mca-subject { margin-bottom: .35rem; }
    .mca-subject-line { display: block; font-size: .78rem; font-weight: 600; color: #0f172a; font-style: italic; }
    .mca-subject-why { display: block; font-size: .7rem; color: #64748b; }
  `]
})
export class McAnniversaryComponent {
  offers = [
    'Exclusive content: deleted scene, alternate ending, short story in your series world',
    'Early access: first chapter, cover reveal, upcoming release schedule preview',
    'Thank-you discount on an unread title — framed as gift, not "20% off this weekend only"',
  ];
  subjects = [
    { line: 'One year. Thank you.', why: 'Minimal, direct — signals personal message not campaign.' },
    { line: '[First Name], it\'s been a year', why: 'Personalization + conversational acknowledgment.' },
    { line: 'I wanted to mark this', why: 'Signals intentionality without being vague.' },
    { line: 'Your one-year anniversary with my books', why: 'Explicit — works for strong series/catalog fan identity.' },
  ];
}
