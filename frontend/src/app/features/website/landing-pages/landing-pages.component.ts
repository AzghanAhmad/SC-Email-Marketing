import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteApiService, LandingPageItem } from '../../../core/services/website-api.service';
import { ContentApiService } from '../../../core/services/content-api.service';
import { LANDING_PAGE_ICONS, NAV_ICONS } from '../../../core/constants/nav-icons';
import { formatPublicUrlForDisplay, landingPagePublicUrl } from '../../../core/utils/public-site-url';

interface PageView extends LandingPageItem {
  safeIcon: SafeHtml;
}

const THEME_PRESETS = [
  { label: 'Midnight Blue', value: 'linear-gradient(135deg,#1e3a5f,#2d5a87)' },
  { label: 'Purple Dusk', value: 'linear-gradient(135deg,#4c1d95,#6d28d9)' },
  { label: 'Forest Green', value: 'linear-gradient(135deg,#065f46,#059669)' },
  { label: 'Amber Sunset', value: 'linear-gradient(135deg,#92400e,#d97706)' },
  { label: 'Crimson Tide', value: 'linear-gradient(135deg,#991b1b,#dc2626)' },
  { label: 'Sky Ocean', value: 'linear-gradient(135deg,#1e40af,#3b82f6)' },
];

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
        <button class="btn-primary" data-tooltip="Create a new landing page" (click)="openCreatePageModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Page
        </button>
      </div>

      <div class="filter-bar">
        <button class="filter-btn" [class.active]="activeFilter === ''" (click)="activeFilter=''">All</button>
        <button class="filter-btn" [class.active]="activeFilter === 'published'" (click)="activeFilter='published'">Published</button>
        <button class="filter-btn" [class.active]="activeFilter === 'draft'" (click)="activeFilter='draft'">Draft</button>
        <div class="search-wrap" style="margin-left:auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" placeholder="Search pages..." [(ngModel)]="searchQuery" />
        </div>
      </div>

      <div class="pages-grid" *ngIf="filteredPages.length > 0">
        <div class="glass-card page-card" *ngFor="let page of filteredPages">
          <div class="page-preview" [style.background]="page.themeGradient">
            <div class="page-preview-inner">
              <span class="nav-icon preview-icon" [innerHTML]="page.safeIcon"></span>
              <div class="pp-lines">
                <div class="ppl" style="width:80%"></div>
                <div class="ppl" style="width:60%"></div>
                <div class="ppl cta-line"></div>
              </div>
            </div>
          </div>
          <div class="page-body">
            <div class="page-header-row">
              <h3 class="pg-name">{{ page.name }}</h3>
              <div class="header-actions">
                <span class="badge" [ngClass]="'badge-' + page.status">{{ page.status }}</span>
                <div class="menu-wrap">
                  <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options" (click)="toggleMenu(page.id, $event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  <div class="action-menu" *ngIf="openMenuId === page.id" (click)="$event.stopPropagation()">
                    <button type="button" class="action-menu-item" (click)="useInCampaign(page)">Use in campaign</button>
                    <button type="button" class="action-menu-item" (click)="openEditPageModal(page)">Edit</button>
                    <button type="button" class="action-menu-item" (click)="previewPage(page)">Preview</button>
                    <button type="button" class="action-menu-item danger" (click)="deletePage(page)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <a class="pg-url" [href]="pageHref(page)" target="_blank" rel="noopener noreferrer" (click)="$event.stopPropagation()">{{ pageUrlDisplay(page) }}</a>
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
              <button class="btn-primary btn-sm" (click)="openEditPageModal(page)">Edit</button>
              <button class="btn-ghost btn-sm" (click)="previewPage(page)">Preview</button>
              <button class="btn-ghost btn-sm" (click)="useInCampaign(page)">Use in campaign</button>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card empty-card" *ngIf="filteredPages.length === 0">
        <span class="nav-icon empty-icon" [innerHTML]="emptyIcon"></span>
        <p>No landing pages yet. Create one for your next book launch or reader magnet.</p>
      </div>

      <div class="modal-backdrop" *ngIf="showCreatePageModal" (click)="closeCreatePageModal()">
        <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create Landing Page</h3>
            <button class="close-btn" (click)="closeCreatePageModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Page Title <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newPage.name" placeholder="e.g. Free Prequel Novelization" class="text-input" [class.input-error]="createErrors.name">
              <span class="field-error" *ngIf="createErrors.name">Page title is required.</span>
            </div>
            <div class="setup-field">
              <label>Page Icon</label>
              <div class="icon-picker">
                <button *ngFor="let key of iconOptions"
                        type="button"
                        class="icon-btn"
                        [class.active]="newPage.iconKey === key"
                        (click)="newPage.iconKey = key">
                  <span class="nav-icon" [innerHTML]="getIcon(key)"></span>
                </button>
              </div>
            </div>
            <div class="setup-field">
              <label>Theme Preset Gradient</label>
              <select [(ngModel)]="newPage.themeGradient" class="select-input">
                <option *ngFor="let t of themePresets" [value]="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Status</label>
              <select [(ngModel)]="newPage.status" class="select-input">
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Headline <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newPage.headline" placeholder="Your page headline" class="text-input" [class.input-error]="createErrors.headline">
              <span class="field-error" *ngIf="createErrors.headline">Headline is required.</span>
            </div>
            <div class="setup-field">
              <label>Description <span class="req">*</span></label>
              <textarea [(ngModel)]="newPage.description" rows="3" placeholder="Describe your offer..." class="text-input" [class.input-error]="createErrors.description"></textarea>
              <span class="field-error" *ngIf="createErrors.description">Description is required.</span>
            </div>
            <div class="setup-field">
              <label>Button Text <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newPage.buttonText" placeholder="Get access" class="text-input" [class.input-error]="createErrors.buttonText">
              <span class="field-error" *ngIf="createErrors.buttonText">Button text is required.</span>
            </div>
            <div class="setup-field">
              <label>Thank-you Message <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newPage.thankYouMessage" placeholder="You're in! Check your inbox." class="text-input" [class.input-error]="createErrors.thankYouMessage">
              <span class="field-error" *ngIf="createErrors.thankYouMessage">Thank-you message is required.</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeCreatePageModal()">Cancel</button>
            <button class="btn-primary" (click)="createPage()" [disabled]="!canCreatePage">Create Page</button>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showEditPageModal" (click)="closeEditPageModal()">
        <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Edit Landing Page</h3>
            <button class="close-btn" (click)="closeEditPageModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Page Title</label>
              <input type="text" [(ngModel)]="editPage.name" class="text-input">
            </div>
            <div class="setup-field">
              <label>URL Slug</label>
              <input type="text" [(ngModel)]="editPage.slug" class="text-input" placeholder="my-landing-page">
              <span class="field-hint">Public URL: {{ editPageUrlDisplay() }}</span>
            </div>
            <div class="setup-field">
              <label>Page Icon</label>
              <div class="icon-picker">
                <button *ngFor="let key of iconOptions"
                        type="button"
                        class="icon-btn"
                        [class.active]="editPage.iconKey === key"
                        (click)="editPage.iconKey = key">
                  <span class="nav-icon" [innerHTML]="getIcon(key)"></span>
                </button>
              </div>
            </div>
            <div class="setup-field">
              <label>Theme Preset Gradient</label>
              <select [(ngModel)]="editPage.themeGradient" class="select-input">
                <option *ngFor="let t of themePresets" [value]="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Status</label>
              <select [(ngModel)]="editPage.status" class="select-input">
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Headline</label>
              <input type="text" [(ngModel)]="editPage.headline" class="text-input">
            </div>
            <div class="setup-field">
              <label>Description</label>
              <textarea [(ngModel)]="editPage.description" rows="3" class="text-input"></textarea>
            </div>
            <div class="setup-field">
              <label>Button Text</label>
              <input type="text" [(ngModel)]="editPage.buttonText" class="text-input">
            </div>
            <div class="setup-field">
              <label>Thank-you Message</label>
              <input type="text" [(ngModel)]="editPage.thankYouMessage" class="text-input">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeEditPageModal()">Cancel</button>
            <button class="btn-primary" (click)="saveEditPage()" [disabled]="!editPage.name">Save Changes</button>
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
    .page-card { overflow:visible; padding:0; }
    .page-preview { min-height:160px; display:flex; align-items:center; justify-content:center; border-bottom:1.5px solid #f1f5f9; }
    .page-preview-inner { display:flex; flex-direction:column; align-items:center; gap:.75rem; padding:1.5rem; width:100%; box-sizing:border-box; }
    .preview-icon { color:rgba(255,255,255,0.9); }
    .preview-icon svg { width:32px; height:32px; }
    .pp-lines { display:flex; flex-direction:column; gap:.375rem; width:100%; }
    .ppl { height:8px; border-radius:4px; background:rgba(255,255,255,0.3); }
    .cta-line { width:40%; margin-top:.75rem; height:24px; border-radius:6px; }
    .page-body { padding:1.25rem; }
    .page-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:.35rem; gap:.5rem; }
    .header-actions { display:flex; align-items:center; gap:.35rem; flex-shrink:0; }
    .menu-wrap { position:relative; }
    .action-menu {
      position:absolute; top:calc(100% + 4px); right:0; z-index:20; min-width:140px;
      background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:.35rem;
      box-shadow:0 10px 25px rgba(15,23,42,0.12);
    }
    .action-menu-item {
      display:block; width:100%; text-align:left; padding:.5rem .75rem; border:none; background:transparent;
      font-size:.8125rem; font-weight:500; color:#334155; border-radius:7px; cursor:pointer; font-family:inherit;
    }
    .action-menu-item:hover { background:#f8fafc; color:#0f172a; }
    .action-menu-item.danger { color:#dc2626; }
    .action-menu-item.danger:hover { background:rgba(239,68,68,0.08); }
    .pg-name { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; }
    .pg-url { display:block; font-size:.72rem; color:#2563eb; margin:0 0 1rem; font-family:monospace; text-decoration:none; }
    .pg-url:hover { text-decoration:underline; }
    .pg-stats { display:flex; gap:1.5rem; margin-bottom:1rem; }
    .pg-stat { display:flex; flex-direction:column; }
    .pgs-val { font-size:1.0625rem; font-weight:700; color:#0f172a; }
    .pgs-label { font-size:.65rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .pg-actions { display:flex; gap:.5rem; flex-wrap:wrap; }
    .field-hint { font-size:.72rem; color:#94a3b8; margin-top:4px; }
    .req { color:#dc2626; }
    .field-error { font-size:.72rem; color:#dc2626; margin-top:2px; }
    .input-error { border-color:#fca5a5 !important; }
    .badge-published { background:rgba(16,185,129,0.1); color:#059669; }
    .badge-draft { background:#f1f5f9; color:#64748b; }
    .empty-card { padding:2.5rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:.75rem; }
    .empty-card p { margin:0; color:#94a3b8; font-size:.875rem; }
    .empty-icon { color:#cbd5e1; }
    .nav-icon { display:flex; align-items:center; justify-content:center; }
    .icon-picker { display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
    .icon-btn { padding:8px; border:1.5px solid #e2e8f0; border-radius:8px; background:white; cursor:pointer; color:#64748b; transition:all .15s; }
    .icon-btn.active { border-color:#3b82f6; background:#eff6ff; color:#3b82f6; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { background:#fff; border:1px solid rgba(226,232,240,0.8); border-radius:20px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); width:100%; max-width:480px; display:flex; flex-direction:column; overflow:hidden; max-height:90vh; }
    .modal-wide { max-width:520px; }
    .modal-header { padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; }
    .modal-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .close-btn { background:transparent; border:none; color:#94a3b8; cursor:pointer; padding:4px; border-radius:6px; display:flex; }
    .close-btn:hover { background:#f1f5f9; color:#475569; }
    .modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem; overflow-y:auto; }
    .modal-footer { padding:1rem 1.5rem; border-top:1px solid #f1f5f9; display:flex; justify-content:flex-end; gap:.75rem; background:#f8fafc; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .text-input, .select-input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.875rem; font-family:inherit; color:#0f172a; outline:none; width:100%; box-sizing:border-box; resize:vertical; }
    .text-input:focus, .select-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
    @media(max-width:1100px) { .pages-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .pages-grid { grid-template-columns:1fr; } }
  `]
})
export class LandingPagesComponent implements OnInit {
  private websiteApi = inject(WebsiteApiService);
  private contentApi = inject(ContentApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  searchQuery = '';
  activeFilter = '';
  pages = signal<PageView[]>([]);
  showCreatePageModal = false;
  showEditPageModal = false;
  editingPageId = '';
  themePresets = THEME_PRESETS;
  iconOptions = LANDING_PAGE_ICONS;
  emptyIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['landing']);
  newPage = {
    name: '',
    iconKey: 'book' as string,
    status: 'draft' as string,
    themeGradient: THEME_PRESETS[0].value,
    headline: '',
    description: '',
    buttonText: '',
    thankYouMessage: '',
  };
  createErrors = { name: false, headline: false, description: false, buttonText: false, thankYouMessage: false };
  editPage = {
    name: '',
    slug: '',
    iconKey: 'book' as string,
    status: 'draft' as string,
    themeGradient: THEME_PRESETS[0].value,
    headline: '',
    description: '',
    buttonText: '',
    thankYouMessage: '',
  };
  openMenuId: string | null = null;

  @HostListener('document:click')
  closeMenu() {
    this.openMenuId = null;
  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  ngOnInit() {
    this.load();
    this.route.queryParams.subscribe(params => {
      const templateId = params['template'];
      if (templateId) {
        this.contentApi.getWebsiteTemplate(templateId).subscribe(t => {
          if (t.templateKind !== 'landing-page') return;
          this.applyTemplate(t);
          this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
        });
      }
    });
  }

  get canCreatePage() {
    return !!(
      this.newPage.name.trim() &&
      this.newPage.headline.trim() &&
      this.newPage.description.trim() &&
      this.newPage.buttonText.trim() &&
      this.newPage.thankYouMessage.trim()
    );
  }

  private applyTemplate(t: { suggestedName: string; iconKey: string; themeGradient?: string; defaultStatus: string; headline: string; bodyDescription: string; buttonText: string; thankYouMessage: string }) {
    const iconKey = LANDING_PAGE_ICONS.includes(t.iconKey as typeof LANDING_PAGE_ICONS[number]) ? t.iconKey : 'book';
    this.newPage = {
      name: t.suggestedName,
      iconKey,
      status: t.defaultStatus || 'draft',
      themeGradient: t.themeGradient || THEME_PRESETS[0].value,
      headline: t.headline,
      description: t.bodyDescription,
      buttonText: t.buttonText,
      thankYouMessage: t.thankYouMessage,
    };
    this.createErrors = { name: false, headline: false, description: false, buttonText: false, thankYouMessage: false };
    this.showCreatePageModal = true;
  }

  private validateCreatePage() {
    this.createErrors = {
      name: !this.newPage.name.trim(),
      headline: !this.newPage.headline.trim(),
      description: !this.newPage.description.trim(),
      buttonText: !this.newPage.buttonText.trim(),
      thankYouMessage: !this.newPage.thankYouMessage.trim(),
    };
    return this.canCreatePage;
  }

  load() {
    this.websiteApi.getWebsite().subscribe(bundle => {
      this.pages.set(bundle.landingPages.map(p => this.toPageView(p)));
    });
  }

  private toPageView(p: LandingPageItem): PageView {
    return {
      ...p,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[p.iconKey] ?? NAV_ICONS['landing']),
    };
  }

  getIcon(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[key] ?? NAV_ICONS['book']);
  }

  get filteredPages() {
    return this.pages().filter(p => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q);
      const matchF = !this.activeFilter || p.status === this.activeFilter;
      return matchQ && matchF;
    });
  }

  openCreatePageModal() {
    this.newPage = {
      name: '', iconKey: 'book', status: 'draft', themeGradient: THEME_PRESETS[0].value,
      headline: '', description: '', buttonText: '', thankYouMessage: '',
    };
    this.createErrors = { name: false, headline: false, description: false, buttonText: false, thankYouMessage: false };
    this.showCreatePageModal = true;
  }

  closeCreatePageModal() {
    this.showCreatePageModal = false;
  }

  openEditPageModal(page: PageView) {
    this.closeMenu();
    this.editingPageId = page.id;
    this.editPage = {
      name: page.name,
      slug: page.slug ?? page.url.split('/').pop() ?? '',
      iconKey: page.iconKey,
      status: page.status,
      themeGradient: page.themeGradient,
      headline: page.headline ?? '',
      description: page.description ?? '',
      buttonText: page.buttonText ?? '',
      thankYouMessage: page.thankYouMessage ?? '',
    };
    this.showEditPageModal = true;
  }

  closeEditPageModal() {
    this.showEditPageModal = false;
    this.editingPageId = '';
  }

  previewPage(page: PageView) {
    this.closeMenu();
    window.open(`/website/landing-pages/preview/${page.id}`, '_blank');
  }

  pageHref(page: PageView): string {
    return page.url?.includes('://') ? page.url : landingPagePublicUrl(page.slug);
  }

  pageUrlDisplay(page: PageView): string {
    return formatPublicUrlForDisplay(this.pageHref(page));
  }

  editPageUrlDisplay(): string {
    return formatPublicUrlForDisplay(landingPagePublicUrl(this.editPage.slug || 'slug'));
  }

  useInCampaign(page: PageView) {
    this.closeMenu();
    void this.router.navigate(['/campaigns'], { queryParams: { useLanding: page.id } });
  }

  deletePage(page: PageView) {
    this.closeMenu();
    if (!confirm(`Delete "${page.name}"? This cannot be undone.`)) return;
    this.websiteApi.deleteLandingPage(page.id).subscribe(() => this.load());
  }

  createPage() {
    if (!this.validateCreatePage()) return;
    this.websiteApi.createLandingPage({
      name: this.newPage.name.trim(),
      status: this.newPage.status,
      themeGradient: this.newPage.themeGradient,
      iconKey: this.newPage.iconKey,
      headline: this.newPage.headline.trim(),
      description: this.newPage.description.trim(),
      buttonText: this.newPage.buttonText.trim(),
      thankYouMessage: this.newPage.thankYouMessage.trim(),
    }).subscribe(() => {
      this.load();
      this.closeCreatePageModal();
    });
  }

  saveEditPage() {
    if (!this.editPage.name || !this.editingPageId) return;
    this.websiteApi.updateLandingPage(this.editingPageId, {
      name: this.editPage.name,
      status: this.editPage.status,
      themeGradient: this.editPage.themeGradient,
      iconKey: this.editPage.iconKey,
      slug: this.editPage.slug || undefined,
      headline: this.editPage.headline,
      description: this.editPage.description,
      buttonText: this.editPage.buttonText,
      thankYouMessage: this.editPage.thankYouMessage,
    }).subscribe({
      next: () => {
        this.load();
        this.closeEditPageModal();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Could not save landing page.';
        alert(msg);
      },
    });
  }
}
