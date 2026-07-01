import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ContentApiService, EmailTemplate, ContentBlock, WebsiteTemplate } from '../../core/services/content-api.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';

type TemplatesTab = 'templates' | 'blocks' | 'website';

interface TemplateView extends EmailTemplate {
  safeHtml: SafeHtml;
}

interface WebsiteTemplateView extends WebsiteTemplate {
  safeHtml: SafeHtml;
}

interface BlockView extends ContentBlock {
  safeIcon: SafeHtml;
  safeHtml: SafeHtml;
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
          <p class="page-subtitle">Ready-to-use email templates, website pages, and reusable content blocks</p>
        </div>
        <button class="btn-primary" (click)="onHeaderAction()" [attr.data-tooltip]="activeTab() === 'blocks' ? 'Create a new reusable block' : 'Create a custom email template from scratch'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ activeTab() === 'blocks' ? 'New Block' : 'Create Template' }}
        </button>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'templates'" (click)="activeTab.set('templates')">
          Email Templates <span class="tab-count">{{ templates().length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'blocks'" (click)="activeTab.set('blocks')">
          Reusable Blocks <span class="tab-count">{{ reusableBlocks().length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'website'" (click)="activeTab.set('website')">
          Sign-up & Landing <span class="tab-count">{{ websiteTemplates().length }}</span>
        </button>
      </div>

      <div *ngIf="activeTab() === 'templates'">
        <div class="filter-bar">
          <button class="filter-btn" [class.active]="activeCategory() === ''" (click)="activeCategory.set('')">All</button>
          <button class="filter-btn" *ngFor="let cat of categories()" [class.active]="activeCategory() === cat" (click)="activeCategory.set(cat)">{{ cat }}</button>
          <div class="search-wrap" style="margin-left:auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" placeholder="Search templates..." [(ngModel)]="searchQuery" />
          </div>
        </div>

        <div class="loading-state" *ngIf="loading()">Loading templates…</div>

        <div class="templates-grid" *ngIf="!loading()">
          <div class="glass-card template-card" *ngFor="let t of filteredTemplates" (click)="openPreview(t)">
            <div class="template-preview">
              <div class="preview-scale-wrap">
                <div class="preview-html" [innerHTML]="t.safeHtml"></div>
              </div>
            </div>
            <div class="template-body">
              <div class="template-header-row">
                <h3 class="template-name">{{ t.name }}</h3>
                <span class="template-cat">{{ t.category }}</span>
              </div>
              <p class="template-subject" *ngIf="t.subjectLine">{{ t.subjectLine }}</p>
              <p class="template-desc">{{ t.description }}</p>
              <div class="template-actions">
                <button class="btn-primary btn-sm" (click)="useTemplate(t, $event)" [disabled]="usingId() === t.id" data-tooltip="Use this template to create a campaign">
                  {{ usingId() === t.id ? 'Creating…' : 'Use Template' }}
                </button>
                <button class="btn-ghost btn-sm" (click)="openPreview(t); $event.stopPropagation()" data-tooltip="Preview this template">Preview</button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading() && filteredTemplates.length === 0">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="48" height="48"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3>No templates found</h3>
          <p>Try a different category or search term</p>
        </div>
      </div>

      <div *ngIf="activeTab() === 'website'">
        <div class="filter-bar">
          <button class="filter-btn" [class.active]="websiteCategory() === ''" (click)="websiteCategory.set('')">All</button>
          <button class="filter-btn" [class.active]="websiteCategory() === 'Sign-up Form'" (click)="websiteCategory.set('Sign-up Form')">Sign-up Forms</button>
          <button class="filter-btn" [class.active]="websiteCategory() === 'Landing Page'" (click)="websiteCategory.set('Landing Page')">Landing Pages</button>
          <div class="search-wrap" style="margin-left:auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" placeholder="Search website templates..." [(ngModel)]="websiteSearchQuery" />
          </div>
        </div>

        <div class="templates-grid" *ngIf="!loading()">
          <div class="glass-card template-card" *ngFor="let t of filteredWebsiteTemplates" (click)="openWebsitePreview(t)">
            <div class="template-preview">
              <div class="preview-scale-wrap">
                <div class="preview-html website-preview-html" [innerHTML]="t.safeHtml"></div>
              </div>
            </div>
            <div class="template-body">
              <div class="template-header-row">
                <h3 class="template-name">{{ t.name }}</h3>
                <span class="template-cat">{{ t.category }}</span>
              </div>
              <p class="template-subject">{{ t.headline }}</p>
              <p class="template-desc">{{ t.description }}</p>
              <div class="template-actions">
                <button class="btn-primary btn-sm" (click)="useWebsiteTemplate(t, $event)" data-tooltip="Start with this template">
                  Use Template
                </button>
                <button class="btn-ghost btn-sm" (click)="openWebsitePreview(t); $event.stopPropagation()">Preview</button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading() && filteredWebsiteTemplates.length === 0">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="48" height="48"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3>No website templates found</h3>
          <p>Try a different category or search term</p>
        </div>
      </div>

      <div *ngIf="activeTab() === 'blocks'">
        <div class="blocks-explainer glass-card">
          <div class="be-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div class="be-body">
            <h3 class="be-title">Build once, drop in anywhere</h3>
            <p class="be-desc">Reusable blocks save you from rebuilding the same elements every issue — your book card, author bio, social follow row, and more. Build them once and insert them into any newsletter or campaign instantly.</p>
          </div>
        </div>

        <div class="loading-state" *ngIf="loading()">Loading blocks…</div>

        <div class="blocks-grid" *ngIf="!loading()">
          <div class="glass-card block-card" *ngFor="let block of reusableBlocks()" (click)="openBlockPreview(block)">
            <div class="block-preview">
              <div class="preview-scale-wrap block-scale">
                <div class="preview-html" [innerHTML]="block.safeHtml"></div>
              </div>
            </div>
            <div class="block-body">
              <div class="block-header-row">
                <h3 class="block-name">{{ block.name }}</h3>
                <span class="block-type-badge">{{ block.type }}</span>
              </div>
              <p class="block-desc">{{ block.description }}</p>
              <div class="block-meta">Used in {{ block.usedIn }} campaign{{ block.usedIn === 1 ? '' : 's' }}</div>
              <div class="block-actions">
                <button class="btn-primary btn-sm" (click)="insertBlock(block, $event)" [disabled]="usingBlockId() === block.id" data-tooltip="Start a campaign draft with this block">
                  {{ usingBlockId() === block.id ? 'Opening…' : 'Insert Block' }}
                </button>
                <button class="btn-ghost btn-sm" (click)="openBlockPreview(block, $event)" data-tooltip="Preview this reusable block">Preview</button>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card empty-card" *ngIf="!loading() && reusableBlocks().length === 0">
          <span class="nav-icon empty-icon" [innerHTML]="blocksEmptyIcon"></span>
          <p>No reusable blocks yet. Click <strong>New Block</strong> to create your first one.</p>
          <button class="btn-primary btn-sm" (click)="openCreateBlock()">Create Block</button>
        </div>

        <div class="glass-card block-types-guide">
          <h3 class="btg-title">Available Block Types</h3>
          <div class="btg-grid">
            <div class="btg-item" *ngFor="let bt of blockTypes">
              <span class="nav-icon btg-icon" [innerHTML]="bt.safeIcon"></span>
              <div>
                <div class="btg-name">{{ bt.name }}</div>
                <div class="btg-desc">{{ bt.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="previewBlock()" (click)="closeBlockPreview()">
        <div class="modal-card modal-card-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">{{ previewBlock()!.name }}</h2>
              <span class="template-cat">{{ previewBlock()!.type }}</span>
            </div>
            <button class="modal-close" (click)="closeBlockPreview()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p class="modal-desc">{{ previewBlock()!.description }}</p>
          <div class="modal-preview">
            <div class="email-frame">
              <div class="email-frame-inner" [innerHTML]="previewBlock()!.safeHtml"></div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="insertBlock(previewBlock()!)" [disabled]="usingBlockId() === previewBlock()!.id">
              {{ usingBlockId() === previewBlock()!.id ? 'Opening…' : 'Use in Campaign' }}
            </button>
            <button class="btn-secondary" (click)="closeBlockPreview()">Close</button>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="showCreateBlock()" (click)="showCreateBlock.set(false)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h2 class="modal-title">New Reusable Block</h2>
          <p class="modal-desc">Pick a block type and name it for your library.</p>
          <div class="form-group">
            <label class="form-label">Block type</label>
            <select class="form-input" [(ngModel)]="blockDraft.blockType" (ngModelChange)="onBlockTypeChange($event)">
              <option *ngFor="let bt of blockTypes" [value]="bt.name">{{ bt.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Name</label>
            <input class="form-input" [(ngModel)]="blockDraft.name" placeholder="My Author Bio" />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <input class="form-input" [(ngModel)]="blockDraft.description" placeholder="Short note for your team" />
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="showCreateBlock.set(false)">Cancel</button>
            <button class="btn-primary" (click)="createBlock()" [disabled]="!blockDraft.name.trim() || creatingBlock()">
              {{ creatingBlock() ? 'Creating…' : 'Create Block' }}
            </button>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="previewTemplate()" (click)="closePreview()">
        <div class="modal-card modal-card-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">{{ previewTemplate()!.name }}</h2>
              <span class="template-cat">{{ previewTemplate()!.category }}</span>
            </div>
            <button class="modal-close" (click)="closePreview()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="email-meta" *ngIf="previewTemplate()!.subjectLine">
            <div class="email-meta-row"><span class="email-meta-label">Subject</span><span class="email-meta-value">{{ previewTemplate()!.subjectLine }}</span></div>
          </div>

          <div class="modal-preview" *ngIf="!previewLoading()">
            <div class="email-frame">
              <div class="email-frame-inner" [innerHTML]="previewTemplate()!.safeHtml"></div>
            </div>
          </div>
          <div class="modal-loading" *ngIf="previewLoading()">Loading preview…</div>

          <p class="modal-desc">{{ previewTemplate()!.description }}</p>
          <div class="modal-actions">
            <button class="btn-primary" (click)="useTemplate(previewTemplate()!)" [disabled]="usingId() === previewTemplate()!.id" data-tooltip="Use this template to create a new campaign">
              {{ usingId() === previewTemplate()!.id ? 'Creating campaign…' : 'Use This Template' }}
            </button>
            <button class="btn-secondary" (click)="closePreview()">Close</button>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="previewWebsite()" (click)="closeWebsitePreview()">
        <div class="modal-card modal-card-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">{{ previewWebsite()!.name }}</h2>
              <span class="template-cat">{{ previewWebsite()!.category }}</span>
            </div>
            <button class="modal-close" (click)="closeWebsitePreview()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="email-meta">
            <div class="email-meta-row"><span class="email-meta-label">Headline</span><span class="email-meta-value">{{ previewWebsite()!.headline }}</span></div>
            <div class="email-meta-row"><span class="email-meta-label">Button</span><span class="email-meta-value">{{ previewWebsite()!.buttonText }}</span></div>
          </div>
          <div class="modal-preview">
            <div class="email-frame">
              <div class="email-frame-inner" [innerHTML]="previewWebsite()!.safeHtml"></div>
            </div>
          </div>
          <p class="modal-desc">{{ previewWebsite()!.description }}</p>
          <div class="modal-actions">
            <button class="btn-primary" (click)="useWebsiteTemplate(previewWebsite()!)">Use This Template</button>
            <button class="btn-secondary" (click)="closeWebsitePreview()">Close</button>
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

    .loading-state { text-align:center; padding:3rem; color:#94a3b8; font-size:.875rem; }

    .templates-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
    .template-card { overflow:hidden; cursor:pointer; padding:0; }
    .template-card:hover .template-preview { background:#f1f5f9; }

    .template-preview { background:#f8fafc; border-bottom:1.5px solid #f1f5f9; height:200px; overflow:hidden; position:relative; transition:background .2s; }
    .preview-scale-wrap { position:absolute; inset:0; overflow:hidden; }
    .preview-html { transform:scale(0.42); transform-origin:top left; width:238%; pointer-events:none; }
    .website-preview-html { transform:scale(0.55); transform-origin:top left; width:182%; }

    .template-body { padding:1.125rem; }
    .template-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; gap:.5rem; }
    .template-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .template-cat { font-size:.7rem; font-weight:700; padding:.2rem .55rem; background:rgba(99,102,241,0.08); color:#6366f1; border-radius:6px; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; }
    .template-subject { font-size:.75rem; color:#475569; margin:0 0 .35rem; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .template-desc { font-size:.8rem; color:#94a3b8; margin:0 0 1rem; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .template-actions { display:flex; gap:.5rem; }

    .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem; animation:fadeIn .2s; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .modal-card { background:#ffffff; border:1.5px solid #e2e8f0; border-radius:20px; padding:2rem; max-width:480px; width:100%; box-shadow:0 24px 64px rgba(0,0,0,0.15); animation:slideUp .25s ease-out; max-height:90vh; overflow-y:auto; }
    .modal-card-lg { max-width:640px; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .modal-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1rem; }
    .modal-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .375rem; }
    .modal-close { background:#f1f5f9; border:none; border-radius:8px; cursor:pointer; color:#64748b; padding:.375rem; display:flex; transition:all .2s; flex-shrink:0; }
    .modal-close:hover { background:#e2e8f0; color:#0f172a; }

    .email-meta { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:.75rem 1rem; margin-bottom:1rem; }
    .email-meta-row { display:flex; gap:.75rem; font-size:.8125rem; margin-bottom:.35rem; }
    .email-meta-row:last-child { margin-bottom:0; }
    .email-meta-label { font-weight:600; color:#64748b; min-width:58px; flex-shrink:0; }
    .email-meta-value { color:#0f172a; }
    .email-meta-value.muted { color:#64748b; }

    .modal-preview { margin-bottom:1.25rem; }
    .email-frame { background:#e2e8f0; border-radius:12px; padding:12px; max-height:420px; overflow-y:auto; }
    .email-frame-inner { background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    .modal-loading { text-align:center; padding:2rem; color:#94a3b8; font-size:.875rem; }
    .modal-desc { font-size:.875rem; color:#64748b; margin:0 0 1.5rem; line-height:1.5; }
    .modal-actions { display:flex; gap:.75rem; flex-wrap:wrap; }

    @media(max-width:1200px) { .templates-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:900px) { .templates-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .templates-grid { grid-template-columns:1fr; } }

    .tabs { display:flex; gap:.25rem; margin-bottom:1.5rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; }
    .tab:hover { color:#0f172a; }
    .tab.active { background:#ffffff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }

    .blocks-explainer { display:flex; align-items:flex-start; gap:1rem; padding:1.25rem 1.5rem; margin-bottom:1.5rem; background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(59,130,246,0.06)); border:1.5px solid rgba(99,102,241,0.15); }
    .be-icon { width:40px; height:40px; border-radius:10px; background:rgba(99,102,241,0.1); display:flex; align-items:center; justify-content:center; color:#6366f1; flex-shrink:0; }
    .be-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .be-desc { font-size:.8125rem; color:#64748b; margin:0; line-height:1.6; }
    .blocks-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.5rem; }
    .block-card { overflow:hidden; padding:0; cursor:pointer; }
    .block-preview { background:#f8fafc; border-bottom:1.5px solid #f1f5f9; height:140px; overflow:hidden; position:relative; }
    .block-scale .preview-html { transform:scale(0.38); transform-origin:top left; width:263%; }
    .form-group { margin-bottom:1rem; }
    .form-label { display:block; font-size:.8125rem; font-weight:600; color:#334155; margin-bottom:.35rem; }
    .form-input { width:100%; padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.875rem; font-family:inherit; box-sizing:border-box; }
    .nav-icon { display:flex; align-items:center; justify-content:center; color:#64748b; }
    .nav-icon svg { width:28px; height:28px; }
    .empty-card { padding:2rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:.5rem; margin-bottom:1.5rem; }
    .empty-card p { margin:0; color:#94a3b8; font-size:.875rem; }
    .empty-icon { color:#cbd5e1; }
    .block-body { padding:1.125rem; }
    .block-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; }
    .block-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .block-type-badge { font-size:.7rem; font-weight:700; padding:.2rem .55rem; background:rgba(99,102,241,0.08); color:#6366f1; border-radius:6px; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; }
    .block-desc { font-size:.8rem; color:#94a3b8; margin:0 0 .5rem; line-height:1.5; }
    .block-meta { font-size:.75rem; color:#cbd5e1; margin-bottom:.875rem; }
    .block-actions { display:flex; gap:.5rem; align-items:center; }
    .block-types-guide { padding:1.5rem; }
    .btg-title { font-size:.875rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .btg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
    .btg-item { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#f8fafc; border-radius:10px; }
    .btg-icon { width:32px; height:32px; border-radius:8px; background:#f8fafc; border:1.5px solid #f1f5f9; flex-shrink:0; }
    .btg-name { font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .btg-desc { font-size:.75rem; color:#94a3b8; line-height:1.4; }
    @media(max-width:900px) { .blocks-grid { grid-template-columns:repeat(2,1fr); } .btg-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .blocks-grid { grid-template-columns:1fr; } .btg-grid { grid-template-columns:1fr; } }
  `]
})
export class TemplatesComponent implements OnInit {
  private contentApi = inject(ContentApiService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  templates = signal<TemplateView[]>([]);
  loading = signal(true);
  usingId = signal<string | null>(null);
  previewLoading = signal(false);
  activeTab = signal<TemplatesTab>('templates');
  activeCategory = signal('');
  searchQuery = '';
  previewTemplate = signal<TemplateView | null>(null);
  categories = signal<string[]>([]);
  websiteTemplates = signal<WebsiteTemplateView[]>([]);
  websiteCategory = signal('');
  websiteSearchQuery = '';
  previewWebsite = signal<WebsiteTemplateView | null>(null);
  reusableBlocks = signal<BlockView[]>([]);
  blocksEmptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['blocks']);
  previewBlock = signal<BlockView | null>(null);
  showCreateBlock = signal(false);
  creatingBlock = signal(false);
  usingBlockId = signal<string | null>(null);
  blockDraft = { name: '', blockType: 'Book Card', description: '', iconKey: 'book' };

  blockTypes = [
    { name: 'Book Card', description: 'Cover, title, tagline, and buy button for a single title', iconKey: 'book' },
    { name: 'Series Reading Order', description: 'Numbered book list with covers for series readers', iconKey: 'blocks' },
    { name: 'Pull Quote', description: 'Styled reader review or excerpt with accent border', iconKey: 'star' },
    { name: 'CTA Button', description: 'Centered call-to-action button with custom label and URL', iconKey: 'link' },
    { name: 'Author Bio', description: 'Headshot, short bio, and social links', iconKey: 'users' },
    { name: 'Social Follow Row', description: 'Follow icons for Instagram, Facebook, Goodreads, and more', iconKey: 'globe' },
  ].map(bt => ({
    ...bt,
    safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[bt.iconKey]),
  }));

  ngOnInit() {
    this.loadContent();
  }

  onHeaderAction() {
    if (this.activeTab() === 'blocks') {
      this.openCreateBlock();
      return;
    }
    this.router.navigate(['/campaigns'], { queryParams: { create: '1' } });
  }

  openCreateBlock() {
    this.blockDraft = { name: '', blockType: 'Book Card', description: '', iconKey: 'book' };
    this.onBlockTypeChange('Book Card');
    this.showCreateBlock.set(true);
  }

  onBlockTypeChange(type: string) {
    const match = this.blockTypes.find(bt => bt.name === type);
    this.blockDraft.blockType = type;
    this.blockDraft.iconKey = match?.iconKey ?? 'book';
    if (!this.blockDraft.description.trim() && match) {
      this.blockDraft.description = match.description;
    }
    if (!this.blockDraft.name.trim()) {
      this.blockDraft.name = type;
    }
  }

  createBlock() {
    if (!this.blockDraft.name.trim() || this.creatingBlock()) return;
    this.creatingBlock.set(true);
    this.contentApi.createBlock({
      name: this.blockDraft.name.trim(),
      blockType: this.blockDraft.blockType,
      description: this.blockDraft.description.trim(),
      iconKey: this.blockDraft.iconKey,
    }).subscribe({
      next: () => {
        this.creatingBlock.set(false);
        this.showCreateBlock.set(false);
        this.loadContent();
      },
      error: () => this.creatingBlock.set(false),
    });
  }

  openBlockPreview(block: BlockView, event?: Event) {
    event?.stopPropagation();
    this.previewBlock.set(block);
  }

  closeBlockPreview() {
    this.previewBlock.set(null);
  }

  insertBlock(block: BlockView, event?: Event) {
    event?.stopPropagation();
    if (this.usingBlockId()) return;
    this.usingBlockId.set(block.id);
    this.contentApi.useBlock(block.id).subscribe({
      next: campaign => {
        this.usingBlockId.set(null);
        this.closeBlockPreview();
        this.router.navigate(['/campaigns'], { queryParams: { edit: campaign.id } });
      },
      error: () => this.usingBlockId.set(null),
    });
  }

  private loadContent() {
    this.loading.set(true);
    this.contentApi.getContent().subscribe({
      next: bundle => {
        this.templates.set(bundle.templates.map(t => this.toTemplateView(t)));
        this.categories.set([...new Set(bundle.templates.map(t => t.category))]);
        this.websiteTemplates.set((bundle.websiteTemplates ?? []).map(t => this.toWebsiteTemplateView(t)));
        this.reusableBlocks.set(bundle.blocks.map(b => this.toBlockView(b)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private toBlockView(b: ContentBlock): BlockView {
    const html = b.htmlBody || '';
    return {
      ...b,
      htmlBody: html,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[b.iconKey] ?? NAV_ICONS['blocks']),
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(
        html || '<p style="padding:16px;color:#94a3b8;font-family:sans-serif;">Preview unavailable</p>'
      ),
    };
  }

  get filteredWebsiteTemplates() {
    return this.websiteTemplates().filter(t => {
      const matchCat = !this.websiteCategory() || t.category === this.websiteCategory();
      const q = this.websiteSearchQuery.toLowerCase();
      const matchQ = !q
        || t.name.toLowerCase().includes(q)
        || t.description.toLowerCase().includes(q)
        || t.headline.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }

  get filteredTemplates() {
    return this.templates().filter(t => {
      const matchCat = !this.activeCategory() || t.category === this.activeCategory();
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q
        || t.name.toLowerCase().includes(q)
        || t.description.toLowerCase().includes(q)
        || t.subjectLine.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }

  openPreview(t: TemplateView) {
    this.previewTemplate.set(t);
    if (t.htmlBody) return;

    this.previewLoading.set(true);
    this.contentApi.getTemplate(t.id).subscribe({
      next: full => {
        const view = this.toTemplateView(full);
        this.previewTemplate.set(view);
        this.templates.update(list => list.map(item => item.id === view.id ? view : item));
        this.previewLoading.set(false);
      },
      error: () => this.previewLoading.set(false),
    });
  }

  closePreview() {
    this.previewTemplate.set(null);
    this.previewLoading.set(false);
  }

  useWebsiteTemplate(t: WebsiteTemplateView, event?: Event) {
    event?.stopPropagation();
    this.closeWebsitePreview();
    if (t.templateKind === 'signup-form') {
      this.router.navigate(['/website/sign-up-forms'], { queryParams: { template: t.id } });
      return;
    }
    this.router.navigate(['/website/landing-pages'], { queryParams: { template: t.id } });
  }

  openWebsitePreview(t: WebsiteTemplateView) {
    this.previewWebsite.set(t);
  }

  closeWebsitePreview() {
    this.previewWebsite.set(null);
  }

  private toWebsiteTemplateView(t: WebsiteTemplate): WebsiteTemplateView {
    return {
      ...t,
      htmlBody: t.htmlBody ?? '',
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(t.htmlBody || '<p style="padding:24px;color:#94a3b8;">Preview unavailable</p>'),
    };
  }

  useTemplate(t: TemplateView, event?: Event) {
    event?.stopPropagation();
    if (this.usingId()) return;

    this.usingId.set(t.id);
    this.contentApi.useTemplate(t.id).subscribe({
      next: campaign => {
        this.usingId.set(null);
        this.closePreview();
        this.router.navigate(['/campaigns'], { queryParams: { edit: campaign.id } });
      },
      error: () => this.usingId.set(null),
    });
  }

  private toTemplateView(t: EmailTemplate): TemplateView {
    return {
      ...t,
      subjectLine: t.subjectLine ?? '',
      previewText: '',
      htmlBody: t.htmlBody ?? '',
      iconKey: t.iconKey ?? 'mail',
      suggestedCampaignType: t.suggestedCampaignType ?? 'newsletter',
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(t.htmlBody || '<p style="padding:24px;color:#94a3b8;font-family:sans-serif;">Preview loading…</p>'),
    };
  }
}
