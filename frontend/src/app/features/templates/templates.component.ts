import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Template } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Templates</h1>
          <p class="page-subtitle">Ready-to-use email templates for every occasion</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a custom email template from scratch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Template
        </button>
      </div>

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
  `]
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  activeCategory = signal('');
  searchQuery = '';
  previewTemplate = signal<Template | null>(null);
  categories: string[] = [];

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
}
