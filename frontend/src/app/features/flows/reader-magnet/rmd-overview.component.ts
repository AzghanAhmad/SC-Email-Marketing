import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rmd-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rmd-overview">
      <div class="rmd-promise-callout">
        <div class="rmd-promise-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div>
          <span class="rmd-promise-title">The one non-negotiable promise in your email program</span>
          <p class="rmd-promise-desc">If you tell a reader they'll receive something in exchange for joining your list, they need to receive it. Immediately. Reliably. Without any friction between the moment they enter their email address and the moment the promised content is in their hands.</p>
        </div>
      </div>

      <div class="rmd-flow-diagram">
        <div class="rmd-flow-step" *ngFor="let step of flowSteps; let last = last">
          <div class="rmd-flow-node" [ngClass]="step.color">
            <div class="rmd-flow-icon" [innerHTML]="step.icon"></div>
          </div>
          <div class="rmd-flow-body">
            <span class="rmd-flow-title">{{ step.title }}</span>
            <span class="rmd-flow-desc">{{ step.desc }}</span>
          </div>
          <div class="rmd-flow-arrow" *ngIf="!last">↓</div>
        </div>
      </div>

      <div class="rmd-first-impression">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>The delivery email arrives <strong>before</strong> your welcome email, before your author story, before any of the relationship you intend to build. Its quality, warmth, and reliability are the first data points the reader uses to decide whether being on your list is going to be a good experience or a routine one.</p>
      </div>

      <div class="rmd-magnet-qualities">
        <p class="rmd-qualities-label">What makes a reader magnet worth delivering:</p>
        <div class="rmd-quality-item" *ngFor="let q of magnetQualities">
          <svg viewBox="0 0 20 20" fill="#6366f1" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <span>{{ q }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rmd-overview { display:flex; flex-direction:column; gap:.875rem; }
    .rmd-promise-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(16,185,129,.06); border-left:3px solid #10b981; border-radius:0 10px 10px 0; }
    .rmd-promise-icon { width:32px; height:32px; border-radius:8px; background:rgba(16,185,129,.1); color:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rmd-promise-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .rmd-promise-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .rmd-flow-diagram { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem; display:flex; flex-direction:column; gap:.375rem; }
    .rmd-flow-step { display:flex; align-items:flex-start; gap:.75rem; }
    .rmd-flow-node { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rmd-flow-node.trigger { background:rgba(245,158,11,.1); color:#d97706; }
    .rmd-flow-node.email { background:rgba(59,130,246,.1); color:#3b82f6; }
    .rmd-flow-node.wait { background:#f1f5f9; color:#64748b; }
    .rmd-flow-node.condition { background:rgba(139,92,246,.1); color:#8b5cf6; }
    .rmd-flow-node.goal { background:rgba(16,185,129,.1); color:#059669; }
    .rmd-flow-body { flex:1; }
    .rmd-flow-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; }
    .rmd-flow-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.4; }
    .rmd-flow-arrow { font-size:1rem; color:#cbd5e1; padding-left:1rem; }
    .rmd-first-impression { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:#f0f7ff; border-left:3px solid #3b82f6; border-radius:0 8px 8px 0; font-size:.8rem; color:#1e40af; line-height:1.55; }
    .rmd-first-impression svg { flex-shrink:0; margin-top:2px; color:#3b82f6; }
    .rmd-first-impression p { margin:0; }
    .rmd-first-impression strong { font-weight:700; }
    .rmd-magnet-qualities { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .rmd-qualities-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .rmd-quality-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.45; margin-bottom:.375rem; }
    .rmd-quality-item:last-child { margin-bottom:0; }
  `]
})
export class RmdOverviewComponent {
  readonly flowSteps = [
    { title: 'Opt-in fires trigger', desc: 'Within seconds of form submission — not at the next batch window', color: 'trigger', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
    { title: 'Delivery Email sends', desc: 'Download link first, brief introduction, forward frame toward welcome sequence', color: 'email', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { title: 'Wait 24–48 hours', desc: 'ScribeCount checks whether the reader clicked the download link', color: 'wait', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { title: 'Conditional branch', desc: 'Downloaded → Welcome Sequence. Not downloaded → Delivery Follow-Up', color: 'condition', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { title: 'Goal Exit', desc: 'Tagged confirmed-download, transitions to Welcome Sequence', color: 'goal', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
  ];

  readonly magnetQualities = [
    'Generous — a full short story, novella, complete prequel, or substantial bonus chapter. Something that feels like a real gift, not a teaser.',
    'Authentic to your voice and genre — the reader who downloads it is immediately experiencing the same kind of writing they\'ll find in your books.',
    'Positioned at the entry point of your catalog — a reader who loves the magnet has somewhere natural to go next.',
  ];
}
