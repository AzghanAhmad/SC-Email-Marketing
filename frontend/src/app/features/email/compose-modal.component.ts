import { Component, Output, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compose-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div class="compose-backdrop" (click)="onClose.emit()" @fadeIn></div>

    <!-- Modal -->
    <div class="compose-modal" @slideUp>
      <div class="compose-header">
        <h2 class="compose-title">{{ composeTitle }}</h2>
        <button class="compose-close" (click)="onClose.emit()">
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
          <label class="compose-label">Subject</label>
          <input type="text" class="compose-input" placeholder="Enter subject..."
                 [(ngModel)]="subject">
        </div>

        <!-- Message -->
        <div class="compose-field compose-message-field">
          <label class="compose-label">Message</label>
          <textarea #messageInput class="compose-textarea" placeholder="Write your message..."
                    [(ngModel)]="body"></textarea>
        </div>

        <!-- Formatting Toolbar -->
        <div class="compose-toolbar">
          <button class="toolbar-btn" title="Bold" (click)="applyFormat('bold')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Italic" (click)="applyFormat('italic')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Link" (click)="insertLink()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Attach file" (click)="fileInput.click()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input #fileInput type="file" multiple hidden (change)="onAttachFiles($event)">
        </div>

        <div class="attachments-list" *ngIf="attachments.length > 0">
          <div class="attachment-chip" *ngFor="let att of attachments; let i = index">
            <span class="att-name">{{ att }}</span>
            <button class="remove-att" (click)="removeAttachment(i)" title="Remove attachment">×</button>
          </div>
        </div>
      </div>

      <div class="compose-footer">
        <div class="footer-left">
          <button class="btn-primary" (click)="send()" data-tooltip="Send this email now">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send
          </button>
          <button class="btn-secondary btn-sm" (click)="saveDraft()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Draft
          </button>
        </div>
        <button class="btn-ghost btn-sm schedule-btn" (click)="schedule()"
                data-tooltip="Schedule this email to send later (mock)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Schedule
        </button>
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
      animation: fadeUp .3s cubic-bezier(.4,0,.2,1);
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
    .compose-textarea {
      flex: 1;
      min-height: 180px;
      padding: .875rem 1rem;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: .875rem;
      font-family: inherit;
      color: var(--text-primary);
      outline: none;
      transition: all .2s;
      resize: vertical;
      line-height: 1.6;
    }
    .compose-textarea:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: var(--surface);
    }
    .compose-textarea::placeholder { color: var(--text-muted); }

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
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  `]
})
export class ComposeModalComponent implements OnChanges, OnInit {
  @Input() initialTo = '';
  @Input() initialSubject = '';
  @Input() initialBody = '';
  @Input() composeTitle = 'New Message';
  @Output() onClose = new EventEmitter<void>();
  @Output() onSend = new EventEmitter<{ to: string; subject: string; body: string }>();
  @Output() onSaveDraft = new EventEmitter<{ to: string; subject: string; body: string }>();
  @Output() onSchedule = new EventEmitter<{ to: string; subject: string; body: string }>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  to = '';
  subject = '';
  body = '';
  attachments: string[] = [];

  ngOnInit(): void {
    this.syncFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialTo'] || changes['initialSubject'] || changes['initialBody']) {
      this.syncFromInputs();
    }
  }

  send() {
    if (!this.to.trim() || !this.subject.trim()) return;
    this.onSend.emit({ to: this.to, subject: this.subject, body: this.body });
  }

  saveDraft() {
    this.onSaveDraft.emit({ to: this.to, subject: this.subject, body: this.body });
  }

  schedule() {
    if (!this.to.trim() || !this.subject.trim()) return;
    this.onSchedule.emit({ to: this.to, subject: this.subject, body: this.body });
  }

  applyFormat(type: 'bold' | 'italic') {
    const textarea = this.messageInput?.nativeElement;
    if (!textarea) return;
    const start = textarea.selectionStart ?? this.body.length;
    const end = textarea.selectionEnd ?? this.body.length;
    const selected = this.body.slice(start, end) || 'text';
    const wrapped = type === 'bold' ? `**${selected}**` : `*${selected}*`;
    this.body = this.body.slice(0, start) + wrapped + this.body.slice(end);
  }

  insertLink() {
    const textarea = this.messageInput?.nativeElement;
    if (!textarea) return;
    const start = textarea.selectionStart ?? this.body.length;
    const end = textarea.selectionEnd ?? this.body.length;
    const selected = this.body.slice(start, end) || 'link text';
    const value = `[${selected}](https://example.com)`;
    this.body = this.body.slice(0, start) + value + this.body.slice(end);
  }

  onAttachFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.attachments.push(...files.map(file => file.name));
    input.value = '';
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  private syncFromInputs() {
    this.to = this.initialTo || '';
    this.subject = this.initialSubject || '';
    this.body = this.initialBody || '';
    this.attachments = [];
  }
}
