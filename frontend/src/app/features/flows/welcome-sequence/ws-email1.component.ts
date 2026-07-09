import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowStep } from '../../../core/services/mock-data.service';
import { WsEmailScheduleComponent } from './ws-email-schedule.component';

@Component({
  selector: 'app-ws-email1',
  standalone: true,
  imports: [CommonModule, WsEmailScheduleComponent],
  template: `
    <div class="ws-email-section">
      <app-ws-email-schedule
        [step]="emailStep"
        [showError]="showScheduleError"
        (scheduleChange)="scheduleChange.emit($event)">
      </app-ws-email-schedule>
      <div class="ws-email-header e1">
        <span class="ws-email-badge">Email 1</span>
        <span class="ws-email-name">The Welcome</span>
        <span class="ws-email-timing">{{ timingLabel }}</span>
      </div>
      <div class="ws-timing-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>Sends immediately — not in an hour, not at the next send time. A welcome email that arrives within 60 seconds tells the reader you take their decision seriously. That impression establishes the baseline expectation for every email that follows.</span>
      </div>
      <div class="ws-three-jobs">
        <p class="ws-jobs-label">Three jobs, in this order of priority:</p>
        <div class="ws-job-item" *ngFor="let j of email1Jobs">
          <div class="ws-job-num">{{ j.num }}</div>
          <div>
            <span class="ws-job-title">{{ j.title }}</span>
            <span class="ws-job-desc">{{ j.desc }}</span>
          </div>
        </div>
      </div>
      <div class="ws-magnet-section">
        <div class="ws-magnet-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span class="ws-magnet-title">Reader Magnet Delivery</span>
        </div>
        <p class="ws-body">If the subscriber joined through a reader magnet, the delivery link should be the first thing in the email — above any other content. The reader opted in specifically for that content; making them search for the download link below three paragraphs of introduction creates friction at exactly the wrong moment.</p>
        <div class="ws-magnet-tip">
          <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <span>Include one sentence explaining that BookFunnel is how you deliver files — removing the small uncertainty of "what is this site" before it becomes a barrier increases download completion rate.</span>
        </div>
      </div>
      <div class="ws-intro-example">
        <p class="ws-example-label">Introduction example (2–3 sentences):</p>
        <div class="ws-example-block">"I'm Randall Wood, and I write thrillers with an intelligence analyst's eye for detail and a former police officer's understanding of how things actually go wrong. If you like your suspense grounded in reality and your protagonists genuinely fallible, you're in the right place."</div>
        <p class="ws-example-note">That's enough for Email 1. The deeper introduction — the story behind the author, the journey, the personal context — is Email 2's job.</p>
      </div>
      <div class="ws-subject-guide">
        <p class="ws-subject-label">Subject line options:</p>
        <div class="ws-subject-option" *ngFor="let s of email1Subjects" (click)="subjectSelected.emit(s.line)">
          <span class="ws-subject-line">"{{ s.line }}"</span>
          <span class="ws-subject-why">{{ s.why }}</span>
        </div>
      </div>
      <div class="ws-preview-tip">
        <span class="ws-preview-label">Preview text:</span>
        <span class="ws-preview-desc">Works in concert with the subject line — don't repeat it. If the subject says the magnet is here, the preview text says "Plus — a quick note on what to expect next."</span>
      </div>
    </div>
  `,
  styles: [`
    .ws-email-section { display:flex; flex-direction:column; gap:.875rem; }
    .ws-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .ws-email-header { display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; padding:.75rem 1rem; border-radius:10px; }
    .ws-email-header.e1 { background:rgba(99,102,241,.06); border:1.5px solid rgba(99,102,241,.15); }
    .ws-email-badge { font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; padding:.2rem .55rem; border-radius:20px; background:rgba(99,102,241,.12); color:#6366f1; }
    .ws-email-name { font-size:.9375rem; font-weight:700; color:#0f172a; }
    .ws-email-timing { font-size:.75rem; color:#94a3b8; margin-left:auto; }
    .ws-timing-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:#f0fdf4; border-left:3px solid #10b981; border-radius:0 8px 8px 0; font-size:.78rem; color:#166534; line-height:1.5; }
    .ws-timing-note svg { flex-shrink:0; margin-top:1px; color:#10b981; }
    .ws-three-jobs { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-jobs-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .ws-job-item { display:flex; align-items:flex-start; gap:.625rem; margin-bottom:.5rem; }
    .ws-job-item:last-child { margin-bottom:0; }
    .ws-job-num { width:22px; height:22px; border-radius:50%; background:#6366f1; color:#fff; font-size:.7rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ws-job-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.1rem; }
    .ws-job-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.4; }
    .ws-magnet-section { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .ws-magnet-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; }
    .ws-magnet-title { font-size:.8125rem; font-weight:700; color:#0f172a; }
    .ws-magnet-tip { display:flex; align-items:flex-start; gap:.5rem; margin-top:.625rem; padding:.5rem .75rem; background:rgba(16,185,129,.05); border-radius:8px; font-size:.75rem; color:#374151; line-height:1.4; }
    .ws-intro-example { background:#f8fafc; border-radius:10px; padding:.875rem; }
    .ws-example-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .5rem; }
    .ws-example-block { font-size:.8rem; color:#374151; font-style:italic; line-height:1.55; padding:.625rem .875rem; background:#fff; border-left:3px solid #6366f1; border-radius:0 8px 8px 0; margin-bottom:.5rem; }
    .ws-example-note { font-size:.75rem; color:#94a3b8; margin:0; line-height:1.4; }
    .ws-subject-guide { display:flex; flex-direction:column; gap:.375rem; }
    .ws-subject-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .25rem; }
    .ws-subject-option { display:flex; align-items:flex-start; gap:.75rem; padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:border-color .15s; }
    .ws-subject-option:hover { border-color:#6366f1; }
    .ws-subject-line { font-size:.8125rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .ws-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .ws-preview-tip { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(99,102,241,.05); border-radius:8px; font-size:.78rem; color:#374151; line-height:1.5; }
    .ws-preview-label { font-weight:700; color:#6366f1; white-space:nowrap; }
    .ws-preview-desc { color:#64748b; }
  `]
})
export class WsEmail1Component {
  @Input() emailStep: FlowStep | null = null;
  @Input() showScheduleError = false;
  @Output() subjectSelected = new EventEmitter<string>();
  @Output() scheduleChange = new EventEmitter<string>();

  get timingLabel(): string {
    if (!this.emailStep?.scheduledAt) return 'Set send date & time below';
    const d = new Date(this.emailStep.scheduledAt);
    return Number.isNaN(d.getTime()) ? 'Scheduled' : `Scheduled: ${d.toLocaleString()}`;
  }

  readonly email1Jobs = [
    { num: '1', title: 'Deliver what you promised', desc: 'Reader magnet download link, clearly labeled, above all other content. If no magnet, skip this and open with the introduction.' },
    { num: '2', title: 'Introduce who you are', desc: 'Two or three sentences: your name, what you write, and one specific thing that makes you and your books worth knowing.' },
    { num: '3', title: 'Set expectations for what comes next', desc: 'A sentence or two telling the reader what to expect in the next few days. Transforms the upcoming sequence from unexpected emails into a promised experience.' },
  ];

  readonly email1Subjects = [
    { line: 'Welcome — you\'re in', why: 'Clean and confident — immediately recognizes the reader\'s decision to join' },
    { line: 'Your [Reader Magnet Title] is here', why: 'Leads with the delivery if a reader magnet was promised — puts the most immediately valuable information first' },
    { line: 'Hi [First Name] — welcome to the list', why: 'Uses personalization to signal from the very first email that this is not a generic program' },
  ];
}
