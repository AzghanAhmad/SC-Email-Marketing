import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowStep } from '../../../core/services/mock-data.service';
import { WsEmailScheduleComponent } from './ws-email-schedule.component';

@Component({
  selector: 'app-ws-email3',
  standalone: true,
  imports: [CommonModule, WsEmailScheduleComponent],
  template: `
    <div class="ws-email-section">
      <app-ws-email-schedule
        [step]="emailStep"
        [showError]="showScheduleError"
        (scheduleChange)="scheduleChange.emit($event)">
      </app-ws-email-schedule>
      <div class="ws-email-header e3">
        <span class="ws-email-badge">Email 3</span>
        <span class="ws-email-name">The World of Your Books</span>
        <span class="ws-email-timing">{{ timingLabel }}</span>
      </div>
      <div class="ws-callout amber">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <p>By Email 3, the reader knows you showed up reliably, knows who you are as a person, and has formed an impression of your voice. This is where you redirect that accumulated goodwill toward your books — gently, naturally, as a recommendation from someone they've been getting to know rather than a pitch from someone who's been warming them up for a sale.</p>
      </div>
      <div class="ws-soft-sell-guide">
        <p class="ws-guide-label">Email structure:</p>
        <div class="ws-soft-sell-item" *ngFor="let s of email3Structure">
          <div class="ws-soft-sell-num">{{ s.num }}</div>
          <div>
            <span class="ws-soft-sell-title">{{ s.title }}</span>
            <span class="ws-soft-sell-desc">{{ s.desc }}</span>
            <div class="ws-soft-sell-example" *ngIf="s.example">
              <span class="ws-ex-label">Example:</span>
              <span class="ws-ex-text">{{ s.example }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ws-soft-sell-warning">
        <svg viewBox="0 0 20 20" fill="#dc2626" width="13" height="13"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
        <span>Don't open Email 3 with a hard pitch, a discount offer, or promotional language. Readers who felt they were getting to know a person discover they were being warmed up for a sales funnel. The sequence that was building trust reframes itself as manipulation.</span>
      </div>
      <div class="ws-subject-guide">
        <p class="ws-subject-label">Subject line options:</p>
        <div class="ws-subject-option" *ngFor="let s of email3Subjects" (click)="subjectSelected.emit(s.line)">
          <span class="ws-subject-line">"{{ s.line }}"</span>
          <span class="ws-subject-why">{{ s.why }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ws-email-section { display:flex; flex-direction:column; gap:.875rem; }
    .ws-email-header { display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; padding:.75rem 1rem; border-radius:10px; }
    .ws-email-header.e3 { background:rgba(245,158,11,.06); border:1.5px solid rgba(245,158,11,.2); }
    .ws-email-badge { font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; padding:.2rem .55rem; border-radius:20px; background:rgba(245,158,11,.15); color:#d97706; }
    .ws-email-name { font-size:.9375rem; font-weight:700; color:#0f172a; }
    .ws-email-timing { font-size:.75rem; color:#94a3b8; margin-left:auto; }
    .ws-callout { display:flex; align-items:flex-start; gap:.625rem; padding:.875rem 1rem; border-radius:0 10px 10px 0; font-size:.8rem; line-height:1.55; }
    .ws-callout.amber { background:rgba(245,158,11,.06); border-left:3px solid #f59e0b; color:#78350f; }
    .ws-callout svg { flex-shrink:0; margin-top:2px; color:#d97706; }
    .ws-callout p { margin:0; }
    .ws-soft-sell-guide { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-guide-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .ws-soft-sell-item { display:flex; align-items:flex-start; gap:.75rem; margin-bottom:.625rem; }
    .ws-soft-sell-item:last-child { margin-bottom:0; }
    .ws-soft-sell-num { width:22px; height:22px; border-radius:50%; background:#f59e0b; color:#fff; font-size:.7rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
    .ws-soft-sell-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .ws-soft-sell-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.45; }
    .ws-soft-sell-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.375rem; padding:.4rem .625rem; background:rgba(245,158,11,.05); border-radius:6px; }
    .ws-ex-label { font-size:.68rem; font-weight:700; color:#d97706; white-space:nowrap; }
    .ws-ex-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .ws-soft-sell-warning { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(220,38,38,.05); border:1px solid rgba(220,38,38,.15); border-radius:8px; font-size:.78rem; color:#7f1d1d; line-height:1.5; }
    .ws-subject-guide { display:flex; flex-direction:column; gap:.375rem; }
    .ws-subject-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .25rem; }
    .ws-subject-option { display:flex; align-items:flex-start; gap:.75rem; padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:border-color .15s; }
    .ws-subject-option:hover { border-color:#f59e0b; }
    .ws-subject-line { font-size:.8125rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .ws-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
  `]
})
export class WsEmail3Component {
  @Input() emailStep: FlowStep | null = null;
  @Input() showScheduleError = false;
  @Output() subjectSelected = new EventEmitter<string>();
  @Output() scheduleChange = new EventEmitter<string>();

  get timingLabel(): string {
    if (!this.emailStep?.scheduledAt) return 'Set send date & time below';
    const d = new Date(this.emailStep.scheduledAt);
    return Number.isNaN(d.getTime()) ? 'Scheduled' : `Scheduled: ${d.toLocaleString()}`;
  }

  readonly email3Structure = [
    { num: '1', title: 'Paint the reading experience', desc: 'Not a catalog list or cover images with buy links. Describe what it feels like to be inside one of your books — the pace, the atmosphere, the emotional register, the kind of reader who tends to find them.', example: '"My books tend to move fast, but they make room for the moments between the action — the conversations where characters say the things they\'ve been avoiding."' },
    { num: '2', title: 'Recommend where to start', desc: 'A specific, confident answer to: if I\'ve never read you before, what should I read first? Most readers appreciate being told where to start. It removes a decision they were going to have to make anyway.', example: null },
    { num: '3', title: 'Cover image + hook + social proof', desc: 'Include your cover image for the recommended title. Two or three sentences of your hook. A short line of reader praise if you have something particularly compelling.', example: null },
    { num: '4', title: 'One CTA — one link', desc: 'One button, one link, directly to the purchase or sample page. This is the soft sell moment — not urgency mechanics, not a promotional discount. Just a warm, confident recommendation.', example: null },
  ];

  readonly email3Subjects = [
    { line: 'What you can expect from my books', why: 'Direct and honest — sets up the reading experience description that follows' },
    { line: 'Where I\'d suggest you start', why: 'Personal and opinionated — two qualities that tend to drive opens' },
    { line: 'The book I\'d put in your hands first', why: 'Works particularly well for series authors — signals a confident recommendation' },
  ];
}
