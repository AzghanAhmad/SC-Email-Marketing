import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-growth-tools',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">List Growth Tools</h1>
          <p class="page-subtitle">Tools to grow your subscriber base and engage your audience</p>
        </div>
      </div>

      <!-- Collect Subscribers -->
      <section class="tools-section">
        <h2 class="section-heading">Collect subscribers with web experiences</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of collectToolsSanitized">
            <div class="tool-icon" [style.background]="tool.iconBg">
              <span [innerHTML]="tool.safeIcon"></span>
            </div>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip" (click)="onToolAction(tool)">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <!-- Build Experiences -->
      <section class="tools-section">
        <h2 class="section-heading">Build experiences for your audience</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of buildToolsSanitized">
            <div class="tool-icon" [style.background]="tool.iconBg">
              <span [innerHTML]="tool.safeIcon"></span>
            </div>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip" (click)="onToolAction(tool)">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <!-- Integrate -->
      <section class="tools-section">
        <h2 class="section-heading">Integrate with third-party tools</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of integrateToolsSanitized">
            <div class="tool-icon" [style.background]="tool.iconBg">
              <span [innerHTML]="tool.safeIcon"></span>
            </div>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip" (click)="onToolAction(tool)">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <!-- Modal dialog for guidance & setup -->
      <div class="modal-backdrop" *ngIf="activeModalTool" (click)="closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-icon-container" [style.background]="activeModalTool.iconBg">
              <span [innerHTML]="activeModalTool.safeIcon"></span>
            </div>
            <div>
              <h3 class="modal-title">{{ activeModalTool.name }}</h3>
              <p class="modal-subtitle">Setup & Guidance</p>
            </div>
            <button class="close-btn" (click)="closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <!-- Dynamic content based on tool name -->
            <ng-container [ngSwitch]="activeModalTool.name">
              
              <!-- Customize subscribe and preference pages -->
              <div *ngSwitchCase="'Customize subscribe and preference pages'">
                <div class="setup-field">
                  <label>Primary Brand Color</label>
                  <input type="color" value="#3b82f6" class="color-picker">
                </div>
                <div class="setup-field">
                  <label>Custom Domain</label>
                  <input type="text" placeholder="subscribers.myauthorbrand.com" class="text-input">
                </div>
                <div class="info-alert">
                  <strong>Tip:</strong> You can embed these pages as an iframe directly in your website or redirect readers here when they click "Unsubscribe" or "Manage Preferences" at the bottom of emails.
                </div>
              </div>

              <!-- Reader magnet delivery -->
              <div *ngSwitchCase="'Reader magnet delivery'">
                <div class="setup-field">
                  <label>Select Magnet PDF / EPUB</label>
                  <div class="file-upload-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Click to upload file (Max 25MB)</span>
                  </div>
                </div>
                <div class="setup-field">
                  <label>Associated Email List</label>
                  <select class="select-input">
                    <option>Main VIP List</option>
                    <option>New Releases Alerts</option>
                  </select>
                </div>
              </div>

              <!-- Add subscribers at checkout -->
              <div *ngSwitchCase="'Add subscribers at checkout'">
                <div class="integration-grid">
                  <div class="integration-item active">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" height="18">
                    <span>Stripe Checkout</span>
                    <span class="status-connected">Connected</span>
                  </div>
                  <div class="integration-item" style="justify-content: space-between; display: flex; width: 100%; box-sizing: border-box; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="18">
                      <span>PayPal Checkout</span>
                    </div>
                    <button class="btn-primary btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Connect</button>
                  </div>
                </div>
                <p class="info-text">When customers purchase your books, we will automatically check if they opted in to receive marketing newsletter emails at checkout.</p>
              </div>

              <!-- Integrate with BookFunnel -->
              <div *ngSwitchCase="'Integrate with BookFunnel'">
                <div class="setup-field">
                  <label>BookFunnel API Key</label>
                  <input type="password" placeholder="bf_live_..." class="text-input">
                </div>
                <div class="setup-field">
                  <label>Webhook URL (Copy to BookFunnel)</label>
                  <div class="copy-box">
                    <code>https://api.scribecount.com/v1/webhooks/bookfunnel/abc123xyz</code>
                    <button class="btn-sm btn-secondary" style="padding: 2px 6px; font-size: 0.7rem;">Copy</button>
                  </div>
                </div>
              </div>

              <!-- Import from other providers -->
              <div *ngSwitchCase="'Import from other providers'">
                <div class="setup-field">
                  <label>Source Email Provider</label>
                  <select class="select-input">
                    <option>Mailchimp</option>
                    <option>ConvertKit</option>
                    <option>MailerLite</option>
                    <option>CSV / Excel File Upload</option>
                  </select>
                </div>
                <div class="setup-field">
                  <label>API Key / Import File</label>
                  <input type="text" placeholder="Enter API Key from source provider" class="text-input">
                </div>
                <div class="info-alert info-warn">
                  <strong>Important:</strong> You must have permission from all subscribers before migrating them. Sending spam will result in account suspension.
                </div>
              </div>

            </ng-container>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn-primary" (click)="saveModalChanges()">Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tools-section { margin-bottom:2rem; }
    .section-heading { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .tools-list { display:flex; flex-direction:column; gap:.75rem; }
    .tool-item { display:flex; align-items:center; gap:1.25rem; padding:1.25rem 1.5rem; }
    .tool-item:hover { border-color:#bfdbfe; }
    .tool-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tool-icon svg { width:20px; height:20px; display: block; }
    .tool-body { flex:1; }
    .tool-name { font-size:.9375rem; font-weight:600; color:#0f172a; margin:0 0 .25rem; }
    .tool-desc { font-size:.8125rem; color:#94a3b8; margin:0; line-height:1.4; }

    /* Modal styles */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.25s ease-out;
    }
    .modal-card {
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 20px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 100%; max-width: 520px;
      display: flex; flex-direction: column;
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex; align-items: center; gap: 1rem;
      position: relative;
    }
    .modal-icon-container {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .modal-icon-container svg {
      width: 18px; height: 18px;
    }
    .modal-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
    .modal-subtitle { font-size: 0.75rem; color: #64748b; margin: 2px 0 0; font-weight: 500; }
    .close-btn {
      position: absolute; right: 1.25rem; top: 1.25rem;
      background: transparent; border: none; color: #94a3b8; cursor: pointer;
      padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .close-btn:hover { background: #f1f5f9; color: #475569; }
    
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .modal-footer {
      padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9;
      display: flex; justify-content: flex-end; gap: 0.75rem; background: #f8fafc;
    }
    
    /* Input styles */
    .setup-field { display: flex; flex-direction: column; gap: 6px; }
    .setup-field label { font-size: 0.8125rem; font-weight: 600; color: #334155; }
    .text-input, .select-input {
      padding: 0.625rem 0.875rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 0.875rem; font-family: inherit; color: #0f172a; outline: none;
      transition: all 0.15s; width: 100%; box-sizing: border-box;
    }
    .text-input:focus, .select-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .color-picker {
      border: 1.5px solid #e2e8f0; border-radius: 8px; width: 60px; height: 36px; padding: 2px; cursor: pointer;
    }
    
    .file-upload-box {
      border: 2px dashed #cbd5e1; border-radius: 10px; padding: 1.5rem;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      color: #64748b; font-size: 0.8125rem; cursor: pointer; transition: all 0.15s;
    }
    .file-upload-box:hover { border-color: #3b82f6; color: #3b82f6; background: #f0f7ff; }
    .copy-box {
      display: flex; gap: 0.5rem; align-items: center;
      background: #f1f5f9; border-radius: 8px; padding: 6px 10px; border: 1.5px solid #e2e8f0;
    }
    .copy-box code { font-family: monospace; font-size: 0.8rem; color: #334155; flex: 1; overflow-x: auto; }
    
    .info-alert {
      background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;
      padding: 0.75rem 1rem; font-size: 0.8125rem; color: #1e3a8a; line-height: 1.45;
    }
    .info-warn { background: #fff7ed; border-color: #ffedd5; color: #7c2d12; }
    .info-text { font-size: 0.8125rem; color: #64748b; margin: 0; line-height: 1.45; }
    
    .integration-grid { display: flex; flex-direction: column; gap: 0.75rem; }
    .integration-item {
      display: flex; align-items: center; justify-content: space-between;
      border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0.75rem 1rem;
      font-size: 0.875rem; font-weight: 500; color: #334155;
    }
    .integration-item.active { border-color: #3b82f6; background: #f0f7ff; }
    .status-connected { font-size: 0.75rem; font-weight: 600; color: #059669; background: #dcfce7; padding: 2px 8px; border-radius: 12px; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class GrowthToolsComponent {
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  activeModalTool: any = null;

  collectTools = [
    {
      name: 'Manage sign-up forms', description: 'Gather information about your readers, serve them offers, and show personalized content.',
      action: 'Manage', tooltip: 'Create and manage your sign-up forms',
      iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'
    },
    {
      name: 'Customize subscribe and preference pages', description: 'Collect new subscribers for specific lists and manage global subscribe and preference pages.',
      action: 'Customize', tooltip: 'Configure subscription preferences',
      iconBg: 'rgba(139,92,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-.9-1.51"/></svg>'
    },
  ];

  buildTools = [
    {
      name: 'Reader magnet delivery', description: 'Automate delivery of reader magnets to new subscribers via email or download link.',
      action: 'Setup', tooltip: 'Configure reader magnet delivery automation',
      iconBg: 'rgba(16,185,129,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
      name: 'Landing page builder', description: 'Create beautiful, mobile-responsive landing pages for your book launches and giveaways.',
      action: 'Build', tooltip: 'Create a new landing page',
      iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    },
  ];

  integrateTools = [
    {
      name: 'Add subscribers at checkout', description: 'Set up your integration to enable customers to sign up for email marketing at checkout.',
      action: 'Connect', tooltip: 'Connect your checkout to capture subscribers',
      iconBg: 'rgba(99,102,241,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
    },
    {
      name: 'Integrate with BookFunnel', description: 'Seamlessly connect subscribers and add them to ScribeCount through BookFunnel delivery.',
      action: 'Integrate', tooltip: 'Connect your BookFunnel account',
      iconBg: 'rgba(16,185,129,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    },
    {
      name: 'Import from other providers', description: 'Migrate your subscriber list from Mailchimp, ConvertKit, or other email providers.',
      action: 'Import', tooltip: 'Start the migration wizard',
      iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
    },
  ];

  collectToolsSanitized: any[] = [];
  buildToolsSanitized: any[] = [];
  integrateToolsSanitized: any[] = [];

  constructor() {
    const s = (svg: string) => this.sanitizer.bypassSecurityTrustHtml(svg);
    this.collectToolsSanitized = this.collectTools.map(t => ({ ...t, safeIcon: s(t.icon) }));
    this.buildToolsSanitized = this.buildTools.map(t => ({ ...t, safeIcon: s(t.icon) }));
    this.integrateToolsSanitized = this.integrateTools.map(t => ({ ...t, safeIcon: s(t.icon) }));
  }

  onToolAction(tool: any) {
    if (tool.name === 'Manage sign-up forms') {
      this.router.navigate(['/website/sign-up-forms']);
    } else if (tool.name === 'Landing page builder') {
      this.router.navigate(['/website/landing-pages']);
    } else {
      this.activeModalTool = tool;
    }
  }

  closeModal() {
    this.activeModalTool = null;
  }

  saveModalChanges() {
    this.activeModalTool = null;
  }
}
