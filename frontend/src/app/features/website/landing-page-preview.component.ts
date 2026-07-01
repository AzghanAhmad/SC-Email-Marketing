import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebsiteApiService, LandingPagePreview } from '../../core/services/website-api.service';
import { PublicWebsiteService } from '../../core/services/public-website.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';

@Component({
  selector: 'app-landing-page-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="preview-page">
      <div class="preview-toolbar">
        <span class="brand">Landing page preview</span>
        <span class="meta" *ngIf="page">{{ page.name }}</span>
        <span class="draft-pill" *ngIf="page?.status !== 'published'">Draft — not public yet</span>
      </div>

      <div *ngIf="loading" class="state">Loading page…</div>
      <div *ngIf="error" class="state error">{{ error }}</div>

      <div *ngIf="!loading && !error && page" class="hero" [style.background]="page.themeGradient">
        <div class="hero-inner">
          <span class="icon" [innerHTML]="safeIcon"></span>
          <div *ngIf="submitted" class="thank-you">
            <h1>{{ page.thankYouMessage }}</h1>
          </div>
          <ng-container *ngIf="!submitted">
            <h1>{{ page.headline }}</h1>
            <p class="desc">{{ page.description }}</p>
            <div class="signup-box">
              <input type="text" placeholder="First name" [(ngModel)]="firstName" class="field" />
              <input type="email" placeholder="Email address" [(ngModel)]="email" class="field" />
              <button class="cta" (click)="submit()" [disabled]="submitting || page.status !== 'published'">
                {{ submitting ? 'Submitting…' : page.buttonText }}
              </button>
              <p class="submit-error" *ngIf="submitError">{{ submitError }}</p>
              <p class="draft-note" *ngIf="page.status !== 'published'">Publish this page to enable sign-ups.</p>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-page { min-height:100vh; background:#0f172a; }
    .preview-toolbar {
      display:flex; align-items:center; gap:1rem; padding:.875rem 1.25rem;
      background:#fff; border-bottom:1px solid #e2e8f0;
    }
    .brand { font-weight:700; color:#0f172a; }
    .meta { font-size:.8125rem; color:#64748b; }
    .draft-pill { margin-left:auto; font-size:.7rem; font-weight:600; padding:.25rem .6rem; border-radius:999px; background:#fef3c7; color:#b45309; }
    .state { padding:3rem; text-align:center; color:#64748b; background:#f1f5f9; }
    .state.error { color:#dc2626; }
    .hero { min-height:calc(100vh - 52px); display:flex; align-items:center; justify-content:center; padding:2rem; }
    .hero-inner { max-width:560px; width:100%; text-align:center; color:#fff; }
    .icon { display:inline-flex; margin-bottom:1.5rem; color:rgba(255,255,255,0.95); }
    .icon :deep(svg) { width:48px; height:48px; }
    h1 { margin:0 0 1rem; font-size:2rem; font-weight:800; letter-spacing:-.02em; line-height:1.2; }
    .desc { margin:0 0 2rem; font-size:1.0625rem; line-height:1.6; color:rgba(255,255,255,0.88); }
    .signup-box {
      background:rgba(255,255,255,0.12); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.2);
      border-radius:16px; padding:1.5rem; display:flex; flex-direction:column; gap:.75rem; text-align:left;
    }
    .field {
      padding:.875rem 1rem; border:1.5px solid rgba(255,255,255,0.25); border-radius:10px;
      font-size:.9375rem; font-family:inherit; background:rgba(255,255,255,0.95); outline:none;
    }
    .cta {
      padding:.875rem 1rem; border:none; border-radius:10px; background:#fff; color:#0f172a;
      font-size:.9375rem; font-weight:700; cursor:pointer; font-family:inherit; margin-top:.25rem;
    }
    .cta:disabled { opacity:.55; cursor:not-allowed; }
    .thank-you h1 { color:#fff; }
    .submit-error { color:#fecaca; font-size:.8125rem; margin:0; }
    .draft-note { font-size:.75rem; color:rgba(255,255,255,0.7); margin:0; text-align:center; }
  `]
})
export class LandingPagePreviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private websiteApi = inject(WebsiteApiService);
  private publicWebsite = inject(PublicWebsiteService);
  private sanitizer = inject(DomSanitizer);

  page: LandingPagePreview | null = null;
  safeIcon: SafeHtml = '';
  loading = true;
  error = '';
  email = '';
  firstName = '';
  submitting = false;
  submitted = false;
  submitError = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteApi.previewLandingPage(id).subscribe({
      next: p => {
        this.page = p;
        this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[p.iconKey] ?? NAV_ICONS['book']);
        this.loading = false;
      },
      error: () => { this.error = 'Landing page not found or you do not have access.'; this.loading = false; },
    });
  }

  submit() {
    if (!this.page || this.page.status !== 'published' || !this.email.trim()) {
      this.submitError = 'Enter your email address.';
      return;
    }
    this.submitting = true;
    this.submitError = '';
    this.publicWebsite.submitLandingPage(this.page.slug, {
      email: this.email.trim(),
      firstName: this.firstName.trim() || undefined,
    }).subscribe({
      next: res => {
        this.submitting = false;
        if (res.success) this.submitted = true;
        else this.submitError = res.message;
      },
      error: () => {
        this.submitting = false;
        this.submitError = 'Could not submit. Try again.';
      },
    });
  }
}
