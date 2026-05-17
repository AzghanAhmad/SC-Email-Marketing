import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rmd-reporting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rmd-reporting-section">
      <p class="rmd-body">ScribeCount's flow reporting surfaces the click rate on the delivery link — the primary performance metric for this flow. Both emails have their own click rate visible in your flow dashboard, updated in real time.</p>

      <div class="rmd-metrics-grid">
        <div class="rmd-metric-card primary">
          <div class="rmd-metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <div>
            <span class="rmd-metric-label">Delivery Email Click Rate</span>
            <span class="rmd-metric-desc">Primary metric — tells you the email is arriving, the link is visible, and readers are downloading</span>
            <span class="rmd-metric-val">{{ deliveryClickRate }}%</span>
          </div>
        </div>
        <div class="rmd-metric-card secondary">
          <div class="rmd-metric-icon secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          </div>
          <div>
            <span class="rmd-metric-label">Follow-Up Click Rate</span>
            <span class="rmd-metric-desc">Secondary metric — fraction of readers who needed the second delivery attempt</span>
            <span class="rmd-metric-val secondary">{{ followupClickRate }}%</span>
          </div>
        </div>
      </div>

      <div class="rmd-diagnostic-signals">
        <p class="rmd-signals-label">What the data tells you:</p>
        <div class="rmd-signal-item" *ngFor="let s of diagnosticSignals">
          <div class="rmd-signal-icon" [ngClass]="s.type">
            <svg *ngIf="s.type === 'warn'" viewBox="0 0 20 20" fill="#d97706" width="12" height="12"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
            <svg *ngIf="s.type === 'good'" viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          </div>
          <span>{{ s.signal }}</span>
        </div>
      </div>

      <div class="rmd-multiple-magnets">
        <div class="rmd-mm-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Multiple Reader Magnets</span>
        </div>
        <p class="rmd-body">If you have multiple reader magnets — different free stories for different series — create a separate delivery flow for each one, each triggered by the opt-in form associated with that specific magnet. ScribeCount supports multiple active delivery flows simultaneously, so your different list-building entry points each deliver their specific promised content without any manual management.</p>
      </div>

      <div class="rmd-speed-note">
        <div class="rmd-speed-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div>
          <span class="rmd-speed-title">Speed is a quality signal</span>
          <p class="rmd-speed-desc">The gap between opt-in and delivery email is measured in seconds for ScribeCount Email — the trigger fires the moment the opt-in event is received, not at the next batch processing window. A reader who fills in their email address and then opens their inbox to find the delivery email already waiting has a materially different first impression than one who waits five or ten minutes wondering whether their opt-in worked.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rmd-reporting-section { display:flex; flex-direction:column; gap:.875rem; }
    .rmd-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .rmd-metrics-grid { display:grid; grid-template-columns:1fr 1fr; gap:.625rem; }
    .rmd-metric-card { display:flex; align-items:flex-start; gap:.75rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .rmd-metric-card.primary { border-color:rgba(59,130,246,.25); background:rgba(59,130,246,.03); }
    .rmd-metric-card.secondary { border-color:rgba(245,158,11,.2); background:rgba(245,158,11,.03); }
    .rmd-metric-icon { width:32px; height:32px; border-radius:8px; background:rgba(59,130,246,.1); color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rmd-metric-icon.secondary { background:rgba(245,158,11,.1); color:#d97706; }
    .rmd-metric-label { display:block; font-size:.8rem; font-weight:700; color:#0f172a; margin-bottom:.2rem; }
    .rmd-metric-desc { display:block; font-size:.72rem; color:#64748b; line-height:1.4; margin-bottom:.375rem; }
    .rmd-metric-val { display:block; font-size:1.375rem; font-weight:900; color:#3b82f6; letter-spacing:-.02em; }
    .rmd-metric-val.secondary { color:#d97706; }
    .rmd-diagnostic-signals { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .rmd-signals-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .rmd-signal-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.45; margin-bottom:.5rem; }
    .rmd-signal-item:last-child { margin-bottom:0; }
    .rmd-signal-icon { flex-shrink:0; margin-top:1px; }
    .rmd-multiple-magnets { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .rmd-mm-header { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.5rem; }
    .rmd-speed-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(245,158,11,.04); border:1.5px solid rgba(245,158,11,.15); border-radius:10px; }
    .rmd-speed-icon { width:32px; height:32px; border-radius:8px; background:rgba(245,158,11,.1); color:#d97706; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rmd-speed-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .rmd-speed-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    @media(max-width:480px) { .rmd-metrics-grid { grid-template-columns:1fr; } }
  `]
})
export class RmdReportingComponent {
  deliveryClickRate = 74;
  followupClickRate = 31;

  readonly diagnosticSignals = [
    { type: 'good', signal: 'High delivery click rate → email is arriving, link is visible, readers are downloading' },
    { type: 'warn', signal: 'Low delivery click rate → possible deliverability issue (landing in spam), broken BookFunnel URL, or mismatch between what readers expected and what the email offered' },
    { type: 'warn', signal: 'Consistently high follow-up click rate → delivery email\'s link placement or labeling needs improvement, or deliverability to certain email providers is reducing reach of the first email' },
  ];
}
