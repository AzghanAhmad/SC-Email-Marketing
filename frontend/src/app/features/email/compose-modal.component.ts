import { Component, Output, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComposePayload, EmailAttachment } from './email.service';

@Component({
  selector: 'app-compose-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div class="compose-backdrop" (click)="close()"></div>

    <!-- Modal -->
    <div class="compose-modal">
      <div class="sending-status" *ngIf="isBusy" role="status" aria-live="polite">
        <span class="sending-spinner" aria-hidden="true"></span>
        {{ busyMessage }}
      </div>
      <div class="compose-header">
        <h2 class="compose-title">{{ composeTitle || 'New Message' }}</h2>
        <button class="compose-close" [disabled]="isBusy" (click)="close()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="compose-body">
        <!-- To -->
        <div class="compose-field">
          <label class="compose-label">To</label>
          <input type="email" class="compose-input" placeholder="recipient@example.com"
                 [(ngModel)]="to">
        </div>

        <!-- Subject -->
        <div class="compose-field">
          <div class="label-row">
            <label class="compose-label">Subject</label>
            <span class="char-counter" [class.over]="subject.length > 60">
              {{ subject.length }}/60
              <span class="counter-hint" *ngIf="subject.length > 60">May be truncated on mobile</span>
            </span>
          </div>
          <input type="text" class="compose-input" placeholder="Enter subject..."
                 [(ngModel)]="subject">
        </div>

        <!-- Message -->
        <div class="compose-field compose-message-field">
          <label class="compose-label">Message</label>
          <div #messageEditor
               class="compose-editor user-editor"
               contenteditable="true"
               role="textbox"
               aria-multiline="true"
               data-placeholder="Write your message..."
               (input)="onEditorInput()"
               (blur)="syncBodyFromEditor()"></div>
          <div *ngIf="quotedHtml" class="quoted-original" [innerHTML]="quotedHtml"></div>
        </div>

        <!-- Pre-Send Score Check -->
        <div class="score-check" *ngIf="getPlainBody().length > 20">
          <div class="score-header" (click)="showScorePanel = !showScorePanel">
            <div class="score-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Pre-Send Score</span>
            </div>
            <div class="score-badge" [class.good]="sendScore >= 80" [class.warn]="sendScore >= 50 && sendScore < 80" [class.bad]="sendScore < 50">
              {{ sendScore }}/100
            </div>
          </div>
          <div class="score-details" *ngIf="showScorePanel">
            <div class="score-row" *ngFor="let cat of scoreCategories">
              <div class="score-cat-info">
                <span class="score-cat-name">{{ cat.name }}</span>
                <span class="score-cat-desc">{{ cat.desc }}</span>
              </div>
              <div class="score-cat-bar">
                <div class="score-cat-fill" [style.width]="cat.score + '%'"
                     [class.good]="cat.score >= 80" [class.warn]="cat.score >= 50 && cat.score < 80" [class.bad]="cat.score < 50"></div>
              </div>
              <span class="score-cat-val" [class.good]="cat.score >= 80" [class.warn]="cat.score >= 50 && cat.score < 80" [class.bad]="cat.score < 50">{{ cat.score }}%</span>
            </div>
            <div class="score-tips" *ngIf="scoreTips.length > 0">
              <div class="score-tip" *ngFor="let tip of scoreTips">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ tip }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Formatting Toolbar -->
        <div class="compose-toolbar">
          <button type="button" class="toolbar-btn" (mousedown)="$event.preventDefault()" (click)="applyFormat('bold')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            </svg>
          </button>
          <button type="button" class="toolbar-btn" (mousedown)="$event.preventDefault()" (click)="applyFormat('italic')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>
            </svg>
          </button>
          <button type="button" class="toolbar-btn" (mousedown)="$event.preventDefault()" (click)="insertLink()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
          <button type="button" class="toolbar-btn" (mousedown)="$event.preventDefault()" (click)="applyFormat('underline')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/>
            </svg>
          </button>
          <button type="button" class="toolbar-btn" (mousedown)="$event.preventDefault()" (click)="applyFormat('insertUnorderedList')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
            </svg>
          </button>
          <button type="button" class="toolbar-btn" (click)="fileInput.click()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input #fileInput type="file" multiple hidden (change)="onAttachFiles($event)">
        </div>

        <div class="attachments-list" *ngIf="attachments.length > 0">
          <div class="attachment-chip" *ngFor="let att of attachments; let i = index">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            <span class="att-name">{{ att.name }}</span>
            <span class="att-size">{{ att.size }}</span>
            <button type="button" class="remove-att" (click)="removeAttachment(i)">×</button>
          </div>
        </div>
      </div>

      <div class="send-error" *ngIf="sendError">{{ sendError }}</div>

      <div class="compose-footer">
        <div class="footer-left">
          <button class="btn-primary" [disabled]="isBusy" (click)="send()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {{ isBusy && actionType === 'send' ? 'Sending…' : 'Send' }}
          </button>
          <button class="btn-secondary btn-sm" [disabled]="isBusy" (click)="saveDraft()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ editingMessageId ? 'Save changes' : 'Save Draft' }}
          </button>
        </div>
        <div class="footer-right">
          <input type="datetime-local" class="schedule-input" [(ngModel)]="scheduledAtLocal" [min]="minScheduleAt" [disabled]="isBusy">
          <button class="btn-ghost btn-sm schedule-btn" [disabled]="isBusy" (click)="schedule()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Schedule
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .compose-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 200;
      animation: fadeIn .2s ease-out;
    }

    .compose-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 580px;
      max-width: calc(100vw - 2rem);
      max-height: calc(100vh - 4rem);
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      z-index: 201;
      overflow: hidden;
      animation: modalFadeUp .3s cubic-bezier(.4,0,.2,1);
    }

    .compose-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }
    .compose-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }
    .compose-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: .35rem;
      border-radius: 8px;
      transition: all .2s;
    }
    .compose-close:hover {
      background: var(--bg-subtle);
      color: var(--text-primary);
    }
    .compose-close svg { width: 18px; height: 18px; }

    .compose-body {
      flex: 1;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: .875rem;
      overflow-y: auto;
    }
    .compose-field {
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }
    .compose-label {
      font-size: .78rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .compose-input {
      padding: .65rem 1rem;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: .875rem;
      font-family: inherit;
      color: var(--text-primary);
      outline: none;
      transition: all .2s;
    }
    .compose-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: var(--surface);
    }
    .compose-input::placeholder { color: var(--text-muted); }

    .compose-message-field { flex: 1; }
    .compose-editor {
      flex: 1;
      min-height: 180px;
      max-height: 320px;
      overflow-y: auto;
      padding: .875rem 1rem;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: .875rem;
      font-family: inherit;
      color: var(--text-primary);
      outline: none;
      transition: all .2s;
      line-height: 1.6;
    }
    .compose-editor:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: var(--surface);
    }
    .compose-editor:empty::before {
      content: attr(data-placeholder);
      color: var(--text-muted);
      pointer-events: none;
    }
    .compose-editor :global(ul),
    .compose-editor :global(ol) {
      padding-left: 1.25rem;
      margin: .5rem 0;
    }
    .compose-editor :global(a) { color: #2563eb; }
    .quoted-original {
      margin-top: .75rem;
      padding: .875rem 1rem;
      border-radius: var(--radius-sm);
      border-left: 3px solid #cbd5e1;
      background: #f8fafc;
      color: #64748b;
      font-size: .8125rem;
      line-height: 1.65;
      max-height: 220px;
      overflow-y: auto;
    }
    .quoted-original :global(.quote-line) {
      margin: 0 0 .35rem;
    }
    .quoted-original :global(.quote-body) {
      margin: .5rem 0 0;
      padding-left: .75rem;
      border-left: 2px solid #e2e8f0;
      color: #475569;
    }
    .quoted-original :global(.quote-body p) {
      margin: 0 0 .5rem;
    }

    .label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .char-counter {
      font-size: .7rem;
      font-weight: 500;
      color: var(--text-muted);
      transition: color .2s;
    }
    .char-counter.over { color: #f59e0b; }
    .counter-hint {
      font-size: .65rem;
      color: #f59e0b;
      margin-left: .35rem;
    }
    .label-hint {
      font-size: .68rem;
      color: var(--text-muted);
      font-weight: 400;
      cursor: help;
    }
    .field-help {
      font-size: .68rem;
      color: var(--text-muted);
      margin-top: .15rem;
    }

    .score-check {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .score-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .625rem .875rem;
      cursor: pointer;
      background: var(--bg);
      transition: background .15s;
    }
    .score-header:hover { background: var(--bg-subtle); }
    .score-left {
      display: flex;
      align-items: center;
      gap: .45rem;
      font-size: .8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .score-badge {
      font-size: .72rem;
      font-weight: 700;
      padding: .2rem .55rem;
      border-radius: 100px;
    }
    .score-badge.good { background: rgba(16,185,129,0.1); color: #059669; }
    .score-badge.warn { background: rgba(245,158,11,0.1); color: #d97706; }
    .score-badge.bad { background: rgba(239,68,68,0.1); color: #dc2626; }
    .score-details {
      padding: .75rem .875rem;
      border-top: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      gap: .625rem;
    }
    .score-row {
      display: flex;
      align-items: center;
      gap: .75rem;
    }
    .score-cat-info {
      flex: 1;
      min-width: 0;
    }
    .score-cat-name {
      font-size: .75rem;
      font-weight: 600;
      color: var(--text-primary);
      display: block;
    }
    .score-cat-desc {
      font-size: .65rem;
      color: var(--text-muted);
    }
    .score-cat-bar {
      width: 80px;
      height: 5px;
      background: var(--border-light);
      border-radius: 100px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .score-cat-fill {
      height: 100%;
      border-radius: 100px;
      transition: width .5s;
    }
    .score-cat-fill.good { background: #10b981; }
    .score-cat-fill.warn { background: #f59e0b; }
    .score-cat-fill.bad { background: #ef4444; }
    .score-cat-val {
      font-size: .7rem;
      font-weight: 700;
      width: 32px;
      text-align: right;
      flex-shrink: 0;
    }
    .score-cat-val.good { color: #059669; }
    .score-cat-val.warn { color: #d97706; }
    .score-cat-val.bad { color: #dc2626; }
    .score-tips {
      display: flex;
      flex-direction: column;
      gap: .35rem;
      padding-top: .375rem;
      border-top: 1px solid var(--border-light);
    }
    .score-tip {
      display: flex;
      align-items: flex-start;
      gap: .375rem;
      font-size: .7rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    .score-tip svg { color: #f59e0b; flex-shrink: 0; margin-top: 1px; }

    .compose-toolbar {
      display: flex;
      gap: .25rem;
      padding: .5rem 0 0;
    }
    .toolbar-btn {
      padding: .45rem;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all .15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toolbar-btn:hover {
      background: var(--bg-subtle);
      color: var(--text-primary);
    }
    .attachments-list {
      display: flex;
      flex-wrap: wrap;
      gap: .45rem;
      padding-top: .25rem;
    }
    .attachment-chip {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      padding: .25rem .55rem;
      border-radius: 999px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #3730a3;
      font-size: .72rem;
      max-width: 100%;
    }
    .att-name {
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .att-size {
      font-size: .65rem;
      opacity: .75;
    }
    .remove-att {
      border: none;
      background: transparent;
      color: #4338ca;
      cursor: pointer;
      font-size: .9rem;
      line-height: 1;
      padding: 0;
    }

    .compose-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-light);
      background: var(--bg);
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: .625rem;
    }
    .schedule-btn {
      gap: .375rem !important;
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: .5rem;
    }
    .schedule-input {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: .35rem .55rem;
      font-size: .75rem;
      font-family: inherit;
      color: var(--text-secondary);
      background: var(--surface);
    }
    .send-error {
      margin: 0 1.5rem .75rem;
      padding: .55rem .75rem;
      border-radius: 8px;
      background: #fef2f2;
      color: #b91c1c;
      font-size: .78rem;
    }
    .sending-status {
      display: flex;
      align-items: center;
      gap: .625rem;
      margin: 0 1.5rem;
      padding: .65rem .85rem;
      border-radius: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: .8125rem;
      font-weight: 500;
    }
    .sending-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid #93c5fd;
      border-top-color: #1d4ed8;
      border-radius: 50%;
      animation: spin .8s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .btn-primary:disabled,
    .btn-secondary:disabled,
    .btn-ghost:disabled,
    .compose-close:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    @keyframes modalFadeUp {
      from {
        opacity: 0;
        transform: translate(-50%, -40%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ComposeModalComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {}
  @Input() initialTo = '';
  @Input() initialSubject = '';
  @Input() initialBody = '';
  @Input() initialQuotedHtml = '';
  @Input() initialAttachments: EmailAttachment[] = [];
  @Input() editingMessageId: string | null = null;
  @Input() initialScheduledAt = '';
  @Input() actionBusy = false;
  @Input() openSession = 0;
  private _composeTitle = 'New Message';

  @Input()
  get composeTitle(): string {
    return this._composeTitle;
  }
  set composeTitle(value: string) {
    this._composeTitle = value || 'New Message';
    this.cdr.detectChanges();
  }
  @Output() onClose = new EventEmitter<void>();
  @Output() onSend = new EventEmitter<ComposePayload>();
  @Output() onSaveDraft = new EventEmitter<ComposePayload>();
  @Output() onSchedule = new EventEmitter<ComposePayload>();
  @ViewChild('messageEditor') messageEditor!: ElementRef<HTMLDivElement>;

  to = '';
  subject = '';
  body = '';
  quotedHtml = '';
  scheduledAtLocal = '';
  sendError = '';
  attachments: EmailAttachment[] = [];
  attachmentsLoading = 0;
  actionType: 'send' | 'draft' | 'schedule' | null = null;
  busyMessage = '';
  showScorePanel = false;
  private readonly maxAttachmentBytes = 5 * 1024 * 1024;

  get isBusy(): boolean {
    return this.actionBusy || this.actionType !== null;
  }

  close() {
    if (this.isBusy) return;
    this.onClose.emit();
  }

  get minScheduleAt(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    return this.toLocalInputValue(d);
  }

  scoreCategories = [
    { name: 'Content', desc: 'Spam trigger words & formatting', score: 92 },
    { name: 'Technical', desc: 'Authentication & domain', score: 95 },
    { name: 'Links', desc: 'URL validity & reputation', score: 88 },
    { name: 'Compliance', desc: 'Address, unsubscribe & identity', score: 100 },
  ];

  get sendScore(): number {
    return Math.round(this.scoreCategories.reduce((s, c) => s + c.score, 0) / this.scoreCategories.length);
  }

  get scoreTips(): string[] {
    const tips: string[] = [];
    const plainBody = this.getPlainBody();
    if (this.subject.length > 60) tips.push('Subject line exceeds 60 characters — may be truncated on mobile devices.');
    if (this.subject.length === 0 && plainBody.length > 0) tips.push('Add a subject line before sending.');
    if (/!{2,}/.test(this.subject) || /!{2,}/.test(plainBody)) tips.push('Multiple exclamation marks may trigger spam filters.');
    if (/FREE|GUARANTEED|ACT NOW|LIMITED TIME/i.test(plainBody)) tips.push('Some phrases in your message may trigger spam filters.');
    return tips;
  }

  ngOnInit(): void {
    this.syncFromInputs();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.setEditorHtml(this.quotedHtml ? '' : this.initialBody);
    if (!this.initialScheduledAt) {
      this.defaultScheduleTime();
    }
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actionBusy'] && !this.actionBusy) {
      this.actionType = null;
      this.busyMessage = '';
    }
    if (changes['initialTo'] || changes['initialSubject'] || changes['initialBody']
        || changes['initialQuotedHtml'] || changes['initialAttachments'] || changes['editingMessageId']
        || changes['initialScheduledAt'] || changes['openSession']) {
      this.syncFromInputs();
      setTimeout(() => this.setEditorHtml(this.quotedHtml ? '' : this.initialBody));
      this.cdr.detectChanges();
    }
  }

  onEditorInput() {
    this.syncBodyFromEditor();
    this.recalculateScore();
  }

  send() {
    if (this.isBusy) return;
    this.sendError = '';
    this.syncBodyFromEditor();
    if (!this.to.trim() || !this.subject.trim()) {
      this.sendError = 'Recipient and subject are required.';
      return;
    }
    if (!this.getPlainBody().trim()) {
      this.sendError = 'Message body is required.';
      return;
    }
    if (!this.attachmentsReady(true)) return;
    this.actionType = 'send';
    this.busyMessage = 'Sending email, please wait…';
    this.onSend.emit(this.buildPayload());
  }

  saveDraft() {
    if (this.isBusy) return;
    this.sendError = '';
    this.syncBodyFromEditor();
    if (!this.attachmentsReady(false)) return;
    this.actionType = 'draft';
    this.busyMessage = 'Saving draft, please wait…';
    this.onSaveDraft.emit(this.buildPayload());
  }

  schedule() {
    if (this.isBusy) return;
    this.sendError = '';
    this.syncBodyFromEditor();
    if (!this.to.trim() || !this.subject.trim()) {
      this.sendError = 'Recipient and subject are required.';
      return;
    }
    if (!this.getPlainBody().trim()) {
      this.sendError = 'Message body is required.';
      return;
    }
    if (!this.attachmentsReady(false)) return;
    if (!this.scheduledAtLocal) {
      this.sendError = 'Choose a date and time to schedule this email.';
      return;
    }
    const scheduledAt = new Date(this.scheduledAtLocal);
    if (Number.isNaN(scheduledAt.getTime())) {
      this.sendError = 'Invalid schedule date.';
      return;
    }
    this.actionType = 'schedule';
    this.busyMessage = 'Scheduling email, please wait…';
    this.onSchedule.emit(this.buildPayload());
  }

  private attachmentsReady(requireFileData: boolean): boolean {
    if (this.attachmentsLoading > 0) {
      this.sendError = 'Please wait — attachments are still loading.';
      return false;
    }
    if (requireFileData) {
      const missing = this.attachments.filter(a => !a.contentBase64);
      if (missing.length > 0) {
        this.sendError = 'Please wait for attachments to finish loading, or re-attach your files.';
        return false;
      }
    }
    return true;
  }

  private buildPayload(): ComposePayload {
    const scheduledAt = this.scheduledAtLocal
      ? new Date(this.scheduledAtLocal)
      : new Date(Date.now() + 60 * 60 * 1000);
    return {
      to: this.to.trim(),
      subject: this.subject.trim(),
      body: this.buildFullBody(),
      attachments: [...this.attachments],
      scheduledAt,
      messageId: this.editingMessageId ?? undefined,
    };
  }

  applyFormat(command: 'bold' | 'italic' | 'underline' | 'insertUnorderedList') {
    const editor = this.messageEditor?.nativeElement;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false);
    this.syncBodyFromEditor();
    this.recalculateScore();
  }

  insertLink() {
    const editor = this.messageEditor?.nativeElement;
    if (!editor) return;
    const url = window.prompt('Enter link URL', 'https://');
    if (!url?.trim()) return;
    editor.focus();
    document.execCommand('createLink', false, url.trim());
    this.syncBodyFromEditor();
    this.recalculateScore();
  }

  onAttachFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    for (const file of files) {
      if (file.size > this.maxAttachmentBytes) {
        this.sendError = `"${file.name}" is too large. Max size is 5 MB per file.`;
        continue;
      }
      this.attachmentsLoading++;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        this.attachments.push({
          name: file.name,
          size: this.formatFileSize(file.size),
          type: this.fileTypeFromName(file.name),
          contentBase64: base64,
        });
        this.attachmentsLoading--;
        this.sendError = '';
        this.cdr.detectChanges();
      };
      reader.onerror = () => {
        this.attachmentsLoading--;
        this.sendError = `Could not read "${file.name}".`;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  private syncFromInputs() {
    this.to = this.initialTo || '';
    this.subject = this.initialSubject || '';
    this.body = '';
    this.quotedHtml = this.initialQuotedHtml || '';
    this.attachments = [...(this.initialAttachments || [])];
    if (this.initialScheduledAt) {
      this.scheduledAtLocal = this.initialScheduledAt;
    }
    this.attachments = [];
    this.showScorePanel = false;
    this.sendError = '';
    this.defaultScheduleTime();
    this.recalculateScore();
  }

  private defaultScheduleTime() {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0, 0, 0);
    this.scheduledAtLocal = this.toLocalInputValue(d);
  }

  syncBodyFromEditor() {
    this.body = this.buildFullBody();
  }

  getPlainBody(): string {
    const editor = this.messageEditor?.nativeElement;
    return (editor?.textContent || editor?.innerText || '').trim();
  }

  private buildFullBody(): string {
    const editor = this.messageEditor?.nativeElement;
    const userHtml = editor?.innerHTML.trim() ?? '';
    if (!this.quotedHtml) return userHtml;
    if (!userHtml) return this.quotedHtml;
    return `${userHtml}<br><br>${this.quotedHtml}`;
  }

  private setEditorHtml(value: string) {
    const editor = this.messageEditor?.nativeElement;
    if (!editor) return;
    if (value && /<[a-z][\s\S]*>/i.test(value)) {
      editor.innerHTML = value;
    } else {
      editor.innerHTML = value ? this.toEditorHtml(value) : '';
    }
    this.body = this.buildFullBody();
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private fileTypeFromName(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? 'file';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'docx';
    if (['xls', 'xlsx'].includes(ext)) return 'xlsx';
    if (['zip', 'rar', '7z'].includes(ext)) return 'zip';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'fig'].includes(ext)) return ext;
    return ext;
  }

  private toEditorHtml(text: string): string {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  private toLocalInputValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private recalculateScore() {
    const plainBody = this.getPlainBody();
    const hasBody = plainBody.length > 20;
    const hasSubject = this.subject.length > 0;
    const noSpamWords = !/FREE|GUARANTEED|ACT NOW|LIMITED TIME|CLICK HERE/i.test(plainBody + ' ' + this.subject);
    const noExcessPunctuation = !/!{3,}|\${2,}|[A-Z]{10,}/.test(plainBody + ' ' + this.subject);

    this.scoreCategories = [
      { name: 'Content', desc: 'Spam trigger words & formatting', score: noSpamWords && noExcessPunctuation ? 95 : (noSpamWords ? 78 : 55) },
      { name: 'Technical', desc: 'Authentication & domain verified', score: 95 },
      { name: 'Links', desc: 'URL validity & reputation', score: 88 },
      { name: 'Compliance', desc: 'Address, unsubscribe & sender identity', score: 100 },
    ];
  }
}
