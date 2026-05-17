import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ws-logic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ws-logic-section">
      <p class="ws-body">The welcome sequence includes conditional logic that detects when a subscriber purchases a book while in the sequence and adjusts what they receive accordingly. This is what separates a sophisticated welcome sequence from a linear email drip.</p>
      <div class="ws-logic-diagram">
        <div class="ws-logic-node trigger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          New subscriber joins
        </div>
        <div class="ws-logic-arrow">↓</div>
        <div class="ws-logic-node email">Emails 1–3 send as normal</div>
        <div class="ws-logic-arrow">↓</div>
        <div class="ws-logic-condition">
          <div class="ws-logic-condition-label">Did reader purchase after Email 3?</div>
          <div class="ws-logic-branches">
            <div class="ws-logic-branch yes">
              <div class="ws-branch-badge yes">YES</div>
              <div class="ws-branch-text">Moves to post-purchase flow — receives thank-you and review request instead of Email 4's purchase invitation</div>
            </div>
            <div class="ws-logic-branch no">
              <div class="ws-branch-badge no">NO</div>
              <div class="ws-branch-text">Receives Email 4 — the direct, confident book recommendation for readers who haven't bought yet</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ws-logic-note">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
        <span>A reader who bought immediately doesn't need to be sold to again. A reader who hasn't bought yet needs Email 4's direct invitation. The flow handles both paths automatically.</span>
      </div>
      <div class="ws-personalization">
        <div class="ws-pers-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span class="ws-pers-title">Personalization Throughout</span>
        </div>
        <p class="ws-body">Every email uses first-name personalization in both the subject line and body. ScribeCount pulls the subscriber's first name from the opt-in form automatically — you don't configure it separately for each email.</p>
        <div class="ws-behavioral-tags">
          <p class="ws-tags-label">Behavioral tags built during the sequence:</p>
          <div class="ws-tags-row">
            <span class="ws-tag" *ngFor="let tag of behavioralTags">{{ tag }}</span>
          </div>
          <p class="ws-tags-note">These tags become the foundation for more precisely targeted campaigns and flows that serve readers later in their relationship with your list.</p>
        </div>
      </div>
      <div class="ws-timing-defaults">
        <div class="ws-timing-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Default Timing (configurable)</span>
        </div>
        <div class="ws-timing-row" *ngFor="let t of timingDefaults">
          <span class="ws-timing-email">{{ t.email }}</span>
          <span class="ws-timing-when">{{ t.when }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ws-logic-section { display:flex; flex-direction:column; gap:.875rem; }
    .ws-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .ws-logic-diagram { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem; display:flex; flex-direction:column; align-items:center; gap:.5rem; }
    .ws-logic-node { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem; border-radius:8px; font-size:.8rem; font-weight:600; }
    .ws-logic-node.trigger { background:rgba(245,158,11,.1); color:#d97706; border:1.5px solid rgba(245,158,11,.2); }
    .ws-logic-node.email { background:rgba(59,130,246,.1); color:#3b82f6; border:1.5px solid rgba(59,130,246,.2); }
    .ws-logic-arrow { font-size:1.25rem; color:#cbd5e1; line-height:1; }
    .ws-logic-condition { width:100%; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .ws-logic-condition-label { font-size:.8rem; font-weight:700; color:#0f172a; margin-bottom:.75rem; text-align:center; }
    .ws-logic-branches { display:grid; grid-template-columns:1fr 1fr; gap:.625rem; }
    .ws-logic-branch { padding:.75rem; border-radius:8px; }
    .ws-logic-branch.yes { background:#f0fdf4; border:1.5px solid #bbf7d0; }
    .ws-logic-branch.no { background:#fff7ed; border:1.5px solid #fed7aa; }
    .ws-branch-badge { display:inline-block; padding:.15rem .5rem; border-radius:6px; font-size:.68rem; font-weight:800; letter-spacing:.05em; margin-bottom:.375rem; }
    .ws-branch-badge.yes { background:#dcfce7; color:#16a34a; }
    .ws-branch-badge.no { background:#ffedd5; color:#c2410c; }
    .ws-branch-text { font-size:.75rem; color:#374151; line-height:1.45; }
    .ws-logic-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:#f0f7ff; border-left:3px solid #3b82f6; border-radius:0 8px 8px 0; font-size:.78rem; color:#1e40af; line-height:1.5; }
    .ws-personalization { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .ws-pers-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; }
    .ws-pers-title { font-size:.8125rem; font-weight:700; color:#0f172a; }
    .ws-behavioral-tags { margin-top:.75rem; padding:.75rem; background:#f8fafc; border-radius:8px; }
    .ws-tags-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .5rem; }
    .ws-tags-row { display:flex; flex-wrap:wrap; gap:.375rem; margin-bottom:.5rem; }
    .ws-tag { padding:.2rem .6rem; background:#ede9fe; color:#6d28d9; border-radius:20px; font-size:.72rem; font-weight:600; }
    .ws-tags-note { font-size:.75rem; color:#94a3b8; margin:0; line-height:1.4; }
    .ws-timing-defaults { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-timing-header { display:flex; align-items:center; gap:.5rem; font-size:.8rem; font-weight:700; color:#0f172a; margin-bottom:.625rem; }
    .ws-timing-row { display:flex; align-items:center; justify-content:space-between; padding:.375rem 0; border-bottom:1px solid #f1f5f9; font-size:.8rem; }
    .ws-timing-row:last-child { border-bottom:none; }
    .ws-timing-email { font-weight:600; color:#374151; }
    .ws-timing-when { color:#64748b; }
    @media(max-width:500px) { .ws-logic-branches { grid-template-columns:1fr; } }
  `]
})
export class WsLogicComponent {
  readonly behavioralTags = ['welcome-complete', 'clicked-book-link', 'magnet-downloaded', 'engaged-week-one', 'first-purchase'];

  readonly timingDefaults = [
    { email: 'Email 1 — The Welcome', when: 'Immediately on opt-in' },
    { email: 'Email 2 — Story Behind the Author', when: '1–2 days after Email 1' },
    { email: 'Email 3 — World of Your Books', when: '2–3 days after Email 2' },
    { email: 'Email 4 — The Invitation', when: '3–5 days after Email 3' },
  ];
}
