import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ws-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ws-overview">
      <p class="ws-body">Four emails over roughly a week. Each has a specific job. Together they introduce who you are, why you write, what your books offer, and what readers can expect going forward.</p>
      <div class="ws-open-rate-callout">
        <div class="ws-or-stat">
          <span class="ws-or-num">50%+</span>
          <span class="ws-or-label">Typical open rate</span>
        </div>
        <p class="ws-or-desc">Welcome emails routinely exceed 50% open rates. The reader who just signed up is at the peak of their curiosity about you. This attention window is finite — what you do with the first few days determines whether you earn a lasting place in their inbox.</p>
      </div>
      <div class="ws-sequence-overview">
        <div class="ws-seq-item" *ngFor="let e of emailOverview" (click)="tabSelect.emit(e.tab)">
          <div class="ws-seq-num" [style.background]="e.color">{{ e.num }}</div>
          <div class="ws-seq-body">
            <span class="ws-seq-title">{{ e.title }}</span>
            <span class="ws-seq-timing">{{ e.timing }}</span>
            <span class="ws-seq-job">{{ e.job }}</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
      <div class="ws-why-four">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>Four emails spread across the first week gives you room to do each job well, in sequence, without overwhelming the reader on day one. The sequence rewards itself — readers who opened Email 1 are primed to open Email 2. Front-load your best thinking into these four emails.</p>
      </div>
    </div>
  `,
  styles: [`
    .ws-overview { display:flex; flex-direction:column; gap:.875rem; }
    .ws-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .ws-open-rate-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(59,130,246,.06)); border:1.5px solid rgba(99,102,241,.15); border-radius:12px; }
    .ws-or-stat { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
    .ws-or-num { font-size:1.75rem; font-weight:900; color:#6366f1; letter-spacing:-.03em; line-height:1; }
    .ws-or-label { font-size:.65rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; text-align:center; white-space:nowrap; }
    .ws-or-desc { font-size:.78rem; color:#334155; line-height:1.55; margin:0; }
    .ws-sequence-overview { display:flex; flex-direction:column; gap:.375rem; }
    .ws-seq-item { display:flex; align-items:center; gap:.75rem; padding:.75rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .ws-seq-item:hover { border-color:#bfdbfe; }
    .ws-seq-num { width:26px; height:26px; border-radius:50%; color:#fff; font-size:.75rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ws-seq-body { flex:1; display:flex; flex-direction:column; gap:.1rem; }
    .ws-seq-title { font-size:.8125rem; font-weight:700; color:#0f172a; }
    .ws-seq-timing { font-size:.7rem; color:#94a3b8; }
    .ws-seq-job { font-size:.75rem; color:#64748b; line-height:1.4; }
    .ws-why-four { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:#f0f7ff; border-left:3px solid #3b82f6; border-radius:0 10px 10px 0; font-size:.78rem; color:#1e40af; line-height:1.55; }
    .ws-why-four svg { flex-shrink:0; margin-top:2px; color:#3b82f6; }
    .ws-why-four p { margin:0; }
  `]
})
export class WsOverviewComponent {
  @Output() tabSelect = new EventEmitter<string>();

  readonly emailOverview = [
    { num: '1', color: '#6366f1', title: 'The Welcome', timing: 'Immediately on opt-in', job: 'Deliver promised content, introduce yourself, set expectations', tab: 'email1' },
    { num: '2', color: '#3b82f6', title: 'The Story Behind the Author', timing: '1–2 days after Email 1', job: 'Create human connection — your story, not a professional bio', tab: 'email2' },
    { num: '3', color: '#f59e0b', title: 'The World of Your Books', timing: '2–3 days after Email 2', job: 'Soft sell — paint the reading experience, recommend where to start', tab: 'email3' },
    { num: '4', color: '#10b981', title: 'The Invitation', timing: '3–5 days after Email 3', job: 'Close onboarding — invite into community, direct CTA toward key title', tab: 'email4' },
  ];
}
