import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface CampaignSender {
  fromName: string;
  fromEmail: string;
}

@Component({
  selector: 'app-campaign-sender-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="modal-overlay" *ngIf="open" (click)="cancel.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h2 class="modal-title">Sender</h2>
        <p class="modal-sub">Campaigns are sent from your Amazon SES identity. Update it in Settings if you need a different address.</p>

        <div class="form-group">
          <label class="form-label">Sending email (Amazon SES)</label>
          <div class="readonly-field">{{ sender.fromEmail || 'Not configured' }}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Sender name (Amazon SES)</label>
          <div class="readonly-field">{{ sender.fromName || 'Not configured' }}</div>
        </div>

        <div class="ses-note" *ngIf="!sender.fromEmail">
          <svg viewBox="0 0 20 20" fill="#f59e0b" width="16" height="16"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <span>No verified SES sender is configured. Add <strong>AmazonSes:FromEmail</strong> in Settings before sending.</span>
        </div>

        <div class="ses-note info" *ngIf="sender.fromEmail">
          <span>To change the sending address or display name, open <a routerLink="/settings" (click)="cancel.emit()">Settings → Deliverability</a> and update your Amazon SES configuration.</span>
        </div>

        <div class="inbox-preview-wrap">
          <div class="inbox-preview-label">Inbox preview</div>
          <div class="phone-inbox">
            <div class="phone-inbox-header">Inbox</div>
            <div class="inbox-row" *ngFor="let row of inboxRows">
              <div class="inbox-avatar">{{ initials }}</div>
              <div class="inbox-row-body">
                <div class="inbox-row-top">
                  <span class="inbox-sender">{{ sender.fromName || 'Sender name' }}</span>
                  <span class="inbox-time">{{ row.time }}</span>
                </div>
                <div class="inbox-subject">{{ subject || 'Message subject...' }}</div>
              </div>
            </div>
          </div>
          <p class="inbox-note">Actual email preview may vary depending on the email client.</p>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-primary" (click)="cancel.emit()">Done</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); backdrop-filter:blur(4px); z-index:300; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
    .modal-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:16px; padding:1.75rem; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.12); }
    .modal-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .modal-sub { font-size:.875rem; color:#64748b; margin:0 0 1.25rem; line-height:1.5; }
    .form-group { margin-bottom:1rem; }
    .form-label { display:block; font-size:.8125rem; font-weight:600; color:#334155; margin-bottom:.35rem; }
    .readonly-field { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.875rem; background:#f8fafc; color:#0f172a; font-family:ui-monospace,monospace; }
    .ses-note { display:flex; gap:.625rem; align-items:flex-start; padding:.75rem 1rem; background:#fffbeb; border:1px solid #fde68a; border-radius:10px; font-size:.75rem; color:#92400e; line-height:1.5; margin-bottom:1rem; }
    .ses-note.info { background:#eff6ff; border-color:#bfdbfe; color:#1e40af; }
    .ses-note a { color:#2563eb; font-weight:600; }
    .inbox-preview-wrap { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem; margin-bottom:1.25rem; }
    .inbox-preview-label { font-size:.75rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.04em; margin-bottom:.75rem; }
    .phone-inbox { background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; max-width:280px; margin:0 auto; }
    .phone-inbox-header { padding:.625rem 1rem; font-size:.8125rem; font-weight:700; color:#0f172a; border-bottom:1px solid #f1f5f9; text-align:center; }
    .inbox-row { display:flex; gap:.75rem; padding:.75rem 1rem; border-bottom:1px solid #f8fafc; }
    .inbox-row:last-child { border-bottom:none; }
    .inbox-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#3b82f6); color:#fff; font-size:.75rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .inbox-row-body { flex:1; min-width:0; }
    .inbox-row-top { display:flex; justify-content:space-between; gap:.5rem; margin-bottom:.15rem; }
    .inbox-sender { font-size:.8125rem; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .inbox-time { font-size:.7rem; color:#94a3b8; flex-shrink:0; }
    .inbox-subject { font-size:.75rem; color:#334155; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .inbox-note { font-size:.7rem; color:#94a3b8; text-align:center; margin:.75rem 0 0; }
    .modal-actions { display:flex; justify-content:flex-end; gap:.75rem; }
  `],
})
export class CampaignSenderModalComponent implements OnChanges {
  @Input() open = false;
  @Input() sender: CampaignSender = { fromName: '', fromEmail: '' };
  @Input() subject = '';
  @Output() cancel = new EventEmitter<void>();

  readonly inboxRows = [{ time: '9:47' }, { time: '17:45' }, { time: '17:45' }];

  get initials(): string {
    const parts = (this.sender.fromName || 'S').trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : (parts[0][0] || 'S').toUpperCase();
  }

  ngOnChanges() {}
}
