import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Template } from '../../core/services/mock-data.service';

type TemplatesTab = 'templates' | 'blocks';

interface ReusableBlock {
  id: string;
  name: string;
  type: 'book-card' | 'author-bio' | 'quote' | 'button' | 'series' | 'social';
  description: string;
  preview: string;
  lastUsed: string;
}

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Templates</h1>
          <p class="page-subtitle">Ready-to-use email templates and reusable content blocks</p>
        </div>
        <button class="btn-primary" [attr.data-tooltip]="activeTab() === 'blocks' ? 'Create a new reusable block' : 'Create a custom email template from scratch'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ activeTab() === 'blocks' ? 'New Block' : 'Create Template' }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'templates'" (click)="activeTab.set('templates')">
          Email Templates <span class="tab-count">{{ templates.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'blocks'" (click)="activeTab.set('blocks')">
          Reusable Blocks <span class="tab-count">{{ reusableBlocks.length }}</span>
        </button>
      </div>

      <!-- ===== TEMPLATES TAB ===== -->
      <div *ngIf="activeTab() === 'templates'">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <button class="filter-btn" [class.active]="activeCategory() === ''" (click)="activeCategory.set('')">All</button>
          <button class="filter-btn" *ngFor="let cat of categories" [class.active]="activeCategory() === cat" (click)="activeCategory.set(cat)">{{ cat }}</button>
          <div class="search-wrap" style="margin-left:auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" placeholder="Search templates..." [(ngModel)]="searchQuery" />
          </div>
        </div>

        <!-- Template Grid -->
        <div class="templates-grid">
          <div class="glass-card template-card" *ngFor="let t of filteredTemplates" (click)="previewTemplate.set(t)">
            <div class="template-preview">
              <div class="template-icon-wrap">
                <svg *ngIf="t.preview === 'NL'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <svg *ngIf="t.preview === 'BL'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                <svg *ngIf="t.preview === 'WE'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <svg *ngIf="t.preview === 'SE'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <svg *ngIf="t.preview === 'EV'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <svg *ngIf="t.preview === 'RE'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                <svg *ngIf="t.preview === 'HS'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg *ngIf="t.preview === 'SF'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div class="template-lines">
                <div class="tl tl-1"></div>
                <div class="tl tl-2"></div>
                <div class="tl tl-3"></div>
                <div class="tl tl-4"></div>
              </div>
            </div>
            <div class="template-body">
              <div class="template-header-row">
                <h3 class="template-name">{{ t.name }}</h3>
                <span class="template-cat">{{ t.category }}</span>
              </div>
              <p class="template-desc">{{ t.description }}</p>
              <div class="template-actions">
                <button class="btn-primary btn-sm" (click)="$event.stopPropagation()" data-tooltip="Use this template to create a campaign">Use Template</button>
                <button class="btn-ghost btn-sm" (click)="previewTemplate.set(t); $event.stopPropagation()" data-tooltip="Preview this template">Preview</button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredTemplates.length === 0">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="48" height="48"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3>No templates found</h3>
          <p>Try a different category or search term</p>
        </div>
      </div>

      <!-- ===== REUSABLE BLOCKS TAB ===== -->
      <div *ngIf="activeTab() === 'blocks'">

        <!-- Explainer -->
        <div class="blocks-explainer glass-card">
          <div class="be-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div class="be-body">
            <h3 class="be-title">Build once, drop in anywhere</h3>
            <p class="be-desc">Reusable blocks save you from rebuilding the same elements every issue — your book card, author bio, social follow row, and more. Build them once and insert them into any newsletter or campaign instantly. The time you save on formatting goes back to writing.</p>
          </div>
        </div>

        <!-- Blocks grid -->
        <div class="blocks-grid">
          <div class="glass-card block-card" *ngFor="let block of reusableBlocks">
            <div class="block-preview" [class]="'block-preview-' + block.type">
              <div class="block-preview-inner" [innerHTML]="getBlockPreviewHTML(block.type)"></div>
            </div>
            <div class="block-body">
              <div class="block-header-row">
                <h3 class="block-name">{{ block.name }}</h3>
                <span class="block-type-badge">{{ getBlockTypeLabel(block.type) }}</span>
              </div>
              <p class="block-desc">{{ block.description }}</p>
              <div class="block-meta">Last used: {{ block.lastUsed }}</div>
              <div class="block-actions">
                <button class="btn-primary btn-sm" data-tooltip="Insert this block into your current email">Insert Block</button>
                <button class="btn-ghost btn-sm" data-tooltip="Edit this reusable block">Edit</button>
                <button class="btn-ghost btn-sm danger" data-tooltip="Delete this block">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Block type guide -->
        <div class="glass-card block-types-guide">
          <h3 class="btg-title">Available Block Types</h3>
          <div class="btg-grid">
            <div class="btg-item" *ngFor="let bt of blockTypes">
              <div class="btg-icon" [style.background]="bt.bg" [style.color]="bt.color">
                <span [innerHTML]="bt.icon"></span>
              </div>
              <div>
                <div class="btg-name">{{ bt.name }}</div>
                <div class="btg-desc">{{ bt.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Modal -->
      <div class="modal-overlay" *ngIf="previewTemplate()" (click)="previewTemplate.set(null)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">{{ previewTemplate()!.name }}</h2>
              <span class="template-cat">{{ previewTemplate()!.category }}</span>
            </div>
            <button class="modal-close" (click)="previewTemplate.set(null)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-preview">
            <div class="email-mock">
              <div class="email-mock-header">
                <div class="email-mock-logo">{{ previewTemplate()!.preview }}</div>
                <div class="email-mock-lines">
                  <div class="eml tl-1"></div>
                  <div class="eml tl-2"></div>
                </div>
              </div>
              <div class="email-mock-body">
                <div class="eml tl-1" style="height:14px;margin-bottom:8px"></div>
                <div class="eml tl-2" style="height:10px;margin-bottom:6px"></div>
                <div class="eml tl-3" style="height:10px;margin-bottom:6px"></div>
                <div class="eml tl-4" style="height:10px;margin-bottom:16px"></div>
                <div class="email-mock-btn"></div>
              </div>
            </div>
          </div>
          <p class="modal-desc">{{ previewTemplate()!.description }}</p>
          <div class="modal-actions">
            <button class="btn-primary" data-tooltip="Use this template to create a new campaign">Use This Template</button>
            <button class="btn-secondary" (click)="previewTemplate.set(null)">Close</button>
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

    .templates-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
    .template-card { overflow:hidden; cursor:pointer; padding:0; }
    .template-card:hover .template-preview { background:#eff6ff; }

    .template-preview { padding:1.5rem; background:#f8fafc; border-bottom:1.5px solid #f1f5f9; display:flex; flex-direction:column; align-items:center; gap:.875rem; min-height:140px; justify-content:center; transition:background .2s; }
    .template-icon-wrap { width:56px; height:56px; border-radius:14px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; color:#64748b; transition:all .2s; }
    .template-card:hover .template-icon-wrap { background:#dbeafe; color:#3b82f6; }
    .template-lines { display:flex; flex-direction:column; gap:.375rem; width:80%; }
    .tl { height:8px; border-radius:4px; background:#e2e8f0; }
    .tl-1 { width:100%; }
    .tl-2 { width:80%; }
    .tl-3 { width:90%; }
    .tl-4 { width:60%; }

    .template-body { padding:1.125rem; }
    .template-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; }
    .template-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .template-cat { font-size:.7rem; font-weight:700; padding:.2rem .55rem; background:rgba(99,102,241,0.08); color:#6366f1; border-radius:6px; text-transform:uppercase; letter-spacing:.04em; }
    .template-desc { font-size:.8rem; color:#94a3b8; margin:0 0 1rem; line-height:1.5; }
    .template-actions { display:flex; gap:.5rem; }

    .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem; animation:fadeIn .2s; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .modal-card { background:#ffffff; border:1.5px solid #e2e8f0; border-radius:20px; padding:2rem; max-width:480px; width:100%; box-shadow:0 24px 64px rgba(0,0,0,0.15); animation:slideUp .25s ease-out; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .modal-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; }
    .modal-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .375rem; }
    .modal-close { background:#f1f5f9; border:none; border-radius:8px; cursor:pointer; color:#64748b; padding:.375rem; display:flex; transition:all .2s; }
    .modal-close:hover { background:#e2e8f0; color:#0f172a; }
    .modal-preview { margin-bottom:1.25rem; }
    .email-mock { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; }
    .email-mock-header { padding:1rem; background:#f1f5f9; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; gap:.875rem; }
    .email-mock-logo { font-size:1.75rem; }
    .email-mock-lines { display:flex; flex-direction:column; gap:.375rem; flex:1; }
    .eml { height:8px; border-radius:4px; background:#e2e8f0; }
    .email-mock-body { padding:1rem; display:flex; flex-direction:column; }
    .email-mock-btn { width:80px; height:28px; border-radius:8px; background:linear-gradient(135deg,rgba(59,130,246,0.3),rgba(99,102,241,0.3)); }
    .modal-desc { font-size:.875rem; color:#64748b; margin:0 0 1.5rem; line-height:1.5; }
    .modal-actions { display:flex; gap:.75rem; }

    @media(max-width:1200px) { .templates-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .templates-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .templates-grid { grid-template-columns:1fr; } }

    /* Tabs */
    .tabs { display:flex; gap:.25rem; margin-bottom:1.5rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; }
    .tab:hover { color:#0f172a; }
    .tab.active { background:#ffffff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }

    /* Reusable Blocks */
    .blocks-explainer { display:flex; align-items:flex-start; gap:1rem; padding:1.25rem 1.5rem; margin-bottom:1.5rem; background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(59,130,246,0.06)); border:1.5px solid rgba(99,102,241,0.15); }
    .be-icon { width:40px; height:40px; border-radius:10px; background:rgba(99,102,241,0.1); display:flex; align-items:center; justify-content:center; color:#6366f1; flex-shrink:0; }
    .be-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .be-desc { font-size:.8125rem; color:#64748b; margin:0; line-height:1.6; }
    .blocks-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.5rem; }
    .block-card { overflow:hidden; padding:0; }
    .block-preview { padding:1.25rem; background:#f8fafc; border-bottom:1.5px solid #f1f5f9; min-height:100px; display:flex; align-items:center; justify-content:center; }
    .block-preview-book-card { background:linear-gradient(135deg,rgba(59,130,246,0.06),rgba(99,102,241,0.06)); }
    .block-preview-author-bio { background:linear-gradient(135deg,rgba(16,185,129,0.06),rgba(5,150,105,0.06)); }
    .block-preview-quote { background:linear-gradient(135deg,rgba(168,85,247,0.06),rgba(99,102,241,0.06)); }
    .block-preview-button { background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(239,68,68,0.06)); }
    .block-preview-series { background:linear-gradient(135deg,rgba(59,130,246,0.06),rgba(16,185,129,0.06)); }
    .block-preview-social { background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(168,85,247,0.06)); }
    .block-preview-inner { font-size:.75rem; color:#64748b; text-align:center; }
    .block-body { padding:1.125rem; }
    .block-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; }
    .block-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .block-type-badge { font-size:.7rem; font-weight:700; padding:.2rem .55rem; background:rgba(99,102,241,0.08); color:#6366f1; border-radius:6px; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; }
    .block-desc { font-size:.8rem; color:#94a3b8; margin:0 0 .5rem; line-height:1.5; }
    .block-meta { font-size:.75rem; color:#cbd5e1; margin-bottom:.875rem; }
    .block-actions { display:flex; gap:.5rem; align-items:center; }
    .block-actions .danger { color:#dc2626; }
    .block-types-guide { padding:1.5rem; }
    .btg-title { font-size:.875rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .btg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
    .btg-item { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#f8fafc; border-radius:10px; }
    .btg-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .btg-name { font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .btg-desc { font-size:.75rem; color:#94a3b8; line-height:1.4; }
    @media(max-width:900px) { .blocks-grid { grid-template-columns:repeat(2,1fr); } .btg-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .blocks-grid { grid-template-columns:1fr; } .btg-grid { grid-template-columns:1fr; } }
  `]
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  activeTab = signal<TemplatesTab>('templates');
  activeCategory = signal('');
  searchQuery = '';
  previewTemplate = signal<Template | null>(null);
  categories: string[] = [];

  reusableBlocks: ReusableBlock[] = [
    { id: '1', name: 'Book Card — The Ember Crown', type: 'book-card', description: 'Cover image, title, tagline, and buy button for your latest release', preview: 'BC', lastUsed: '2 days ago' },
    { id: '2', name: 'Author Bio', type: 'author-bio', description: 'Short bio with headshot, social links, and website URL', preview: 'AB', lastUsed: '1 week ago' },
    { id: '3', name: 'Pull Quote Block', type: 'quote', description: 'Styled reader review or excerpt with left border accent', preview: 'QT', lastUsed: '3 days ago' },
    { id: '4', name: 'CTA Button Row', type: 'button', description: 'Centered call-to-action button with customizable label and URL', preview: 'BT', lastUsed: '5 days ago' },
    { id: '5', name: 'Series Reading Order', type: 'series', description: 'Numbered list of books in your series with cover thumbnails', preview: 'SR', lastUsed: '2 weeks ago' },
    { id: '6', name: 'Social Follow Row', type: 'social', description: 'Instagram, Facebook, and Goodreads follow icons with links', preview: 'SF', lastUsed: '1 week ago' },
  ];

  blockTypes = [
    { name: 'Book Card', description: 'Cover, title, tagline, and buy button for a single title', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    { name: 'Series Reading Order', description: 'Numbered book list with covers for series readers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    { name: 'Pull Quote', description: 'Styled reader review or excerpt with accent border', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>', bg: 'rgba(168,85,247,0.1)', color: '#9333ea' },
    { name: 'CTA Button', description: 'Centered call-to-action button with custom label and URL', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="8" width="18" height="8" rx="4"/><line x1="12" y1="12" x2="12.01" y2="12"/></svg>', bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    { name: 'Author Bio', description: 'Headshot, short bio, and social links', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    { name: 'Social Follow Row', description: 'Follow icons for Instagram, Facebook, Goodreads, and more', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>', bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  ];

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.templates = this.mockData.getTemplates();
    this.categories = [...new Set(this.templates.map(t => t.category))];
  }

  get filteredTemplates() {
    return this.templates.filter(t => {
      const matchCat = !this.activeCategory() || t.category === this.activeCategory();
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }

  getBlockTypeLabel(type: ReusableBlock['type']): string {
    const labels: Record<ReusableBlock['type'], string> = {
      'book-card': 'Book Card', 'author-bio': 'Author Bio', 'quote': 'Quote',
      'button': 'Button', 'series': 'Series', 'social': 'Social'
    };
    return labels[type];
  }

  getBlockPreviewHTML(type: ReusableBlock['type']): string {
    const previews: Record<ReusableBlock['type'], string> = {
      'book-card': '<div style="display:flex;gap:8px;align-items:center"><div style="width:32px;height:44px;background:#e2e8f0;border-radius:3px"></div><div><div style="width:80px;height:8px;background:#e2e8f0;border-radius:4px;margin-bottom:5px"></div><div style="width:60px;height:6px;background:#f1f5f9;border-radius:4px;margin-bottom:8px"></div><div style="width:56px;height:18px;background:rgba(59,130,246,0.2);border-radius:4px"></div></div></div>',
      'author-bio': '<div style="display:flex;gap:8px;align-items:center"><div style="width:36px;height:36px;background:#e2e8f0;border-radius:50%"></div><div><div style="width:70px;height:7px;background:#e2e8f0;border-radius:4px;margin-bottom:4px"></div><div style="width:90px;height:6px;background:#f1f5f9;border-radius:4px"></div></div></div>',
      'quote': '<div style="border-left:3px solid #a78bfa;padding-left:8px"><div style="width:100px;height:6px;background:#e2e8f0;border-radius:4px;margin-bottom:4px"></div><div style="width:80px;height:6px;background:#f1f5f9;border-radius:4px"></div></div>',
      'button': '<div style="width:80px;height:24px;background:rgba(59,130,246,0.2);border-radius:6px;margin:0 auto"></div>',
      'series': '<div style="display:flex;flex-direction:column;gap:4px"><div style="display:flex;gap:6px;align-items:center"><span style="font-size:10px;color:#94a3b8">1</span><div style="width:16px;height:22px;background:#e2e8f0;border-radius:2px"></div><div style="width:60px;height:6px;background:#e2e8f0;border-radius:4px"></div></div><div style="display:flex;gap:6px;align-items:center"><span style="font-size:10px;color:#94a3b8">2</span><div style="width:16px;height:22px;background:#e2e8f0;border-radius:2px"></div><div style="width:50px;height:6px;background:#f1f5f9;border-radius:4px"></div></div></div>',
      'social': '<div style="display:flex;gap:8px;justify-content:center"><div style="width:24px;height:24px;background:#e2e8f0;border-radius:50%"></div><div style="width:24px;height:24px;background:#e2e8f0;border-radius:50%"></div><div style="width:24px;height:24px;background:#e2e8f0;border-radius:50%"></div></div>',
    };
    return previews[type];
  }
}
