import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicWebsiteService, PublicFormPreview } from '../../core/services/public-website.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';

@Component({
  selector: 'app-sign-up-form-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div *ngIf="loading" class="state">Loading…</div>
      <div *ngIf="error" class="state error">{{ error }}</div>

      <div *ngIf="!loading && !error && form" class="card-wrap">
        <div class="card">
          <span class="icon" [innerHTML]="safeIcon"></span>
          <div *ngIf="submitted" class="thank-you">
            <h1>{{ form.thankYouMessage }}</h1>
          </div>
          <ng-container *ngIf="!submitted">
            <h1>{{ form.headline }}</h1>
            <p class="desc">{{ form.description }}</p>
            <div class="signup-box">
              <input type="text" placeholder="First name" [(ngModel)]="firstName" class="field" />
              <input type="email" placeholder="Email address" [(ngModel)]="email" class="field" />
              <button class="cta" (click)="submit()" [disabled]="submitting">
                {{ submitting ? 'Submitting…' : form.buttonText }}
              </button>
              <p class="submit-error" *ngIf="submitError">{{ submitError }}</p>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height:100vh; background:linear-gradient(160deg,#f8fafc,#e2e8f0); }
    .state { padding:3rem; text-align:center; color:#64748b; min-height:100vh; }
    .state.error { color:#dc2626; }
    .card-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; }
    .card { max-width:480px; width:100%; background:#fff; border:1.5px solid #e2e8f0; border-radius:20px; padding:2rem; text-align:center; box-shadow:0 16px 48px rgba(15,23,42,0.08); }
    .icon { display:inline-flex; margin-bottom:1rem; color:#2563eb; }
    .icon :deep(svg) { width:40px; height:40px; }
    h1 { margin:0 0 .75rem; font-size:1.5rem; font-weight:800; color:#0f172a; line-height:1.25; }
    .desc { margin:0 0 1.5rem; font-size:.9375rem; line-height:1.6; color:#64748b; }
    .signup-box { display:flex; flex-direction:column; gap:.75rem; text-align:left; }
    .field { padding:.875rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.9375rem; font-family:inherit; outline:none; }
    .field:focus { border-color:#93c5fd; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
    .cta { padding:.875rem 1rem; border:none; border-radius:10px; background:#2563eb; color:#fff; font-size:.9375rem; font-weight:700; cursor:pointer; font-family:inherit; }
    .cta:disabled { opacity:.55; cursor:not-allowed; }
    .submit-error { color:#dc2626; font-size:.8125rem; margin:0; text-align:center; }
  `],
})
export class SignUpFormPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicWebsite = inject(PublicWebsiteService);
  private sanitizer = inject(DomSanitizer);

  form: PublicFormPreview | null = null;
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
    this.publicWebsite.getForm(id).subscribe({
      next: f => {
        this.form = f;
        this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS['form'] ?? NAV_ICONS['book']);
        this.loading = false;
      },
      error: () => { this.error = 'This sign-up form is not available.'; this.loading = false; },
    });
  }

  submit() {
    if (!this.form || !this.email.trim()) {
      this.submitError = 'Enter your email address.';
      return;
    }
    this.submitting = true;
    this.submitError = '';
    this.publicWebsite.submitForm(this.form.id, {
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
