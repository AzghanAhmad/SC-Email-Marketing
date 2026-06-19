import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-campaign-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Explainer callout -->
    <div class="newsletter-callout glass-card">
      <div class="nc-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </div>
      <div class="nc-body">
        <h3 class="nc-title">Your newsletter is the heartbeat of your email program</h3>
        <p class="nc-desc">Unlike one-off campaigns, a newsletter is a recurring, relationship-driven email that keeps your list warm between launches. Set a schedule you can sustain — consistency beats perfection every time.</p>
      </div>
    </div>

    <!-- Schedule card -->
    <div class="glass-card step-card">
      <div class="nl-header-row">
        <div>
          <h2 class="step-title">Newsletter Schedule</h2>
          <p class="step-sub">Set up your recurring newsletter cadence</p>
        </div>
        <div class="nl-status-badge" [class.nl-active]="newsletter.status==='active'" [class.nl-paused]="newsletter.status==='paused'" [class.nl-draft]="newsletter.status==='draft'">
          <span class="nl-dot"></span>
          {{ newsletter.status === 'active' ? 'Active' : newsletter.status === 'paused' ? 'Paused' : 'Draft' }}
        </div>
      </div>

      <div class="nl-form">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Newsletter Name <span class="required">*</span></label>
            <input type="text" class="form-input" [(ngModel)]="newsletter.name" placeholder="e.g. Monthly Reader Letter" />
          </div>
          <div class="form-group">
            <label class="form-label">Frequency</label>
            <select class="form-input" [(ngModel)]="newsletter.frequency">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly (every 2 weeks)</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group" *ngIf="newsletter.frequency === 'weekly' || newsletter.frequency === 'biweekly'">
            <label class="form-label">Day of Week</label>
            <select class="form-input" [(ngModel)]="newsletter.dayOfWeek">
              <option value="Monday">Monday</option><option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option><option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>
          <div class="form-group" *ngIf="newsletter.frequency === 'monthly'">
            <label class="form-label">Day of Month</label>
            <select class="form-input" [(ngModel)]="newsletter.dayOfMonth">
              <option value="1st">1st</option><option value="2nd">2nd</option>
              <option value="3rd">3rd</option><option value="last">Last day</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Send Time</label>
            <input type="time" class="form-input" [(ngModel)]="newsletter.sendTime" />
          </div>
        </div>

        <!-- Timezone optimization -->
        <div class="tz-opt-row">
          <div class="tz-opt-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
              <span class="tz-opt-label">Timezone Optimization</span>
              <span class="tz-opt-desc">Deliver at {{ newsletter.sendTime || '9:00' }} in each subscriber's local timezone — not yours. Readers in the UK, Australia, and Canada receive it at a reasonable local hour.</span>
            </div>
          </div>
          <label class="toggle-wrap">
            <input type="checkbox" [(ngModel)]="newsletter.timezoneOptimized" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Default Subject Line</label>
          <input type="text" class="form-input" [(ngModel)]="newsletter.subject" placeholder="e.g. What I've been writing this month..." />
          <span class="field-help">Tip: specific subject lines ("The research that changed my book") outperform generic ones ("May newsletter") — they tell readers what's inside.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Preview Text <span class="label-hint">(acts as a second subject line in the inbox)</span></label>
          <input type="text" class="form-input" [(ngModel)]="newsletter.previewText" placeholder="A short teaser that extends your subject line..." maxlength="150" />
        </div>

        <!-- Reply invitation -->
        <div class="reply-invite-section">
          <div class="ri-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="ri-title">Reader Reply Invitation</span>
            <span class="ri-badge">Builds loyalty</span>
          </div>
          <p class="ri-desc">End each newsletter with a genuine question. Readers who reply become evangelists — and replies signal to inbox providers that your emails are wanted, improving deliverability.</p>
          <div class="form-group">
            <label class="form-label">Closing Question for Readers</label>
            <input type="text" class="form-input" [(ngModel)]="newsletter.replyQuestion" placeholder="e.g. What's the last book you recommended to a friend?" />
          </div>
          <div class="reply-examples">
            <span class="re-label">Examples:</span>
            <button class="re-chip" (click)="setReplyQuestion(0)">What's the last book you recommended to a friend?</button>
            <button class="re-chip" (click)="setReplyQuestion(1)">What's a trope you never get tired of?</button>
            <button class="re-chip" (click)="setReplyQuestion(2)">If you could spend a day in one fictional world, which would it be?</button>
          </div>
        </div>

        <!-- Content guidance -->
        <div class="nl-content-guide">
          <h4 class="ncg-title">What to include in each issue</h4>
          <div class="ncg-grid">
            <div class="ncg-item" *ngFor="let item of contentItems">
              <div class="ncg-icon" [class]="item.cls">
                <span [innerHTML]="item.icon"></span>
              </div>
              <div>
                <span class="ncg-name">{{ item.name }}</span>
                <span class="ncg-hint">{{ item.hint }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="nl-actions">
          <button class="btn-primary" (click)="save()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Schedule
          </button>
          <button class="btn-secondary" (click)="newsletter.status = newsletter.status === 'active' ? 'paused' : 'active'">
            {{ newsletter.status === 'active' ? 'Pause Newsletter' : 'Activate Newsletter' }}
          </button>
          <button class="btn-ghost" (click)="onWriteNextIssue.emit()">
            Write Next Issue
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Consistency tip -->
    <div class="consistency-tip glass-card">
      <div class="ct-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <div class="ct-body">
        <p class="ct-quote">"Consistency beats perfection every time. A newsletter that arrives reliably and feels genuine will outperform a beautiful, meticulously crafted one that only shows up three times a year."</p>
        <p class="ct-tip">Tip: batch-write 2–3 issues in one sitting and schedule them in advance. Your readers hear from you consistently even when you're deep in a draft.</p>
      </div>
    </div>
  `,
  styles: [`
    .newsletter-callout { display:flex; align-items:flex-start; gap:1rem; padding:1.25rem 1.5rem; margin-bottom:1.25rem; background:linear-gradient(135deg,rgba(59,130,246,0.06),rgba(99,102,241,0.06)); border:1.5px solid rgba(59,130,246,0.15); }
    .nc-icon { width:40px; height:40px; border-radius:10px; background:rgba(59,130,246,0.1); display:flex; align-items:center; justify-content:center; color:#3b82f6; flex-shrink:0; }
    .nc-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .nc-desc { font-size:.8125rem; color:#64748b; margin:0; line-height:1.6; }
    .step-card { padding:2rem; margin-bottom:1.25rem; }
    .step-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .step-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.75rem; }
    .nl-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .nl-status-badge { display:flex; align-items:center; gap:.5rem; padding:.4rem .875rem; border-radius:100px; font-size:.75rem; font-weight:700; }
    .nl-active { background:rgba(16,185,129,0.1); color:#059669; border:1px solid rgba(16,185,129,0.25); }
    .nl-paused { background:rgba(245,158,11,0.1); color:#d97706; border:1px solid rgba(245,158,11,0.25); }
    .nl-draft { background:rgba(148,163,184,0.1); color:#64748b; border:1px solid rgba(148,163,184,0.25); }
    .nl-dot { width:7px; height:7px; border-radius:50%; background:currentColor; }
    .nl-form { display:flex; flex-direction:column; gap:1.125rem; }
    .nl-actions { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; margin-top:.5rem; }
    .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; display:flex; align-items:center; gap:.375rem; flex-wrap:wrap; }
    .label-hint { font-size:.75rem; font-weight:400; color:#94a3b8; }
    .required { color:#ef4444; }
    .form-input { padding:.625rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#3b82f6; background:#fff; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.3rem; display:block; line-height:1.5; }
    .tz-opt-row { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:.875rem 1rem; background:rgba(59,130,246,0.04); border:1.5px solid rgba(59,130,246,0.12); border-radius:10px; }
    .tz-opt-info { display:flex; align-items:flex-start; gap:.625rem; flex:1; color:#3b82f6; }
    .tz-opt-label { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .tz-opt-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .toggle-wrap { position:relative; display:inline-flex; align-items:center; cursor:pointer; flex-shrink:0; }
    .toggle-wrap input { opacity:0; width:0; height:0; position:absolute; }
    .toggle-slider { width:40px; height:22px; background:#e2e8f0; border-radius:100px; transition:background .2s; position:relative; }
    .toggle-slider::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,0.15); }
    .toggle-wrap input:checked + .toggle-slider { background:#3b82f6; }
    .toggle-wrap input:checked + .toggle-slider::after { transform:translateX(18px); }
    .reply-invite-section { background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.15); border-radius:12px; padding:1.125rem; }
    .ri-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#059669; }
    .ri-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .ri-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(16,185,129,0.12); color:#059669; border-radius:100px; margin-left:.25rem; }
    .ri-desc { font-size:.8rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .reply-examples { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; margin-top:.625rem; }
    .re-label { font-size:.75rem; font-weight:600; color:#94a3b8; }
    .re-chip { padding:.3rem .7rem; border:1.5px solid #e2e8f0; border-radius:100px; background:#fff; font-size:.75rem; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; }
    .re-chip:hover { border-color:#34d399; color:#059669; background:rgba(16,185,129,0.04); }
    .nl-content-guide { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .ncg-title { font-size:.8125rem; font-weight:700; color:#374151; margin:0 0 .875rem; text-transform:uppercase; letter-spacing:.05em; }
    .ncg-grid { display:grid; grid-template-columns:1fr 1fr; gap:.625rem; }
    .ncg-item { display:flex; align-items:flex-start; gap:.625rem; }
    .ncg-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .story { background:rgba(99,102,241,0.1); color:#6366f1; }
    .reading { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .wip { background:rgba(245,158,11,0.1); color:#d97706; }
    .research { background:rgba(16,185,129,0.1); color:#059669; }
    .bts { background:rgba(168,85,247,0.1); color:#9333ea; }
    .soft-promo { background:rgba(239,68,68,0.1); color:#dc2626; }
    .ncg-name { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; }
    .ncg-hint { display:block; font-size:.75rem; color:#94a3b8; line-height:1.4; }
    .consistency-tip { display:flex; align-items:flex-start; gap:1rem; padding:1.25rem 1.5rem; background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(168,85,247,0.06)); border:1.5px solid rgba(99,102,241,0.15); }
    .ct-icon { width:36px; height:36px; border-radius:10px; background:rgba(99,102,241,0.1); display:flex; align-items:center; justify-content:center; color:#6366f1; flex-shrink:0; margin-top:.1rem; }
    .ct-quote { font-size:.875rem; font-style:italic; color:#374151; margin:0 0 .5rem; line-height:1.6; border-left:3px solid #6366f1; padding-left:.875rem; }
    .ct-tip { font-size:.8rem; color:#64748b; margin:0; }
    @media(max-width:700px) { .form-row-2 { grid-template-columns:1fr; } .ncg-grid { grid-template-columns:1fr; } }
  `]
})
export class CampaignNewsletterComponent implements OnChanges {
  @Input() newsletter = {
    name: 'Monthly Reader Letter', frequency: 'monthly' as 'weekly'|'biweekly'|'monthly',
    dayOfWeek: 'Tuesday', dayOfMonth: '1st', sendTime: '09:00',
    timezoneOptimized: true, subject: '', previewText: '', replyQuestion: '',
    content: '', status: 'draft' as 'active'|'paused'|'draft'
  };
  @Output() onWriteNextIssue = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<typeof this.newsletter>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['newsletter'] && changes['newsletter'].currentValue) {
      this.newsletter = { ...changes['newsletter'].currentValue };
    }
  }

  readonly replyQuestionExamples = [
    "What's the last book you recommended to a friend?",
    "What's a trope you never get tired of?",
    "If you could spend a day in one fictional world, which would it be?"
  ];

  readonly contentItems = [
    { cls: 'story', name: 'Lead with a story', hint: 'Something specific from your writing week — not a pitch', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
    { cls: 'reading', name: "What you're reading", hint: 'A genuine recommendation with a sentence on why you loved it', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
    { cls: 'wip', name: 'Work in progress', hint: 'Where you are emotionally in the story, not just a word count', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { cls: 'research', name: 'Research finds', hint: 'Fascinating things you discovered — especially for historical or speculative fiction', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
    { cls: 'bts', name: 'Behind the scenes', hint: 'Cover design, editorial changes, the dedication you almost didn\'t write', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>' },
    { cls: 'soft-promo', name: 'Soft mention', hint: 'After delivering value, a natural note about your current or upcoming title', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' },
  ];

  setReplyQuestion(i: number) { this.newsletter.replyQuestion = this.replyQuestionExamples[i]; }
  save() { this.onSave.emit({ ...this.newsletter }); }
}
