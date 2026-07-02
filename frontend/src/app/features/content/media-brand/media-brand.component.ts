import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentApiService, BrandColor, BrandAsset } from '../../../core/services/content-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';
import { ASSET_CATEGORIES } from '../../../core/constants/block-types';

interface AssetView extends BrandAsset {
  safeIcon: SafeHtml;
  imageUrl: string | null;
  isImage: boolean;
}

@Component({
  selector: 'app-media-brand',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Media & Brand</h1>
          <p class="page-subtitle">Manage your brand assets, images, and files used in emails</p>
        </div>
        <button class="btn-primary" (click)="openAddMedia()" data-tooltip="Add a new brand asset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Media
        </button>
      </div>

      <div class="glass-card brand-section">
        <h2 class="bs-title">Brand Colors</h2>
        <p class="bs-sub">Define your brand palette to automatically style emails</p>
        <div class="color-swatches">
          <div class="swatch" *ngFor="let c of brandColors()">
            <div class="swatch-color" [style.background]="c.value"></div>
            <span class="swatch-label">{{ c.label }}</span>
            <span class="swatch-hex">{{ c.value }}</span>
          </div>
        </div>
      </div>

      <div class="glass-card brand-section">
        <div class="section-header">
          <h2 class="bs-title">Asset Library</h2>
          <span class="count-badge">{{ assets().length }} files</span>
        </div>
        <div class="assets-grid" *ngIf="assets().length > 0">
          <div class="asset-card" *ngFor="let a of assets()">
            <div class="asset-preview">
              <img *ngIf="a.isImage && a.imageUrl" [src]="a.imageUrl" [alt]="a.name" class="asset-img" />
              <span class="nav-icon" *ngIf="!a.isImage || !a.imageUrl" [innerHTML]="a.safeIcon"></span>
            </div>
            <div class="asset-info">
              <span class="asset-name">{{ a.name }}</span>
              <span class="asset-size">{{ a.size }}</span>
            </div>
            <button class="asset-delete" (click)="deleteAsset(a, $event)" title="Remove asset">&times;</button>
          </div>
        </div>
        <div class="empty-assets" *ngIf="assets().length === 0">
          <span class="nav-icon" [innerHTML]="emptyIcon"></span>
          <p>No assets uploaded yet. Click <strong>Add Media</strong> to upload from your computer.</p>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showAddMedia" (click)="closeAddMedia()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h3 class="modal-title">Add Media</h3>
        <p class="modal-sub">Upload an image or file from your computer and fill in the required details.</p>

        <div class="setup-field">
          <label>Name <span class="req">*</span></label>
          <input class="text-input" [(ngModel)]="mediaDraft.name" placeholder="Author headshot" />
        </div>
        <div class="setup-field">
          <label>Category <span class="req">*</span></label>
          <select class="text-input" [(ngModel)]="mediaDraft.category">
            <option *ngFor="let c of assetCategories" [value]="c">{{ c }}</option>
          </select>
        </div>
        <div class="setup-field">
          <label>File <span class="req">*</span></label>
          <div class="upload-row">
            <input type="file" #fileInput accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,image/*" (change)="onFileSelected($event)" />
            <button type="button" class="btn-secondary btn-sm" (click)="fileInput.click()">Choose File</button>
            <span class="file-name">{{ selectedFile?.name || 'No file chosen' }}</span>
          </div>
        </div>
        <p class="form-error" *ngIf="uploadError">{{ uploadError }}</p>

        <div class="modal-actions">
          <button class="btn-secondary" (click)="closeAddMedia()" [disabled]="uploading">Cancel</button>
          <button class="btn-primary" (click)="uploadMedia()" [disabled]="!canUpload() || uploading">
            {{ uploading ? 'Uploading…' : 'Upload' }}
          </button>
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
    .asset-card { border:1.5px solid #f1f5f9; border-radius:12px; overflow:hidden; position:relative; }
    .asset-preview { height:90px; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden; }
    .asset-img { max-width:100%; max-height:100%; object-fit:contain; }
    .nav-icon svg { width:24px; height:24px; color:#64748b; }
    .asset-info { padding:.75rem; display:flex; flex-direction:column; gap:.15rem; }
    .asset-name { font-size:.78rem; font-weight:600; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .asset-size { font-size:.65rem; color:#94a3b8; }
    .asset-delete { position:absolute; top:6px; right:6px; width:22px; height:22px; border:none; border-radius:50%; background:rgba(15,23,42,0.55); color:#fff; cursor:pointer; font-size:14px; line-height:1; opacity:0; transition:opacity .2s; }
    .asset-card:hover .asset-delete { opacity:1; }
    .empty-assets { text-align:center; padding:2rem; color:#94a3b8; display:flex; flex-direction:column; align-items:center; gap:.5rem; }
    .empty-assets p { margin:0; font-size:.875rem; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { background:#fff; border-radius:16px; padding:1.5rem; width:100%; max-width:440px; display:flex; flex-direction:column; gap:1rem; }
    .modal-title { margin:0; font-size:1rem; font-weight:700; }
    .modal-sub { margin:0; font-size:.8125rem; color:#64748b; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .req { color:#ef4444; }
    .text-input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-family:inherit; }
    .upload-row { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; }
    .upload-row input[type=file] { display:none; }
    .file-name { font-size:.8125rem; color:#64748b; }
    .form-error { margin:0; font-size:.8125rem; color:#ef4444; }
    .modal-actions { display:flex; justify-content:flex-end; gap:.75rem; }
    @media(max-width:1100px) { .assets-grid { grid-template-columns:repeat(4,1fr); } }
    @media(max-width:800px) { .assets-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:500px) { .assets-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class MediaBrandComponent implements OnInit {
  private contentApi = inject(ContentApiService);
  private sanitizer = inject(DomSanitizer);

  brandColors = signal<BrandColor[]>([]);
  assets = signal<AssetView[]>([]);
  emptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['image']);
  assetCategories = ASSET_CATEGORIES;

  showAddMedia = false;
  uploading = false;
  uploadError = '';
  selectedFile: File | null = null;
  mediaDraft = { name: '', category: ASSET_CATEGORIES[0] };

  ngOnInit() {
    this.load();
  }

  load() {
    this.contentApi.getContent().subscribe(bundle => {
      this.brandColors.set(bundle.brandColors);
      this.assets.set(bundle.assets.map(a => this.toAssetView(a)));
    });
  }

  openAddMedia() {
    this.mediaDraft = { name: '', category: ASSET_CATEGORIES[0] };
    this.selectedFile = null;
    this.uploadError = '';
    this.showAddMedia = true;
  }

  closeAddMedia() {
    if (this.uploading) return;
    this.showAddMedia = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    if (this.selectedFile && !this.mediaDraft.name.trim()) {
      this.mediaDraft.name = this.selectedFile.name.replace(/\.[^.]+$/, '');
    }
  }

  canUpload() {
    return !!this.mediaDraft.name.trim() && !!this.selectedFile;
  }

  uploadMedia() {
    if (!this.canUpload() || !this.selectedFile || this.uploading) return;
    this.uploading = true;
    this.uploadError = '';
    this.contentApi.uploadAsset(this.selectedFile, this.mediaDraft.name.trim(), this.mediaDraft.category).subscribe({
      next: () => {
        this.uploading = false;
        this.showAddMedia = false;
        this.load();
      },
      error: err => {
        this.uploading = false;
        this.uploadError = err?.message ?? 'Upload failed. Please try again.';
      },
    });
  }

  deleteAsset(asset: AssetView, event: Event) {
    event.stopPropagation();
    if (!confirm(`Remove "${asset.name}" from your library?`)) return;
    this.contentApi.deleteAsset(asset.id).subscribe(() => this.load());
  }

  private toAssetView(a: BrandAsset): AssetView {
    const url = this.contentApi.assetFullUrl(a);
    const isImage = !!(a.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(a.url ?? ''));
    return {
      ...a,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[a.iconKey] ?? NAV_ICONS['image']),
      imageUrl: url,
      isImage,
    };
  }
}
