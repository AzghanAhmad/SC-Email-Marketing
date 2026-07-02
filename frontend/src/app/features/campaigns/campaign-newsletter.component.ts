import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterSchedule } from '../../core/models/campaign.models';

const EMPTY_FORM = (): NewsletterSchedule => ({
  name: '',
  frequency: 'monthly',
  dayOfWeek: 'Tuesday',
  dayOfMonth: '1st',
  sendTime: '09:00',
  timezoneOptimized: true,
  subject: '',
  previewText: '',
  replyQuestion: '',
  content: '',
  status: 'draft',
});

@Component({
  selector: 'app-campaign-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="newsletter-callout glass-card">
      <div class="nc-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </div>
      <div class="nc-body">
        <h3 class="nc-title">Your newsletter is the heartbeat of your email program</h3>
        <p class="nc-desc">Set a schedule you can sustain — when activated, issues send automatically on your cadence.</p>
      </div>
    </div>

    <div class="glass-card step-card" *ngIf="activeNewsletter">
      <div class="active-header">
        <h2 class="step-title">Active Newsletter</h2>
        <span class="nl-status-badge" [class.nl-active]="activeNewsletter.status==='active'" [class.nl-paused]="activeNewsletter.status==='paused'">
          <span class="nl-dot"></span>
          {{ activeNewsletter.status === 'active' ? 'Active' : 'Paused' }}
        </span>
      </div>
      <div class="active-grid">
        <div><span class="active-label">Name</span><span class="active-value">{{ activeNewsletter.name }}</span></div>
        <div><span class="active-label">Cadence</span><span class="active-value">{{ activeNewsletter.frequency }} · {{ activeNewsletter.sendTime }}</span></div>
        <div><span class="active-label">Subject</span><span class="active-value">{{ activeNewsletter.subject || '—' }}</span></div>
        <div><span class="active-label">Next send</span><span class="active-value">{{ formatDate(activeNewsletter.nextSendAt) }}</span></div>
        <div class="active-full"><span class="active-label">Reply question</span><span class="active-value">{{ activeNewsletter.replyQuestion || '—' }}</span></div>
      </div>
      <div class="nl-actions">
        <button class="btn-secondary" (click)="pauseActive()" *ngIf="activeNewsletter.status==='active'">Pause Newsletter</button>
        <button class="btn-primary" (click)="resumeActive()" *ngIf="activeNewsletter.status==='paused'">Resume Newsletter</button>
        <button class="btn-ghost" (click)="onWriteNextIssue.emit()">Write Next Issue</button>
      </div>
    </div>

    <div class="glass-card step-card">
      <div class="nl-header-row">
        <div>
          <h2 class="step-title">{{ activeNewsletter ? 'Schedule a New Newsletter' : 'Newsletter Schedule' }}</h2>
          <p class="step-sub">Configure cadence, subject, and content template</p>
        </div>
      </div>

      <div class="nl-form">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Newsletter Name <span class="required">*</span></label>
            <input type="text" class="form-input" [(ngModel)]="form.name" placeholder="e.g. Monthly Reader Letter" />
          </div>
          <div class="form-group">
            <label class="form-label">Frequency</label>
            <select class="form-input" [(ngModel)]="form.frequency">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly (every 2 weeks)</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group" *ngIf="form.frequency === 'weekly' || form.frequency === 'biweekly'">
            <label class="form-label">Day of Week</label>
            <select class="form-input" [(ngModel)]="form.dayOfWeek">
              <option value="Monday">Monday</option><option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option><option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>
          <div class="form-group" *ngIf="form.frequency === 'monthly'">
            <label class="form-label">Day of Month</label>
            <select class="form-input" [(ngModel)]="form.dayOfMonth">
              <option value="1st">1st</option><option value="2nd">2nd</option>
              <option value="3rd">3rd</option><option value="last">Last day</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Send Time</label>
            <input type="time" class="form-input" [(ngModel)]="form.sendTime" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Default Subject Line</label>
          <input type="text" class="form-input" [(ngModel)]="form.subject" placeholder="e.g. What I've been writing this month..." />
        </div>

        <div class="form-group">
          <label class="form-label">Closing Question for Readers</label>
          <input type="text" class="form-input" [(ngModel)]="form.replyQuestion" placeholder="e.g. What's the last book you recommended to a friend?" />
        </div>

        <div class="form-group">
          <label class="form-label">Newsletter Content Template</label>
          <textarea class="form-input nl-content-area" [(ngModel)]="form.content" rows="6"
            placeholder="Default body copy for each issue..."></textarea>
        </div>

        <div class="nl-actions">
          <button class="btn-primary" (click)="saveDraft()" [disabled]="!form.name.trim()">Save Schedule</button>
          <button class="btn-secondary" (click)="activate()" [disabled]="!form.name.trim()">Activate Newsletter</button>
        </div>
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
    .active-header, .nl-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:.75rem; }
    .nl-status-badge { display:flex; align-items:center; gap:.5rem; padding:.4rem .875rem; border-radius:100px; font-size:.75rem; font-weight:700; }
    .nl-active { background:rgba(16,185,129,0.1); color:#059669; border:1px solid rgba(16,185,129,0.25); }
    .nl-paused { background:rgba(245,158,11,0.1); color:#d97706; border:1px solid rgba(245,158,11,0.25); }
    .nl-dot { width:7px; height:7px; border-radius:50%; background:currentColor; }
    .active-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
    .active-full { grid-column:1 / -1; }
    .active-label { display:block; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#94a3b8; margin-bottom:.2rem; }
    .active-value { font-size:.875rem; color:#0f172a; line-height:1.5; }
    .nl-form { display:flex; flex-direction:column; gap:1.125rem; }
    .nl-actions { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; margin-top:.5rem; }
    .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .required { color:#ef4444; }
    .form-input { padding:.625rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; }
    .form-input:focus { border-color:#3b82f6; background:#fff; }
    .nl-content-area { resize:vertical; min-height:120px; font-family:inherit; line-height:1.5; }
    @media(max-width:700px) { .form-row-2, .active-grid { grid-template-columns:1fr; } }
  `]
})
export class CampaignNewsletterComponent implements OnChanges {
  @Input() newsletter: NewsletterSchedule = EMPTY_FORM();
  @Output() onWriteNextIssue = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<NewsletterSchedule>();

  form: NewsletterSchedule = EMPTY_FORM();
  activeNewsletter: NewsletterSchedule | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['newsletter']?.currentValue) return;
    const incoming = { ...changes['newsletter'].currentValue } as NewsletterSchedule;
    if (incoming.status === 'active' || incoming.status === 'paused') {
      this.activeNewsletter = incoming;
      this.form = EMPTY_FORM();
    } else {
      this.activeNewsletter = null;
      this.form = { ...incoming, status: 'draft' };
    }
  }

  formatDate(value?: string | null): string {
    if (!value) return 'Not scheduled yet';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Not scheduled yet' : d.toLocaleString();
  }

  saveDraft() {
    this.onSave.emit({ ...this.form, status: 'draft' });
  }

  activate() {
    this.onSave.emit({ ...this.form, status: 'active' });
    this.form = EMPTY_FORM();
  }

  pauseActive() {
    if (!this.activeNewsletter) return;
    this.onSave.emit({ ...this.activeNewsletter, status: 'paused' });
  }

  resumeActive() {
    if (!this.activeNewsletter) return;
    this.onSave.emit({ ...this.activeNewsletter, status: 'active' });
  }
}
