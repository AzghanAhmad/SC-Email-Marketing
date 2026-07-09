import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowStep } from '../../../core/services/mock-data.service';
import { WsEmailScheduleComponent } from './ws-email-schedule.component';

@Component({
  selector: 'app-ws-email2',
  standalone: true,
  imports: [CommonModule, WsEmailScheduleComponent],
  template: `
    <div class="ws-email-section">
      <app-ws-email-schedule
        [step]="emailStep"
        [showError]="showScheduleError"
        (scheduleChange)="scheduleChange.emit($event)">
      </app-ws-email-schedule>
      <div class="ws-email-header e2">
        <span class="ws-email-badge">Email 2</span>
        <span class="ws-email-name">The Story Behind the Author</span>
        <span class="ws-email-timing">{{ timingLabel }}</span>
      </div>
      <div class="ws-callout indigo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <p>This is the email most authors either skip entirely or write badly by making it a professional bio. A professional bio is a list of credentials. What Email 2 needs is a story. The difference is the difference between a reader who knows facts about you and a reader who feels something about you. Feeling something is what creates loyalty.</p>
      </div>
      <div class="ws-story-guide">
        <p class="ws-story-prompt">Write the answer to this question:</p>
        <div class="ws-story-question">"If we were having coffee and you told me why you write, what would you say?"</div>
        <div class="ws-story-criteria">
          <div class="ws-criteria-item" *ngFor="let c of email2Criteria">
            <svg viewBox="0 0 20 20" fill="#6366f1" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ c }}</span>
          </div>
        </div>
      </div>
      <div class="ws-connect-note">
        <p class="ws-connect-label">Connecting your story to your books:</p>
        <p class="ws-body">After establishing your personal connection to writing, draw a brief thread between your life experience and the specific kinds of books you write. A reader who understands why you write what you write is predisposed to trust that the books are genuine — which makes the invitation to buy in Emails 3 and 4 feel like a natural extension of a relationship rather than a sales pitch.</p>
      </div>
      <div class="ws-length-note">
        <span class="ws-length-label">Length &amp; tone:</span>
        <span>3–5 solid paragraphs. Your voice, your rhythm, your particular way of seeing things. Email 2 is the first extended piece of writing this reader has seen from you outside of your books — make it sound like someone they'd want to hear from again.</span>
      </div>
      <div class="ws-subject-guide">
        <p class="ws-subject-label">Subject line options:</p>
        <div class="ws-subject-option" *ngFor="let s of email2Subjects" (click)="subjectSelected.emit(s.line)">
          <span class="ws-subject-line">"{{ s.line }}"</span>
          <span class="ws-subject-why">{{ s.why }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ws-email-section { display:flex; flex-direction:column; gap:.875rem; }
    .ws-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .ws-email-header { display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; padding:.75rem 1rem; border-radius:10px; }
    .ws-email-header.e2 { background:rgba(59,130,246,.06); border:1.5px solid rgba(59,130,246,.15); }
    .ws-email-badge { font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; padding:.2rem .55rem; border-radius:20px; background:rgba(59,130,246,.12); color:#3b82f6; }
    .ws-email-name { font-size:.9375rem; font-weight:700; color:#0f172a; }
    .ws-email-timing { font-size:.75rem; color:#94a3b8; margin-left:auto; }
    .ws-callout { display:flex; align-items:flex-start; gap:.625rem; padding:.875rem 1rem; border-radius:0 10px 10px 0; font-size:.8rem; line-height:1.55; }
    .ws-callout.indigo { background:rgba(99,102,241,.06); border-left:3px solid #6366f1; color:#3730a3; }
    .ws-callout svg { flex-shrink:0; margin-top:2px; color:#6366f1; }
    .ws-callout p { margin:0; }
    .ws-story-guide { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-story-prompt { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .5rem; }
    .ws-story-question { font-size:.875rem; font-style:italic; color:#0f172a; font-weight:600; padding:.625rem .875rem; background:#fff; border-left:3px solid #6366f1; border-radius:0 8px 8px 0; margin-bottom:.75rem; line-height:1.4; }
    .ws-story-criteria { display:flex; flex-direction:column; gap:.375rem; }
    .ws-criteria-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.4; }
    .ws-connect-note { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .ws-connect-label { font-size:.75rem; font-weight:700; color:#0f172a; margin:0 0 .5rem; display:block; }
    .ws-length-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(59,130,246,.05); border-radius:8px; font-size:.78rem; color:#374151; line-height:1.5; }
    .ws-length-label { font-weight:700; color:#3b82f6; white-space:nowrap; }
    .ws-subject-guide { display:flex; flex-direction:column; gap:.375rem; }
    .ws-subject-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .25rem; }
    .ws-subject-option { display:flex; align-items:flex-start; gap:.75rem; padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:border-color .15s; }
    .ws-subject-option:hover { border-color:#6366f1; }
    .ws-subject-line { font-size:.8125rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .ws-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
  `]
})
export class WsEmail2Component {
  @Input() emailStep: FlowStep | null = null;
  @Input() showScheduleError = false;
  @Output() subjectSelected = new EventEmitter<string>();
  @Output() scheduleChange = new EventEmitter<string>();

  get timingLabel(): string {
    if (!this.emailStep?.scheduledAt) return 'Set send date & time below';
    const d = new Date(this.emailStep.scheduledAt);
    return Number.isNaN(d.getTime()) ? 'Scheduled' : `Scheduled: ${d.toLocaleString()}`;
  }

  readonly email2Criteria = [
    'Conversational — reads like the answer to a question, not a press release',
    'Specific — names real places, real experiences, real turning points rather than abstract descriptions of passion',
    'Honest — readers can distinguish between a curated author persona and a genuinely personal account',
    'Connects your life experience to the kinds of stories you tell',
  ];

  readonly email2Subjects = [
    { line: 'The real reason I started writing', why: 'Signals something personal and specific is coming — not a professional biography header' },
    { line: 'Something I don\'t talk about often', why: 'Works if the content supports that framing — creates genuine curiosity' },
    { line: 'How I ended up here', why: 'Quieter and more introspective — good for authors whose personal story has an unexpected or nonlinear quality' },
  ];
}
