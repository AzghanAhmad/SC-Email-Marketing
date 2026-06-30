import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicCampaignService, CampaignView } from '../../core/services/public-campaign.service';

@Component({
  selector: 'app-campaign-email-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="shell">
        <div class="topbar">
          <span class="brand">Email preview</span>
          <span class="meta" *ngIf="view">{{ view.fromName }}</span>
        </div>

        <div *ngIf="loading" class="state">Loading email…</div>
        <div *ngIf="error" class="state error">{{ error }}</div>

        <ng-container *ngIf="!loading && !error && view">
          <div class="subject-block">
            <h1>{{ view.subject }}</h1>
            <p class="campaign-name">{{ view.campaignName }}</p>
          </div>
          <div class="email-frame" [innerHTML]="safeHtml"></div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f1f5f9; padding: 1.5rem; }
    .shell {
      max-width: 720px; margin: 0 auto; background: #fff; border-radius: 16px;
      border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 12px 40px rgba(15,23,42,0.06);
    }
    .topbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: .875rem 1.25rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
      font-size: .8125rem;
    }
    .brand { font-weight: 700; color: #334155; }
    .meta { color: #64748b; }
    .subject-block { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    h1 { margin: 0 0 .5rem; font-size: 1.25rem; color: #0f172a; }
    .preview { margin: 0 0 .35rem; color: #64748b; font-size: .875rem; }
    .campaign-name { margin: 0; font-size: .75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; }
    .email-frame { padding: 0; overflow-x: auto; }
    .state { padding: 3rem 1.5rem; text-align: center; color: #64748b; }
    .state.error { color: #dc2626; }
  `]
})
export class CampaignEmailViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicApi = inject(PublicCampaignService);
  private sanitizer = inject(DomSanitizer);

  view: CampaignView | null = null;
  loading = true;
  error = '';

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!token) {
      this.error = 'This view link is invalid.';
      this.loading = false;
      return;
    }

    this.publicApi.getCampaignView(token).subscribe({
      next: view => {
        this.view = view;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'This email view link is invalid or has expired.';
        this.loading = false;
      },
    });
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.view?.htmlBody || '');
  }
}
