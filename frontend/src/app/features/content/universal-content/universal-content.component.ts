import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentApiService, ContentBlock } from '../../../core/services/content-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';

interface BlockView extends ContentBlock {
  safeIcon: SafeHtml;
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
        <button class="btn-primary" (click)="openCreate = true" data-tooltip="Create a new reusable content block">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Block
        </button>
      </div>

      <div class="blocks-grid" *ngIf="blocks().length > 0">
        <div class="glass-card block-card" *ngFor="let block of blocks()">
          <div class="block-preview">
            <span class="nav-icon" [innerHTML]="block.safeIcon"></span>
          </div>
          <div class="block-body">
            <h3 class="block-name">{{ block.name }}</h3>
            <p class="block-desc">{{ block.description }}</p>
            <div class="block-meta">
              <span class="block-type">{{ block.type }}</span>
              <span class="block-used">Used in {{ block.usedIn }} templates</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card empty-card" *ngIf="blocks().length === 0">
        <span class="nav-icon empty-icon" [innerHTML]="emptyIcon"></span>
        <p>No content blocks yet. Create reusable blocks for book cards, bios, and CTAs.</p>
      </div>

      <div class="modal-backdrop" *ngIf="openCreate" (click)="openCreate = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3 class="modal-title">Create Content Block</h3>
          <div class="setup-field">
            <label>Name</label>
            <input class="text-input" [(ngModel)]="draft.name" placeholder="Author Bio & Photo">
          </div>
          <div class="setup-field">
            <label>Type</label>
            <input class="text-input" [(ngModel)]="draft.blockType" placeholder="Bio Block">
          </div>
          <div class="setup-field">
            <label>Description</label>
            <input class="text-input" [(ngModel)]="draft.description" placeholder="Your author bio and headshot">
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="openCreate = false">Cancel</button>
            <button class="btn-primary" (click)="createBlock()" [disabled]="!draft.name">Create</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blocks-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .block-card { overflow:hidden; padding:0; }
    .block-preview { height:100px; display:flex; align-items:center; justify-content:center; border-bottom:1.5px solid #f1f5f9; background:#f8fafc; }
    .nav-icon { display:flex; align-items:center; justify-content:center; color:#64748b; }
    .nav-icon svg { width:28px; height:28px; }
    .block-body { padding:1.25rem; }
    .block-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .block-desc { font-size:.8rem; color:#94a3b8; margin:0 0 .875rem; line-height:1.5; }
    .block-meta { display:flex; align-items:center; gap:.75rem; }
    .block-type { padding:.2rem .55rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .block-used { font-size:.72rem; color:#94a3b8; }
    .empty-card { padding:2.5rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:.75rem; }
    .empty-card p { margin:0; color:#94a3b8; font-size:.875rem; }
    .empty-icon { color:#cbd5e1; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { background:#fff; border-radius:16px; padding:1.5rem; width:100%; max-width:420px; display:flex; flex-direction:column; gap:1rem; }
    .modal-title { margin:0; font-size:1rem; font-weight:700; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .text-input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-family:inherit; }
    .modal-actions { display:flex; justify-content:flex-end; gap:.75rem; }
    @media(max-width:1100px) { .blocks-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .blocks-grid { grid-template-columns:1fr; } }
  `]
})
export class UniversalContentComponent implements OnInit {
  private contentApi = inject(ContentApiService);
  private sanitizer = inject(DomSanitizer);

  blocks = signal<BlockView[]>([]);
  openCreate = false;
  draft = { name: '', blockType: 'Book Card', description: '' };
  emptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['blocks']);

  ngOnInit() {
    this.contentApi.getContent().subscribe(bundle => {
      this.blocks.set(bundle.blocks.map(b => ({
        ...b,
        safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[b.iconKey] ?? NAV_ICONS['book']),
      })));
    });
  }

  createBlock() {
    this.contentApi.createBlock({
      name: this.draft.name,
      blockType: this.draft.blockType,
      description: this.draft.description,
      iconKey: 'book',
    }).subscribe(() => {
      this.contentApi.getContent().subscribe(bundle => {
        this.blocks.set(bundle.blocks.map(b => ({
          ...b,
          safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[b.iconKey] ?? NAV_ICONS['book']),
        })));
      });
      this.openCreate = false;
      this.draft = { name: '', blockType: 'Book Card', description: '' };
    });
  }
}
