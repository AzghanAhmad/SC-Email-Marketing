import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EmailService } from '../../features/email/email.service';
import { MailboxApiService, MailboxSetupInstructions, type SaveMailboxConnectionRequest } from '../../core/services/mailbox-api.service';

@Component({
  selector: 'app-inbox-connection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card settings-card">
      <div class="inbox-header">
        <div>
          <h2 class="sc-title" style="margin:0 0 .25rem">Inbox Connection</h2>
          <p class="sc-sub" style="margin:0">Connect your email account to read and send from ScribeCount Email</p>
        </div>
        <span class="conn-status-badge" [class.connected]="connected()">
          <span class="conn-dot"></span>
          {{ connected() ? 'Connected' : 'Not connected' }}
        </span>
      </div>

      <div class="provider-pills">
        <button type="button" class="provider-pill" *ngFor="let p of providers"
          [class.active]="form.provider === p.id"
          (click)="applyProvider(p.id)">{{ p.label }}</button>
      </div>

      <div class="gmail-help" *ngIf="form.provider === 'gmail'">
        <p class="gmail-help-title">Gmail setup</p>
        <ol class="gmail-help-steps">
          <li>Enable 2-Step Verification on your Google account.</li>
          <li>
            <a [href]="gmailAppPasswordUrl" target="_blank" rel="noopener noreferrer" class="gmail-link">Create an App Password</a>
            (choose Mail → Other → ScribeCount).
          </li>
          <li>Enable IMAP in Gmail → Settings → See all settings → Forwarding and POP/IMAP.</li>
          <li>Use your full @gmail.com address as username and paste the 16-character App Password below.</li>
        </ol>
        <a [href]="gmailAppPasswordUrl" target="_blank" rel="noopener noreferrer" class="btn-gmail-app">
          Open Google App Passwords
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-input" [(ngModel)]="form.username" placeholder="Usually your full email" />
        </div>
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input type="email" class="form-input" [(ngModel)]="form.emailAddress" placeholder="you@gmail.com" (blur)="syncUsernameFromEmail()" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Password / App password</label>
        <div class="password-wrap">
          <input [type]="showPassword ? 'text' : 'password'" class="form-input" [(ngModel)]="form.password" placeholder="16-character app password (spaces OK)" />
          <button type="button" class="toggle-pw" (click)="showPassword = !showPassword" [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
            <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">IMAP host</label>
          <input type="text" class="form-input" [(ngModel)]="form.imapHost" />
        </div>
        <div class="form-group">
          <label class="form-label">IMAP port</label>
          <input type="number" class="form-input" [(ngModel)]="form.imapPort" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">SMTP host</label>
          <input type="text" class="form-input" [(ngModel)]="form.smtpHost" />
        </div>
        <div class="form-group">
          <label class="form-label">SMTP port</label>
          <input type="number" class="form-input" [(ngModel)]="form.smtpPort" />
        </div>
      </div>

      <div class="action-row">
        <button class="btn-secondary" type="button" (click)="testConnection()" [disabled]="busy()">Test connection</button>
        <button class="btn-primary" type="button" (click)="saveAndSync()" [disabled]="busy()">Save and sync inbox</button>
        <button class="btn-danger-outline" type="button" *ngIf="connected()" (click)="disconnectInbox()" [disabled]="busy()">
          Disconnect inbox
        </button>
      </div>

      <p class="status-msg" *ngIf="statusMessage()" [class.error]="statusError()">{{ statusMessage() }}</p>
      <p class="status-hint" *ngIf="statusError() && form.provider === 'gmail'">
        Still failing? Confirm IMAP is enabled in Gmail settings and
        <a [href]="gmailAppPasswordUrl" target="_blank" rel="noopener noreferrer" class="gmail-link">create a fresh App Password</a>.
      </p>
    </div>

    <div class="glass-card settings-card" *ngIf="instructions">
      <h2 class="sc-title">How to connect your email</h2>
      <ol class="setup-steps">
        <li *ngFor="let step of instructions.generalSteps">{{ step }}</li>
      </ol>

      <div class="provider-guide" *ngFor="let guide of instructions.providers">
        <h3>{{ guide.provider }}</h3>
        <p class="guide-meta">IMAP: {{ guide.imapHost }}:{{ guide.imapPort }} · SMTP: {{ guide.smtpHost }}:{{ guide.smtpPort }}</p>
        <ol>
          <li *ngFor="let step of guide.steps">{{ step }}</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .inbox-header { display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap; }
    .conn-status-badge { display:inline-flex; align-items:center; gap:.5rem; padding:.45rem 1rem; border-radius:100px; font-size:.8125rem; font-weight:600; background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }
    .conn-status-badge.connected { background:rgba(16,185,129,0.1); color:#059669; border-color:rgba(16,185,129,0.2); }
    .conn-dot { width:8px; height:8px; border-radius:50%; background:currentColor; }
    .provider-pills { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1rem; }
    .provider-pill { padding:.4rem .875rem; border-radius:100px; border:1.5px solid #e2e8f0; background:#fff; font-size:.8rem; font-weight:600; color:#64748b; cursor:pointer; }
    .provider-pill.active { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    @media(max-width:700px) { .form-row { grid-template-columns:1fr; } }
    .form-group { margin-bottom:1rem; }
    .form-label { display:block; font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.35rem; }
    .form-input { width:100%; padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.875rem; }
    .password-wrap { position:relative; }
    .password-wrap .form-input { padding-right:2.75rem; }
    .toggle-pw {
      position:absolute; right:.625rem; top:50%; transform:translateY(-50%);
      display:flex; align-items:center; justify-content:center;
      background:none; border:none; padding:.25rem; cursor:pointer; color:#94a3b8;
    }
    .toggle-pw:hover { color:#64748b; }
    .action-row { display:flex; gap:.75rem; flex-wrap:wrap; margin-top:.5rem; }
    .btn-primary, .btn-secondary { padding:.625rem 1.125rem; border-radius:10px; font-size:.875rem; font-weight:600; cursor:pointer; border:none; }
    .btn-primary { background:#3b82f6; color:#fff; }
    .btn-secondary { background:#f1f5f9; color:#374151; border:1.5px solid #e2e8f0; }
    .btn-primary:disabled, .btn-secondary:disabled { opacity:.6; cursor:not-allowed; }
    .btn-danger-outline {
      padding:.625rem 1.125rem; border-radius:10px; font-size:.875rem; font-weight:600; cursor:pointer;
      background:rgba(239,68,68,0.04); color:#dc2626; border:1.5px solid rgba(239,68,68,0.25);
    }
    .btn-danger-outline:hover:not(:disabled) { background:rgba(239,68,68,0.1); border-color:#dc2626; }
    .btn-danger-outline:disabled { opacity:.6; cursor:not-allowed; }
    .status-msg { margin-top:1rem; font-size:.8125rem; color:#059669; padding:.75rem 1rem; border-radius:10px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.15); line-height:1.5; }
    .status-msg.error { color:#b91c1c; background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.2); }
    .status-hint { margin-top:.5rem; font-size:.78rem; color:#64748b; line-height:1.5; }
    .gmail-help { margin-bottom:1.25rem; padding:1rem 1.125rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; }
    .gmail-help-title { margin:0 0 .5rem; font-size:.8125rem; font-weight:700; color:#0f172a; }
    .gmail-help-steps { margin:0 0 .875rem; padding-left:1.2rem; color:#475569; font-size:.8125rem; line-height:1.6; }
    .gmail-link { color:#2563eb; font-weight:600; text-decoration:none; }
    .gmail-link:hover { text-decoration:underline; }
    .btn-gmail-app {
      display:inline-flex; align-items:center; gap:.4rem; padding:.5rem .875rem;
      background:#fff; border:1.5px solid #bfdbfe; border-radius:8px;
      color:#2563eb; font-size:.8125rem; font-weight:600; text-decoration:none;
    }
    .btn-gmail-app:hover { background:#eff6ff; }
    .setup-steps, .provider-guide ol { padding-left:1.25rem; color:#475569; font-size:.875rem; line-height:1.6; }
    .provider-guide { margin-top:1.25rem; padding-top:1rem; border-top:1px solid #f1f5f9; }
    .provider-guide h3 { margin:0 0 .35rem; font-size:.95rem; color:#0f172a; }
    .guide-meta { margin:0 0 .5rem; font-size:.8rem; color:#94a3b8; }
    .sc-title { font-size:1.1rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .sc-sub { font-size:.875rem; color:#64748b; margin:0 0 1.25rem; }
    .settings-card { padding:1.5rem; margin-bottom:1.25rem; }
  `]
})
export class InboxConnectionComponent implements OnInit {
  readonly gmailAppPasswordUrl = 'https://myaccount.google.com/apppasswords';
  showPassword = false;

  connected = signal(false);
  busy = signal(false);
  statusMessage = signal('');
  statusError = signal(false);
  instructions: MailboxSetupInstructions | null = null;

  providers = [
    { id: 'gmail', label: 'Gmail' },
    { id: 'outlook', label: 'Outlook' },
    { id: 'yahoo', label: 'Yahoo' },
    { id: 'custom', label: 'Custom' },
  ];

  form = {
    emailAddress: '',
    username: '',
    password: '',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    imapUseSsl: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUseSsl: true,
    provider: 'gmail',
  };

  constructor(
    private mailboxApi: MailboxApiService,
    private auth: AuthService,
    private emailService: EmailService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mailboxApi.getConnection().subscribe({
      next: conn => {
        this.connected.set(conn.isConnected || !!conn.emailAddress?.trim());
        if (!conn.emailAddress) return;
        this.form.emailAddress = conn.emailAddress;
        this.form.username = conn.username;
        this.form.imapHost = conn.imapHost;
        this.form.imapPort = conn.imapPort;
        this.form.imapUseSsl = conn.imapUseSsl;
        this.form.smtpHost = conn.smtpHost;
        this.form.smtpPort = conn.smtpPort;
        this.form.smtpUseSsl = conn.smtpUseSsl;
        this.form.provider = conn.provider;
      },
      error: () => this.connected.set(false)
    });
    this.mailboxApi.getSetupInstructions().subscribe(i => this.instructions = i);
  }

  applyProvider(id: string) {
    this.form.provider = id;
    const map: Record<string, Partial<typeof this.form>> = {
      gmail: { imapHost: 'imap.gmail.com', imapPort: 993, smtpHost: 'smtp.gmail.com', smtpPort: 587 },
      outlook: { imapHost: 'outlook.office365.com', imapPort: 993, smtpHost: 'smtp.office365.com', smtpPort: 587 },
      yahoo: { imapHost: 'imap.mail.yahoo.com', imapPort: 993, smtpHost: 'smtp.mail.yahoo.com', smtpPort: 587 },
      custom: { imapHost: '', imapPort: 993, smtpHost: '', smtpPort: 587 },
    };
    Object.assign(this.form, map[id]);
  }

  syncUsernameFromEmail() {
    const email = this.form.emailAddress.trim();
    if (email && !this.form.username.trim()) {
      this.form.username = email;
    }
  }

  private prepareForm() {
    this.syncUsernameFromEmail();
    if (!this.form.emailAddress.trim()) {
      this.statusMessage.set('Email address is required.');
      this.statusError.set(true);
      return false;
    }
    if (!this.form.username.trim()) {
      this.statusMessage.set('Username is required.');
      this.statusError.set(true);
      return false;
    }
    if (!this.form.password) {
      this.statusMessage.set('Password or app password is required.');
      this.statusError.set(true);
      return false;
    }
    return true;
  }

  private toRequest(): SaveMailboxConnectionRequest {
    const email = this.form.emailAddress.trim().toLowerCase();
    const password = this.form.password.trim().replace(/\s+/g, '');
    const username = this.form.provider === 'gmail' ? email : this.form.username.trim();
    return {
      emailAddress: email,
      username,
      password,
      imapHost: this.form.imapHost.trim(),
      imapPort: Number(this.form.imapPort) || 993,
      imapUseSsl: !!this.form.imapUseSsl,
      smtpHost: this.form.smtpHost.trim(),
      smtpPort: Number(this.form.smtpPort) || 587,
      smtpUseSsl: !!this.form.smtpUseSsl,
      provider: this.form.provider,
    };
  }

  testConnection() {
    if (!this.prepareForm()) return;
    this.busy.set(true);
    this.statusError.set(false);
    this.mailboxApi.testConnection(this.toRequest()).subscribe({
      next: res => { this.statusMessage.set(res.message); this.busy.set(false); },
      error: err => { this.statusMessage.set(err.message); this.statusError.set(true); this.busy.set(false); }
    });
  }

  saveAndSync() {
    if (!this.prepareForm()) return;
    this.busy.set(true);
    this.statusError.set(false);
    this.mailboxApi.connect(this.toRequest()).subscribe({
      next: (res) => {
        this.connected.set(true);
        this.auth.updateCachedUser({ mailboxConnected: true });
        this.statusMessage.set(res.message || 'Inbox connected.');
        this.statusError.set(false);
        this.busy.set(false);

        this.auth.refreshProfile().subscribe();
        this.emailService.loadMessages().subscribe();

        if (res.connection?.isConnected) {
          void this.router.navigate(['/email', 'inbox']);
        }
      },
      error: err => {
        this.statusMessage.set(err.message);
        this.statusError.set(true);
        this.busy.set(false);
      }
    });
  }

  disconnectInbox() {
    if (!this.connected()) return;
    this.busy.set(true);
    this.statusError.set(false);
    this.mailboxApi.disconnect().subscribe({
      next: () => {
        this.connected.set(false);
        this.auth.updateCachedUser({ mailboxConnected: false });
        this.form.password = '';
        this.statusMessage.set('Inbox disconnected. You can connect a different Gmail or Outlook account.');
        this.statusError.set(false);
        this.busy.set(false);
        this.emailService.clearInbox();
        this.auth.refreshProfile().subscribe();
      },
      error: err => {
        this.statusMessage.set(err.message || 'Could not disconnect inbox.');
        this.statusError.set(true);
        this.busy.set(false);
      }
    });
  }
}
