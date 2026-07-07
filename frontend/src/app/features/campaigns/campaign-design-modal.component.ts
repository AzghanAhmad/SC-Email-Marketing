import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentApiService, EmailTemplate } from '../../core/services/content-api.service';
import { WebsiteApiService, LandingPageItem, SignUpFormItem } from '../../core/services/website-api.service';
import { buildEmailHtmlFromLandingPage, buildEmailHtmlFromSignUpForm } from './campaign-website-email.utils';
import { formatPublicUrlForDisplay, signUpFormPreviewUrl } from '../../core/utils/public-site-url';

export interface AppliedTemplate {
  id: string;
  name: string;
  subjectLine: string;
  previewText: string;
  htmlBody: string;
  suggestedCampaignType: string;
}

type DesignTab = 'templates' | 'yours' | 'basic' | 'ready' | 'landing' | 'forms';

interface TemplateView extends EmailTemplate {
  safeHtml: SafeHtml;
}

interface WebsiteTileView {
  id: string;
  name: string;
  urlLabel: string;
  safeHtml: SafeHtml;
}

@Component({
  selector: 'app-campaign-design-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="open" (click)="cancel.emit()">
      <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
        <h2 class="modal-title">Design your email</h2>
        <p class="modal-sub">Choose a template to start with — you can edit everything after.</p>

        <div class="design-tabs">
          <button class="design-tab" [class.active]="tab() === 'templates'" (click)="tab.set('templates')">Templates</button>
          <button class="design-tab" [class.active]="tab() === 'yours'" (click)="tab.set('yours')">Your templates</button>
          <button class="design-tab" [class.active]="tab() === 'landing'" (click)="tab.set('landing')">Landing pages</button>
          <button class="design-tab" [class.active]="tab() === 'forms'" (click)="tab.set('forms')">Sign-up forms</button>
          <button class="design-tab" [class.active]="tab() === 'basic'" (click)="tab.set('basic')">Basic templates</button>
          <button class="design-tab" [class.active]="tab() === 'ready'" (click)="tab.set('ready')">Ready-to-use</button>
        </div>

        <div class="loading" *ngIf="loading">Loading…</div>

        <div class="template-grid" *ngIf="!loading && isEmailTab">
          <button type="button" class="template-tile blank-tile" (click)="useBlank()">
            <div class="blank-icon">+</div>
            <span>Start from scratch</span>
          </button>
          <button type="button" class="template-tile" *ngFor="let t of filteredTemplates" (click)="selectTemplate(t)">
            <div class="tile-preview">
              <div class="tile-html" [innerHTML]="t.safeHtml"></div>
            </div>
            <div class="tile-name">{{ t.name }}</div>
            <div class="tile-cat">{{ t.category }}</div>
          </button>
        </div>

        <div class="template-grid" *ngIf="!loading && tab() === 'landing'">
          <button type="button" class="template-tile" *ngFor="let p of landingPageTiles" (click)="selectLandingPageById(p.id)">
            <div class="tile-preview">
              <div class="tile-html" [innerHTML]="p.safeHtml"></div>
            </div>
            <div class="tile-name">{{ p.name }}</div>
            <div class="tile-cat">{{ p.urlLabel }}</div>
          </button>
        </div>

        <div class="template-grid" *ngIf="!loading && tab() === 'forms'">
          <button type="button" class="template-tile" *ngFor="let f of signUpFormTiles" (click)="selectSignUpFormById(f.id)">
            <div class="tile-preview">
              <div class="tile-html" [innerHTML]="f.safeHtml"></div>
            </div>
            <div class="tile-name">{{ f.name }}</div>
            <div class="tile-cat">{{ f.urlLabel }}</div>
          </button>
        </div>

        <div class="empty" *ngIf="!loading && tab() === 'yours' && filteredTemplates.length === 0">
          No custom templates yet. Save designs from the Templates page.
        </div>
        <div class="empty" *ngIf="!loading && tab() === 'landing' && landingPageTiles.length === 0">
          No landing pages yet. Create one under Website → Landing Pages.
        </div>
        <div class="empty" *ngIf="!loading && tab() === 'forms' && signUpFormTiles.length === 0">
          No sign-up forms yet. Create one under Website → Sign-up Forms.
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="cancel.emit()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); backdrop-filter:blur(4px); z-index:300; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
    .modal-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:16px; padding:1.75rem; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.12); }
    .modal-wide { max-width:900px; }
    .modal-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .modal-sub { font-size:.875rem; color:#64748b; margin:0 0 1rem; }
    .design-tabs { display:flex; gap:.25rem; background:#f1f5f9; border-radius:10px; padding:.25rem; margin-bottom:1.25rem; flex-wrap:wrap; }
    .design-tab { padding:.5rem 1rem; border:none; background:transparent; border-radius:8px; font-size:.8125rem; font-weight:500; color:#64748b; cursor:pointer; font-family:inherit; }
    .design-tab.active { background:#fff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .loading, .empty { text-align:center; padding:2rem; color:#94a3b8; font-size:.875rem; }
    .template-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1rem; max-height:55vh; overflow-y:auto; }
    .template-tile { border:1.5px solid #e2e8f0; border-radius:12px; background:#fff; padding:0; cursor:pointer; text-align:left; overflow:hidden; transition:border-color .2s, box-shadow .2s; font-family:inherit; }
    .template-tile:hover { border-color:#93c5fd; box-shadow:0 4px 12px rgba(59,130,246,0.12); }
    .blank-tile { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:180px; gap:.5rem; color:#64748b; font-size:.8125rem; background:#f8fafc; }
    .blank-icon { width:48px; height:48px; border-radius:12px; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:#94a3b8; }
    .tile-preview { height:140px; overflow:hidden; background:#f8fafc; border-bottom:1px solid #f1f5f9; position:relative; }
    .tile-html { transform:scale(0.35); transform-origin:top left; width:286%; pointer-events:none; }
    .tile-name { padding:.625rem .75rem .15rem; font-size:.8125rem; font-weight:700; color:#0f172a; }
    .tile-cat { padding:0 .75rem .625rem; font-size:.7rem; color:#94a3b8; text-transform:none; letter-spacing:0; word-break:break-all; }
    .modal-actions { display:flex; justify-content:flex-end; gap:.75rem; margin-top:1.25rem; }
  `],
})
export class CampaignDesignModalComponent implements OnInit {
  private contentApi = inject(ContentApiService);
  private websiteApi = inject(WebsiteApiService);
  private sanitizer = inject(DomSanitizer);

  @Input() open = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() applied = new EventEmitter<AppliedTemplate | null>();

  tab = signal<DesignTab>('templates');
  templates: TemplateView[] = [];
  landingPages: LandingPageItem[] = [];
  signUpForms: SignUpFormItem[] = [];
  landingPageTiles: WebsiteTileView[] = [];
  signUpFormTiles: WebsiteTileView[] = [];
  loading = true;

  ngOnInit() {
    this.contentApi.getContent().subscribe({
      next: bundle => {
        this.templates = bundle.templates.map(t => ({
          ...t,
          safeHtml: this.sanitizer.bypassSecurityTrustHtml(t.htmlBody || ''),
        }));
      },
      error: () => {},
    });
    this.websiteApi.getWebsite().subscribe({
      next: bundle => {
        this.landingPages = bundle.landingPages;
        this.signUpForms = bundle.forms;
        this.landingPageTiles = bundle.landingPages.map(p => ({
          id: p.id,
          name: p.name,
          urlLabel: formatPublicUrlForDisplay(p.url),
          safeHtml: this.sanitizer.bypassSecurityTrustHtml(buildEmailHtmlFromLandingPage(p)),
        }));
        this.signUpFormTiles = bundle.forms.map(f => ({
          id: f.id,
          name: f.name,
          urlLabel: formatPublicUrlForDisplay(signUpFormPreviewUrl(f.id)),
          safeHtml: this.sanitizer.bypassSecurityTrustHtml(buildEmailHtmlFromSignUpForm(f)),
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  get isEmailTab(): boolean {
    return ['templates', 'yours', 'basic', 'ready'].includes(this.tab());
  }

  get filteredTemplates(): TemplateView[] {
    switch (this.tab()) {
      case 'yours':
        return this.templates.filter(t => t.isCustom);
      case 'basic':
        return this.templates.filter(t => ['Newsletter', 'Automation', 'Content'].includes(t.category));
      case 'ready':
        return this.templates.filter(t => ['Launch', 'Event', 'ARC', 'Transaction'].includes(t.category));
      default:
        return this.templates;
    }
  }

  displayUrl(url?: string): string {
    return formatPublicUrlForDisplay(url || '');
  }

  useBlank() {
    this.applied.emit(null);
  }

  selectTemplate(t: TemplateView) {
    this.applied.emit({
      id: t.id,
      name: t.name,
      subjectLine: t.subjectLine,
      previewText: '',
      htmlBody: t.htmlBody,
      suggestedCampaignType: t.suggestedCampaignType,
    });
  }

  selectLandingPageById(id: string) {
    const page = this.landingPages.find(p => p.id === id);
    if (page) this.selectLandingPage(page);
  }

  selectSignUpFormById(id: string) {
    const form = this.signUpForms.find(f => f.id === id);
    if (form) this.selectSignUpForm(form);
  }

  selectLandingPage(page: LandingPageItem) {
    this.applied.emit({
      id: `landing-${page.id}`,
      name: page.name,
      subjectLine: page.headline || page.name,
      previewText: page.description || '',
      htmlBody: buildEmailHtmlFromLandingPage(page),
      suggestedCampaignType: '',
    });
  }

  selectSignUpForm(form: SignUpFormItem) {
    this.applied.emit({
      id: `form-${form.id}`,
      name: form.name,
      subjectLine: form.headline || form.name,
      previewText: form.description || '',
      htmlBody: buildEmailHtmlFromSignUpForm(form),
      suggestedCampaignType: '',
    });
  }
}
