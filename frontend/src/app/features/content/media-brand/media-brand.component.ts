import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-brand',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Media & Brand</h1>
          <p class="page-subtitle">Manage your brand assets, images, and files used in emails</p>
        </div>
        <button class="btn-primary" data-tooltip="Upload a new image or file">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload
        </button>
      </div>

      <!-- Brand Colors -->
      <div class="glass-card brand-section">
        <h2 class="bs-title">Brand Colors</h2>
        <p class="bs-sub">Define your brand palette to automatically style emails</p>
        <div class="color-swatches">
          <div class="swatch" *ngFor="let c of brandColors">
            <div class="swatch-color" [style.background]="c.value"></div>
            <span class="swatch-label">{{ c.label }}</span>
            <span class="swatch-hex">{{ c.value }}</span>
          </div>
        </div>
      </div>

      <!-- Asset Library -->
      <div class="glass-card brand-section">
        <div class="section-header">
          <h2 class="bs-title">Asset Library</h2>
          <span class="count-badge">{{ assets.length }} files</span>
        </div>
        <div class="assets-grid">
          <div class="asset-card" *ngFor="let a of assets">
            <div class="asset-preview" [style.background]="a.previewBg">
              <span class="asset-emoji">{{ a.emoji }}</span>
            </div>
            <div class="asset-info">
              <span class="asset-name">{{ a.name }}</span>
              <span class="asset-size">{{ a.size }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-section { padding:1.5rem; margin-bottom:1.5rem; }
    .bs-title { font-size:1.0625rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .bs-sub { font-size:.8125rem; color:#94a3b8; margin:0 0 1.25rem; }
    .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
    .count-badge { font-size:.75rem; font-weight:600; color:#3b82f6; background:rgba(59,130,246,0.08); padding:.25rem .6rem; border-radius:6px; }

    .color-swatches { display:flex; gap:1rem; flex-wrap:wrap; }
    .swatch { display:flex; flex-direction:column; align-items:center; gap:.375rem; }
    .swatch-color { width:56px; height:56px; border-radius:14px; border:2px solid rgba(0,0,0,0.06); box-shadow:0 2px 8px rgba(0,0,0,0.08); }
    .swatch-label { font-size:.75rem; font-weight:600; color:#0f172a; }
    .swatch-hex { font-size:.65rem; color:#94a3b8; font-family:monospace; }

    .assets-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1rem; }
    .asset-card { border:1.5px solid #f1f5f9; border-radius:12px; overflow:hidden; cursor:pointer; transition:all .2s; }
    .asset-card:hover { border-color:#bfdbfe; box-shadow:0 4px 12px rgba(0,0,0,0.06); transform:translateY(-2px); }
    .asset-preview { height:90px; display:flex; align-items:center; justify-content:center; }
    .asset-emoji { font-size:2rem; }
    .asset-info { padding:.75rem; display:flex; flex-direction:column; gap:.15rem; }
    .asset-name { font-size:.78rem; font-weight:600; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .asset-size { font-size:.65rem; color:#94a3b8; }

    @media(max-width:1100px) { .assets-grid { grid-template-columns:repeat(4,1fr); } }
    @media(max-width:800px) { .assets-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:500px) { .assets-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class MediaBrandComponent {
  brandColors = [
    { label: 'Primary', value: '#1e3a5f' },
    { label: 'Accent', value: '#3b82f6' },
    { label: 'Success', value: '#10b981' },
    { label: 'Warning', value: '#f59e0b' },
    { label: 'Text', value: '#0f172a' },
    { label: 'Muted', value: '#94a3b8' },
  ];

  assets = [
    { name: 'Author Headshot.jpg', emoji: '📷', size: '245 KB', previewBg: 'rgba(59,130,246,0.05)' },
    { name: 'Book Cover — Ember Crown.png', emoji: '📕', size: '1.2 MB', previewBg: 'rgba(139,92,246,0.05)' },
    { name: 'Logo Dark.svg', emoji: '🎨', size: '12 KB', previewBg: 'rgba(16,185,129,0.05)' },
    { name: 'Logo Light.svg', emoji: '🎨', size: '11 KB', previewBg: 'rgba(245,158,11,0.05)' },
    { name: 'Banner — Launch.png', emoji: '🖼️', size: '890 KB', previewBg: 'rgba(99,102,241,0.05)' },
    { name: 'Social Icons.png', emoji: '🔗', size: '34 KB', previewBg: 'rgba(239,68,68,0.05)' },
    { name: 'Book Cover — Dark Realms.png', emoji: '📗', size: '1.1 MB', previewBg: 'rgba(16,185,129,0.05)' },
    { name: 'Email Header.png', emoji: '✉️', size: '456 KB', previewBg: 'rgba(59,130,246,0.05)' },
    { name: 'Series Mockup.jpg', emoji: '📚', size: '2.3 MB', previewBg: 'rgba(139,92,246,0.05)' },
    { name: 'ARC Badge.png', emoji: '⭐', size: '78 KB', previewBg: 'rgba(245,158,11,0.05)' },
  ];
}
