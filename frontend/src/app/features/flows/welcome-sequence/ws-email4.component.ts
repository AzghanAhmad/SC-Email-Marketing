import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowStep } from '../../../core/services/mock-data.service';
import { WsEmailScheduleComponent } from './ws-email-schedule.component';

@Component({
  selector: 'app-ws-email4',
  standalone: true,
  imports: [CommonModule, WsEmailScheduleComponent],
  template: `
    <div class="ws-email-section">
      <app-ws-email-schedule
        [step]="emailStep"
        [showError]="showScheduleError"
        (scheduleChange)="scheduleChange.emit($event)">
      </app-ws-email-schedule>
      <div class="ws-email-header e4">
        <span class="ws-email-badge">Email 4</span>
        <span class="ws-email-name">The Invitation</span>
        <span class="ws-email-timing">{{ timingLabel }}</span>
      </div>
      <p class="ws-body">Email 4 closes the formal onboarding with clear next steps — not by adding more information, but by opening a door and pointing the reader toward what lies beyond it. The invitation comes first, because it's the relational gesture that makes the commercial ask land warmly rather than abruptly.</p>
      <div class="ws-invitation-options">
        <p class="ws-inv-label">What to invite the reader into (choose what fits your program):</p>
        <div class="ws-inv-item" *ngFor="let inv of email4Invitations">
          <div class="ws-inv-icon" [innerHTML]="inv.icon"></div>
          <div>
            <span class="ws-inv-title">{{ inv.title }}</span>
            <span class="ws-inv-desc">{{ inv.desc }}</span>
          </div>
        </div>
      </div>
      <div class="ws-direct-cta">
        <div class="ws-cta-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>
          <span>The Direct Call to Action</span>
        </div>
        <p class="ws-body">After the invitation, Email 4 makes the most direct and confident book recommendation of the entire sequence. By now, the reader has had three emails of relationship building. The fourth email can afford to be more direct.</p>
        <div class="ws-cta-example">"If you've been meaning to pick up [Title] and just haven't gotten there yet — this is me telling you that it's worth your time."</div>
        <p class="ws-cta-note">One button. One link. ScribeCount uses conditional logic here — readers who purchased after Email 3 move into a post-purchase flow rather than receiving a repeat purchase invitation.</p>
      </div>
      <div class="ws-closing-note">
        <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
        <span>Close with warmth: <em>"I'm glad you're here, and I'm looking forward to sharing more with you."</em> Simple. Genuine. Done.</span>
      </div>
      <div class="ws-subject-guide">
        <p class="ws-subject-label">Subject line options:</p>
        <div class="ws-subject-option" *ngFor="let s of email4Subjects" (click)="subjectSelected.emit(s.line)">
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
    .ws-email-header.e4 { background:rgba(16,185,129,.06); border:1.5px solid rgba(16,185,129,.2); }
    .ws-email-badge { font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; padding:.2rem .55rem; border-radius:20px; background:rgba(16,185,129,.12); color:#059669; }
    .ws-email-name { font-size:.9375rem; font-weight:700; color:#0f172a; }
    .ws-email-timing { font-size:.75rem; color:#94a3b8; margin-left:auto; }
    .ws-invitation-options { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-inv-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .ws-inv-item { display:flex; align-items:flex-start; gap:.75rem; margin-bottom:.5rem; }
    .ws-inv-item:last-child { margin-bottom:0; }
    .ws-inv-icon { width:26px; height:26px; border-radius:7px; background:rgba(16,185,129,.1); color:#059669; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ws-inv-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .ws-inv-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.45; }
    .ws-direct-cta { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .ws-cta-header { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.5rem; }
    .ws-cta-example { font-size:.8rem; color:#374151; font-style:italic; line-height:1.55; padding:.625rem .875rem; background:rgba(16,185,129,.05); border-left:3px solid #10b981; border-radius:0 8px 8px 0; margin:.625rem 0; }
    .ws-cta-note { font-size:.75rem; color:#94a3b8; margin:.5rem 0 0; line-height:1.4; }
    .ws-closing-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:#f0fdf4; border-radius:8px; font-size:.78rem; color:#166534; line-height:1.5; }
    .ws-subject-guide { display:flex; flex-direction:column; gap:.375rem; }
    .ws-subject-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .25rem; }
    .ws-subject-option { display:flex; align-items:flex-start; gap:.75rem; padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:border-color .15s; }
    .ws-subject-option:hover { border-color:#10b981; }
    .ws-subject-line { font-size:.8125rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .ws-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
  `]
})
export class WsEmail4Component {
  @Input() emailStep: FlowStep | null = null;
  @Input() showScheduleError = false;
  @Output() subjectSelected = new EventEmitter<string>();
  @Output() scheduleChange = new EventEmitter<string>();

  get timingLabel(): string {
    if (!this.emailStep?.scheduledAt) return 'Set send date & time below';
    const d = new Date(this.emailStep.scheduledAt);
    return Number.isNaN(d.getTime()) ? 'Scheduled' : `Scheduled: ${d.toLocaleString()}`;
  }

  readonly email4Invitations = [
    { title: 'Your reader community', desc: 'A Facebook Group, Discord server, or other dedicated space. The highest-relationship invitation in the sequence — works best if you have an active community worth inviting readers into.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { title: 'Newsletter expectations', desc: 'A clear, specific description of what regular communication looks like — how often you send, what you share, what readers get by staying subscribed. Transforms staying subscribed from passive inertia into a deliberate choice.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { title: 'A direct invitation to reply', desc: 'A genuine, specific question that invites the reader to respond and begin a two-way conversation. "I\'d love to know what brought you to this kind of fiction — hit reply and tell me." Signals that you read your emails and that responses matter.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { title: 'Exclusive content', desc: 'A bonus chapter, deleted scene, or behind-the-scenes document not available anywhere else. A gift for completing the sequence and a reward for the reader\'s engagement.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  ];

  readonly email4Subjects = [
    { line: 'A few things I\'d love to share with you', why: 'Works for an invitation-forward closing — signals something personal is coming' },
    { line: 'One more thing before I hand you over to the regular newsletter', why: 'Transparent and friendly about the sequence\'s structure — readers appreciate the honesty' },
    { line: 'You\'ve made it to the end of the beginning', why: 'Slightly playful — works well for authors with a warmer, more conversational newsletter voice' },
  ];
}
