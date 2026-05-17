import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreConnectionGuideComponent } from './store-connection/store-connection-guide.component';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule, StoreConnectionGuideComponent],
  template: `
    <div class="page-wrapper">

      <!-- ── WOOCOMMERCE DETAIL VIEW ── -->
      <div *ngIf="wooView()">
        <div class="page-header">
          <div class="back-header">
            <button class="back-btn" (click)="wooView.set(false)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Integrations
            </button>
            <div class="shopify-page-title">
              <div class="shopify-logo-icon" style="background:rgba(99,102,241,0.08)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.75" width="26" height="26"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <div>
                <h1 class="page-title">WooCommerce Integration</h1>
                <p class="page-subtitle">Connect your WordPress/WooCommerce store via the ScribeCount plugin</p>
              </div>
            </div>
          </div>
          <div class="conn-status-badge" [class.connected]="woo.connected" [class.disconnected]="!woo.connected">
            <span class="conn-dot"></span>
            {{ woo.connected ? 'Connected' : 'Not Connected' }}
          </div>
        </div>

        <!-- Toast -->
        <div class="shop-toast" *ngIf="toastMsg()" [class.toast-ok]="toastType() === 'ok'">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          {{ toastMsg() }}
        </div>

        <!-- NOT CONNECTED -->
        <div *ngIf="!woo.connected">

          <!-- Technical Requirements -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Technical Requirements</h2>
            <p class="shop-section-sub">Verify your WordPress installation meets these requirements before installing the plugin</p>
            <div class="req-grid">
              <div class="req-item" *ngFor="let r of wooRequirements">
                <div class="req-icon" [class.req-ok]="r.met" [class.req-warn]="!r.met">
                  <svg *ngIf="r.met" viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  <svg *ngIf="!r.met" viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                </div>
                <div class="req-body">
                  <div class="req-label">{{ r.label }}</div>
                  <div class="req-desc">{{ r.desc }}</div>
                </div>
              </div>
            </div>
            <div class="warn-note">
              <svg viewBox="0 0 20 20" fill="#d97706" width="16" height="16"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
              If your WordPress site is on a restrictive shared host that blocks outbound API connections, the webhook-based event communication may not function. Contact your hosting provider to confirm outbound HTTPS requests to external APIs are permitted.
            </div>
          </div>

          <!-- Plugin Download + API Credentials -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Step 1 — Download the Plugin & Copy Your Credentials</h2>
            <p class="shop-section-sub">Download the plugin zip file and copy your API credentials — you'll need them during plugin configuration in WordPress</p>

            <div class="cred-grid">
              <div class="cred-item">
                <label class="shop-label">ScribeCount API Key</label>
                <div class="cred-row">
                  <input type="text" class="shop-input cred-input" [value]="woo.apiKey" readonly />
                  <button class="cred-copy-btn" (click)="showToast('API Key copied!', 'ok')" data-tooltip="Copy API Key">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </button>
                </div>
              </div>
              <div class="cred-item">
                <label class="shop-label">Webhook Endpoint URL</label>
                <div class="cred-row">
                  <input type="text" class="shop-input cred-input" [value]="woo.webhookUrl" readonly />
                  <button class="cred-copy-btn" (click)="showToast('Webhook URL copied!', 'ok')" data-tooltip="Copy Webhook URL">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <button class="btn-primary download-btn" (click)="showToast('Plugin download started!', 'ok')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download ScribeCount WooCommerce Plugin (.zip)
            </button>
            <p class="download-note">Do not unzip the file — WordPress handles zip file installation directly via Plugins → Add New → Upload Plugin</p>
          </div>

          <!-- Installation Steps -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Step 2 — Install & Activate in WordPress</h2>
            <div class="setup-steps">
              <div class="setup-step">
                <div class="ss-num">1</div>
                <div class="ss-body">
                  <div class="ss-title">Upload the plugin in WordPress admin</div>
                  <div class="ss-desc">Go to Plugins → Add New → Upload Plugin → Choose File → select the zip → Install Now → Activate Plugin</div>
                </div>
              </div>
              <div class="setup-step">
                <div class="ss-num">2</div>
                <div class="ss-body">
                  <div class="ss-title">Enter your API credentials in WooCommerce settings</div>
                  <div class="ss-desc">Navigate to WooCommerce → Settings → ScribeCount Email → paste your API Key and Webhook Endpoint URL → Save Settings</div>
                </div>
              </div>
              <div class="setup-step">
                <div class="ss-num">3</div>
                <div class="ss-body">
                  <div class="ss-title">Click Test Connection in the plugin settings</div>
                  <div class="ss-desc">The plugin sends a handshake to ScribeCount. A green "Connected" status confirms the integration is working.</div>
                </div>
              </div>
              <div class="setup-step">
                <div class="ss-num">4</div>
                <div class="ss-body">
                  <div class="ss-title">Click Authorize Connection below to complete setup</div>
                  <div class="ss-desc">Once the plugin is installed and the connection test passes, click below to activate the integration in ScribeCount</div>
                </div>
              </div>
            </div>
            <button class="btn-primary" (click)="connectWoo()" style="margin-top:1rem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Authorize Connection
            </button>
          </div>

        </div>

        <!-- CONNECTED -->
        <div *ngIf="woo.connected">

          <!-- Connection Details -->
          <div class="glass-card shop-card">
            <div class="conn-info-header">
              <h2 class="shop-section-title">Connection Details</h2>
              <div class="conn-header-actions">
                <button class="btn-secondary btn-sm" (click)="showToast('Connection test passed!', 'ok')">Test Connection</button>
                <button class="disconnect-btn" (click)="disconnectWoo()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  Disconnect
                </button>
              </div>
            </div>
            <div class="conn-details">
              <div class="cd-row"><span class="cd-key">WordPress Site</span><span class="cd-val">{{ woo.siteUrl || 'yourdomain.com' }}</span></div>
              <div class="cd-row"><span class="cd-key">Plugin version</span><span class="cd-val">ScribeCount Email v2.1.4</span></div>
              <div class="cd-row"><span class="cd-key">Connected since</span><span class="cd-val">Apr 15, 2026</span></div>
              <div class="cd-row"><span class="cd-key">Webhooks received</span><span class="cd-val">847 events</span></div>
              <div class="cd-row">
                <span class="cd-key">WP-Cron health</span>
                <span class="cd-val cron-ok">
                  <svg viewBox="0 0 20 20" fill="#059669" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  Running — last fired 3 min ago
                </span>
              </div>
            </div>
          </div>

          <!-- Order Status Triggers -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Order Status Triggers</h2>
            <p class="shop-section-sub">Choose which WooCommerce order statuses trigger a purchase event to ScribeCount</p>
            <div class="order-status-grid">
              <label class="os-item" *ngFor="let s of orderStatuses">
                <input type="checkbox" [(ngModel)]="s.enabled" class="os-check" />
                <div class="os-body">
                  <div class="os-name">{{ s.label }}</div>
                  <div class="os-desc">{{ s.desc }}</div>
                </div>
                <span class="os-badge" [class]="'os-' + s.type">{{ s.type }}</span>
              </label>
            </div>
            <div class="info-note">
              <svg viewBox="0 0 20 20" fill="#3b82f6" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
              For digital products (ebooks, audiobooks): use <strong>Processing</strong>. For physical products: use <strong>Completed</strong>. For mixed orders: use <strong>Processing</strong>.
            </div>
            <button class="btn-primary btn-sm" style="margin-top:1rem" (click)="showToast('Order trigger settings saved!', 'ok')">Save Trigger Settings</button>
          </div>

          <!-- Product Mapping -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Product Mapping</h2>
            <p class="shop-section-sub">Map your WooCommerce products to AuthorVault titles so post-purchase emails reference the correct book</p>
            <div class="product-map-table">
              <div class="pm-row pm-header">
                <span>WooCommerce Product</span><span>Product ID</span><span>AuthorVault Title</span><span>Format</span>
              </div>
              <div class="pm-row" *ngFor="let p of productMappings">
                <span class="pm-product">{{ p.product }}</span>
                <span class="pm-id">#{{ p.id }}</span>
                <span>
                  <select class="shop-input shop-select pm-select">
                    <option *ngFor="let t of authorVaultTitles" [selected]="t === p.title">{{ t }}</option>
                  </select>
                </span>
                <span class="pm-format">{{ p.format }}</span>
              </div>
            </div>
            <div class="pm-actions">
              <button class="btn-primary btn-sm" (click)="showToast('Product mappings saved!', 'ok')">Save Mappings</button>
              <button class="btn-secondary btn-sm" (click)="showToast('CSV import coming soon', 'ok')" data-tooltip="Import multiple product mappings at once via CSV">Bulk Import CSV</button>
            </div>
          </div>

          <!-- Event Configuration -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Store Event Configuration</h2>
            <p class="shop-section-sub">Configure how each WooCommerce event triggers your email flows</p>
            <div class="event-sections">
              <div class="event-section" *ngFor="let ev of wooEventConfig">
                <div class="event-section-header">
                  <div class="ev-icon" [style.background]="ev.iconBg" [innerHTML]="ev.icon"></div>
                  <div class="ev-info">
                    <div class="ev-title">{{ ev.title }}</div>
                    <div class="ev-sub">{{ ev.sub }}</div>
                  </div>
                  <input type="checkbox" class="toggle" [(ngModel)]="ev.enabled" />
                </div>
                <div class="event-config-body" *ngIf="ev.enabled">
                  <div class="ec-row" *ngFor="let field of ev.fields">
                    <label class="shop-label">{{ field.label }}</label>
                    <select class="shop-input shop-select">
                      <option *ngFor="let opt of field.options">{{ opt }}</option>
                    </select>
                  </div>
                  <div class="ev-toggle-row" *ngFor="let tog of ev.toggles">
                    <span class="etl">{{ tog.label }}</span>
                    <input type="checkbox" class="toggle" [ngModel]="tog.value" />
                  </div>
                </div>
              </div>
            </div>
            <button class="btn-primary" style="margin-top:1.25rem" (click)="showToast('Event settings saved!', 'ok')">Save Event Settings</button>
          </div>

          <!-- WordPress Opt-In Methods -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">WordPress Opt-In Form Placements</h2>
            <p class="shop-section-sub">Embed ScribeCount forms anywhere on your WordPress site using these methods</p>
            <div class="optin-methods">
              <div class="optin-method" *ngFor="let m of optinMethods">
                <div class="om-icon" [innerHTML]="m.icon"></div>
                <div class="om-body">
                  <div class="om-title">{{ m.title }}</div>
                  <div class="om-desc">{{ m.desc }}</div>
                  <div class="om-code" *ngIf="m.code">
                    <code>{{ m.code }}</code>
                    <button class="cred-copy-btn" (click)="showToast('Copied!', 'ok')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Testing Console -->
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Event Testing Console</h2>
            <p class="shop-section-sub">Simulate WooCommerce events to verify your flows — no real orders needed</p>
            <div class="test-grid">
              <div class="test-card" *ngFor="let t of testEvents" (click)="runTest(t)">
                <div class="tc-icon" [style.background]="t.iconBg" [innerHTML]="t.icon"></div>
                <div class="tc-body">
                  <div class="tc-title">{{ t.label }}</div>
                  <div class="tc-desc">{{ t.desc }}</div>
                </div>
                <div class="tc-result" *ngIf="t.result === 'pass'">
                  <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  Passed
                </div>
                <button class="tc-btn" *ngIf="t.result !== 'pass'">Run Test</button>
              </div>
            </div>
            <div class="info-note" style="margin-top:1rem">
              <svg viewBox="0 0 20 20" fill="#3b82f6" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
              Use "Force Abandonment Event" to test cart abandonment without waiting for the 60-minute inactivity window.
            </div>
          </div>

        </div>
      </div>

      <!-- ── SHOPIFY DETAIL VIEW ── -->
      <div *ngIf="shopifyView()">
        <div class="page-header">
          <div class="back-header">
            <button class="back-btn" (click)="shopifyView.set(false)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Integrations
            </button>
            <div class="shopify-page-title">
              <div class="shopify-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.75" width="26" height="26"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <div>
                <h1 class="page-title">Shopify Integration</h1>
                <p class="page-subtitle">Connect your store to trigger email flows from purchase and cart events</p>
              </div>
            </div>
          </div>
          <div class="conn-status-badge" [class.connected]="shopify.connected" [class.disconnected]="!shopify.connected">
            <span class="conn-dot"></span>
            {{ shopify.connected ? 'Connected' : 'Not Connected' }}
          </div>
        </div>

        <!-- Toast -->
        <div class="shop-toast" *ngIf="toastMsg()" [class.toast-ok]="toastType() === 'ok'">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          {{ toastMsg() }}
        </div>

        <!-- NOT CONNECTED -->
        <div *ngIf="!shopify.connected">
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Connect Your Shopify Store</h2>
            <p class="shop-section-sub">Follow these steps to link your store and start triggering email flows automatically</p>
            <div class="setup-steps">
              <div class="setup-step">
                <div class="ss-num">1</div>
                <div class="ss-body">
                  <div class="ss-title">Install the ScribeCount app in Shopify</div>
                  <div class="ss-desc">Go to your Shopify admin → Apps → search for "ScribeCount Email" → click Add App and grant the requested permissions</div>
                </div>
              </div>
              <div class="setup-step">
                <div class="ss-num">2</div>
                <div class="ss-body">
                  <div class="ss-title">Enter your Shopify store URL below</div>
                  <div class="ss-desc">Your store's myshopify.com address — e.g. yourstore.myshopify.com</div>
                </div>
              </div>
              <div class="setup-step">
                <div class="ss-num">3</div>
                <div class="ss-body">
                  <div class="ss-title">Click Authorize Connection</div>
                  <div class="ss-desc">ScribeCount will verify the connection and show a green status indicator when confirmed</div>
                </div>
              </div>
            </div>
            <div class="store-url-group">
              <label class="shop-label">Your Shopify Store URL</label>
              <div class="store-url-row">
                <input type="text" class="shop-input" [(ngModel)]="shopify.storeUrl" placeholder="yourstore.myshopify.com" />
                <button class="btn-primary" (click)="connectShopify()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Authorize Connection
                </button>
              </div>
            </div>
            <div class="permissions-note">
              <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              ScribeCount only requests read access to orders, customers, and products. It never modifies orders, changes prices, or accesses payment information.
            </div>
          </div>
          <div class="glass-card shop-card">
            <h2 class="shop-section-title">What the Shopify Integration Does</h2>
            <div class="event-overview-grid">
              <div class="eo-item" *ngFor="let e of eventOverview">
                <div class="eo-icon" [style.background]="e.bg"><span [innerHTML]="e.icon"></span></div>
                <div class="eo-body">
                  <div class="eo-title">{{ e.title }}</div>
                  <div class="eo-desc">{{ e.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONNECTED -->
        <div *ngIf="shopify.connected">
          <div class="glass-card shop-card">
            <div class="conn-info-header">
              <h2 class="shop-section-title">Connection Details</h2>
              <div class="conn-header-actions">
                <button class="btn-secondary btn-sm" (click)="showToast('Connection test passed!', 'ok')">Test Connection</button>
                <button class="disconnect-btn" (click)="disconnectShopify()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  Disconnect
                </button>
              </div>
            </div>
            <div class="conn-details">
              <div class="cd-row"><span class="cd-key">Store URL</span><span class="cd-val">{{ shopify.storeUrl || 'yourstore.myshopify.com' }}</span></div>
              <div class="cd-row"><span class="cd-key">Connected since</span><span class="cd-val">Mar 1, 2026</span></div>
              <div class="cd-row"><span class="cd-key">Webhooks received</span><span class="cd-val">1,284 events</span></div>
              <div class="cd-row"><span class="cd-key">Last event</span><span class="cd-val">May 8, 2026 at 9:42 AM — order.completed</span></div>
            </div>
          </div>

          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Store Event Configuration</h2>
            <p class="shop-section-sub">Configure how each store event triggers your email flows</p>
            <div class="event-sections">
              <div class="event-section" *ngFor="let ev of eventConfig">
                <div class="event-section-header">
                  <div class="ev-icon" [style.background]="ev.iconBg" [innerHTML]="ev.icon"></div>
                  <div class="ev-info">
                    <div class="ev-title">{{ ev.title }}</div>
                    <div class="ev-sub">{{ ev.sub }}</div>
                  </div>
                  <input type="checkbox" class="toggle" [(ngModel)]="ev.enabled" />
                </div>
                <div class="event-config-body" *ngIf="ev.enabled">
                  <div class="ec-row" *ngFor="let field of ev.fields">
                    <label class="shop-label">{{ field.label }}</label>
                    <select class="shop-input shop-select">
                      <option *ngFor="let opt of field.options">{{ opt }}</option>
                    </select>
                  </div>
                  <div class="ev-toggle-row" *ngFor="let tog of ev.toggles">
                    <span class="etl">{{ tog.label }}</span>
                    <input type="checkbox" class="toggle" [ngModel]="tog.value" />
                  </div>
                </div>
              </div>
            </div>
            <button class="btn-primary" style="margin-top:1.25rem" (click)="showToast('Event settings saved!', 'ok')">Save Event Settings</button>
          </div>

          <div class="glass-card shop-card">
            <h2 class="shop-section-title">Event Testing Console</h2>
            <p class="shop-section-sub">Simulate store events to verify your flows — no real orders needed</p>
            <div class="test-grid">
              <div class="test-card" *ngFor="let t of testEvents" (click)="runTest(t)">
                <div class="tc-icon" [style.background]="t.iconBg" [innerHTML]="t.icon"></div>
                <div class="tc-body">
                  <div class="tc-title">{{ t.label }}</div>
                  <div class="tc-desc">{{ t.desc }}</div>
                </div>
                <div class="tc-result" *ngIf="t.result === 'pass'">
                  <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  Passed
                </div>
                <button class="tc-btn" *ngIf="t.result !== 'pass'">Run Test</button>
              </div>
            </div>
          </div>

          <div class="glass-card shop-card">
            <div class="log-header-row">
              <div>
                <h2 class="shop-section-title">Activity Log</h2>
                <p class="shop-section-sub">Recent webhook events received from your Shopify store</p>
              </div>
              <button class="btn-secondary btn-sm" (click)="showToast('Log refreshed', 'ok')">Refresh</button>
            </div>
            <div class="activity-log-table">
              <div class="al-row al-header">
                <span>Timestamp</span><span>Event</span><span>Subscriber</span><span>Flow Triggered</span><span>Status</span>
              </div>
              <div class="al-row" *ngFor="let entry of activityLog">
                <span class="al-time">{{ entry.time }}</span>
                <span><span class="al-event-badge" [class]="'ev-' + entry.type">{{ entry.eventLabel }}</span></span>
                <span class="al-email">{{ entry.email }}</span>
                <span class="al-flow">{{ entry.flow }}</span>
                <span class="al-status" [class.al-ok]="entry.status === 'ok'" [class.al-warn]="entry.status === 'warn'">
                  <svg *ngIf="entry.status === 'ok'" viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  <svg *ngIf="entry.status === 'warn'" viewBox="0 0 20 20" fill="#f59e0b" width="13" height="13"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ entry.status === 'ok' ? 'Success' : 'Warning' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INTEGRATIONS LIST -->
      <div *ngIf="!shopifyView() && !wooView()">
        <div class="page-header">
          <div>
            <h1 class="page-title">Integrations</h1>
            <p class="page-subtitle">Connect ScribeCount Email with your tools and platforms</p>
          </div>
        </div>

        <app-store-connection-guide></app-store-connection-guide>

        <div class="int-sections" *ngFor="let section of sections">
          <h2 class="section-heading">{{ section.title }}</h2>
          <div class="int-grid">
            <div class="glass-card int-card" *ngFor="let int of section.items">
              <div class="int-icon-wrap" [style.background]="int.iconBg" [innerHTML]="int.icon"></div>
              <div class="int-body">
                <div class="int-name-row">
                  <h3 class="int-name">{{ int.name }}</h3>
                  <span class="int-connected-badge" *ngIf="int.connected">
                    <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    Connected
                  </span>
                </div>
                <p class="int-desc">{{ int.description }}</p>
              </div>
              <button class="int-action-btn"
                [class.connected]="int.connected"
                [class.disconnected]="!int.connected"
                (click)="int.name === 'Shopify' ? shopifyView.set(true) : int.name === 'WooCommerce' ? wooView.set(true) : null">
                {{ int.connected ? 'Manage' : 'Connect' }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* Integrations list */
    .int-sections { margin-bottom:2rem; }
    .section-heading { font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; margin:0 0 .875rem; }
    .int-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
    .int-card { padding:1.25rem; display:flex; align-items:center; gap:1rem; }
    .int-icon-wrap { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .int-body { flex:1; }
    .int-name-row { display:flex; align-items:center; gap:.5rem; margin-bottom:.25rem; }
    .int-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .int-connected-badge { display:inline-flex; align-items:center; gap:.25rem; font-size:.7rem; font-weight:600; color:#059669; background:rgba(5,150,105,0.08); padding:.15rem .5rem; border-radius:100px; }
    .int-desc { font-size:.8rem; color:#94a3b8; margin:0; line-height:1.4; }
    .int-action-btn { padding:.45rem 1rem; border-radius:9px; font-size:.8125rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all .15s; white-space:nowrap; border:1.5px solid; }
    .int-action-btn.disconnected { background:#f8fafc; color:#374151; border-color:#e2e8f0; }
    .int-action-btn.disconnected:hover { background:#eff6ff; color:#3b82f6; border-color:#bfdbfe; }
    .int-action-btn.connected { background:rgba(5,150,105,0.06); color:#059669; border-color:rgba(5,150,105,0.2); }
    .int-action-btn.connected:hover { background:rgba(5,150,105,0.12); }

    /* Shopify detail */
    .back-header { display:flex; flex-direction:column; gap:.875rem; }
    .back-btn { display:inline-flex; align-items:center; gap:.375rem; background:none; border:none; cursor:pointer; font-size:.8125rem; font-weight:500; color:#64748b; font-family:inherit; padding:0; transition:color .15s; }
    .back-btn:hover { color:#0f172a; }
    .shopify-page-title { display:flex; align-items:center; gap:.875rem; }
    .shopify-logo-icon { width:46px; height:46px; border-radius:12px; background:rgba(5,150,105,0.08); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .conn-status-badge { display:inline-flex; align-items:center; gap:.5rem; padding:.45rem 1rem; border-radius:100px; font-size:.8125rem; font-weight:600; }
    .conn-status-badge.connected { background:rgba(5,150,105,0.1); color:#059669; border:1px solid rgba(5,150,105,0.2); }
    .conn-status-badge.disconnected { background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }
    .conn-dot { width:8px; height:8px; border-radius:50%; background:currentColor; }

    .shop-toast { position:fixed; top:1.5rem; right:1.5rem; z-index:9999; display:flex; align-items:center; gap:.625rem; padding:.875rem 1.25rem; border-radius:12px; font-size:.875rem; font-weight:500; box-shadow:0 8px 24px rgba(0,0,0,0.12); animation:toastIn .25s ease; }
    .toast-ok { background:#059669; color:#fff; }
    @keyframes toastIn { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }

    .shop-card { padding:1.75rem; margin-bottom:1.25rem; }
    .shop-section-title { font-size:1.0625rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .shop-section-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.5rem; }

    .setup-steps { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
    .setup-step { display:flex; align-items:flex-start; gap:.875rem; }
    .ss-num { width:28px; height:28px; border-radius:50%; background:#3b82f6; color:#fff; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; flex-shrink:0; }
    .ss-body { flex:1; }
    .ss-title { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ss-desc { font-size:.8rem; color:#64748b; }
    .store-url-group { margin-bottom:1rem; }
    .shop-label { display:block; font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .store-url-row { display:flex; gap:.75rem; }
    .shop-input { flex:1; padding:.65rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.875rem; font-family:inherit; color:#0f172a; outline:none; transition:border-color .15s; }
    .shop-input:focus { border-color:#3b82f6; background:#fff; }
    .shop-select { flex:none; width:100%; }
    .permissions-note { display:flex; align-items:flex-start; gap:.625rem; padding:.875rem 1rem; background:rgba(5,150,105,0.06); border:1px solid rgba(5,150,105,0.15); border-radius:10px; font-size:.8125rem; color:#374151; line-height:1.5; }

    .event-overview-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
    .eo-item { display:flex; align-items:flex-start; gap:.875rem; padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .eo-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .eo-title { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .eo-desc { font-size:.78rem; color:#64748b; line-height:1.4; }

    .conn-info-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
    .conn-header-actions { display:flex; gap:.625rem; }
    .disconnect-btn { display:inline-flex; align-items:center; gap:.375rem; padding:.45rem .875rem; border:1.5px solid rgba(239,68,68,0.25); border-radius:9px; background:rgba(239,68,68,0.04); color:#dc2626; font-size:.8125rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all .15s; }
    .disconnect-btn:hover { background:rgba(239,68,68,0.1); border-color:#dc2626; }
    .conn-details { display:flex; flex-direction:column; }
    .cd-row { display:flex; gap:1rem; padding:.625rem 0; border-bottom:1px solid #f1f5f9; }
    .cd-row:last-child { border-bottom:none; }
    .cd-key { font-size:.8125rem; font-weight:600; color:#94a3b8; min-width:140px; }
    .cd-val { font-size:.8125rem; color:#0f172a; }

    .event-sections { display:flex; flex-direction:column; gap:.75rem; }
    .event-section { border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; }
    .event-section-header { display:flex; align-items:center; gap:.875rem; padding:1rem 1.125rem; background:#f8fafc; }
    .ev-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ev-info { flex:1; }
    .ev-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .ev-sub { font-size:.75rem; color:#94a3b8; margin-top:.1rem; }
    .event-config-body { padding:1rem 1.125rem; border-top:1px solid #f1f5f9; background:#fff; display:flex; flex-direction:column; gap:.75rem; }
    .ec-row { display:flex; flex-direction:column; gap:.35rem; }
    .ev-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:.625rem .875rem; background:#f8fafc; border-radius:8px; }
    .etl { font-size:.8125rem; color:#374151; font-weight:500; }

    .test-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
    .test-card { display:flex; align-items:center; gap:.875rem; padding:1rem; border:1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; cursor:pointer; transition:all .15s; }
    .test-card:hover { border-color:#bfdbfe; background:#f0f7ff; }
    .tc-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tc-body { flex:1; }
    .tc-title { font-size:.8125rem; font-weight:600; color:#0f172a; }
    .tc-desc { font-size:.75rem; color:#94a3b8; margin-top:.1rem; }
    .tc-result { display:flex; align-items:center; gap:.25rem; font-size:.75rem; font-weight:600; color:#059669; }
    .tc-btn { padding:.35rem .75rem; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-size:.75rem; font-weight:600; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; }
    .tc-btn:hover { border-color:#3b82f6; color:#3b82f6; }

    .log-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem; }
    .activity-log-table { display:flex; flex-direction:column; overflow-x:auto; }
    .al-row { display:grid; grid-template-columns:130px 160px 1fr 1fr 90px; gap:.75rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:center; font-size:.8125rem; }
    .al-row:last-child { border-bottom:none; }
    .al-header { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .al-time { color:#64748b; font-size:.75rem; }
    .al-event-badge { padding:.2rem .55rem; border-radius:6px; font-size:.7rem; font-weight:700; font-family:monospace; }
    .ev-purchase { background:rgba(5,150,105,0.1); color:#059669; }
    .ev-cart { background:rgba(245,158,11,0.1); color:#d97706; }
    .ev-checkout { background:rgba(99,102,241,0.1); color:#6366f1; }
    .ev-optin { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .al-email { color:#64748b; font-family:monospace; font-size:.75rem; }
    .al-flow { color:#334155; font-size:.8rem; }
    .al-status { display:flex; align-items:center; gap:.3rem; font-size:.75rem; font-weight:600; }
    .al-ok { color:#059669; }
    .al-warn { color:#d97706; }

    @media(max-width:900px) { .int-grid { grid-template-columns:1fr; } .event-overview-grid { grid-template-columns:1fr; } .test-grid { grid-template-columns:1fr; } .al-row { grid-template-columns:1fr 1fr; } }

    /* WooCommerce-specific */
    .req-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; margin-bottom:1.25rem; }
    .req-item { display:flex; align-items:flex-start; gap:.75rem; padding:.875rem; background:#f8fafc; border-radius:10px; border:1px solid #f1f5f9; }
    .req-icon { width:22px; height:22px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .req-ok { color:#059669; }
    .req-warn { color:#d97706; }
    .req-label { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .req-desc { font-size:.75rem; color:#64748b; }
    .warn-note { display:flex; align-items:flex-start; gap:.625rem; padding:.875rem 1rem; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.2); border-radius:10px; font-size:.8125rem; color:#374151; line-height:1.5; }
    .info-note { display:flex; align-items:flex-start; gap:.625rem; padding:.875rem 1rem; background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.15); border-radius:10px; font-size:.8125rem; color:#374151; line-height:1.5; }
    .info-note strong { color:#0f172a; }

    .cred-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
    .cred-item { display:flex; flex-direction:column; gap:.4rem; }
    .cred-row { display:flex; gap:.5rem; }
    .cred-input { flex:1; font-family:monospace; font-size:.8rem; color:#64748b; }
    .cred-copy-btn { display:inline-flex; align-items:center; gap:.3rem; padding:.45rem .75rem; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-size:.75rem; font-weight:600; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; white-space:nowrap; }
    .cred-copy-btn:hover { border-color:#3b82f6; color:#3b82f6; }
    .download-btn { display:inline-flex; align-items:center; gap:.5rem; margin-bottom:.625rem; }
    .download-note { font-size:.78rem; color:#94a3b8; margin:0; }

    .order-status-grid { display:flex; flex-direction:column; gap:.5rem; margin-bottom:1rem; }
    .os-item { display:flex; align-items:center; gap:.875rem; padding:.875rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:all .15s; }
    .os-item:hover { border-color:#bfdbfe; background:#f8fafc; }
    .os-check { width:16px; height:16px; flex-shrink:0; cursor:pointer; accent-color:#3b82f6; }
    .os-body { flex:1; }
    .os-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .os-desc { font-size:.75rem; color:#64748b; margin-top:.1rem; }
    .os-badge { font-size:.7rem; font-weight:700; padding:.2rem .55rem; border-radius:6px; text-transform:uppercase; letter-spacing:.04em; }
    .os-digital { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .os-physical { background:rgba(139,92,246,0.1); color:#8b5cf6; }
    .os-mixed { background:rgba(245,158,11,0.1); color:#d97706; }

    .product-map-table { display:flex; flex-direction:column; margin-bottom:1rem; overflow-x:auto; }
    .pm-row { display:grid; grid-template-columns:2fr 80px 2fr 100px; gap:.75rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:center; font-size:.8125rem; }
    .pm-row:last-child { border-bottom:none; }
    .pm-header { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .pm-product { font-weight:600; color:#0f172a; }
    .pm-id { font-family:monospace; color:#64748b; font-size:.75rem; }
    .pm-format { font-size:.75rem; color:#94a3b8; }
    .pm-select { padding:.45rem .625rem; font-size:.8rem; }
    .pm-actions { display:flex; gap:.75rem; }

    .cron-ok { display:inline-flex; align-items:center; gap:.375rem; color:#059669; font-weight:500; }

    .optin-methods { display:flex; flex-direction:column; gap:.75rem; }
    .optin-method { display:flex; align-items:flex-start; gap:.875rem; padding:1rem; background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; }
    .om-icon { width:36px; height:36px; border-radius:9px; background:#fff; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .om-body { flex:1; }
    .om-title { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .om-desc { font-size:.8rem; color:#64748b; line-height:1.4; margin-bottom:.5rem; }
    .om-code { display:flex; align-items:center; gap:.5rem; padding:.4rem .75rem; background:#f1f5f9; border-radius:7px; font-size:.78rem; }
    .om-code code { font-family:monospace; color:#6366f1; flex:1; }

    @media(max-width:700px) { .req-grid { grid-template-columns:1fr; } .cred-grid { grid-template-columns:1fr; } .pm-row { grid-template-columns:1fr 1fr; } }
  `]
})
export class IntegrationsComponent {
  shopifyView = signal(false);
  wooView = signal(false);
  toastMsg = signal('');
  toastType = signal('ok');
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  shopify = { connected: false, storeUrl: '' };

  woo = {
    connected: false,
    siteUrl: '',
    apiKey: 'sc_live_k9x2mP4nQr7vL8wZ3jY6tF1hA5bN0cE',
    webhookUrl: 'https://api.scribecount.com/webhooks/woocommerce/v2/inbound',
  };

  connectShopify() {
    if (!this.shopify.storeUrl.trim()) return;
    this.shopify.connected = true;
    const item = this.sections.flatMap(s => s.items).find(i => i.name === 'Shopify');
    if (item) item.connected = true;
    this.showToast('Shopify store connected successfully!', 'ok');
  }

  disconnectShopify() {
    this.shopify.connected = false;
    this.shopify.storeUrl = '';
    const item = this.sections.flatMap(s => s.items).find(i => i.name === 'Shopify');
    if (item) item.connected = false;
    this.shopifyView.set(false);
  }

  connectWoo() {
    this.woo.connected = true;
    const item = this.sections.flatMap(s => s.items).find(i => i.name === 'WooCommerce');
    if (item) item.connected = true;
    this.showToast('WooCommerce store connected successfully!', 'ok');
  }

  disconnectWoo() {
    this.woo.connected = false;
    const item = this.sections.flatMap(s => s.items).find(i => i.name === 'WooCommerce');
    if (item) item.connected = false;
    this.wooView.set(false);
  }

  runTest(t: { result: string }) {
    t.result = 'pass';
    this.showToast('Test event sent and received successfully!', 'ok');
  }

  showToast(msg: string, type: string) {
    this.toastMsg.set(msg);
    this.toastType.set(type);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMsg.set(''), 3000);
  }

  wooRequirements = [
    { label: 'WordPress 6.0+', desc: 'Recommended: always update to the latest stable release', met: true },
    { label: 'WooCommerce 7.0+', desc: 'Required for the plugin\'s order hook integration', met: true },
    { label: 'PHP 8.0+', desc: 'Required for the plugin\'s API communication layer', met: true },
    { label: 'SSL Certificate (HTTPS)', desc: 'Webhooks cannot be sent or received over HTTP', met: true },
    { label: 'Outbound HTTPS Access', desc: 'Server must allow outbound API calls to ScribeCount endpoints', met: true },
    { label: 'WordPress Cron Running', desc: 'Required for cart abandonment detection — configure a real server cron job', met: false },
  ];

  orderStatuses = [
    { label: 'Processing', desc: 'Payment confirmed — use for digital products (ebooks, audiobooks)', enabled: true, type: 'digital' },
    { label: 'Completed', desc: 'Order fulfilled and dispatched — use for physical products (paperbacks)', enabled: true, type: 'physical' },
    { label: 'On Hold', desc: 'Awaiting payment confirmation — typically not recommended', enabled: false, type: 'mixed' },
  ];

  productMappings = [
    { product: 'The Ashford Inheritance — Ebook', id: '101', title: 'The Ashford Inheritance', format: 'Ebook' },
    { product: 'The Ashford Inheritance — Paperback', id: '102', title: 'The Ashford Inheritance', format: 'Paperback' },
    { product: 'The Ember Crown — Ebook', id: '103', title: 'The Ember Crown', format: 'Ebook' },
    { product: 'Complete Series Bundle', id: '104', title: 'Series Bundle', format: 'Bundle' },
  ];

  authorVaultTitles = ['The Ashford Inheritance', 'The Ember Crown', 'Series Bundle', 'Reader Magnet — Prequel'];

  optinMethods = [
    {
      title: 'Gutenberg Block',
      desc: 'Add a ScribeCount Form block to any page or post using the WordPress block editor. Select your form from the block settings panel.',
      code: '',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.75" width="18" height="18"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>'
    },
    {
      title: 'Shortcode',
      desc: 'Add to any page, post, or widget area that supports shortcodes. The form renders at that location and submits directly to ScribeCount.',
      code: '[scribecount_form id="your-form-id"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.75" width="18" height="18"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    },
    {
      title: 'Widget',
      desc: 'Add the ScribeCount Email widget to any widgetized area — sidebar, footer, header zone — from WordPress Widgets settings.',
      code: '',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.75" width="18" height="18"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="14" x2="16" y2="14"/></svg>'
    },
    {
      title: 'Exit-Intent Pop-up',
      desc: 'Triggers when a visitor\'s cursor moves toward the browser close button. Configure display frequency (once per session or once per 30 days).',
      code: '',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="18" height="18"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
    },
  ];

  wooEventConfig = [
    {
      title: 'Completed Order', sub: 'Fires on Processing or Completed status (configurable above)', enabled: true,
      iconBg: 'rgba(5,150,105,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" width="16" height="16"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      fields: [
        { label: 'First-time buyer flow', options: ['Post-Purchase Thank You', 'Order Confirmation'] },
        { label: 'Repeat buyer flow', options: ['Repeat Purchase Thank You', 'Post-Purchase Thank You'] },
        { label: 'Follow-up delay', options: ['3 days', '5 days', '7 days'] },
      ],
      toggles: [{ label: 'Auto-add purchasers to list (with consent checkbox)', value: true }]
    },
    {
      title: 'Abandoned Cart', sub: 'Fires after 60 min inactivity for identified customers (requires WP-Cron)', enabled: true,
      iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
      fields: [
        { label: 'Detection window', options: ['60 minutes (recommended)', '30 minutes', '90 minutes'] },
        { label: 'Minimum cart value', options: ['No minimum', '$5.00', '$10.00'] },
        { label: 'Flow to trigger', options: ['Abandoned Cart Flow'] },
      ],
      toggles: [
        { label: 'Capture email at checkout field entry (before form submission)', value: true },
        { label: 'Suppress existing buyers of the abandoned title', value: true },
      ]
    },
    {
      title: 'Abandoned Checkout', sub: 'Fires when a shopper enters billing info but doesn\'t complete the order', enabled: true,
      iconBg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      fields: [
        { label: 'Detection window', options: ['30 minutes (recommended)', '15 minutes', '45 minutes'] },
        { label: 'Flow to trigger', options: ['Abandoned Checkout Flow'] },
      ],
      toggles: [{ label: 'Capture email at first billing field entry', value: true }]
    },
    {
      title: 'New Subscriber Opt-In', sub: 'Fires when a reader submits a ScribeCount form on your WordPress site', enabled: true,
      iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
      fields: [
        { label: 'Welcome flow', options: ['Welcome Sequence', 'Reader Magnet Delivery'] },
        { label: 'Checkout opt-in source tag', options: ['wordpress-checkout', 'wordpress-footer', 'wordpress-popup', 'wordpress-product-page'] },
      ],
      toggles: [{ label: 'Add checkout opt-in checkbox (unchecked by default — GDPR compliant)', value: true }]
    },
  ];

  eventOverview = [
    { title: 'Completed Purchase', desc: 'Triggers post-purchase flows instantly when a reader buys', bg: 'rgba(5,150,105,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
    { title: 'Abandoned Cart', desc: 'Sends recovery emails when a reader leaves with items in cart', bg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" width="18" height="18"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
    { title: 'Abandoned Checkout', desc: 'Higher-intent recovery for readers who stopped at payment', bg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" width="18" height="18"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { title: 'New Subscriber Opt-In', desc: 'Adds readers to your list and starts welcome sequences', bg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' },
  ];

  eventConfig = [
    {
      title: 'Completed Purchase', sub: 'Fires when a reader completes a transaction', enabled: true,
      iconBg: 'rgba(5,150,105,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" width="16" height="16"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      fields: [
        { label: 'First-time buyer flow', options: ['Post-Purchase Thank You', 'Order Confirmation'] },
        { label: 'Repeat buyer flow', options: ['Repeat Purchase Thank You', 'Post-Purchase Thank You'] },
        { label: 'Follow-up delay', options: ['3 days', '5 days', '7 days'] },
      ],
      toggles: [{ label: 'Auto-add purchasers to list (with consent)', value: true }]
    },
    {
      title: 'Abandoned Cart', sub: 'Fires when a reader leaves without checking out (60 min window)', enabled: true,
      iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
      fields: [
        { label: 'Detection window', options: ['60 minutes (recommended)', '30 minutes', '90 minutes'] },
        { label: 'Flow to trigger', options: ['Abandoned Cart Flow'] },
        { label: 'First email delay', options: ['60 minutes', '30 minutes', '2 hours'] },
      ],
      toggles: [{ label: 'Suppress existing buyers of the abandoned title', value: true }]
    },
    {
      title: 'Abandoned Checkout', sub: 'Fires when a reader stops at payment (higher intent)', enabled: true,
      iconBg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      fields: [
        { label: 'Flow to trigger', options: ['Abandoned Checkout Flow'] },
        { label: 'First email delay', options: ['30 minutes (recommended)', '15 minutes', '60 minutes'] },
      ],
      toggles: []
    },
    {
      title: 'New Subscriber Opt-In', sub: 'Fires when a reader submits an opt-in form in your store', enabled: true,
      iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
      fields: [
        { label: 'Welcome flow', options: ['Welcome Sequence', 'Reader Magnet Delivery'] },
        { label: 'Source tag', options: ['shopify-checkout-optin', 'shopify-footer', 'shopify-product-page'] },
      ],
      toggles: []
    },
  ];

  testEvents = [
    { label: 'Completed Purchase', desc: 'Simulate a reader buying a book', result: '', iconBg: 'rgba(5,150,105,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
    { label: 'Abandoned Cart', desc: 'Simulate a reader leaving with items in cart', result: '', iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" width="18" height="18"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
    { label: 'Abandoned Checkout', desc: 'Simulate a reader stopping at payment', result: '', iconBg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" width="18" height="18"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { label: 'New Opt-In', desc: 'Simulate a reader submitting a sign-up form', result: '', iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' },
  ];

  activityLog = [
    { time: 'May 8, 09:42', eventLabel: 'order.completed', type: 'purchase', email: 'em***@gmail.com', flow: 'Post-Purchase Thank You', status: 'ok' },
    { time: 'May 8, 08:15', eventLabel: 'cart.abandoned', type: 'cart', email: 'sa***@yahoo.com', flow: 'Abandoned Cart Flow', status: 'ok' },
    { time: 'May 7, 22:03', eventLabel: 'checkout.abandoned', type: 'checkout', email: 'to***@outlook.com', flow: 'Abandoned Checkout Flow', status: 'ok' },
    { time: 'May 7, 18:30', eventLabel: 'subscriber.optin', type: 'optin', email: 'pr***@gmail.com', flow: 'Welcome Sequence', status: 'ok' },
    { time: 'May 7, 14:11', eventLabel: 'order.completed', type: 'purchase', email: 'ja***@icloud.com', flow: 'Post-Purchase Thank You', status: 'warn' },
  ];

  sections = [
    {
      title: 'Store Platforms',
      items: [
        { name: 'Shopify', description: 'Connect your store for purchase flows, abandoned cart recovery, and subscriber capture', connected: false, iconBg: 'rgba(5,150,105,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.75" width="24" height="24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
        { name: 'WooCommerce', description: 'Connect your WooCommerce store for the same automation flows as Shopify', connected: false, iconBg: 'rgba(99,102,241,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.75" width="24" height="24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
      ]
    },
    {
      title: 'Reader Delivery',
      items: [
        { name: 'BookFunnel', description: 'Sync reader magnet downloads and trigger welcome sequences automatically', connected: true, iconBg: 'rgba(59,130,246,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.75" width="24" height="24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
        { name: 'StoryOrigin', description: 'Import subscribers from newsletter swaps and group promotions', connected: true, iconBg: 'rgba(139,92,246,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.75" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>' },
      ]
    },
    {
      title: 'Analytics & Advertising',
      items: [
        { name: 'Google Analytics', description: 'Track email campaign traffic and conversions in GA4', connected: false, iconBg: 'rgba(245,158,11,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="24" height="24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
        { name: 'Facebook Pixel', description: 'Retarget email subscribers with Facebook and Instagram ads', connected: false, iconBg: 'rgba(59,130,246,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.75" width="24" height="24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
      ]
    },
    {
      title: 'Automation',
      items: [
        { name: 'Zapier', description: 'Connect ScribeCount Email with 5,000+ apps via Zapier', connected: false, iconBg: 'rgba(239,68,68,0.08)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="24" height="24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
      ]
    },
  ];
}