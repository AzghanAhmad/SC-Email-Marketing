import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CalendarEvent {
  id: string; name: string; type: string; date: string;
  status: 'planned' | 'draft' | 'scheduled' | 'sent';
}

export interface CampaignTypeOption {
  id: string; label: string; purpose: string; audience: string; icon: string; color: string;
}

@Component({
  selector: 'app-campaign-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Campaigns vs Flows explainer -->
    <div class="cvf-callout glass-card">
      <div class="cvf-col">
        <div class="cvf-icon campaigns-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div>
          <h4 class="cvf-title">Campaigns</h4>
          <p class="cvf-desc">Sent by you, on a schedule you control, to an audience you choose. The release day that's the same date for everyone, the sale that runs this weekend only, the ARC window that opens right now.</p>
        </div>
      </div>
      <div class="cvf-vs"><span>vs</span></div>
      <div class="cvf-col">
        <div class="cvf-icon flows-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <h4 class="cvf-title">Flows</h4>
          <p class="cvf-desc">Automated. Triggered by reader behavior — a new subscription, a purchase, an abandoned cart. Built once, delivers itself to each reader at exactly the right moment in their individual journey.</p>
        </div>
      </div>
    </div>
    <div class="cvf-quote glass-card">
      <p class="cvf-quote-text">Think of flows as your always-on reader relationship engine, and campaigns as the deliberate moments where you show up for everyone at the same time.</p>
    </div>

    <!-- Release Date Planner -->
    <div class="glass-card step-card">
      <div class="cal-header-row">
        <div>
          <h2 class="step-title">Campaign Calendar</h2>
          <p class="step-sub">Map your campaigns to your publishing schedule — never scramble for what to send or when</p>
        </div>
        <button class="btn-primary" (click)="onAddEvent.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Campaign
        </button>
      </div>
      <div class="release-planner">
        <div class="rp-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="rp-title">Release Date Planner</span>
          <span class="rp-hint">Working backward from your release date, here are the 4 baseline campaigns for every title</span>
        </div>
        <div class="form-row-2" style="margin-bottom:1.25rem">
          <div class="form-group">
            <label class="form-label">Book Title</label>
            <input type="text" class="form-input" [(ngModel)]="calRelease.title" placeholder="e.g. The Ember Crown" />
          </div>
          <div class="form-group">
            <label class="form-label">Release Date</label>
            <input type="date" class="form-input" [(ngModel)]="calRelease.date" />
          </div>
        </div>
        <div class="baseline-campaigns" *ngIf="calRelease.date">
          <div class="bc-item" *ngFor="let bc of baselineCampaigns">
            <div class="bc-timing">{{ bc.timing }}</div>
            <div class="bc-info">
              <span class="bc-type">{{ bc.type }}</span>
              <span class="bc-desc">{{ bc.description }}</span>
            </div>
            <div class="bc-date">{{ getRelativeDate(calRelease.date, bc.offset) }}</div>
            <button class="btn-ghost btn-sm" (click)="onCreateFromBaseline.emit(bc)">Create</button>
          </div>
        </div>
        <div class="baseline-empty" *ngIf="!calRelease.date">
          <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="32" height="32"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p>Enter a release date above to see your baseline campaign schedule</p>
        </div>
      </div>
    </div>

    <!-- Launch Sequence Timeline -->
    <div class="glass-card step-card">
      <h3 class="step-title" style="font-size:1rem;margin-bottom:.35rem">Book Launch Campaign Window</h3>
      <p class="step-sub" style="margin-bottom:1.25rem">The launch day email is the centerpiece, but its effectiveness is amplified by the campaigns before it and the week-two push after it.</p>
      <div class="launch-timeline">
        <div class="lt-phase header-row"><span>Phase</span><span>Timing</span><span>What Happens</span></div>
        <div class="lt-phase" *ngFor="let phase of launchSequence" [class.lt-highlight]="phase.highlight">
          <div class="lt-phase-name">
            <div class="lt-phase-dot" [style.background]="phase.color"></div>
            {{ phase.phase }}
          </div>
          <span class="lt-timing">{{ phase.timing }}</span>
          <span class="lt-what">{{ phase.what }}</span>
        </div>
      </div>
      <div class="launch-window-note">
        <svg viewBox="0 0 20 20" fill="#d97706" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
        The launch window is typically 7–14 days. After that window, the book either has momentum or it doesn't — and rebuilding momentum is significantly harder than capturing it the first time.
      </div>
    </div>

    <!-- Full Campaign Landscape -->
    <div class="glass-card step-card">
      <h3 class="step-title" style="font-size:1rem;margin-bottom:.35rem">The Full Campaign Landscape</h3>
      <p class="step-sub" style="margin-bottom:1.25rem">15 campaign types available to indie authors — most authors use 2 or 3. Understanding the full set means you can choose the right tool for each moment.</p>
      <div class="landscape-table">
        <div class="lt-row lt-header">
          <span>Campaign Type</span><span>Primary Purpose</span><span>Typical Audience</span><span></span>
        </div>
        <div class="lt-row" *ngFor="let ct of campaignTypes">
          <div class="lt-type">
            <div class="lt-icon" [style.background]="ct.color + '18'" [style.color]="ct.color" [innerHTML]="ct.icon"></div>
            <span class="lt-type-name">{{ ct.label }}</span>
          </div>
          <span class="lt-purpose">{{ ct.purpose }}</span>
          <span class="lt-audience">{{ ct.audience }}</span>
          <button class="btn-ghost btn-sm" (click)="onStartCreateWithType.emit(ct.id)">Use</button>
        </div>
      </div>
    </div>

    <!-- Planned Campaigns -->
    <div class="glass-card step-card" *ngIf="calendarEvents.length > 0">
      <h3 class="step-title" style="font-size:1rem;margin-bottom:1.25rem">Planned Campaigns</h3>
      <div class="cal-events-list">
        <div class="cal-event" *ngFor="let ev of calendarEvents">
          <div class="ce-date">{{ ev.date }}</div>
          <div class="ce-info">
            <span class="ce-name">{{ ev.name }}</span>
            <span class="ce-type-badge">{{ ev.type }}</span>
          </div>
          <span class="badge" [ngClass]="'badge-' + ev.status">{{ ev.status }}</span>
          <button class="row-btn edit-btn btn-sm" (click)="onGoToCreate.emit()">Edit</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cvf-callout { display:grid; grid-template-columns:1fr auto 1fr; gap:1.5rem; padding:1.5rem; margin-bottom:1rem; align-items:start; }
    .cvf-col { display:flex; align-items:flex-start; gap:.875rem; }
    .cvf-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .campaigns-icon { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .flows-icon { background:rgba(99,102,241,0.1); color:#6366f1; }
    .cvf-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .cvf-desc { font-size:.8125rem; color:#64748b; margin:0; line-height:1.6; }
    .cvf-vs { display:flex; align-items:center; justify-content:center; }
    .cvf-vs span { font-size:.75rem; font-weight:700; color:#94a3b8; background:#f1f5f9; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; }
    .cvf-quote { padding:1rem 1.5rem; margin-bottom:1.25rem; background:linear-gradient(135deg,rgba(59,130,246,0.04),rgba(99,102,241,0.04)); border-left:3px solid #6366f1; }
    .cvf-quote-text { font-size:.9rem; font-style:italic; color:#374151; margin:0; line-height:1.6; }
    .step-card { padding:2rem; margin-bottom:1.25rem; }
    .step-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .step-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.75rem; }
    .cal-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .release-planner { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.25rem; }
    .rp-header { display:flex; align-items:center; gap:.5rem; margin-bottom:1rem; color:#3b82f6; flex-wrap:wrap; }
    .rp-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .rp-hint { font-size:.75rem; color:#94a3b8; margin-left:.25rem; }
    .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .form-input { padding:.625rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#3b82f6; background:#fff; }
    .baseline-campaigns { display:flex; flex-direction:column; gap:.625rem; }
    .bc-item { display:flex; align-items:center; gap:1rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; flex-wrap:wrap; }
    .bc-timing { font-size:.75rem; font-weight:700; color:#94a3b8; min-width:120px; }
    .bc-info { flex:1; min-width:160px; }
    .bc-type { display:block; font-size:.875rem; font-weight:600; color:#0f172a; }
    .bc-desc { display:block; font-size:.75rem; color:#94a3b8; }
    .bc-date { font-size:.8125rem; font-weight:600; color:#3b82f6; white-space:nowrap; }
    .baseline-empty { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem; color:#94a3b8; font-size:.8125rem; text-align:center; }
    .launch-timeline { display:flex; flex-direction:column; margin-bottom:1rem; }
    .lt-phase { display:grid; grid-template-columns:2fr 1.5fr 3fr; gap:1rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:start; font-size:.8125rem; }
    .lt-phase:last-child { border-bottom:none; }
    .lt-phase.header-row { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; padding-bottom:.625rem; }
    .lt-phase.lt-highlight { background:rgba(59,130,246,0.04); border-radius:8px; padding:.75rem .625rem; margin:0 -.625rem; border-bottom:none; border:1.5px solid rgba(59,130,246,0.15); margin-bottom:.5rem; }
    .lt-phase-name { display:flex; align-items:center; gap:.5rem; font-weight:600; color:#0f172a; }
    .lt-phase-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .lt-timing { color:#64748b; font-size:.8rem; }
    .lt-what { color:#374151; line-height:1.5; }
    .launch-window-note { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(245,158,11,0.06); border-radius:8px; font-size:.8rem; color:#78350f; line-height:1.5; }
    .landscape-table { display:flex; flex-direction:column; }
    .lt-row { display:grid; grid-template-columns:2fr 3fr 2fr auto; gap:1rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:center; }
    .lt-row:last-child { border-bottom:none; }
    .lt-header { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; padding-bottom:.625rem; }
    .lt-type { display:flex; align-items:center; gap:.625rem; }
    .lt-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .lt-type-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .lt-purpose { font-size:.8125rem; color:#64748b; }
    .lt-audience { font-size:.75rem; color:#94a3b8; }
    .cal-events-list { display:flex; flex-direction:column; gap:.625rem; }
    .cal-event { display:flex; align-items:center; gap:1rem; padding:.75rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; flex-wrap:wrap; }
    .ce-date { font-size:.8125rem; font-weight:600; color:#64748b; min-width:90px; }
    .ce-info { flex:1; display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; }
    .ce-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .ce-type-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(59,130,246,0.08); color:#3b82f6; border-radius:6px; }
    .row-btn { display:inline-flex; align-items:center; gap:.3rem; padding:.35rem .65rem; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all .15s; }
    .edit-btn { color:#6366f1; border-color:rgba(99,102,241,0.2); background:rgba(99,102,241,0.04); }
    .edit-btn:hover { background:rgba(99,102,241,0.1); border-color:#6366f1; }
    @media(max-width:700px) { .cvf-callout { grid-template-columns:1fr; } .cvf-vs { display:none; } .lt-phase { grid-template-columns:1fr; } .lt-row { grid-template-columns:1fr 1fr; } .form-row-2 { grid-template-columns:1fr; } }
  `]
})
export class CampaignCalendarComponent {
  @Input() campaignTypes: CampaignTypeOption[] = [];
  @Input() calendarEvents: CalendarEvent[] = [];
  @Input() launchSequence: any[] = [];
  @Input() baselineCampaigns: any[] = [];
  @Output() onCreateFromBaseline = new EventEmitter<any>();
  @Output() onStartCreateWithType = new EventEmitter<string>();
  @Output() onAddEvent = new EventEmitter<void>();
  @Output() onGoToCreate = new EventEmitter<void>();

  calRelease = { title: '', date: '' };

  getRelativeDate(releaseDate: string, offsetDays: number): string {
    if (!releaseDate) return '';
    const d = new Date(releaseDate);
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
