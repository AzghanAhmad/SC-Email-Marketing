import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicCampaignService, UnsubscribePreview } from '../../core/services/public-campaign.service';

@Component({
  selector: 'app-unsubscribe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="card">
        <div class="brand">ScribeCount</div>

        <div *ngIf="loading" class="state">Loading…</div>
        <div *ngIf="error" class="state error">{{ error }}</div>

        <ng-container *ngIf="!loading && !error && preview">
          <h1>Unsubscribe</h1>
          <p class="lead" *ngIf="!confirmed && !preview.alreadyUnsubscribed">
            You are about to unsubscribe <strong>{{ preview.email }}</strong> from emails about
            <strong>{{ preview.campaignName }}</strong> from {{ preview.fromName }}.
          </p>
          <p class="lead" *ngIf="preview.alreadyUnsubscribed || confirmed">
            <strong>{{ preview.email }}</strong> is unsubscribed from this mailing list.
          </p>

          <div class="actions" *ngIf="!confirmed && !preview.alreadyUnsubscribed">
            <button class="btn-primary" (click)="confirm()" [disabled]="submitting">
              {{ submitting ? 'Unsubscribing…' : 'Unsubscribe' }}
            </button>
            <p class="fine-print">You will not receive further campaign emails from this author.</p>
          </div>

          <div class="success" *ngIf="confirmed || preview.alreadyUnsubscribed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>{{ resultMessage }}</p>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 1.5rem; background: linear-gradient(160deg, #f8fafc 0%, #eef2ff 100%);
    }
    .card {
      width: 100%; max-width: 480px; background: #fff; border-radius: 20px;
      border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(15,23,42,0.08);
      padding: 2rem;
    }
    .brand { font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #6366f1; margin-bottom: 1rem; }
    h1 { margin: 0 0 .75rem; font-size: 1.5rem; color: #0f172a; }
    .lead { color: #475569; line-height: 1.6; margin: 0 0 1.5rem; }
    .actions { display: flex; flex-direction: column; gap: .75rem; }
    .btn-primary {
      border: none; border-radius: 10px; padding: .85rem 1.25rem; background: #dc2626;
      color: #fff; font-weight: 700; font-size: .9375rem; cursor: pointer; font-family: inherit;
    }
    .btn-primary:disabled { opacity: .7; cursor: not-allowed; }
    .fine-print { font-size: .75rem; color: #94a3b8; margin: 0; text-align: center; }
    .state { color: #64748b; text-align: center; padding: 2rem 0; }
    .state.error { color: #dc2626; }
    .success { text-align: center; color: #059669; display: flex; flex-direction: column; align-items: center; gap: .75rem; }
    .success p { margin: 0; color: #334155; line-height: 1.6; }
  `]
})
export class UnsubscribeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicApi = inject(PublicCampaignService);

  token = '';
  preview: UnsubscribePreview | null = null;
  loading = true;
  error = '';
  submitting = false;
  confirmed = false;
  resultMessage = '';

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.error = 'This unsubscribe link is invalid.';
      this.loading = false;
      return;
    }

    this.publicApi.getUnsubscribePreview(this.token).subscribe({
      next: preview => {
        this.preview = preview;
        if (preview.alreadyUnsubscribed) {
          this.resultMessage = 'You have already been removed from this mailing list.';
        }
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'This unsubscribe link is invalid or has expired.';
        this.loading = false;
      },
    });
  }

  confirm() {
    if (!this.token || this.submitting) return;
    this.submitting = true;
    this.publicApi.confirmUnsubscribe(this.token).subscribe({
      next: result => {
        this.confirmed = true;
        this.resultMessage = result.message;
        this.submitting = false;
        if (this.preview) this.preview.alreadyUnsubscribed = true;
      },
      error: err => {
        this.error = err.message || 'Could not complete unsubscribe. Please try again.';
        this.submitting = false;
      },
    });
  }
}
