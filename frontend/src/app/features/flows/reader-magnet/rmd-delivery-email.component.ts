import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rmd-delivery-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rmd-delivery-section">
      <div class="rmd-email-header">
        <span class="rmd-email-badge">Email 1</span>
        <span class="rmd-email-name">The Delivery Email</span>
        <span class="rmd-email-timing">Fires within seconds of opt-in</span>
      </div>

      <div class="rmd-structure">
        <p class="rmd-struct-label">Email structure — in this exact order:</p>
        <div class="rmd-struct-item" *ngFor="let s of emailStructure">
          <div class="rmd-struct-num">{{ s.num }}</div>
          <div>
            <span class="rmd-struct-title">{{ s.title }}</span>
            <span class="rmd-struct-desc">{{ s.desc }}</span>
            <div class="rmd-struct-example" *ngIf="s.example">
              <span class="rmd-ex-label">Example:</span>
              <span class="rmd-ex-text">{{ s.example }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rmd-link-guidance">
        <div class="rmd-link-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span>Making the Link Unmissable</span>
        </div>
        <div class="rmd-link-dos">
          <div class="rmd-link-do" *ngFor="let d of linkDos">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ d }}</span>
          </div>
        </div>
      </div>

      <div class="rmd-bookfunnel-note">
        <div class="rmd-bf-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span class="rmd-bf-title">BookFunnel Delivery</span>
          <span class="rmd-bf-badge">Recommended</span>
        </div>
        <p class="rmd-body">Your BookFunnel link goes directly in the email as your primary download button. BookFunnel handles the format and device complexity that authors shouldn't have to manage — iPhone readers get the Books app, Kindle readers get a different file, Android readers get an ePub.</p>
        <div class="rmd-bf-sentence">
          <span class="rmd-bf-sentence-label">Include this one sentence:</span>
          <div class="rmd-bf-example">"I deliver my free content through BookFunnel, which sends your book directly to your preferred reading app or device."</div>
          <p class="rmd-bf-why">Removes the small uncertainty of clicking a link to an unfamiliar site. That one sentence is all the context most readers need to click with confidence.</p>
        </div>
      </div>

      <div class="rmd-subject-guide">
        <p class="rmd-subject-label">Subject line options:</p>
        <div class="rmd-subject-option" *ngFor="let s of subjectLines" (click)="subjectSelected.emit(s.line)">
          <span class="rmd-subject-line">"{{ s.line }}"</span>
          <span class="rmd-subject-why">{{ s.why }}</span>
        </div>
      </div>

      <div class="rmd-preview-tip">
        <span class="rmd-preview-label">Preview text:</span>
        <span>"Click below to download directly to your reading app" or "Your link is inside — enjoy!" — brief, specific, warm.</span>
      </div>
    </div>
  `,
  styles: [`
    .rmd-delivery-section { display:flex; flex-direction:column; gap:.875rem; }
    .rmd-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .rmd-email-header { display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; padding:.75rem 1rem; background:rgba(59,130,246,.06); border:1.5px solid rgba(59,130,246,.15); border-radius:10px; }
    .rmd-email-badge { font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; padding:.2rem .55rem; border-radius:20px; background:rgba(59,130,246,.12); color:#3b82f6; }
    .rmd-email-name { font-size:.9375rem; font-weight:700; color:#0f172a; }
    .rmd-email-timing { font-size:.75rem; color:#94a3b8; margin-left:auto; }
    .rmd-structure { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .rmd-struct-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .rmd-struct-item { display:flex; align-items:flex-start; gap:.75rem; margin-bottom:.625rem; }
    .rmd-struct-item:last-child { margin-bottom:0; }
    .rmd-struct-num { width:22px; height:22px; border-radius:50%; background:#3b82f6; color:#fff; font-size:.7rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
    .rmd-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .rmd-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.45; }
    .rmd-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.375rem; padding:.4rem .625rem; background:rgba(59,130,246,.05); border-radius:6px; }
    .rmd-ex-label { font-size:.68rem; font-weight:700; color:#3b82f6; white-space:nowrap; }
    .rmd-ex-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .rmd-link-guidance { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .rmd-link-header { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.625rem; }
    .rmd-link-dos { display:flex; flex-direction:column; gap:.375rem; }
    .rmd-link-do { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.45; }
    .rmd-bookfunnel-note { background:rgba(99,102,241,.04); border:1.5px solid rgba(99,102,241,.15); border-radius:10px; padding:.875rem; }
    .rmd-bf-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; }
    .rmd-bf-title { font-size:.8125rem; font-weight:700; color:#0f172a; }
    .rmd-bf-badge { font-size:.65rem; font-weight:700; padding:.15rem .45rem; border-radius:20px; background:rgba(99,102,241,.1); color:#6366f1; }
    .rmd-bf-sentence { margin-top:.625rem; padding:.625rem .875rem; background:#fff; border-radius:8px; }
    .rmd-bf-sentence-label { font-size:.75rem; font-weight:600; color:#64748b; display:block; margin-bottom:.375rem; }
    .rmd-bf-example { font-size:.8rem; color:#374151; font-style:italic; line-height:1.5; padding:.5rem .75rem; background:rgba(99,102,241,.05); border-left:3px solid #6366f1; border-radius:0 6px 6px 0; margin-bottom:.375rem; }
    .rmd-bf-why { font-size:.75rem; color:#94a3b8; margin:0; line-height:1.4; }
    .rmd-subject-guide { display:flex; flex-direction:column; gap:.375rem; }
    .rmd-subject-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .25rem; }
    .rmd-subject-option { display:flex; align-items:flex-start; gap:.75rem; padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:border-color .15s; }
    .rmd-subject-option:hover { border-color:#3b82f6; }
    .rmd-subject-line { font-size:.8125rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .rmd-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .rmd-preview-tip { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(59,130,246,.05); border-radius:8px; font-size:.78rem; color:#374151; line-height:1.5; }
    .rmd-preview-label { font-weight:700; color:#3b82f6; white-space:nowrap; }
  `]
})
export class RmdDeliveryEmailComponent {
  @Output() subjectSelected = new EventEmitter<string>();

  readonly emailStructure = [
    { num: '1', title: 'Download link — first, above everything', desc: 'The reader opened this email with one question: where is it? Answer that question immediately. Not after a paragraph of introduction. Not buried below a welcome message. First.', example: 'A visually prominent button: "Download [Title] Now" or "Get Your Free Copy Here"' },
    { num: '2', title: 'Brief introduction — warm but short', desc: 'Two or three sentences after the link. Your name, what you write, and a single sentence of genuine warmth. The full author story is Email 2 of the welcome sequence — this email\'s job is to get out of the way while delivering something excellent.', example: '"I\'m [Name], and I write [genre]. I\'m genuinely glad you\'re here."' },
    { num: '3', title: 'Forward frame — prime the next email', desc: 'One or two sentences that transform the next email from an unexpected follow-up into an anticipated one. The reader who has been told to expect another email is far more likely to open it.', example: '"I\'ll be in touch soon with a bit more about who I am and what you can expect from being on this list."' },
  ];

  readonly linkDos = [
    'Visually prominent — a button, not a text link buried in a paragraph',
    'Labeled with unmistakable clarity: "Download [Title] Now" or "Access [Title]" — direct, specific, action-forward',
    'A reader who has to look twice to find the download link has already experienced a small friction that the best delivery emails eliminate entirely',
  ];

  readonly subjectLines = [
    { line: 'Your copy of [Title] is here', why: 'Immediately confirms the content has arrived — reader scanning their inbox will spot this instantly' },
    { line: '[Title] — here\'s your download link', why: 'Names the content and the action in the subject line itself' },
    { line: 'Your free [story/novella/chapter] is ready', why: 'Works when the reader magnet type is more important than the title' },
  ];
}
