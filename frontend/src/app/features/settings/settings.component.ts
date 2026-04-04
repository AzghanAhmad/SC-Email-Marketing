import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

type SettingsTab = 'account' | 'domain' | 'integrations' | 'notifications' | 'billing' | 'help';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your account, domain, and integrations</p>
        </div>
      </div>

      <div class="settings-layout">
        <!-- Nav -->
        <nav class="settings-nav">
          <button *ngFor="let s of sections" class="snav-item" [class.active]="activeTab() === s.id" (click)="activeTab.set(s.id)">
            <span class="snav-icon" [innerHTML]="s.icon"></span>
            {{ s.label }}
          </button>
        </nav>

        <!-- Content -->
        <div class="settings-content">

          <!-- Account -->
          <div *ngIf="activeTab() === 'account'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Account Information</h2>
              <p class="sc-sub">Update your personal details and preferences</p>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-input" [(ngModel)]="account.firstName" />
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-input" [(ngModel)]="account.lastName" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" [(ngModel)]="account.email" />
              </div>
              <div class="form-group">
                <label class="form-label">Author / Brand Name <span class="info-icon" data-tooltip="This name appears as the sender in your emails">?</span></label>
                <input type="text" class="form-input" [(ngModel)]="account.brandName" />
              </div>
              <div class="form-group">
                <label class="form-label">Time Zone</label>
                <select class="form-input" [(ngModel)]="account.timezone">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-6 (Central Time)</option>
                  <option>UTC-7 (Mountain Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (CET)</option>
                </select>
              </div>
              <button class="btn-primary" (click)="save()" data-tooltip="Save your account changes">Save Changes</button>
            </div>

            <div class="glass-card settings-card">
              <h2 class="sc-title">Change Password</h2>
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-input" [(ngModel)]="passwords.current" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-input" [(ngModel)]="passwords.next" placeholder="Min 6 characters" />
              </div>
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-input" [(ngModel)]="passwords.confirm" placeholder="Repeat new password" />
              </div>
              <button class="btn-secondary" (click)="save()" data-tooltip="Update your password">Update Password</button>
            </div>
          </div>

          <!-- Domain -->
          <div *ngIf="activeTab() === 'domain'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Sending Domain</h2>
              <p class="sc-sub">Set up a custom sending domain to improve deliverability</p>
              <div class="domain-status">
                <div class="domain-badge unverified">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Not configured
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Your Domain <span class="info-icon" data-tooltip="Enter the domain you want to send emails from, e.g. yourdomain.com">?</span></label>
                <div class="domain-input-row">
                  <input type="text" class="form-input" [(ngModel)]="domain.name" placeholder="yourdomain.com" />
                  <button class="btn-primary" data-tooltip="Verify domain ownership via DNS records">Verify Domain</button>
                </div>
              </div>
              <div class="dns-records" *ngIf="domain.name">
                <h3 class="dns-title">DNS Records to Add</h3>
                <p class="dns-sub">Add these records to your DNS provider to verify ownership</p>
                <div class="dns-table">
                  <div class="dns-row header">
                    <span>Type</span><span>Name</span><span>Value</span><span></span>
                  </div>
                  <div class="dns-row" *ngFor="let r of dnsRecords">
                    <span class="dns-type">{{ r.type }}</span>
                    <span class="dns-name">{{ r.name }}</span>
                    <span class="dns-val">{{ r.value }}</span>
                    <button class="btn-ghost btn-sm btn-icon" data-tooltip="Copy to clipboard">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Integrations -->
          <div *ngIf="activeTab() === 'integrations'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Integrations</h2>
              <p class="sc-sub">Connect ScribeCount Email with your favorite tools</p>
              <div class="integrations-grid">
                <div class="integration-card" *ngFor="let int of integrations">
                  <div class="int-logo">{{ int.logo }}</div>
                  <div class="int-body">
                    <h4 class="int-name">{{ int.name }}</h4>
                    <p class="int-desc">{{ int.description }}</p>
                  </div>
                  <div class="int-status">
                    <span class="int-badge" [class.connected]="int.connected">{{ int.connected ? 'Connected' : 'Connect' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div *ngIf="activeTab() === 'notifications'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Email Notifications</h2>
              <p class="sc-sub">Choose which notifications you want to receive</p>
              <div class="notif-list">
                <div class="notif-item" *ngFor="let n of notifications">
                  <div class="notif-info">
                    <span class="notif-title">{{ n.title }}</span>
                    <span class="notif-desc">{{ n.description }}</span>
                  </div>
                  <input type="checkbox" class="toggle" [(ngModel)]="n.enabled" />
                </div>
              </div>
              <button class="btn-primary" style="margin-top:1rem" (click)="save()" data-tooltip="Save notification preferences">Save Preferences</button>
            </div>
          </div>

          <!-- Billing -->
          <div *ngIf="activeTab() === 'billing'">
            <div class="glass-card settings-card plan-card">
              <div class="plan-header">
                <div>
                  <h2 class="plan-name">Pro Plan</h2>
                  <p class="plan-price">$29 / month</p>
                </div>
                <span class="plan-badge">Current Plan</span>
              </div>
              <div class="plan-features">
                <div class="plan-feat" *ngFor="let f of planFeatures">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ f }}
                </div>
              </div>
            </div>
            <div class="glass-card settings-card">
              <h2 class="sc-title">Billing History</h2>
              <div class="billing-table">
                <div class="billing-row header">
                  <span>Date</span><span>Description</span><span>Amount</span><span>Status</span>
                </div>
                <div class="billing-row" *ngFor="let inv of invoices">
                  <span>{{ inv.date }}</span>
                  <span>{{ inv.desc }}</span>
                  <span class="inv-amount">{{ inv.amount }}</span>
                  <span class="inv-status">{{ inv.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div *ngIf="activeTab() === 'help'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Help & Documentation</h2>
              <p class="sc-sub">Find answers, guides, and support resources</p>
              <div class="help-grid">
                <a class="help-card" *ngFor="let h of helpItems" [href]="h.url" target="_blank" data-tooltip="Open documentation">
                  <div class="help-icon">{{ h.icon }}</div>
                  <div class="help-body">
                    <h4 class="help-title">{{ h.title }}</h4>
                    <p class="help-desc">{{ h.description }}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="help-arrow"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>
            </div>
            <div class="glass-card settings-card">
              <h2 class="sc-title">Contact Support</h2>
              <div class="form-group">
                <label class="form-label">Subject</label>
                <input type="text" class="form-input" placeholder="What do you need help with?" />
              </div>
              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea class="form-input" rows="4" placeholder="Describe your issue..."></textarea>
              </div>
              <button class="btn-primary" data-tooltip="Send your support request">Send Message</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Toast -->
      <div class="toast" [class.show]="showToast()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Settings saved successfully!
      </div>
    </div>
  `,
  styles: [`
    .settings-layout { display:grid; grid-template-columns:220px 1fr; gap:2rem; }
    .settings-nav { display:flex; flex-direction:column; gap:.25rem; position:sticky; top:80px; align-self:flex-start; }
    .snav-item { display:flex; align-items:center; gap:.75rem; padding:.7rem 1rem; background:transparent; border:none; border-radius:10px; font-size:.875rem; font-weight:500; color:#64748b; cursor:pointer; transition:all .2s; text-align:left; font-family:inherit; }
    .snav-item:hover { background:#f1f5f9; color:#0f172a; }
    .snav-item.active { background:#eff6ff; color:#3b82f6; font-weight:600; border:1px solid #bfdbfe; }
    .snav-icon { width:18px; height:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .snav-icon :global(svg) { width:16px; height:16px; }

    .settings-content { display:flex; flex-direction:column; gap:1.25rem; }
    .settings-card { padding:1.75rem; }
    .sc-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .sc-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.5rem; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; margin-bottom:1rem; }
    .form-group:last-of-type { margin-bottom:1.25rem; }

    .domain-status { margin-bottom:1.25rem; }
    .domain-badge { display:inline-flex; align-items:center; gap:.375rem; padding:.35rem .75rem; border-radius:8px; font-size:.8rem; font-weight:600; }
    .domain-badge.unverified { background:rgba(245,158,11,0.1); color:#d97706; border:1px solid rgba(245,158,11,0.2); }
    .domain-badge.verified { background:rgba(16,185,129,0.1); color:#059669; border:1px solid rgba(16,185,129,0.2); }
    .domain-input-row { display:flex; gap:.75rem; }
    .domain-input-row .form-input { flex:1; }
    .dns-records { margin-top:1.5rem; }
    .dns-title { font-size:.9rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .dns-sub { font-size:.8rem; color:#94a3b8; margin:0 0 1rem; }
    .dns-table { display:flex; flex-direction:column; gap:0; }
    .dns-row { display:grid; grid-template-columns:80px 1fr 2fr 40px; gap:.75rem; padding:.75rem; border-bottom:1px solid #f1f5f9; align-items:center; font-size:.8125rem; }
    .dns-row.header { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; background:#f8fafc; }
    .dns-type { font-weight:700; color:#3b82f6; }
    .dns-name { color:#334155; font-family:monospace; }
    .dns-val { color:#64748b; font-family:monospace; font-size:.75rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

    .integrations-grid { display:flex; flex-direction:column; gap:.75rem; }
    .integration-card { display:flex; align-items:center; gap:1rem; padding:1rem; background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; transition:all .2s; }
    .integration-card:hover { background:#f0f7ff; border-color:#bfdbfe; }
    .int-logo { font-size:1.75rem; flex-shrink:0; }
    .int-body { flex:1; }
    .int-name { font-size:.9rem; font-weight:600; color:#0f172a; margin:0 0 .2rem; }
    .int-desc { font-size:.8rem; color:#94a3b8; margin:0; }
    .int-badge { padding:.35rem .875rem; border-radius:8px; font-size:.8rem; font-weight:600; cursor:pointer; background:#f1f5f9; color:#64748b; border:1.5px solid #e2e8f0; transition:all .2s; }
    .int-badge.connected { background:rgba(16,185,129,0.08); color:#059669; border-color:rgba(16,185,129,0.2); }
    .int-badge:hover { background:#eff6ff; color:#3b82f6; border-color:#bfdbfe; }

    .notif-list { display:flex; flex-direction:column; gap:.5rem; }
    .notif-item { display:flex; align-items:center; justify-content:space-between; padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .notif-info { display:flex; flex-direction:column; gap:.2rem; }
    .notif-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .notif-desc { font-size:.8rem; color:#94a3b8; }

    .plan-card { background:linear-gradient(135deg,rgb(22,38,62),rgb(30,55,95)); border-color:transparent; }
    .plan-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .plan-name { font-size:1.5rem; font-weight:800; color:white; margin:0 0 .25rem; }
    .plan-price { font-size:1rem; color:rgba(255,255,255,0.6); margin:0; }
    .plan-badge { padding:.375rem 1rem; background:rgba(255,255,255,0.15); border-radius:100px; font-size:.75rem; font-weight:600; color:white; }
    .plan-features { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .plan-feat { display:flex; align-items:center; gap:.5rem; font-size:.875rem; color:rgba(255,255,255,0.8); }

    .billing-table { display:flex; flex-direction:column; }
    .billing-row { display:grid; grid-template-columns:1fr 2fr 1fr 1fr; gap:1rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; font-size:.875rem; color:#334155; }
    .billing-row.header { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .billing-row:last-child { border-bottom:none; }
    .inv-amount { font-weight:600; color:#0f172a; }
    .inv-status { color:#059669; font-weight:500; text-transform:capitalize; }

    .help-grid { display:flex; flex-direction:column; gap:.625rem; margin-bottom:1.5rem; }
    .help-card { display:flex; align-items:center; gap:1rem; padding:1rem; background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; text-decoration:none; transition:all .2s; cursor:pointer; }
    .help-card:hover { background:#f0f7ff; border-color:#bfdbfe; transform:translateX(3px); }
    .help-icon { font-size:1.5rem; flex-shrink:0; }
    .help-body { flex:1; }
    .help-title { font-size:.9rem; font-weight:600; color:#0f172a; margin:0 0 .2rem; }
    .help-desc { font-size:.8rem; color:#94a3b8; margin:0; }
    .help-arrow { color:#cbd5e1; transition:transform .2s; }
    .help-card:hover .help-arrow { transform:translateX(3px); color:#3b82f6; }

    .toast { position:fixed; bottom:2rem; right:2rem; display:flex; align-items:center; gap:.5rem; padding:.875rem 1.25rem; background:#0f172a; color:white; border-radius:14px; font-size:.875rem; font-weight:500; box-shadow:0 20px 60px rgba(0,0,0,0.2); transform:translateY(100px); opacity:0; transition:all .3s cubic-bezier(.4,0,.2,1); z-index:1000; }
    .toast.show { transform:translateY(0); opacity:1; }
    .toast svg { width:18px; height:18px; color:#34d399; flex-shrink:0; }

    @media(max-width:900px) { .settings-layout { grid-template-columns:1fr; } .settings-nav { flex-direction:row; overflow-x:auto; position:static; } .form-row { grid-template-columns:1fr; } .plan-features { grid-template-columns:1fr; } }
  `]
})
export class SettingsComponent {
  activeTab = signal<SettingsTab>('account');
  showToast = signal(false);

  account = {
    firstName: 'Jane', lastName: 'Austen',
    email: 'jane@scribecount.com', brandName: 'Jane Austen Books', timezone: 'UTC-5 (Eastern Time)'
  };
  passwords = { current: '', next: '', confirm: '' };
  domain = { name: '' };

  sections = [
    { id: 'account' as SettingsTab, label: 'Account', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { id: 'domain' as SettingsTab, label: 'Domain Setup', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
    { id: 'integrations' as SettingsTab, label: 'Integrations', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { id: 'help' as SettingsTab, label: 'Help', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  ];

  dnsRecords = [
    { type: 'TXT', name: '@', value: 'v=spf1 include:scribecount.com ~all' },
    { type: 'CNAME', name: 'em._domainkey', value: 'em._domainkey.scribecount.com' },
    { type: 'CNAME', name: 'mail', value: 'mail.scribecount.com' },
  ];

  integrations = [
    { logo: '📚', name: 'BookFunnel', description: 'Sync reader magnet downloads to your list', connected: true },
    { logo: '🛒', name: 'Shopify', description: 'Add customers to your email list automatically', connected: false },
    { logo: '📊', name: 'Google Analytics', description: 'Track email campaign traffic in GA4', connected: false },
    { logo: '🔗', name: 'Zapier', description: 'Connect with 5,000+ apps via Zapier', connected: false },
    { logo: '📖', name: 'StoryOrigin', description: 'Import subscribers from StoryOrigin', connected: true },
    { logo: '🎯', name: 'Facebook Pixel', description: 'Retarget email subscribers on Facebook', connected: false },
  ];

  notifications = [
    { title: 'Campaign Sent', description: 'Notify me when a campaign is sent successfully', enabled: true },
    { title: 'New Subscriber', description: 'Notify me when someone joins my list', enabled: false },
    { title: 'Weekly Report', description: 'Receive a weekly summary of my email performance', enabled: true },
    { title: 'Flow Triggered', description: 'Notify me when an automation flow is triggered', enabled: false },
    { title: 'Unsubscribe Alert', description: 'Notify me when someone unsubscribes', enabled: true },
    { title: 'Product Updates', description: 'News about new ScribeCount Email features', enabled: true },
  ];

  planFeatures = [
    'Unlimited subscribers', 'Unlimited emails/month', 'Automation flows',
    'Advanced analytics', 'Custom domain', 'Priority support'
  ];

  invoices = [
    { date: 'Mar 1, 2026', desc: 'Pro Plan — Monthly', amount: '$29.00', status: 'Paid' },
    { date: 'Feb 1, 2026', desc: 'Pro Plan — Monthly', amount: '$29.00', status: 'Paid' },
    { date: 'Jan 1, 2026', desc: 'Pro Plan — Monthly', amount: '$29.00', status: 'Paid' },
  ];

  helpItems = [
    { icon: '📖', title: 'Getting Started Guide', description: 'Learn the basics of ScribeCount Email', url: '#' },
    { icon: '📧', title: 'Campaign Best Practices', description: 'Tips for higher open and click rates', url: '#' },
    { icon: '⚡', title: 'Automation Flows', description: 'How to set up and manage flows', url: '#' },
    { icon: '📊', title: 'Understanding Analytics', description: 'Make sense of your email metrics', url: '#' },
  ];

  constructor(public auth: AuthService) {}

  save() {
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2500);
  }
}
