import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AudienceApiService, GrowthTool } from '../../../core/services/audience-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';

interface ToolView extends GrowthTool {
  safeIcon: SafeHtml;
}

interface ModalConfig {
  brandColor?: string;
  customDomain?: string;
  magnetTitle?: string;
  targetList?: string;
  apiKey?: string;
  provider?: string;
}

@Component({
  selector: 'app-growth-tools',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">List Growth Tools</h1>
          <p class="page-subtitle">Tools to grow your subscriber base and engage your audience</p>
        </div>
      </div>

      <section class="tools-section">
        <h2 class="section-heading">Collect subscribers with web experiences</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of collectTools()">
            <span class="nav-icon" [innerHTML]="tool.safeIcon"></span>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip" (click)="onToolAction(tool)">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <section class="tools-section">
        <h2 class="section-heading">Build experiences for your audience</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of buildTools()">
            <span class="nav-icon" [innerHTML]="tool.safeIcon"></span>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip" (click)="onToolAction(tool)">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <section class="tools-section">
        <h2 class="section-heading">Integrate with third-party tools</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of integrateTools()">
            <span class="nav-icon" [innerHTML]="tool.safeIcon"></span>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip" (click)="onToolAction(tool)">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <div class="modal-backdrop" *ngIf="activeModalTool()" (click)="closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <span class="nav-icon modal-icon" [innerHTML]="activeModalTool()!.safeIcon"></span>
            <div>
              <h3 class="modal-title">{{ activeModalTool()!.name }}</h3>
              <p class="modal-subtitle">Setup & Guidance</p>
            </div>
            <button class="close-btn" (click)="closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <ng-container [ngSwitch]="activeModalTool()!.key">
              <div *ngSwitchCase="'customize-pages'">
                <div class="setup-field">
                  <label>Primary Brand Color</label>
                  <input type="color" [(ngModel)]="modalConfig.brandColor" class="color-picker">
                </div>
                <div class="setup-field">
                  <label>Custom Domain</label>
                  <input type="text" [(ngModel)]="modalConfig.customDomain" placeholder="subscribers.myauthorbrand.com" class="text-input">
                </div>
              </div>
              <div *ngSwitchCase="'reader-magnet'">
                <div class="setup-field">
                  <label>Magnet title</label>
                  <input type="text" [(ngModel)]="modalConfig.magnetTitle" class="text-input" placeholder="Free prequel novella">
                </div>
                <div class="setup-field">
                  <label>Delivery list</label>
                  <input type="text" [(ngModel)]="modalConfig.targetList" class="text-input" placeholder="Newsletter list">
                </div>
              </div>
              <div *ngSwitchCase="'bookfunnel'">
                <div class="setup-field">
                  <label>BookFunnel API Key</label>
                  <input type="password" [(ngModel)]="modalConfig.apiKey" placeholder="bf_live_..." class="text-input">
                </div>
              </div>
              <div *ngSwitchCase="'import'">
                <div class="setup-field">
                  <label>Source Email Provider</label>
                  <select [(ngModel)]="modalConfig.provider" class="select-input">
                    <option>Mailchimp</option>
                    <option>ConvertKit</option>
                    <option>MailerLite</option>
                    <option>CSV / Excel File Upload</option>
                  </select>
                </div>
              </div>
              <div *ngSwitchDefault>
                <p class="info-text">Configure this integration and save your settings.</p>
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
    .nav-icon { display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#64748b; }
    .nav-icon svg { width:20px; height:20px; display:block; }
    .modal-icon { margin-right:.25rem; }
    .tool-body { flex:1; }
    .tool-name { font-size:.9375rem; font-weight:600; color:#0f172a; margin:0 0 .25rem; }
    .tool-desc { font-size:.8125rem; color:#94a3b8; margin:0; line-height:1.4; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { background:#fff; border:1px solid rgba(226,232,240,0.8); border-radius:20px; width:100%; max-width:520px; display:flex; flex-direction:column; overflow:hidden; }
    .modal-header { padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; gap:1rem; position:relative; }
    .modal-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .modal-subtitle { font-size:.75rem; color:#64748b; margin:2px 0 0; }
    .close-btn { position:absolute; right:1.25rem; top:1.25rem; background:transparent; border:none; color:#94a3b8; cursor:pointer; padding:4px; border-radius:6px; }
    .modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem; }
    .modal-footer { padding:1rem 1.5rem; border-top:1px solid #f1f5f9; display:flex; justify-content:flex-end; gap:.75rem; background:#f8fafc; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .text-input, .select-input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.875rem; font-family:inherit; width:100%; box-sizing:border-box; }
    .color-picker { border:1.5px solid #e2e8f0; border-radius:8px; width:60px; height:36px; padding:2px; }
    .info-text { font-size:.8125rem; color:#64748b; margin:0; }
  `]
})
export class GrowthToolsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private audienceApi = inject(AudienceApiService);

  collectTools = signal<ToolView[]>([]);
  buildTools = signal<ToolView[]>([]);
  integrateTools = signal<ToolView[]>([]);
  activeModalTool = signal<ToolView | null>(null);
  modalConfig: ModalConfig = {};

  ngOnInit() {
    this.audienceApi.getGrowthTools().subscribe({
      next: res => {
        const tools = (res?.tools ?? []).map(t => ({
          ...t,
          safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[t.iconKey] ?? NAV_ICONS['chart']),
        }));
        this.collectTools.set(tools.filter(t => t.category === 'collect'));
        this.buildTools.set(tools.filter(t => t.category === 'build'));
        this.integrateTools.set(tools.filter(t => t.category === 'integrate'));
      },
    });
  }

  onToolAction(tool: ToolView) {
    if (tool.key === 'manage-forms') {
      this.router.navigate(['/website/sign-up-forms']);
    } else if (tool.key === 'landing-builder') {
      this.router.navigate(['/website/landing-pages']);
    } else if (tool.key === 'import') {
      this.router.navigate(['/audience/import']);
    } else {
      this.activeModalTool.set(tool);
      try {
        this.modalConfig = tool.configJson ? JSON.parse(tool.configJson) as ModalConfig : {};
      } catch {
        this.modalConfig = {};
      }
    }
  }

  closeModal() {
    this.activeModalTool.set(null);
    this.modalConfig = {};
  }

  saveModalChanges() {
    const tool = this.activeModalTool();
    if (!tool) return;
    this.audienceApi.saveGrowthToolConfig(tool.key, JSON.stringify(this.modalConfig)).subscribe(() => {
      this.closeModal();
    });
  }
}
