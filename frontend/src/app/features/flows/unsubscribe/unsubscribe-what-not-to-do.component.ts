import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unsubscribe-what-not-to-do',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wntd-panel">
      <div class="wntd-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <circle cx="12" cy="12" r="10"/>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        </svg>
        What Not to Do
      </div>
      <p class="wntd-intro">
        The most common mistakes reveal the author's discomfort with departures more than they
        serve the departing reader. Avoid all of these:
      </p>
      <div class="wntd-list">
        <div class="wntd-item" *ngFor="let item of mistakes">
          <div class="wntd-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
          <div>
            <p class="wntd-item-title">{{ item.title }}</p>
            <p class="wntd-item-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Subject line guidance -->
      <div class="wntd-subjects">
        <p class="wntd-subjects-label">Subject line: confirm the action, don't express feelings about it</p>
        <div class="wntd-subject good" *ngFor="let s of goodSubjects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ s }}
        </div>
        <div class="wntd-subject bad" *ngFor="let s of badSubjects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          {{ s }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wntd-panel {
      background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 12px;
      padding: 1rem; display: flex; flex-direction: column; gap: .875rem;
    }
    .wntd-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
      color: #e11d48;
    }
    .wntd-intro { font-size: .78rem; color: #9f1239; line-height: 1.5; margin: 0; }

    .wntd-list { display: flex; flex-direction: column; gap: .625rem; }
    .wntd-item { display: flex; align-items: flex-start; gap: .5rem; }
    .wntd-item-icon {
      width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
      background: #fecdd3; color: #e11d48;
      display: flex; align-items: center; justify-content: center; margin-top: 1px;
    }
    .wntd-item-title { font-size: .78rem; font-weight: 700; color: #9f1239; margin: 0 0 .1rem; }
    .wntd-item-desc { font-size: .75rem; color: #be123c; line-height: 1.45; margin: 0; }

    /* Subject lines */
    .wntd-subjects { display: flex; flex-direction: column; gap: .35rem; }
    .wntd-subjects-label { font-size: .72rem; font-weight: 600; color: #9f1239; margin: 0 0 .375rem; }
    .wntd-subject {
      display: flex; align-items: center; gap: .4rem;
      font-size: .75rem; padding: .3rem .6rem; border-radius: 6px;
    }
    .wntd-subject svg { flex-shrink: 0; }
    .wntd-subject.good { background: #f0fdf4; color: #166534; }
    .wntd-subject.good svg { color: #16a34a; }
    .wntd-subject.bad { background: #fff1f2; color: #9f1239; text-decoration: line-through; opacity: .7; }
    .wntd-subject.bad svg { color: #e11d48; }
  `]
})
export class UnsubscribeWhatNotToDoComponent {
  mistakes = [
    {
      title: 'Making the reader confirm a second time',
      desc: 'The decision was made. Requiring another confirmation creates friction that feels punitive and may cause the reader to mark your email as spam out of frustration.'
    },
    {
      title: 'Sending multiple emails about the unsubscribe',
      desc: 'One confirmation email. That is it.'
    },
    {
      title: 'Including a long list of reasons to reconsider',
      desc: 'A reader who has decided to unsubscribe does not want to read a sales pitch in their unsubscribe confirmation.'
    },
    {
      title: 'Expressing excessive sadness, disappointment, or guilt',
      desc: "They have made a reasonable choice about their inbox. They have not done something wrong. Respect it."
    },
    {
      title: 'Making the unsubscribe link hard to find',
      desc: 'A genuinely difficult-to-find unsubscribe link generates spam complaints that are far more damaging to your deliverability than the unsubscribes would have been.'
    },
  ];

  goodSubjects = [
    '"You have been unsubscribed" — direct, unambiguous, exactly what the reader is looking for',
    '"You are off the list" — casual and clear, works for warmer newsletter voices',
    '"All done — you have been removed" — slightly warmer while still leading with confirmation',
  ];

  badSubjects = [
    '"We hate to see you go!" — prioritizes author discomfort over reader need for confirmation',
    '"Before you go..." — obscures the confirmation with marketing language',
  ];
}
