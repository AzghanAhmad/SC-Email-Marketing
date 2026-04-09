import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Integrations</h1>
          <p class="page-subtitle">Connect ScribeCount Email with your tools and platforms</p>
        </div>
      </div>

      <div class="int-sections" *ngFor="let section of sections">
        <h2 class="section-heading">{{ section.title }}</h2>
        <div class="int-grid">
          <div class="glass-card int-card" *ngFor="let int of section.items">
            <div class="int-icon" [style.background]="int.iconBg">
              <span class="int-emoji">{{ int.emoji }}</span>
            </div>
            <div class="int-body">
              <h3 class="int-name">{{ int.name }}</h3>
              <p class="int-desc">{{ int.description }}</p>
            </div>
            <button class="int-action-btn" [class.connected]="int.connected" [attr.data-tooltip]="int.connected ? 'Manage this integration' : 'Set up this integration'">
              {{ int.connected ? 'Connected' : 'Connect' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .int-sections { margin-bottom:2rem; }
    .section-heading { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }

    .int-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
    .int-card { display:flex; align-items:center; gap:1.25rem; padding:1.375rem 1.5rem; }
    .int-card:hover { border-color:#bfdbfe; }
    .int-icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .int-emoji { font-size:1.5rem; }
    .int-body { flex:1; }
    .int-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .int-desc { font-size:.8125rem; color:#94a3b8; margin:0; line-height:1.4; }

    .int-action-btn {
      padding:.5rem 1.125rem; border-radius:10px;
      font-size:.8125rem; font-weight:600; font-family:inherit;
      cursor:pointer; transition:all .2s; flex-shrink:0;
      background:white; border:1.5px solid #e2e8f0; color:#334155;
    }
    .int-action-btn:hover { background:#f0f7ff; border-color:#3b82f6; color:#3b82f6; }
    .int-action-btn.connected {
      background:rgba(16,185,129,0.08); border-color:rgba(16,185,129,0.2); color:#059669;
    }

    @media(max-width:900px) { .int-grid { grid-template-columns:1fr; } }
  `]
})
export class IntegrationsComponent {
  sections = [
    {
      title: 'E-commerce & Sales',
      items: [
        { name: 'Shopify', emoji: '🛒', description: 'Sync customers, track purchases, and trigger post-purchase flows', connected: false, iconBg: 'rgba(59,130,246,0.1)' },
        { name: 'WooCommerce', emoji: '🏪', description: 'Connect your WordPress store for automated email marketing', connected: false, iconBg: 'rgba(139,92,246,0.1)' },
        { name: 'Payhip', emoji: '💳', description: 'Track direct digital sales and automate delivery emails', connected: true, iconBg: 'rgba(16,185,129,0.1)' },
      ]
    },
    {
      title: 'Author & Publishing',
      items: [
        { name: 'BookFunnel', emoji: '📚', description: 'Sync reader magnet downloads and new subscribers automatically', connected: true, iconBg: 'rgba(59,130,246,0.1)' },
        { name: 'StoryOrigin', emoji: '📖', description: 'Import subscribers from StoryOrigin promotions and giveaways', connected: true, iconBg: 'rgba(139,92,246,0.1)' },
        { name: 'Draft2Digital', emoji: '✍️', description: 'Connect your D2D account for sales data integration', connected: false, iconBg: 'rgba(245,158,11,0.1)' },
      ]
    },
    {
      title: 'Analytics & Tracking',
      items: [
        { name: 'Google Analytics 4', emoji: '📊', description: 'Track email campaign traffic and conversions in GA4', connected: false, iconBg: 'rgba(59,130,246,0.1)' },
        { name: 'Facebook Pixel', emoji: '🎯', description: 'Retarget email subscribers and track ad conversions', connected: false, iconBg: 'rgba(99,102,241,0.1)' },
        { name: 'ScribeCount Reports', emoji: '📈', description: 'Export email performance data to ScribeCount unified reporting', connected: true, iconBg: 'rgba(16,185,129,0.1)' },
      ]
    },
    {
      title: 'Automation & Tools',
      items: [
        { name: 'Zapier', emoji: '⚡', description: 'Connect with 5,000+ apps via Zapier automations', connected: false, iconBg: 'rgba(245,158,11,0.1)' },
        { name: 'WordPress', emoji: '🌐', description: 'Add sign-up forms and landing pages to your WordPress site', connected: false, iconBg: 'rgba(59,130,246,0.1)' },
      ]
    },
  ];
}
