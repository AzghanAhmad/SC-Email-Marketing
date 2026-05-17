import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-three-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-jobs">
      <h4 class="scj-title">What the series completion flow actually does</h4>
      <p class="scj-sub">
        The flow has three interconnected jobs. Understanding all three is what makes the difference
        between a flow that converts readers and one that merely sends emails.
      </p>

      <div class="scj-card" *ngFor="let job of jobs">
        <div class="scj-num" [style.background]="job.color">{{ job.num }}</div>
        <div class="scj-body">
          <h5 class="scj-name">{{ job.name }}</h5>
          <p class="scj-desc">{{ job.desc }}</p>
          <div class="scj-example" *ngIf="job.example">
            <span class="scj-ex-label">Example framing</span>
            <span class="scj-ex-text">"{{ job.example }}"</span>
          </div>
          <p class="scj-note" *ngIf="job.note">{{ job.note }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-jobs { margin-bottom: 1.25rem; }
    .scj-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .scj-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .scj-card {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .875rem; margin-bottom: .5rem;
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
    }
    .scj-card:last-child { margin-bottom: 0; }
    .scj-num {
      width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
      color: #fff; font-size: .72rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .scj-name { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .scj-desc { font-size: .75rem; color: #374151; margin: 0 0 .5rem; line-height: 1.55; }
    .scj-example {
      display: flex; flex-direction: column; gap: .15rem;
      padding: .5rem .625rem; margin-bottom: .375rem;
      background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.15); border-radius: 7px;
    }
    .scj-ex-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #6366f1; }
    .scj-ex-text { font-size: .75rem; color: #0f172a; font-style: italic; line-height: 1.5; }
    .scj-note { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.45; font-style: italic; }
  `]
})
export class ScThreeJobsComponent {
  jobs = [
    {
      num: 1,
      color: '#6366f1',
      name: 'Acknowledge the milestone',
      desc:
        'Finishing a multi-book series is a genuine reading accomplishment. The completion email should acknowledge that before it does anything else — not with manufactured loyalty-program language, but in a genuine, specific way that reflects the actual experience of the series.',
      example:
        'If you\'ve made it to the end of [Series Name], you\'ve been through everything [Character] went through from [beginning] to [resolution]. That\'s not a casual reading commitment.',
      note:
        'A sentence or two is enough. Those two sentences transform the recommendation that follows from a sales pitch into a natural continuation of the relationship.',
    },
    {
      num: 2,
      color: '#3b82f6',
      name: 'Present the next step',
      desc:
        'After the acknowledgment, present your recommendation for what to read next. This is the commercial heart of the flow. The recommendation should be specific, not general — a single targeted suggestion with a brief, compelling explanation of why this particular book is the right next step.',
      example:
        'If you loved [Series Name] for its [specific quality], [Next Title] is the book I\'d put in your hands next. It has [related quality] and readers who loved [Series] have consistently told me it\'s the one that felt most like coming home.',
      note:
        'The more precisely the recommendation is calibrated to what the reader just experienced — similar emotional register, related themes, comparable pacing — the higher the conversion rate.',
    },
    {
      num: 3,
      color: '#059669',
      name: 'Make starting irresistible',
      desc:
        'The completion email\'s final job is to lower the activation energy for beginning the next book as much as possible. A clear, prominent call to action. A direct link to the purchase page or bundle. A first-chapter preview if available. A single line of reader praise from someone who made exactly this transition.',
      example: null,
      note:
        'One CTA. One link. One clear next step. A reader who is emotionally primed, given a specific recommendation, and faces a single clear button is as close to a certain purchase as the email medium can produce.',
    },
  ];
}
