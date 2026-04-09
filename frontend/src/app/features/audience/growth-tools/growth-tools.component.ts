import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
          <div class="glass-card tool-item" *ngFor="let tool of collectTools">
            <div class="tool-icon" [style.background]="tool.iconBg">
              <span [innerHTML]="tool.icon"></span>
            </div>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <!-- Build Experiences -->
      <section class="tools-section">
        <h2 class="section-heading">Build experiences for your audience</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of buildTools">
            <div class="tool-icon" [style.background]="tool.iconBg">
              <span [innerHTML]="tool.icon"></span>
            </div>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip">{{ tool.action }}</button>
          </div>
        </div>
      </section>

      <!-- Integrate -->
      <section class="tools-section">
        <h2 class="section-heading">Integrate with third-party tools</h2>
        <div class="tools-list">
          <div class="glass-card tool-item" *ngFor="let tool of integrateTools">
            <div class="tool-icon" [style.background]="tool.iconBg">
              <span [innerHTML]="tool.icon"></span>
            </div>
            <div class="tool-body">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
            </div>
            <button class="btn-secondary btn-sm" [attr.data-tooltip]="tool.tooltip">{{ tool.action }}</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .tools-section { margin-bottom:2rem; }
    .section-heading { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .tools-list { display:flex; flex-direction:column; gap:.75rem; }
    .tool-item { display:flex; align-items:center; gap:1.25rem; padding:1.25rem 1.5rem; }
    .tool-item:hover { border-color:#bfdbfe; }
    .tool-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tool-icon :global(svg) { width:20px; height:20px; }
    .tool-body { flex:1; }
    .tool-name { font-size:.9375rem; font-weight:600; color:#0f172a; margin:0 0 .25rem; }
    .tool-desc { font-size:.8125rem; color:#94a3b8; margin:0; line-height:1.4; }
  `]
})
export class GrowthToolsComponent {
  collectTools = [
    {
      name: 'Manage sign-up forms', description: 'Gather information about your readers, serve them offers, and show personalized content.',
      action: 'Manage', tooltip: 'Create and manage your sign-up forms',
      iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'
    },
    {
      name: 'Customize subscribe and preference pages', description: 'Collect new subscribers for specific lists and manage global subscribe and preference pages.',
      action: 'Customize', tooltip: 'Configure subscription preferences',
      iconBg: 'rgba(139,92,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg>'
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
}
