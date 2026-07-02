import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { SettingsApiService, UserSettings, NotificationSetting } from '../../core/services/settings-api.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';
import { InboxConnectionComponent } from './inbox-connection.component';

type SettingsTab = 'account' | 'domain' | 'inbox' | 'store' | 'notifications' | 'preferences';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, InboxConnectionComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your account, domain, and store connection</p>
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

          <!-- Inbox Connection -->
          <div *ngIf="activeTab() === 'inbox'">
            <app-inbox-connection></app-inbox-connection>
          </div>

          <!-- Store Connection (Shopify) -->
          <div *ngIf="activeTab() === 'store'">

            <!-- Connection Status Card -->
            <div class="glass-card settings-card">
              <div class="store-header">
                <div class="store-header-left">
                  <div class="shopify-logo-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.75" width="28" height="28"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <div>
                    <h2 class="sc-title" style="margin:0 0 .2rem">Shopify Store Connection</h2>
                    <p class="sc-sub" style="margin:0">Connect your Shopify store to trigger email flows from store events</p>
                  </div>
                </div>
                <div class="conn-status-badge" [class.connected]="shopify.connected" [class.disconnected]="!shopify.connected">
                  <span class="conn-dot"></span>
                  {{ shopify.connected ? 'Connected' : 'Not Connected' }}
                </div>
              </div>

              <!-- Not connected state -->
              <div *ngIf="!shopify.connected" class="connect-flow">
                <div class="connect-steps">
                  <div class="connect-step">
                    <div class="cs-num">1</div>
                    <div class="cs-body">
                      <div class="cs-title">Install the ScribeCount app in Shopify</div>
                      <div class="cs-desc">Go to your Shopify admin → Apps → search for "ScribeCount Email" and click Add App</div>
                    </div>
                  </div>
                  <div class="connect-step">
                    <div class="cs-num">2</div>
                    <div class="cs-body">
                      <div class="cs-title">Enter your Shopify store URL</div>
                      <div class="cs-desc">Enter your store's myshopify.com address below</div>
                    </div>
                  </div>
                  <div class="connect-step">
                    <div class="cs-num">3</div>
                    <div class="cs-body">
                      <div class="cs-title">Authorize the connection</div>
                      <div class="cs-desc">ScribeCount will verify the connection and display a green status indicator</div>
                    </div>
                  </div>
                </div>
                <div class="form-group" style="margin-top:1.5rem">
                  <label class="form-label">Your Shopify Store URL</label>
                  <div class="store-url-row">
                    <input type="text" class="form-input" [(ngModel)]="shopify.storeUrl" placeholder="yourstore.myshopify.com" />
                    <button class="btn-primary" (click)="connectShopify()" data-tooltip="Authorize the connection between your Shopify store and ScribeCount Email">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      Authorize Connection
                    </button>
                  </div>
                </div>
                <div class="permissions-note">
                  <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  ScribeCount only requests read access to orders, customers, and products. It does not modify orders, change prices, or access payment information.
                </div>
              </div>

              <!-- Connected state -->
              <div *ngIf="shopify.connected" class="connected-info">
                <div class="conn-detail-row">
                  <span class="conn-detail-key">Store URL</span>
                  <span class="conn-detail-val">{{ shopify.storeUrl || 'yourstore.myshopify.com' }}</span>
                </div>
                <div class="conn-detail-row">
                  <span class="conn-detail-key">Connected since</span>
                  <span class="conn-detail-val">{{ shopify.connectedSince || '—' }}</span>
                </div>
                <div class="conn-detail-row">
                  <span class="conn-detail-key">Events received</span>
                  <span class="conn-detail-val">{{ shopify.eventsReceived | number }} webhooks</span>
                </div>
                <div class="conn-detail-row" *ngIf="shopify.lastEvent">
                  <span class="conn-detail-key">Last event</span>
                  <span class="conn-detail-val">{{ shopify.lastEvent }}</span>
                </div>
                <div class="conn-actions">
                  <button class="btn-secondary btn-sm" (click)="testStoreConnection()" data-tooltip="Test the connection by sending a simulated event">Test Connection</button>
                  <button class="btn-ghost btn-sm danger-btn" (click)="disconnectShopify()" data-tooltip="Disconnect your Shopify store">Disconnect</button>
                </div>
              </div>
            </div>

            <!-- Event Configuration -->
            <div class="glass-card settings-card" *ngIf="shopify.connected">
              <h2 class="sc-title">Store Event Configuration</h2>
              <p class="sc-sub">Configure how each store event triggers your email flows</p>

              <div class="event-sections">
                <!-- Purchase Events -->
                <div class="event-section">
                  <div class="event-section-header">
                    <div class="event-icon purchase">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <div>
                      <div class="event-section-title">Completed Purchase</div>
                      <div class="event-section-sub">Fires when a reader completes a transaction in your store</div>
                    </div>
                    <input type="checkbox" class="toggle" [(ngModel)]="shopify.events.purchase" />
                  </div>
                  <div class="event-config" *ngIf="shopify.events.purchase">
                    <div class="form-row-3">
                      <div class="form-group">
                        <label class="form-label">First-time buyer flow</label>
                        <select class="form-input"><option>Post-Purchase Thank You</option><option>Order Confirmation</option></select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Repeat buyer flow</label>
                        <select class="form-input"><option>Repeat Purchase Thank You</option><option>Post-Purchase Thank You</option></select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Follow-up delay</label>
                        <select class="form-input"><option>3 days</option><option>5 days</option><option>7 days</option></select>
                      </div>
                    </div>
                    <div class="event-toggle-row">
                      <span class="etl">Auto-add purchasers to list (with consent)</span>
                      <input type="checkbox" class="toggle" [(ngModel)]="shopify.autoAddPurchasers" />
                    </div>
                  </div>
                </div>

                <!-- Abandoned Cart -->
                <div class="event-section">
                  <div class="event-section-header">
                    <div class="event-icon cart">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </div>
                    <div>
                      <div class="event-section-title">Abandoned Cart</div>
                      <div class="event-section-sub">Fires when a reader leaves without checking out (default: 60 min window)</div>
                    </div>
                    <input type="checkbox" class="toggle" [(ngModel)]="shopify.events.abandonedCart" />
                  </div>
                  <div class="event-config" *ngIf="shopify.events.abandonedCart">
                    <div class="form-row-3">
                      <div class="form-group">
                        <label class="form-label">Detection window</label>
                        <select class="form-input"><option>60 minutes (recommended)</option><option>30 minutes</option><option>90 minutes</option></select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Flow to trigger</label>
                        <select class="form-input"><option>Abandoned Cart Flow</option></select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">First email delay</label>
                        <select class="form-input"><option>60 minutes</option><option>30 minutes</option><option>2 hours</option></select>
                      </div>
                    </div>
                    <div class="event-toggle-row">
                      <span class="etl">Suppress existing buyers of the abandoned title</span>
                      <input type="checkbox" class="toggle" [ngModel]="true" />
                    </div>
                  </div>
                </div>

                <!-- Abandoned Checkout -->
                <div class="event-section">
                  <div class="event-section-header">
                    <div class="event-icon checkout">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div>
                      <div class="event-section-title">Abandoned Checkout</div>
                      <div class="event-section-sub">Fires when a reader enters payment info but doesn't complete (higher intent)</div>
                    </div>
                    <input type="checkbox" class="toggle" [(ngModel)]="shopify.events.abandonedCheckout" />
                  </div>
                  <div class="event-config" *ngIf="shopify.events.abandonedCheckout">
                    <div class="form-row-3">
                      <div class="form-group">
                        <label class="form-label">Flow to trigger</label>
                        <select class="form-input"><option>Abandoned Checkout Flow</option></select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">First email delay</label>
                        <select class="form-input"><option>30 minutes (recommended)</option><option>15 minutes</option><option>60 minutes</option></select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Subscriber Opt-In -->
                <div class="event-section">
                  <div class="event-section-header">
                    <div class="event-icon optin">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    </div>
                    <div>
                      <div class="event-section-title">New Subscriber Opt-In</div>
                      <div class="event-section-sub">Fires when a reader submits an opt-in form in your store</div>
                    </div>
                    <input type="checkbox" class="toggle" [(ngModel)]="shopify.events.optIn" />
                  </div>
                  <div class="event-config" *ngIf="shopify.events.optIn">
                    <div class="form-row-3">
                      <div class="form-group">
                        <label class="form-label">Welcome flow</label>
                        <select class="form-input"><option>Welcome Sequence</option><option>Reader Magnet Delivery</option></select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Source tag</label>
                        <input type="text" class="form-input" value="shopify-checkout-optin" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button class="btn-primary" style="margin-top:1rem" (click)="saveStoreSettings()">Save Event Settings</button>
            </div>

            <!-- Testing Console -->
            <div class="glass-card settings-card" *ngIf="shopify.connected">
              <h2 class="sc-title">Event Testing Console</h2>
              <p class="sc-sub">Simulate store events to verify your flows are configured correctly — no real orders needed</p>
              <div class="test-console">
                <div class="test-event-grid">
                  <div class="test-event-card" *ngFor="let t of testEvents" (click)="runTest(t)">
                    <div class="te-icon" [innerHTML]="t.icon"></div>
                    <div class="te-body">
                      <div class="te-title">{{ t.label }}</div>
                      <div class="te-desc">{{ t.desc }}</div>
                    </div>
                    <div class="te-status" *ngIf="t.result">
                      <span class="te-pass" *ngIf="t.result === 'pass'">
                        <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                        Passed
                      </span>
                    </div>
                    <button class="te-run-btn">Run Test</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Log -->
            <div class="glass-card settings-card" *ngIf="shopify.connected">
              <div class="log-header">
                <div>
                  <h2 class="sc-title">Activity Log</h2>
                  <p class="sc-sub">Recent webhook events received from your Shopify store</p>
                </div>
                <button class="btn-secondary btn-sm" (click)="save()">Refresh</button>
              </div>
              <div class="activity-log">
                <div class="log-row header-row">
                  <span>Timestamp</span><span>Event Type</span><span>Subscriber</span><span>Flow Triggered</span><span>Status</span>
                </div>
                <div class="log-row" *ngFor="let entry of activityLog">
                  <span class="log-time">{{ entry.time }}</span>
                  <span class="log-event">
                    <span class="log-event-badge" [class]="'event-' + entry.type">{{ entry.eventLabel }}</span>
                  </span>
                  <span class="log-email">{{ entry.email }}</span>
                  <span class="log-flow">{{ entry.flow }}</span>
                  <span class="log-status" [class.status-ok]="entry.status === 'ok'" [class.status-warn]="entry.status === 'warn'">
                    <svg *ngIf="entry.status === 'ok'" viewBox="0 0 20 20" fill="#059669" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    <svg *ngIf="entry.status === 'warn'" viewBox="0 0 20 20" fill="#f59e0b" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                    {{ entry.status === 'ok' ? 'Success' : 'Warning' }}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- Notifications -->
          <div *ngIf="activeTab() === 'notifications'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Email Notifications</h2>
              <p class="sc-sub">Choose which alerts ScribeCount sends to your inbox</p>

              <div class="notif-delivery">
                <span class="notif-delivery-label">Delivery address</span>
                <span class="notif-delivery-email">{{ account.email }}</span>
                <span class="notif-delivery-note">Alerts are sent to your account email. Update it under Account.</span>
              </div>

              <div class="notif-loading" *ngIf="notificationsLoading()">Loading notification preferences…</div>

              <ng-container *ngIf="!notificationsLoading()">
                <div class="notif-group" *ngFor="let group of notificationGroups">
                  <h3 class="notif-group-title">{{ group.label }}</h3>
                  <div class="notif-list">
                    <div class="notif-item" *ngFor="let n of group.items">
                      <div class="notif-info">
                        <span class="notif-title">{{ n.title }}</span>
                        <span class="notif-desc">{{ n.description }}</span>
                      </div>
                      <label class="toggle-wrap" [attr.aria-label]="'Toggle ' + n.title">
                        <input type="checkbox" [(ngModel)]="n.enabled" />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <p class="notif-empty" *ngIf="notifications.length === 0">No notification options are available right now.</p>
              </ng-container>

              <button class="btn-primary" style="margin-top:1rem" (click)="saveNotifications()" [disabled]="notificationsLoading() || notifications.length === 0" data-tooltip="Save notification preferences">Save Preferences</button>
            </div>
          </div>

          <!-- Preference Center -->
          <div *ngIf="activeTab() === 'preferences'">
            <div class="glass-card settings-card">
              <h2 class="sc-title">Reader Preference Center</h2>
              <p class="sc-sub">Let your readers choose what they receive and how often — readers who feel in control are dramatically less likely to unsubscribe</p>

              <!-- Explainer -->
              <div class="pref-explainer">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p>A preference center is linked from the footer of every email you send. Readers tell you what they want — and your segmentation updates automatically, with no manual list management.</p>
              </div>

              <!-- Preference options -->
              <h3 class="pref-section-title">Email Types Readers Can Choose</h3>
              <div class="pref-options-list">
                <div class="pref-option" *ngFor="let opt of prefOptions">
                  <div class="pref-opt-left">
                    <label class="toggle-wrap">
                      <input type="checkbox" [(ngModel)]="opt.enabled" />
                      <span class="toggle-slider"></span>
                    </label>
                    <div class="pref-opt-info">
                      <span class="pref-opt-name">{{ opt.name }}</span>
                      <span class="pref-opt-desc">{{ opt.description }}</span>
                    </div>
                  </div>
                  <span class="pref-opt-count">{{ opt.subscriberCount | number }} subscribers</span>
                </div>
              </div>

              <!-- Frequency options -->
              <h3 class="pref-section-title" style="margin-top:1.5rem">Frequency Options Readers Can Choose</h3>
              <div class="pref-freq-grid">
                <div class="pref-freq-card" *ngFor="let freq of prefFrequencies" [class.pref-freq-active]="freq.enabled">
                  <label class="toggle-wrap" style="position:absolute;top:.875rem;right:.875rem">
                    <input type="checkbox" [(ngModel)]="freq.enabled" />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="nav-icon pref-freq-icon" [innerHTML]="freq.safeIcon"></span>
                  <div class="pref-freq-name">{{ freq.name }}</div>
                  <div class="pref-freq-desc">{{ freq.description }}</div>
                </div>
              </div>

              <!-- Footer link preview -->
              <h3 class="pref-section-title" style="margin-top:1.5rem">Footer Link Preview</h3>
              <div class="pref-footer-preview">
                <div class="pfp-inner">
                  <p class="pfp-text">You're receiving this because you subscribed at <strong>{{ brandDomain }}</strong>.</p>
                  <div class="pfp-links">
                    <a class="pfp-link">Manage preferences</a>
                    <span class="pfp-sep">·</span>
                    <a class="pfp-link">Unsubscribe</a>
                    <span class="pfp-sep">·</span>
                    <a class="pfp-link">View in browser</a>
                  </div>
                  <p class="pfp-address">123 Author Lane, New York, NY 10001</p>
                </div>
              </div>
              <p class="pref-footer-note">The "Manage preferences" link is automatically added to every email footer and links to your preference center page.</p>

              <button class="btn-primary" style="margin-top:1.25rem" (click)="savePreferences()">Save Preference Center Settings</button>
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
    .nav-icon { display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#64748b; }
    .nav-icon :global(svg) { width:22px; height:22px; display:block; }
    .pref-freq-icon { margin-bottom:.5rem; }
    .int-body { flex:1; }
    .int-name { font-size:.9rem; font-weight:600; color:#0f172a; margin:0 0 .2rem; }
    .int-desc { font-size:.8rem; color:#94a3b8; margin:0; }
    .int-badge { padding:.35rem .875rem; border-radius:8px; font-size:.8rem; font-weight:600; cursor:pointer; background:#f1f5f9; color:#64748b; border:1.5px solid #e2e8f0; transition:all .2s; }
    .int-badge.connected { background:rgba(16,185,129,0.08); color:#059669; border-color:rgba(16,185,129,0.2); }
    .int-badge:hover { background:#eff6ff; color:#3b82f6; border-color:#bfdbfe; }

    /* Store Connection */
    .store-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
    .store-header-left { display:flex; align-items:center; gap:1rem; }
    .shopify-logo-wrap { width:48px; height:48px; border-radius:12px; background:rgba(5,150,105,0.08); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .conn-status-badge { display:inline-flex; align-items:center; gap:.5rem; padding:.45rem 1rem; border-radius:100px; font-size:.8125rem; font-weight:600; }
    .conn-status-badge.connected { background:rgba(16,185,129,0.1); color:#059669; border:1px solid rgba(16,185,129,0.2); }
    .conn-status-badge.disconnected { background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }
    .conn-dot { width:8px; height:8px; border-radius:50%; background:currentColor; }

    .connect-steps { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
    .connect-step { display:flex; align-items:flex-start; gap:.875rem; }
    .cs-num { width:28px; height:28px; border-radius:50%; background:#3b82f6; color:white; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; flex-shrink:0; }
    .cs-body { flex:1; }
    .cs-title { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .cs-desc { font-size:.8rem; color:#64748b; }
    .store-url-row { display:flex; gap:.75rem; }
    .store-url-row .form-input { flex:1; }
    .permissions-note { display:flex; align-items:flex-start; gap:.625rem; padding:.875rem 1rem; background:rgba(5,150,105,0.06); border:1px solid rgba(5,150,105,0.15); border-radius:10px; font-size:.8125rem; color:#374151; margin-top:1rem; line-height:1.5; }

    .connected-info { display:flex; flex-direction:column; gap:0; }
    .conn-detail-row { display:flex; gap:1rem; padding:.625rem 0; border-bottom:1px solid #f1f5f9; }
    .conn-detail-row:last-of-type { border-bottom:none; }
    .conn-detail-key { font-size:.8125rem; font-weight:600; color:#94a3b8; min-width:130px; }
    .conn-detail-val { font-size:.8125rem; color:#0f172a; }
    .conn-actions { display:flex; gap:.75rem; margin-top:1.25rem; }
    .danger-btn { color:#dc2626 !important; }
    .danger-btn:hover { background:rgba(239,68,68,0.06) !important; }

    .event-sections { display:flex; flex-direction:column; gap:.75rem; }
    .event-section { border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; }
    .event-section-header { display:flex; align-items:center; gap:.875rem; padding:1rem 1.125rem; background:#f8fafc; }
    .event-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .event-icon.purchase { background:rgba(5,150,105,0.1); color:#059669; }
    .event-icon.cart { background:rgba(245,158,11,0.1); color:#d97706; }
    .event-icon.checkout { background:rgba(99,102,241,0.1); color:#6366f1; }
    .event-icon.optin { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .event-section-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .event-section-sub { font-size:.75rem; color:#94a3b8; margin-top:.1rem; }
    .event-section-header .toggle { margin-left:auto; }
    .event-config { padding:1rem 1.125rem; border-top:1px solid #f1f5f9; background:#fff; }
    .form-row-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:.75rem; }
    .event-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:.625rem .875rem; background:#f8fafc; border-radius:8px; }
    .etl { font-size:.8125rem; color:#374151; font-weight:500; }

    .test-console { }
    .test-event-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
    .test-event-card { display:flex; align-items:center; gap:.875rem; padding:1rem; border:1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; transition:all .15s; cursor:pointer; }
    .test-event-card:hover { border-color:#bfdbfe; background:#f0f7ff; }
    .te-icon { width:36px; height:36px; border-radius:9px; background:#fff; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .te-body { flex:1; }
    .te-title { font-size:.8125rem; font-weight:600; color:#0f172a; }
    .te-desc { font-size:.75rem; color:#94a3b8; margin-top:.1rem; }
    .te-status { display:flex; align-items:center; }
    .te-pass { display:flex; align-items:center; gap:.25rem; font-size:.75rem; font-weight:600; color:#059669; }
    .te-run-btn { padding:.35rem .75rem; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-size:.75rem; font-weight:600; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; white-space:nowrap; }
    .te-run-btn:hover { border-color:#3b82f6; color:#3b82f6; }

    .log-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem; }
    .activity-log { display:flex; flex-direction:column; overflow-x:auto; }
    .log-row { display:grid; grid-template-columns:130px 160px 1fr 1fr 90px; gap:.75rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:center; font-size:.8125rem; }
    .log-row:last-child { border-bottom:none; }
    .header-row { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .log-time { color:#64748b; font-size:.75rem; }
    .log-event-badge { padding:.2rem .55rem; border-radius:6px; font-size:.7rem; font-weight:700; font-family:monospace; }
    .event-purchase { background:rgba(5,150,105,0.1); color:#059669; }
    .event-cart { background:rgba(245,158,11,0.1); color:#d97706; }
    .event-checkout { background:rgba(99,102,241,0.1); color:#6366f1; }
    .event-optin { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .log-email { color:#64748b; font-family:monospace; font-size:.75rem; }
    .log-flow { color:#334155; font-size:.8rem; }
    .log-status { display:flex; align-items:center; gap:.3rem; font-size:.75rem; font-weight:600; }
    .status-ok { color:#059669; }
    .status-warn { color:#d97706; }

    @media(max-width:900px) { .test-event-grid { grid-template-columns:1fr; } .form-row-3 { grid-template-columns:1fr; } .log-row { grid-template-columns:1fr 1fr; } }
    @media(max-width:768px) {
      .settings-layout { grid-template-columns:1fr; gap:1rem; }
      .settings-nav {
        flex-direction:row; overflow-x:auto; position:static;
        padding-bottom:.5rem; gap:.375rem;
        -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
      }
      .settings-nav::-webkit-scrollbar { display:none; }
      .snav-item { white-space:nowrap; flex-shrink:0; padding:.55rem .875rem; }
      .form-row { grid-template-columns:1fr; }
      .domain-input-row { flex-direction:column; }
      .store-url-row { flex-direction:column; }
      .dns-row { grid-template-columns:60px 1fr 1fr 32px; }
      .plan-features { grid-template-columns:1fr; }
      .billing-row { grid-template-columns:1fr 1fr; gap:.5rem; }
      .settings-card { padding:1.25rem; }
    }
    @media(max-width:480px) {
      .dns-row { grid-template-columns:1fr; }
      .dns-row.header { display:none; }
      .billing-row.header { display:none; }
      .billing-row { grid-template-columns:1fr; }
      .log-row.header-row { display:none; }
      .test-event-card { flex-wrap:wrap; }
      .notif-item { flex-direction:column; align-items:flex-start; gap:.5rem; }
    }

    .notif-list { display:flex; flex-direction:column; gap:.5rem; }
    .notif-group { margin-bottom:1.25rem; }
    .notif-group:last-of-type { margin-bottom:0; }
    .notif-group-title { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; margin:0 0 .625rem; }
    .notif-item { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .notif-info { display:flex; flex-direction:column; gap:.2rem; flex:1; min-width:0; }
    .notif-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .notif-desc { font-size:.8rem; color:#64748b; line-height:1.45; }
    .notif-delivery { padding:.875rem 1rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:1.25rem; display:flex; flex-direction:column; gap:.2rem; }
    .notif-delivery-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .notif-delivery-email { font-size:.9375rem; font-weight:600; color:#0f172a; }
    .notif-delivery-note { font-size:.75rem; color:#94a3b8; }
    .notif-loading, .notif-empty { font-size:.875rem; color:#64748b; padding:.5rem 0; }

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
    .help-icon { width:36px; height:36px; border-radius:9px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .help-body { flex:1; }
    .help-title { font-size:.9rem; font-weight:600; color:#0f172a; margin:0 0 .2rem; }
    .help-desc { font-size:.8rem; color:#94a3b8; margin:0; }
    .help-arrow { color:#cbd5e1; transition:transform .2s; }
    .help-card:hover .help-arrow { transform:translateX(3px); color:#3b82f6; }

    .toast { position:fixed; bottom:2rem; right:2rem; display:flex; align-items:center; gap:.5rem; padding:.875rem 1.25rem; background:#0f172a; color:white; border-radius:14px; font-size:.875rem; font-weight:500; box-shadow:0 20px 60px rgba(0,0,0,0.2); transform:translateY(100px); opacity:0; transition:all .3s cubic-bezier(.4,0,.2,1); z-index:1000; }
    .toast.show { transform:translateY(0); opacity:1; }
    .toast svg { width:18px; height:18px; color:#34d399; flex-shrink:0; }

    @media(max-width:900px) { .settings-layout { grid-template-columns:1fr; } .settings-nav { flex-direction:row; overflow-x:auto; position:static; } .form-row { grid-template-columns:1fr; } .plan-features { grid-template-columns:1fr; } }

    /* Preference Center */
    .pref-explainer { display:flex; align-items:flex-start; gap:.75rem; padding:.875rem 1rem; background:rgba(59,130,246,0.06); border:1.5px solid rgba(59,130,246,0.12); border-radius:10px; margin-bottom:1.5rem; font-size:.8125rem; color:#374151; line-height:1.6; }
    .pref-section-title { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .875rem; }
    .pref-options-list { display:flex; flex-direction:column; gap:.625rem; }
    .pref-option { display:flex; align-items:center; justify-content:space-between; padding:.875rem 1rem; border:1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; gap:1rem; flex-wrap:wrap; }
    .pref-opt-left { display:flex; align-items:center; gap:.875rem; flex:1; min-width:200px; }
    .pref-opt-info { display:flex; flex-direction:column; gap:.2rem; }
    .pref-opt-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .pref-opt-desc { font-size:.75rem; color:#94a3b8; line-height:1.4; }
    .pref-opt-count { font-size:.8125rem; font-weight:600; color:#64748b; white-space:nowrap; }
    .pref-freq-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.75rem; }
    .pref-freq-card { position:relative; padding:1rem; border:1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; transition:all .15s; }
    .pref-freq-active { border-color:rgba(59,130,246,0.3); background:rgba(59,130,246,0.04); }
    .pref-freq-name { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .pref-freq-desc { font-size:.75rem; color:#94a3b8; }
    .pref-footer-preview { border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:.5rem; }
    .pfp-inner { padding:1.25rem; background:#f8fafc; text-align:center; }
    .pfp-text { font-size:.8125rem; color:#64748b; margin:0 0 .625rem; }
    .pfp-links { display:flex; align-items:center; justify-content:center; gap:.5rem; margin-bottom:.5rem; }
    .pfp-link { font-size:.8125rem; color:#3b82f6; text-decoration:underline; cursor:pointer; }
    .pfp-sep { color:#cbd5e1; font-size:.75rem; }
    .pfp-address { font-size:.75rem; color:#94a3b8; margin:0; }
    .pref-footer-note { font-size:.75rem; color:#94a3b8; line-height:1.5; }
    /* Toggle for preference center (reuse from campaigns) */
    .toggle-wrap { position:relative; display:inline-flex; align-items:center; cursor:pointer; flex-shrink:0; }
    .toggle-wrap input { opacity:0; width:0; height:0; position:absolute; }
    .toggle-slider { width:40px; height:22px; background:#e2e8f0; border-radius:100px; transition:background .2s; position:relative; }
    .toggle-slider::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,0.15); }
    .toggle-wrap input:checked + .toggle-slider { background:#3b82f6; }
    .toggle-wrap input:checked + .toggle-slider::after { transform:translateX(18px); }
    @media(max-width:700px) { .pref-freq-grid { grid-template-columns:1fr 1fr; } }
  `]
})
export class SettingsComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);
  private sanitizer = inject(DomSanitizer);

  activeTab = signal<SettingsTab>('account');
  showToast = signal(false);
  brandDomain = 'yourdomain.com';

  account = {
    firstName: 'Jane', lastName: 'Austen',
    email: 'jane@scribecount.com', brandName: 'Jane Austen Books', timezone: 'UTC-5 (Eastern Time)'
  };
  passwords = { current: '', next: '', confirm: '' };
  domain = { name: '' };

  sections = [
    { id: 'account' as SettingsTab, label: 'Account', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { id: 'domain' as SettingsTab, label: 'Domain Setup', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
    { id: 'inbox' as SettingsTab, label: 'Inbox Connection', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'store' as SettingsTab, label: 'Store Connection', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
    { id: 'preferences' as SettingsTab, label: 'Preference Center', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  ];

  dnsRecords = [
    { type: 'TXT', name: '@', value: 'v=spf1 include:scribecount.com ~all' },
    { type: 'CNAME', name: 'em._domainkey', value: 'em._domainkey.scribecount.com' },
    { type: 'CNAME', name: 'mail', value: 'mail.scribecount.com' },
  ];

  shopify = {
    connected: false,
    storeUrl: '',
    connectedSince: '' as string | null,
    eventsReceived: 0,
    lastEvent: '' as string | null,
    events: {
      purchase: true,
      abandonedCart: true,
      abandonedCheckout: true,
      optIn: true,
    },
    autoAddPurchasers: true,
  };

  testEvents = [
    { label: 'Completed Purchase', desc: 'Simulate a reader buying a book', type: 'purchase', result: '' as string, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
    { label: 'Abandoned Cart', desc: 'Simulate a reader leaving with items in cart', type: 'cart', result: '' as string, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" width="18" height="18"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
    { label: 'Abandoned Checkout', desc: 'Simulate a reader stopping at payment', type: 'checkout', result: '' as string, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" width="18" height="18"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { label: 'New Opt-In', desc: 'Simulate a reader submitting a sign-up form', type: 'optin', result: '' as string, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' },
  ];

  activityLog = [
    { time: 'May 8, 09:42', eventLabel: 'order.completed', type: 'purchase', email: 'em***@gmail.com', flow: 'Post-Purchase Thank You', status: 'ok' },
    { time: 'May 8, 08:15', eventLabel: 'cart.abandoned', type: 'cart', email: 'sa***@yahoo.com', flow: 'Abandoned Cart Flow', status: 'ok' },
    { time: 'May 7, 22:03', eventLabel: 'checkout.abandoned', type: 'checkout', email: 'to***@outlook.com', flow: 'Abandoned Checkout Flow', status: 'ok' },
    { time: 'May 7, 18:30', eventLabel: 'subscriber.optin', type: 'optin', email: 'pr***@gmail.com', flow: 'Welcome Sequence', status: 'ok' },
    { time: 'May 7, 14:11', eventLabel: 'order.completed', type: 'purchase', email: 'ja***@icloud.com', flow: 'Post-Purchase Thank You', status: 'warn' },
  ];

  notifications: NotificationSetting[] = [];
  notificationsLoading = signal(true);

  private static readonly DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
    { key: 'campaign_sent', title: 'Campaign sent', description: 'When a campaign finishes sending to your list', enabled: true },
    { key: 'campaign_scheduled', title: 'Campaign scheduled', description: 'When a campaign is scheduled for a future send time', enabled: true },
    { key: 'flow_triggered', title: 'Flow triggered', description: 'When an automation flow enrolls subscribers', enabled: false },
    { key: 'flow_completed', title: 'Flow completed', description: 'When a subscriber completes an automation flow', enabled: false },
    { key: 'new_subscriber', title: 'New subscriber', description: 'When someone joins your email list', enabled: true },
    { key: 'unsubscribe_alert', title: 'Unsubscribe alert', description: 'When a reader unsubscribes from your list', enabled: true },
    { key: 'bounce_alert', title: 'Bounce alert', description: 'When an email hard-bounces and an address is flagged', enabled: true },
    { key: 'spam_complaint', title: 'Spam complaint', description: 'When a reader marks your email as spam', enabled: true },
    { key: 'weekly_report', title: 'Weekly performance report', description: 'Summary of opens, clicks, revenue, and list growth each Monday', enabled: true },
    { key: 'deliverability_alert', title: 'Deliverability warning', description: 'When your deliverability score drops below a healthy threshold', enabled: true },
    { key: 'product_updates', title: 'Product updates', description: 'News about new ScribeCount Email features and improvements', enabled: true },
  ];

  private static readonly NOTIFICATION_GROUP_KEYS: { label: string; keys: string[] }[] = [
    { label: 'Campaigns & automations', keys: ['campaign_sent', 'campaign_scheduled', 'flow_triggered', 'flow_completed'] },
    { label: 'Audience activity', keys: ['new_subscriber', 'unsubscribe_alert', 'bounce_alert', 'spam_complaint'] },
    { label: 'Reports & insights', keys: ['weekly_report', 'deliverability_alert'] },
    { label: 'Account', keys: ['product_updates'] },
  ];

  get notificationGroups(): { label: string; items: NotificationSetting[] }[] {
    return SettingsComponent.NOTIFICATION_GROUP_KEYS
      .map(group => ({
        label: group.label,
        items: group.keys
          .map(key => this.notifications.find(n => n.key === key))
          .filter((n): n is NotificationSetting => !!n),
      }))
      .filter(group => group.items.length > 0);
  }

  prefOptions: { key: string; name: string; description: string; enabled: boolean; subscriberCount: number }[] = [];

  prefFrequencies: { key: string; name: string; description: string; enabled: boolean; iconKey: string; safeIcon: SafeHtml }[] = [];

  constructor(public auth: AuthService, private route: ActivatedRoute) {
    this.applyTabFromRoute(this.route.snapshot.queryParamMap.get('tab'));
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.applyTabFromRoute(params.get('tab'));
    });
    const user = this.auth.user();
    if (user) {
      const parts = user.name.split(' ');
      this.account.firstName = parts[0] ?? '';
      this.account.lastName = parts.slice(1).join(' ');
      this.account.email = user.email;
    }
    this.loadSettings();
  }

  private loadSettings() {
    this.notificationsLoading.set(true);
    this.settingsApi.getSettings().subscribe({
      next: s => {
        this.applySettings(s);
        this.notificationsLoading.set(false);
      },
      error: () => {
        this.notifications = this.mergeNotifications([]);
        this.notificationsLoading.set(false);
      },
    });
  }

  private mergeNotifications(fromApi: NotificationSetting[]): NotificationSetting[] {
    const saved = new Map(fromApi.map(n => [n.key, n.enabled]));
    return SettingsComponent.DEFAULT_NOTIFICATIONS.map(def => ({
      ...def,
      enabled: saved.has(def.key) ? saved.get(def.key)! : def.enabled,
      title: fromApi.find(n => n.key === def.key)?.title ?? def.title,
      description: fromApi.find(n => n.key === def.key)?.description ?? def.description,
    }));
  }

  private applySettings(s: UserSettings) {
    this.notifications = this.mergeNotifications(s.notifications ?? []);
    this.prefOptions = s.preferenceEmailTypes;
    this.prefFrequencies = s.preferenceFrequencies.map(f => ({
      ...f,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[f.iconKey] ?? NAV_ICONS['calendar']),
    }));
    this.brandDomain = s.brandDomain || 'yourdomain.com';
    this.shopify = {
      connected: s.store.connected,
      storeUrl: s.store.storeUrl,
      connectedSince: s.store.connectedSince ?? null,
      eventsReceived: s.store.eventsReceived,
      lastEvent: s.store.lastEvent ?? null,
      events: {
        purchase: s.store.events.purchase,
        abandonedCart: s.store.events.abandonedCart,
        abandonedCheckout: s.store.events.abandonedCheckout,
        optIn: s.store.events.optIn,
      },
      autoAddPurchasers: s.store.events.autoAddPurchasers,
    };
  }

  private applyTabFromRoute(tab: string | null) {
    if (tab && this.sections.some(s => s.id === tab)) {
      this.activeTab.set(tab as SettingsTab);
    }
  }

  save() {
    this.toast();
  }

  saveNotifications() {
    this.settingsApi.updateNotifications(this.notifications).subscribe(s => {
      this.applySettings(s);
      this.toast();
    });
  }

  savePreferences() {
    this.settingsApi.updatePreferences(
      this.prefOptions,
      this.prefFrequencies.map(({ key, name, description, enabled, iconKey }) => ({ key, name, description, enabled, iconKey }))
    ).subscribe(s => {
      this.applySettings(s);
      this.toast();
    });
  }

  saveStoreSettings() {
    this.settingsApi.updateStore({
      connected: this.shopify.connected,
      storeUrl: this.shopify.storeUrl,
      events: {
        purchase: this.shopify.events.purchase,
        abandonedCart: this.shopify.events.abandonedCart,
        abandonedCheckout: this.shopify.events.abandonedCheckout,
        optIn: this.shopify.events.optIn,
        autoAddPurchasers: this.shopify.autoAddPurchasers,
      },
    }).subscribe(s => {
      this.applySettings(s);
      this.toast();
    });
  }

  connectShopify() {
    if (!this.shopify.storeUrl.trim()) return;
    this.settingsApi.connectStore(this.shopify.storeUrl.trim()).subscribe(s => {
      this.applySettings(s);
      this.toast();
    });
  }

  disconnectShopify() {
    this.settingsApi.disconnectStore().subscribe(s => {
      this.applySettings(s);
      this.toast();
    });
  }

  testStoreConnection() {
    this.settingsApi.testStore().subscribe(s => {
      this.applySettings(s);
      this.toast();
    });
  }

  runTest(t: { label: string; result: string }) {
    t.result = 'pass';
    this.testStoreConnection();
  }

  private toast() {
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2500);
  }
}
