import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-scribecount-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-setup">
      <h4 class="res-title">Building and running the flow in ScribeCount</h4>
      <p class="res-sub">
        The re-engagement flow runs automatically based on the inactivity threshold you define.
        ScribeCount monitors engagement continuously, flags subscribers who cross the threshold,
        surfaces them in list health, and begins the sequence on your configured schedule.
      </p>

      <div class="res-timing">
        <h5 class="res-section-title">Default sequence timing</h5>
        <div class="res-timeline">
          <div class="res-step" *ngFor="let s of timeline; let last = last">
            <div class="res-step-dot" [style.background]="s.color"></div>
            <div class="res-step-body">
              <span class="res-step-when">{{ s.when }}</span>
              <span class="res-step-what">{{ s.what }}</span>
            </div>
            <div class="res-step-line" *ngIf="!last"></div>
          </div>
        </div>
        <p class="res-timing-note">
          The full window from first email to removal is typically two to three weeks — long enough
          for readers temporarily away from their inbox without losing practical list hygiene value.
        </p>
      </div>

      <div class="res-ships">
        <h5 class="res-section-title">Pre-built template includes</h5>
        <div class="res-ship-item" *ngFor="let item of templateIncludes">
          <svg viewBox="0 0 20 20" fill="#db2777" width="11" height="11">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
          </svg>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .re-setup { margin-bottom: 1.25rem; }
    .res-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .res-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.55; }
    .res-section-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem; }

    .res-timing { margin-bottom: .875rem; }
    .res-timeline { display: flex; flex-direction: column; gap: 0; margin-bottom: .5rem; }
    .res-step { display: flex; align-items: flex-start; gap: .625rem; position: relative; padding-bottom: .75rem; }
    .res-step-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: .25rem; z-index: 1; }
    .res-step-line { position: absolute; left: 4px; top: 14px; bottom: 0; width: 2px; background: #e2e8f0; }
    .res-step-when { display: block; font-size: .72rem; font-weight: 700; color: #0f172a; }
    .res-step-what { display: block; font-size: .72rem; color: #64748b; line-height: 1.4; }
    .res-timing-note { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.45; font-style: italic; }

    .res-ships { display: flex; flex-direction: column; gap: .35rem; }
    .res-ship-item { display: flex; align-items: flex-start; gap: .35rem; font-size: .72rem; color: #374151; line-height: 1.4; }
  `]
})
export class ReScribecountSetupComponent {
  timeline = [
    { when: 'Day 0', what: 'Email 1 — warm check-in when inactivity threshold is crossed', color: '#db2777' },
    { when: 'Day 5–7', what: 'Email 2 — last chance if no open, click, or re-engagement action', color: '#be185d' },
    { when: 'Day 8–10', what: 'Email 3 (optional) — preference adjustment offer', color: '#9d174d' },
    { when: 'After sequence', what: 'Removal email + exit from active list if still unresponsive', color: '#64748b' },
  ];
  templateIncludes = [
    'Two core emails + optional third preference-adjustment email with editable sample content',
    'Inactivity trigger, wait periods, and goal exit conditions pre-configured',
    'Author\'s Choice removal email on failed sequence',
    'List health dashboard integration for flagged subscribers',
  ];
}
