import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-writing-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-write">
      <h4 class="scw-title">Writing the series completion email</h4>
      <p class="scw-intro">
        The most effective series completion emails are written with the specific series and the
        specific reader in mind — not as a generic "thanks for reading, here's what's next" template.
        They reference the world, the characters, and the experience in terms a reader who just
        finished the series recognizes immediately.
      </p>

      <div class="scw-works">
        <div class="scw-works-col good">
          <div class="scw-works-label good-label">What works</div>
          <div class="scw-works-item" *ngFor="let w of whatWorks">
            <svg viewBox="0 0 20 20" fill="#059669" width="11" height="11">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <span>{{ w }}</span>
          </div>
        </div>
        <div class="scw-works-col bad">
          <div class="scw-works-label bad-label">What doesn't work</div>
          <div class="scw-works-item" *ngFor="let w of whatDoesnt">
            <svg viewBox="0 0 20 20" fill="#dc2626" width="11" height="11">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/>
            </svg>
            <span>{{ w }}</span>
          </div>
        </div>
      </div>

      <div class="scw-subjects">
        <h5 class="scw-subjects-title">Subject lines that work</h5>
        <p class="scw-subjects-note">
          The subject line must signal this is a personal, specific message about a book the reader
          just finished — not a generic promotional email.
        </p>
        <div class="scw-subject-item" *ngFor="let s of subjectLines">
          <span class="scw-subject-line">"{{ s.line }}"</span>
          <span class="scw-subject-why">{{ s.why }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-write { margin-bottom: 1.25rem; }
    .scw-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .scw-intro { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.55; }

    .scw-works { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; margin-bottom: 1rem; }
    .scw-works-col { padding: .75rem; border-radius: 10px; }
    .scw-works-col.good { background: rgba(16,185,129,0.05); border: 1.5px solid rgba(16,185,129,0.15); }
    .scw-works-col.bad { background: rgba(239,68,68,0.05); border: 1.5px solid rgba(239,68,68,0.15); }
    .scw-works-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .5rem; }
    .good-label { color: #059669; }
    .bad-label { color: #dc2626; }
    .scw-works-item { display: flex; align-items: flex-start; gap: .35rem; font-size: .75rem; color: #374151; line-height: 1.4; margin-bottom: .35rem; }
    .scw-works-item:last-child { margin-bottom: 0; }

    .scw-subjects { margin-bottom: 0; }
    .scw-subjects-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .35rem; }
    .scw-subjects-note { font-size: .72rem; color: #64748b; margin: 0 0 .5rem; line-height: 1.45; }
    .scw-subject-item { padding: .5rem .625rem; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 7px; margin-bottom: .35rem; }
    .scw-subject-item:last-child { margin-bottom: 0; }
    .scw-subject-line { display: block; font-size: .78rem; font-weight: 600; color: #0f172a; font-style: italic; margin-bottom: .15rem; }
    .scw-subject-why { display: block; font-size: .7rem; color: #64748b; }

    @media (max-width: 500px) { .scw-works { grid-template-columns: 1fr; } }
  `]
})
export class ScWritingGuideComponent {
  whatWorks = [
    'Specificity — references the world, characters, and experience so the reader recognizes this email was written for them',
    'Warmth without sycophancy — acknowledges the milestone without overpraising it',
    'Single recommendation with conviction — "this is what you should read next, and here is why"',
    'One call to action, one link, one clear next step',
  ];

  whatDoesnt = [
    'Generic language — "Thank you for your recent purchase. You might also enjoy these titles" is a product recommendation widget, not a series completion email',
    'Multiple asks — presenting your full catalog or three different series replaces emotional momentum with a decision-making burden',
    'No acknowledgment — jumping straight to the recommendation misses the emotional leverage the moment offers',
  ];

  subjectLines = [
    { line: 'So you finished [Series Name]…', why: 'Ellipsis signals continuation. Specific series name tells the reader this email knows something about them. Works especially well for completed series with a strong emotional arc.' },
    { line: 'What to read after [Final Title]', why: 'Direct and helpful — positions the email as a service. High open rates because it answers a question the reader may actually be asking.' },
    { line: '[Character Name] isn\'t quite done with you yet', why: 'For series with a shared character in subsequent books. Creates curiosity and uses existing attachment as the hook.' },
    { line: 'The next chapter in [World Name]', why: 'For world-building-forward fantasy and sci-fi. Signals that more of the world they love is available.' },
    { line: 'You finished the series. What now?', why: 'Conversational and slightly conspiratorial — works well for authors with a warm, direct newsletter voice.' },
  ];
}
