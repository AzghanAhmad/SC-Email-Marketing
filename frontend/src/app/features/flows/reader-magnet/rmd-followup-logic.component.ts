import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rmd-followup-logic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rmd-followup-section">

      <!-- Conditional branch diagram -->
      <div class="rmd-branch-diagram">
        <div class="rmd-branch-condition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span>24–48 hours after delivery email: Did the reader click the download link?</span>
        </div>
        <div class="rmd-branch-paths">
          <div class="rmd-branch-path yes">
            <div class="rmd-branch-badge yes">YES</div>
            <div class="rmd-branch-title">Downloaded</div>
            <div class="rmd-branch-steps">
              <div class="rmd-branch-step">Tag: <strong>confirmed-download</strong></div>
              <div class="rmd-branch-step">→ Move to Welcome Sequence</div>
            </div>
          </div>
          <div class="rmd-branch-path no">
            <div class="rmd-branch-badge no">NO</div>
            <div class="rmd-branch-title">Not Downloaded</div>
            <div class="rmd-branch-steps">
              <div class="rmd-branch-step">→ Send Delivery Follow-Up</div>
              <div class="rmd-branch-step">→ Wait 1–2 days</div>
              <div class="rmd-branch-step">→ Move to Welcome Sequence regardless</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rmd-why-check">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
        <span>Download rates on delivery emails are high but not perfect. Some readers intend to download later and forget. Some click to a device where the file won't open easily. Some experience a technical issue. The conditional check catches these readers before they fall through the cracks.</span>
      </div>

      <!-- Follow-up email -->
      <div class="rmd-followup-email">
        <div class="rmd-email-header followup">
          <span class="rmd-email-badge">Email 2</span>
          <span class="rmd-email-name">Delivery Follow-Up</span>
          <span class="rmd-email-timing">Non-downloaders only</span>
        </div>
        <div class="rmd-followup-tone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Tone: helpful, not urgent. This is not a pressure email. It doesn't manufacture urgency or imply the download opportunity is disappearing.</span>
        </div>
        <div class="rmd-followup-example">
          <p class="rmd-example-label">Example copy:</p>
          <div class="rmd-example-block">"Hey [First Name] — just wanted to make sure [Title] made it to you. Sometimes these emails wander into spam, and I'd hate for you to miss it. Here's the download link again, and if you're having any trouble opening the file, hit reply and I'll sort it out for you."</div>
        </div>
        <div class="rmd-followup-elements">
          <div class="rmd-followup-el" *ngFor="let el of followupElements">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ el }}</span>
          </div>
        </div>
        <div class="rmd-subject-guide">
          <p class="rmd-subject-label">Subject line options:</p>
          <div class="rmd-subject-option" *ngFor="let s of followupSubjects" (click)="subjectSelected.emit(s.line)">
            <span class="rmd-subject-line">"{{ s.line }}"</span>
            <span class="rmd-subject-why">{{ s.why }}</span>
          </div>
        </div>
      </div>

      <!-- Move forward regardless -->
      <div class="rmd-move-forward">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>
        <div>
          <span class="rmd-mf-title">Move forward regardless</span>
          <p class="rmd-mf-desc">Whether or not the reader downloads after the follow-up, the flow moves them into the welcome sequence within another day or two. The delivery flow's job is to make every reasonable attempt to get the reader their content — not to hold the relationship hostage to a download event.</p>
        </div>
      </div>

      <!-- Confirmed download tag -->
      <div class="rmd-tag-note">
        <div class="rmd-tag-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span>confirmed-download tag</span>
        </div>
        <p class="rmd-body">Applied when the reader clicks the download link. Useful for future segmentation — a reader who downloaded and then received the welcome sequence is in a different position than one who downloaded and went immediately cold. Over time, tracking download completion alongside subsequent engagement gives you a nuanced picture of which acquisition sources produce the most engaged long-term subscribers.</p>
      </div>
    </div>
  `,
  styles: [`
    .rmd-followup-section { display:flex; flex-direction:column; gap:.875rem; }
    .rmd-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .rmd-branch-diagram { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem; }
    .rmd-branch-condition { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.875rem; padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; }
    .rmd-branch-condition svg { flex-shrink:0; color:#8b5cf6; }
    .rmd-branch-paths { display:grid; grid-template-columns:1fr 1fr; gap:.625rem; }
    .rmd-branch-path { padding:.875rem; border-radius:10px; }
    .rmd-branch-path.yes { background:#f0fdf4; border:1.5px solid #bbf7d0; }
    .rmd-branch-path.no { background:#fff7ed; border:1.5px solid #fed7aa; }
    .rmd-branch-badge { display:inline-block; padding:.15rem .5rem; border-radius:6px; font-size:.68rem; font-weight:800; letter-spacing:.05em; margin-bottom:.375rem; }
    .rmd-branch-badge.yes { background:#dcfce7; color:#16a34a; }
    .rmd-branch-badge.no { background:#ffedd5; color:#c2410c; }
    .rmd-branch-title { font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.375rem; }
    .rmd-branch-steps { display:flex; flex-direction:column; gap:.2rem; }
    .rmd-branch-step { font-size:.75rem; color:#374151; line-height:1.4; }
    .rmd-branch-step strong { font-weight:700; color:#6d28d9; }
    .rmd-why-check { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:#f0f7ff; border-left:3px solid #3b82f6; border-radius:0 8px 8px 0; font-size:.78rem; color:#1e40af; line-height:1.5; }
    .rmd-followup-email { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; display:flex; flex-direction:column; gap:.625rem; }
    .rmd-email-header { display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; padding:.625rem .875rem; border-radius:8px; }
    .rmd-email-header.followup { background:rgba(245,158,11,.06); border:1.5px solid rgba(245,158,11,.2); }
    .rmd-email-badge { font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; padding:.2rem .55rem; border-radius:20px; background:rgba(245,158,11,.15); color:#d97706; }
    .rmd-email-name { font-size:.875rem; font-weight:700; color:#0f172a; }
    .rmd-email-timing { font-size:.75rem; color:#94a3b8; margin-left:auto; }
    .rmd-followup-tone { display:flex; align-items:flex-start; gap:.5rem; padding:.5rem .75rem; background:rgba(245,158,11,.05); border-radius:8px; font-size:.78rem; color:#78350f; line-height:1.5; }
    .rmd-followup-tone svg { flex-shrink:0; margin-top:1px; color:#d97706; }
    .rmd-example-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .375rem; }
    .rmd-example-block { font-size:.8rem; color:#374151; font-style:italic; line-height:1.55; padding:.625rem .875rem; background:#f8fafc; border-left:3px solid #f59e0b; border-radius:0 8px 8px 0; }
    .rmd-followup-elements { display:flex; flex-direction:column; gap:.375rem; }
    .rmd-followup-el { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.45; }
    .rmd-subject-guide { display:flex; flex-direction:column; gap:.375rem; }
    .rmd-subject-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .25rem; }
    .rmd-subject-option { display:flex; align-items:flex-start; gap:.75rem; padding:.5rem .75rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:border-color .15s; }
    .rmd-subject-option:hover { border-color:#f59e0b; }
    .rmd-subject-line { font-size:.8125rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .rmd-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .rmd-move-forward { display:flex; align-items:flex-start; gap:.75rem; padding:.875rem 1rem; background:rgba(16,185,129,.04); border:1.5px solid rgba(16,185,129,.15); border-radius:10px; }
    .rmd-move-forward svg { flex-shrink:0; margin-top:2px; color:#059669; }
    .rmd-mf-title { display:block; font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.25rem; }
    .rmd-mf-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.55; }
    .rmd-tag-note { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .rmd-tag-header { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:700; color:#6d28d9; margin-bottom:.5rem; }
    @media(max-width:500px) { .rmd-branch-paths { grid-template-columns:1fr; } }
  `]
})
export class RmdFollowupLogicComponent {
  @Output() subjectSelected = new EventEmitter<string>();

  readonly followupElements = [
    'Download link resent prominently — the primary CTA, not buried in the body',
    'Acknowledge the email may have gone to spam — removes the reader\'s uncertainty about what happened',
    'Invite reply for direct support — creates a support channel without requiring a formal process',
    'No pressure, no urgency — warm and helpful, not a collection notice',
  ];

  readonly followupSubjects = [
    { line: 'Did your copy of [Title] arrive okay?', why: 'Warm and direct — acknowledges the situation without pressure' },
    { line: 'Just checking — here\'s your [Title] link again', why: 'Practical and friendly — makes the purpose of the email immediately clear' },
  ];
}
