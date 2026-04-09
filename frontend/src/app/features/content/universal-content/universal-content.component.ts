import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-universal-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Universal Content</h1>
          <p class="page-subtitle">Reusable content blocks for your email templates — book cards, series lists, author bios</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a new reusable content block">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Block
        </button>
      </div>

      <div class="blocks-grid">
        <div class="glass-card block-card" *ngFor="let block of blocks">
          <div class="block-preview" [style.background]="block.previewBg">
            <span class="block-emoji">{{ block.emoji }}</span>
          </div>
          <div class="block-body">
            <h3 class="block-name">{{ block.name }}</h3>
            <p class="block-desc">{{ block.description }}</p>
            <div class="block-meta">
              <span class="block-type">{{ block.type }}</span>
              <span class="block-used">Used in {{ block.usedIn }} templates</span>
            </div>
            <div class="block-actions">
              <button class="btn-primary btn-sm" data-tooltip="Edit this content block">Edit</button>
              <button class="btn-ghost btn-sm" data-tooltip="Duplicate this block">Duplicate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blocks-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .block-card { overflow:hidden; padding:0; }
    .block-preview { height:100px; display:flex; align-items:center; justify-content:center; border-bottom:1.5px solid #f1f5f9; }
    .block-emoji { font-size:2.5rem; }
    .block-body { padding:1.25rem; }
    .block-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .block-desc { font-size:.8rem; color:#94a3b8; margin:0 0 .875rem; line-height:1.5; }
    .block-meta { display:flex; align-items:center; gap:.75rem; margin-bottom:1rem; }
    .block-type { padding:.2rem .55rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .block-used { font-size:.72rem; color:#94a3b8; }
    .block-actions { display:flex; gap:.5rem; }

    @media(max-width:1100px) { .blocks-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .blocks-grid { grid-template-columns:1fr; } }
  `]
})
export class UniversalContentComponent {
  blocks = [
    { name: 'Book Card — The Ember Crown', type: 'Book Card', emoji: '📕', description: 'Cover image, title, blurb, and buy links for The Ember Crown', usedIn: 4, previewBg: 'rgba(139,92,246,0.05)' },
    { name: 'Author Bio & Photo', type: 'Bio Block', emoji: '👤', description: 'Your author bio and headshot for email footers', usedIn: 12, previewBg: 'rgba(59,130,246,0.05)' },
    { name: 'Series Order — Dark Realms', type: 'Series Block', emoji: '📚', description: 'Ordered list of all books in the Dark Realms series with links', usedIn: 3, previewBg: 'rgba(16,185,129,0.05)' },
    { name: 'Social Links Footer', type: 'Footer Block', emoji: '🔗', description: 'Facebook, Instagram, TikTok, and website links', usedIn: 15, previewBg: 'rgba(245,158,11,0.05)' },
    { name: 'Review Request CTA', type: 'CTA Block', emoji: '⭐', description: 'A button block asking readers to leave a review', usedIn: 6, previewBg: 'rgba(239,68,68,0.05)' },
    { name: 'Preorder Countdown', type: 'Dynamic Block', emoji: '⏰', description: 'Dynamic countdown timer for upcoming book preorders', usedIn: 2, previewBg: 'rgba(99,102,241,0.05)' },
  ];
}
