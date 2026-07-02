import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentApiService, ContentBlock } from '../../../core/services/content-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';
import { BLOCK_TYPES } from '../../../core/constants/block-types';

interface BlockView extends ContentBlock {
  safeIcon: SafeHtml;
  safeHtml: SafeHtml;
}

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
        <button class="btn-primary" (click)="openCreateModal()" data-tooltip="Create a new reusable content block">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Block
        </button>
      </div>

      <div class="filter-bar glass-card">
        <span class="filter-label">Available Block Types</span>
        <button class="filter-btn" [class.active]="typeFilter() === ''" (click)="typeFilter.set('')">All</button>
        <button class="filter-btn" *ngFor="let bt of blockTypes" [class.active]="typeFilter() === bt.name" (click)="typeFilter.set(bt.name)">{{ bt.name }}</button>
      </div>

      <div class="blocks-grid" *ngIf="filteredBlocks().length > 0">
        <div class="glass-card block-card" *ngFor="let block of filteredBlocks()">
          <div class="block-preview" (click)="openPreview(block)">
            <div class="preview-scale-wrap">
              <div class="preview-html" [innerHTML]="block.safeHtml"></div>
            </div>
          </div>
          <div class="block-body">
            <h3 class="block-name">{{ block.name }}</h3>
            <p class="block-desc">{{ block.description }}</p>
            <div class="block-meta">
              <span class="block-type">{{ block.type }}</span>
              <span class="block-used">Used in {{ block.usedIn }} templates</span>
            </div>
            <div class="block-actions">
              <button class="btn-ghost btn-sm" (click)="openPreview(block)">Preview</button>
              <button class="btn-ghost btn-sm" (click)="openEditModal(block)">Edit</button>
              <button class="btn-ghost btn-sm danger" (click)="deleteBlock(block)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card empty-card" *ngIf="filteredBlocks().length === 0">
        <span class="nav-icon empty-icon" [innerHTML]="emptyIcon"></span>
        <p *ngIf="blocks().length === 0">No content blocks yet. Create reusable blocks for book cards, bios, and CTAs.</p>
        <p *ngIf="blocks().length > 0">No blocks match this type filter.</p>
      </div>

      <!-- Create modal -->
      <div class="modal-backdrop" *ngIf="showCreate" (click)="showCreate = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3 class="modal-title">Create Content Block</h3>
          <div class="setup-field">
            <label>Name <span class="req">*</span></label>
            <input class="text-input" [(ngModel)]="draft.name" placeholder="Author Bio & Photo" />
          </div>
          <div class="setup-field">
            <label>Type <span class="req">*</span></label>
            <select class="text-input" [(ngModel)]="draft.blockType" (ngModelChange)="onBlockTypeChange($event)">
              <option *ngFor="let bt of blockTypes" [value]="bt.name">{{ bt.name }}</option>
            </select>
          </div>
          <div class="setup-field">
            <label>Description</label>
            <input class="text-input" [(ngModel)]="draft.description" placeholder="Your author bio and headshot" />
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="showCreate = false">Cancel</button>
            <button class="btn-primary" (click)="createBlock()" [disabled]="!draft.name.trim() || saving">Create</button>
          </div>
        </div>
      </div>

      <!-- Edit modal -->
      <div class="modal-backdrop" *ngIf="editBlock()" (click)="editBlock.set(null)">
        <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
          <h3 class="modal-title">Edit Content Block</h3>
          <div class="setup-field">
            <label>Name <span class="req">*</span></label>
            <input class="text-input" [(ngModel)]="editDraft.name" />
          </div>
          <div class="setup-field">
            <label>Type <span class="req">*</span></label>
            <select class="text-input" [(ngModel)]="editDraft.blockType" (ngModelChange)="onEditTypeChange($event)">
              <option *ngFor="let bt of blockTypes" [value]="bt.name">{{ bt.name }}</option>
            </select>
          </div>
          <div class="setup-field">
            <label>Description</label>
            <input class="text-input" [(ngModel)]="editDraft.description" />
          </div>
          <div class="setup-field">
            <label>HTML body</label>
            <textarea class="text-input html-area" rows="8" [(ngModel)]="editDraft.htmlBody"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="editBlock.set(null)">Cancel</button>
            <button class="btn-primary" (click)="saveEdit()" [disabled]="!editDraft.name.trim() || saving">Save</button>
          </div>
        </div>
      </div>

      <!-- Preview modal -->
      <div class="modal-backdrop" *ngIf="previewBlock()" (click)="previewBlock.set(null)">
        <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
          <div class="preview-header">
            <div>
              <h3 class="modal-title">{{ previewBlock()!.name }}</h3>
              <span class="block-type">{{ previewBlock()!.type }}</span>
            </div>
            <button class="modal-close" (click)="previewBlock.set(null)">&times;</button>
          </div>
          <p class="block-desc">{{ previewBlock()!.description }}</p>
          <div class="preview-frame">
            <div [innerHTML]="previewBlock()!.safeHtml"></div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="openEditModal(previewBlock()!); previewBlock.set(null)">Edit</button>
            <button class="btn-primary" (click)="previewBlock.set(null)">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar { display:flex; align-items:center; gap:.5rem; margin-bottom:1.25rem; padding:1rem 1.25rem; flex-wrap:wrap; }
    .filter-label { font-size:.8125rem; font-weight:700; color:#0f172a; margin-right:.5rem; }
    .filter-btn { padding:.45rem .875rem; border-radius:8px; border:1.5px solid #e2e8f0; background:white; color:#64748b; font-size:.78rem; font-weight:500; font-family:inherit; cursor:pointer; }
    .filter-btn.active { background:#eff6ff; border-color:#93c5fd; color:#3b82f6; font-weight:600; }
    .blocks-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .block-card { overflow:hidden; padding:0; }
    .block-preview { height:120px; display:flex; align-items:center; justify-content:center; border-bottom:1.5px solid #f1f5f9; background:#f8fafc; cursor:pointer; overflow:hidden; position:relative; }
    .preview-scale-wrap { position:absolute; inset:0; overflow:hidden; }
    .preview-html { transform:scale(0.38); transform-origin:top left; width:263%; pointer-events:none; }
    .block-body { padding:1.25rem; }
    .block-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .block-desc { font-size:.8rem; color:#94a3b8; margin:0 0 .875rem; line-height:1.5; }
    .block-meta { display:flex; align-items:center; gap:.75rem; margin-bottom:.875rem; }
    .block-type { padding:.2rem .55rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .block-used { font-size:.72rem; color:#94a3b8; }
    .block-actions { display:flex; gap:.5rem; flex-wrap:wrap; }
    .danger { color:#ef4444 !important; }
    .empty-card { padding:2.5rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:.75rem; }
    .empty-card p { margin:0; color:#94a3b8; font-size:.875rem; }
    .empty-icon { color:#cbd5e1; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; }
    .modal-card { background:#fff; border-radius:16px; padding:1.5rem; width:100%; max-width:420px; display:flex; flex-direction:column; gap:1rem; max-height:90vh; overflow-y:auto; }
    .modal-lg { max-width:640px; }
    .modal-title { margin:0; font-size:1rem; font-weight:700; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .req { color:#ef4444; }
    .text-input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-family:inherit; }
    .html-area { font-family:monospace; font-size:.78rem; resize:vertical; }
    .modal-actions { display:flex; justify-content:flex-end; gap:.75rem; }
    .preview-header { display:flex; justify-content:space-between; align-items:flex-start; }
    .modal-close { background:#f1f5f9; border:none; border-radius:8px; width:32px; height:32px; cursor:pointer; font-size:1.25rem; color:#64748b; }
    .preview-frame { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px; max-height:420px; overflow:auto; }
    @media(max-width:1100px) { .blocks-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .blocks-grid { grid-template-columns:1fr; } }
  `]
})
export class UniversalContentComponent implements OnInit {
  private contentApi = inject(ContentApiService);
  private sanitizer = inject(DomSanitizer);

  blocks = signal<BlockView[]>([]);
  typeFilter = signal('');
  showCreate = false;
  saving = false;
  previewBlock = signal<BlockView | null>(null);
  editBlock = signal<BlockView | null>(null);
  draft = { name: '', blockType: BLOCK_TYPES[0].name, description: '', iconKey: BLOCK_TYPES[0].iconKey };
  editDraft = { name: '', blockType: '', description: '', iconKey: 'book', htmlBody: '' };
  blockTypes = BLOCK_TYPES;
  emptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['blocks']);

  ngOnInit() {
    this.loadBlocks();
  }

  filteredBlocks() {
    const filter = this.typeFilter();
    const all = this.blocks();
    return filter ? all.filter(b => b.type === filter) : all;
  }

  loadBlocks() {
    this.contentApi.getContent().subscribe(bundle => {
      this.blocks.set(bundle.blocks.map(b => this.toBlockView(b)));
    });
  }

  openCreateModal() {
    this.draft = { name: '', blockType: BLOCK_TYPES[0].name, description: BLOCK_TYPES[0].description, iconKey: BLOCK_TYPES[0].iconKey };
    this.showCreate = true;
  }

  onBlockTypeChange(type: string) {
    const match = BLOCK_TYPES.find(bt => bt.name === type);
    this.draft.blockType = type;
    this.draft.iconKey = match?.iconKey ?? 'book';
    if (match && !this.draft.description.trim()) this.draft.description = match.description;
  }

  onEditTypeChange(type: string) {
    const match = BLOCK_TYPES.find(bt => bt.name === type);
    this.editDraft.blockType = type;
    this.editDraft.iconKey = match?.iconKey ?? 'book';
  }

  createBlock() {
    if (!this.draft.name.trim() || this.saving) return;
    this.saving = true;
    this.contentApi.createBlock({
      name: this.draft.name.trim(),
      blockType: this.draft.blockType,
      description: this.draft.description.trim(),
      iconKey: this.draft.iconKey,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.showCreate = false;
        this.loadBlocks();
      },
      error: () => this.saving = false,
    });
  }

  openPreview(block: BlockView) {
    this.previewBlock.set(block);
  }

  openEditModal(block: BlockView) {
    this.editBlock.set(block);
    this.editDraft = {
      name: block.name,
      blockType: block.type,
      description: block.description,
      iconKey: block.iconKey,
      htmlBody: block.htmlBody,
    };
  }

  saveEdit() {
    const block = this.editBlock();
    if (!block || !this.editDraft.name.trim() || this.saving) return;
    this.saving = true;
    this.contentApi.updateBlock(block.id, {
      name: this.editDraft.name.trim(),
      blockType: this.editDraft.blockType,
      description: this.editDraft.description.trim(),
      iconKey: this.editDraft.iconKey,
      htmlBody: this.editDraft.htmlBody,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.editBlock.set(null);
        this.loadBlocks();
      },
      error: () => this.saving = false,
    });
  }

  deleteBlock(block: BlockView) {
    if (!confirm(`Delete "${block.name}"? This cannot be undone.`)) return;
    this.contentApi.deleteBlock(block.id).subscribe(() => this.loadBlocks());
  }

  private toBlockView(b: ContentBlock): BlockView {
    const html = b.htmlBody || '';
    return {
      ...b,
      htmlBody: html,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[b.iconKey] ?? NAV_ICONS['book']),
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(
        html || '<p style="padding:16px;color:#94a3b8;font-family:sans-serif;">Preview unavailable</p>'
      ),
    };
  }
}
