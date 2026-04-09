import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Landing Pages</h1>
          <p class="page-subtitle">Create high-converting pages for book launches, giveaways, and reader magnets</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a new landing page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Page
        </button>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <button class="filter-btn" [class.active]="activeFilter === ''" (click)="activeFilter=''">All</button>
        <button class="filter-btn" [class.active]="activeFilter === 'published'" (click)="activeFilter='published'">Published</button>
        <button class="filter-btn" [class.active]="activeFilter === 'draft'" (click)="activeFilter='draft'">Draft</button>
        <div class="search-wrap" style="margin-left:auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" placeholder="Search pages..." [(ngModel)]="searchQuery" />
        </div>
      </div>

      <!-- Pages Grid -->
      <div class="pages-grid">
        <div class="glass-card page-card" *ngFor="let page of filteredPages">
          <div class="page-preview" [style.background]="page.previewBg">
            <div class="page-preview-inner">
              <div class="pp-emoji">{{ page.emoji }}</div>
              <div class="pp-lines">
                <div class="ppl" style="width:80%"></div>
                <div class="ppl" style="width:60%"></div>
                <div class="ppl" style="width:40%;margin-top:.75rem;height:24px;border-radius:6px;background:rgba(255,255,255,0.3)"></div>
              </div>
            </div>
          </div>
          <div class="page-body">
            <div class="page-header-row">
              <h3 class="pg-name">{{ page.name }}</h3>
              <span class="badge" [ngClass]="'badge-' + page.status">{{ page.status }}</span>
            </div>
            <p class="pg-url">{{ page.url }}</p>
            <div class="pg-stats">
              <div class="pg-stat">
                <span class="pgs-val">{{ page.visits | number }}</span>
                <span class="pgs-label">Visits</span>
              </div>
              <div class="pg-stat">
                <span class="pgs-val">{{ page.signups | number }}</span>
                <span class="pgs-label">Signups</span>
              </div>
              <div class="pg-stat">
                <span class="pgs-val">{{ page.convRate }}%</span>
                <span class="pgs-label">Conv. Rate</span>
              </div>
            </div>
            <div class="pg-actions">
              <button class="btn-primary btn-sm" data-tooltip="Edit this landing page">Edit</button>
              <button class="btn-ghost btn-sm" data-tooltip="Preview in a new tab">Preview</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar { display:flex; align-items:center; gap:.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .filter-btn { padding:.5rem 1rem; border-radius:10px; border:1.5px solid #e2e8f0; background:white; color:#64748b; font-size:.8125rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; }
    .filter-btn:hover { border-color:#93c5fd; color:#0f172a; }
    .filter-btn.active { background:#eff6ff; border-color:#93c5fd; color:#3b82f6; font-weight:600; }

    .pages-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .page-card { overflow:hidden; padding:0; }
    .page-preview { min-height:160px; display:flex; align-items:center; justify-content:center; border-bottom:1.5px solid #f1f5f9; }
    .page-preview-inner { display:flex; flex-direction:column; align-items:center; gap:.75rem; padding:1.5rem; }
    .pp-emoji { font-size:2.5rem; }
    .pp-lines { display:flex; flex-direction:column; gap:.375rem; width:100%; }
    .ppl { height:8px; border-radius:4px; background:rgba(255,255,255,0.3); }

    .page-body { padding:1.25rem; }
    .page-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:.35rem; }
    .pg-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .pg-url { font-size:.72rem; color:#94a3b8; margin:0 0 1rem; font-family:monospace; }
    .pg-stats { display:flex; gap:1.5rem; margin-bottom:1rem; }
    .pg-stat { display:flex; flex-direction:column; }
    .pgs-val { font-size:1.0625rem; font-weight:700; color:#0f172a; }
    .pgs-label { font-size:.65rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .pg-actions { display:flex; gap:.5rem; }

    .badge-published { background:rgba(16,185,129,0.1); color:#059669; }

    @media(max-width:1100px) { .pages-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .pages-grid { grid-template-columns:1fr; } }
  `]
})
export class LandingPagesComponent {
  searchQuery = '';
  activeFilter = '';

  pages = [
    { name: 'The Ember Crown Launch', emoji: '🔥', status: 'published', url: 'scribecount.com/p/ember-crown', visits: 2840, signups: 312, convRate: 11.0, previewBg: 'linear-gradient(135deg,#1e3a5f,#2d5a87)' },
    { name: 'Free Chapter Giveaway', emoji: '📖', status: 'published', url: 'scribecount.com/p/free-chapter', visits: 1620, signups: 284, convRate: 17.5, previewBg: 'linear-gradient(135deg,#4c1d95,#6d28d9)' },
    { name: 'Newsletter Signup', emoji: '📧', status: 'published', url: 'scribecount.com/p/newsletter', visits: 4210, signups: 520, convRate: 12.4, previewBg: 'linear-gradient(135deg,#065f46,#059669)' },
    { name: 'ARC Team Application', emoji: '⭐', status: 'draft', url: 'scribecount.com/p/arc-team', visits: 0, signups: 0, convRate: 0, previewBg: 'linear-gradient(135deg,#92400e,#d97706)' },
    { name: 'Series Bundle Promo', emoji: '📚', status: 'published', url: 'scribecount.com/p/series-bundle', visits: 980, signups: 76, convRate: 7.8, previewBg: 'linear-gradient(135deg,#991b1b,#dc2626)' },
    { name: 'Summer Reading List', emoji: '☀️', status: 'draft', url: 'scribecount.com/p/summer-reads', visits: 0, signups: 0, convRate: 0, previewBg: 'linear-gradient(135deg,#1e40af,#3b82f6)' },
  ];

  get filteredPages() {
    return this.pages.filter(p => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q);
      const matchF = !this.activeFilter || p.status === this.activeFilter;
      return matchQ && matchF;
    });
  }
}
