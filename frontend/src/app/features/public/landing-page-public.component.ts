import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicWebsiteService, PublicLandingPage } from '../../core/services/public-website.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';

@Component({
  selector: 'app-landing-page-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div *ngIf="loading" class="state">Loading…</div>
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
              <button class="cta" (click)="submit()" [disabled]="submitting">
                {{ submitting ? 'Submitting…' : page.buttonText }}
              </button>
              <p class="submit-error" *ngIf="submitError">{{ submitError }}</p>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height:100vh; background:#0f172a; }
    .state { padding:3rem; text-align:center; color:#64748b; background:#f1f5f9; min-height:100vh; }
    .state.error { color:#dc2626; }
    .hero { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; }
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
    .submit-error { color:#fecaca; font-size:.8125rem; margin:0; text-align:center; }
  `]
})
export class LandingPagePublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicWebsite = inject(PublicWebsiteService);
  private sanitizer = inject(DomSanitizer);

  page: PublicLandingPage | null = null;
  safeIcon: SafeHtml = '';
  loading = true;
  error = '';
  email = '';
  firstName = '';
  submitting = false;
  submitted = false;
  submitError = '';

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.publicWebsite.getLandingPage(slug).subscribe({
      next: p => {
        this.page = p;
        this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[p.iconKey] ?? NAV_ICONS['book']);
        this.loading = false;
      },
      error: () => { this.error = 'This landing page is not available.'; this.loading = false; },
    });
  }

  submit() {
    if (!this.page || !this.email.trim()) {
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
