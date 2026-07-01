import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WebsiteApiService, FormPreview } from '../../core/services/website-api.service';
import { PublicWebsiteService } from '../../core/services/public-website.service';

@Component({
  selector: 'app-sign-up-form-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="preview-page" [class.embedded]="form?.formType === 'Embedded'" [class.flyout]="form?.formType === 'Flyout'">
      <div class="preview-toolbar">
        <span class="brand">Form preview</span>
        <span class="meta" *ngIf="form">{{ form.name }} · {{ form.formType }}</span>
        <span class="draft-pill" *ngIf="form?.status !== 'active'">Draft — submissions disabled</span>
      </div>

      <div *ngIf="loading" class="state">Loading form…</div>
      <div *ngIf="error" class="state error">{{ error }}</div>

      <ng-container *ngIf="!loading && !error && form">
        <div class="stage" *ngIf="form.formType === 'Popup' || form.formType === 'Full Page'">
          <div class="backdrop" *ngIf="form.formType === 'Popup'"></div>
          <div class="form-card" [class.full-page]="form.formType === 'Full Page'">
            <ng-container *ngTemplateOutlet="formBody"></ng-container>
          </div>
        </div>

        <div class="embedded-wrap" *ngIf="form.formType === 'Embedded'">
          <div class="page-mock">
            <div class="page-mock-bar"></div>
            <div class="page-mock-line"></div>
            <div class="embedded-form">
              <ng-container *ngTemplateOutlet="formBody"></ng-container>
            </div>
            <div class="page-mock-line wide"></div>
            <div class="page-mock-line"></div>
          </div>
        </div>

        <div class="flyout-wrap" *ngIf="form.formType === 'Flyout'">
          <div class="flyout-banner">
            <ng-container *ngTemplateOutlet="formBody"></ng-container>
          </div>
        </div>
      </ng-container>

      <ng-template #formBody>
        <div *ngIf="submitted" class="thank-you">
          <h2>{{ form!.thankYouMessage }}</h2>
        </div>
        <div *ngIf="!submitted" class="form-inner">
          <h2>{{ form!.headline }}</h2>
          <p>{{ form!.description }}</p>
          <div class="fields">
            <input type="text" placeholder="First name" [(ngModel)]="firstName" class="field" />
            <input type="email" placeholder="Email address" [(ngModel)]="email" class="field" />
          </div>
          <button class="cta" (click)="submit()" [disabled]="submitting || form!.status !== 'active'">
            {{ submitting ? 'Submitting…' : form!.buttonText }}
          </button>
          <p class="submit-error" *ngIf="submitError">{{ submitError }}</p>
          <p class="draft-note" *ngIf="form!.status !== 'active'">Set status to Active to accept submissions.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .preview-page { min-height:100vh; background:#f1f5f9; }
    .preview-toolbar {
      display:flex; align-items:center; gap:1rem; padding:.875rem 1.25rem;
      background:#fff; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:10;
    }
    .brand { font-weight:700; color:#0f172a; }
    .meta { font-size:.8125rem; color:#64748b; }
    .draft-pill { margin-left:auto; font-size:.7rem; font-weight:600; padding:.25rem .6rem; border-radius:999px; background:#fef3c7; color:#b45309; }
    .state { padding:3rem; text-align:center; color:#64748b; }
    .state.error { color:#dc2626; }
    .stage { min-height:calc(100vh - 52px); display:flex; align-items:center; justify-content:center; position:relative; padding:2rem; }
    .backdrop { position:absolute; inset:0; background:rgba(15,23,42,0.45); }
    .form-card {
      position:relative; z-index:1; width:100%; max-width:420px; background:#fff; border-radius:16px;
      padding:2rem; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
    }
    .form-card.full-page { max-width:520px; min-height:420px; display:flex; align-items:center; }
    .embedded-wrap { padding:2rem; max-width:800px; margin:0 auto; }
    .page-mock { background:#fff; border-radius:12px; border:1px solid #e2e8f0; padding:2rem; }
    .page-mock-bar { height:12px; width:40%; background:#e2e8f0; border-radius:6px; margin-bottom:1.5rem; }
    .page-mock-line { height:8px; width:70%; background:#f1f5f9; border-radius:4px; margin:.75rem 0; }
    .page-mock-line.wide { width:90%; }
    .embedded-form { margin:1.5rem 0; padding:1.5rem; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1; }
    .flyout-wrap { padding:2rem; }
    .flyout-banner {
      max-width:900px; margin:0 auto; background:linear-gradient(135deg,#1e3a5f,#2d5a87);
      border-radius:12px; padding:1.5rem 2rem; color:#fff;
    }
    .form-inner h2 { margin:0 0 .75rem; font-size:1.375rem; color:#0f172a; }
    .flyout-banner .form-inner h2, .flyout-banner .form-inner p { color:#fff; }
    .form-inner p { margin:0 0 1.25rem; color:#64748b; line-height:1.5; }
    .fields { display:flex; flex-direction:column; gap:.75rem; margin-bottom:1rem; }
    .field {
      padding:.75rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.9375rem;
      font-family:inherit; outline:none; width:100%; box-sizing:border-box;
    }
    .flyout-banner .field { border-color:rgba(255,255,255,0.3); background:rgba(255,255,255,0.95); }
    .cta {
      width:100%; padding:.875rem 1rem; border:none; border-radius:10px; background:#3b82f6; color:#fff;
      font-size:.9375rem; font-weight:600; cursor:pointer; font-family:inherit;
    }
    .cta:disabled { opacity:.55; cursor:not-allowed; }
    .flyout-banner .cta { background:#fff; color:#1e3a5f; }
    .thank-you { text-align:center; padding:1rem 0; }
    .thank-you h2 { margin:0; font-size:1.25rem; color:#059669; }
    .submit-error { color:#dc2626; font-size:.8125rem; margin:.75rem 0 0; }
    .draft-note { font-size:.75rem; color:#94a3b8; margin:.75rem 0 0; }
  `]
})
export class SignUpFormPreviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private websiteApi = inject(WebsiteApiService);
  private publicWebsite = inject(PublicWebsiteService);

  form: FormPreview | null = null;
  loading = true;
  error = '';
  email = '';
  firstName = '';
  submitting = false;
  submitted = false;
  submitError = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteApi.previewForm(id).subscribe({
      next: f => { this.form = f; this.loading = false; },
      error: () => { this.error = 'Form not found or you do not have access.'; this.loading = false; },
    });
  }

  submit() {
    if (!this.form || this.form.status !== 'active' || !this.email.trim()) {
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
