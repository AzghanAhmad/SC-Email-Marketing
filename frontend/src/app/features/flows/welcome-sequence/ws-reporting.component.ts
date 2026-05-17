import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ws-reporting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ws-reporting-section">
      <p class="ws-body">ScribeCount's flow reporting surfaces the open rate, click rate, and goal completion rate for each email in your welcome sequence. Over time, patterns emerge that tell you exactly where to improve.</p>

      <div class="ws-metrics-grid">
        <div class="ws-metric-card" *ngFor="let m of reportingMetrics">
          <div class="ws-metric-val" [style.color]="m.color">{{ m.value }}</div>
          <div class="ws-metric-label">{{ m.label }}</div>
          <div class="ws-metric-email">{{ m.email }}</div>
        </div>
      </div>

      <div class="ws-reporting-signals">
        <p class="ws-signals-label">What the data tells you:</p>
        <div class="ws-signal-item" *ngFor="let s of reportingSignals">
          <div class="ws-signal-icon" [ngClass]="s.type">
            <svg *ngIf="s.type === 'warn'" viewBox="0 0 20 20" fill="#d97706" width="12" height="12">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
            <svg *ngIf="s.type === 'good'" viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span>{{ s.signal }}</span>
        </div>
      </div>

      <div class="ws-revenue-note">
        <div class="ws-rev-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <div>
          <span class="ws-rev-title">Connected to purchase data</span>
          <p class="ws-rev-desc">ScribeCount connects welcome sequence performance to your store's purchase data — how many readers who completed the sequence made a first purchase within 30 days, and how that compares to readers who joined before the sequence was in place. That data makes the case for the welcome sequence in language every author understands: revenue.</p>
        </div>
      </div>

      <div class="ws-edit-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        <span>Edit your sequence regularly as your voice and catalog evolve. The welcome sequence you build today will still be building reader relationships a year from now — for every new subscriber who joins between now and whenever you update it.</span>
      </div>
    </div>
  `,
  styles: [`
    .ws-reporting-section { display:flex; flex-direction:column; gap:.875rem; }
    .ws-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .ws-metrics-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.625rem; }
    .ws-metric-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; display:flex; flex-direction:column; gap:.2rem; }
    .ws-metric-val { font-size:1.5rem; font-weight:900; letter-spacing:-.03em; line-height:1; }
    .ws-metric-label { font-size:.75rem; font-weight:600; color:#374151; }
    .ws-metric-email { font-size:.7rem; color:#94a3b8; }
    .ws-reporting-signals { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-signals-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .ws-signal-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.45; margin-bottom:.5rem; }
    .ws-signal-item:last-child { margin-bottom:0; }
    .ws-signal-icon { flex-shrink:0; margin-top:1px; }
    .ws-revenue-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(59,130,246,.04); border:1.5px solid rgba(59,130,246,.12); border-radius:10px; }
    .ws-rev-icon { width:32px; height:32px; border-radius:8px; background:rgba(59,130,246,.1); color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ws-rev-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .ws-rev-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .ws-edit-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:#f0fdf4; border-left:3px solid #10b981; border-radius:0 8px 8px 0; font-size:.78rem; color:#166534; line-height:1.5; }
    .ws-edit-note svg { flex-shrink:0; margin-top:2px; color:#10b981; }
    @media(max-width:480px) { .ws-metrics-grid { grid-template-columns:1fr; } }
  `]
})
export class WsReportingComponent {
  readonly reportingMetrics = [
    { value: '58%', label: 'Open rate', email: 'Email 1 — The Welcome', color: '#6366f1' },
    { value: '51%', label: 'Open rate', email: 'Email 2 — Story Behind Author', color: '#3b82f6' },
    { value: '44%', label: 'Open rate', email: 'Email 3 — World of Books', color: '#f59e0b' },
    { value: '38%', label: 'Open rate', email: 'Email 4 — The Invitation', color: '#10b981' },
  ];

  readonly reportingSignals = [
    { type: 'warn', signal: 'Drop in open rate at Email 3 → subject line or timing needs adjustment' },
    { type: 'good', signal: 'Consistently high click rate on Email 3 recommendation → soft sell is landing' },
    { type: 'good', signal: 'High goal exit rate early in the sequence → catalog introduction is working faster than expected (a genuinely good problem)' },
    { type: 'warn', signal: 'Low open rate on Email 2 → your Email 1 subject line or preview text may not be setting up the sequence correctly' },
  ];
}
