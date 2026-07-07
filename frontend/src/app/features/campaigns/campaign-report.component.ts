import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Campaign, CampaignApiService } from '../../core/services/campaign-api.service';
import { AudienceApiService } from '../../core/services/audience-api.service';
import { ContentApiService } from '../../core/services/content-api.service';
import {
  applyPreviewMergeTags,
  buildPreviewOverridesFromExtras,
  campaignTypeLabel,
  formatCampaignDateTime,
  isHtmlContent,
  resolveAudienceLabel,
} from './campaign-preview.utils';

@Component({
  selector: 'app-campaign-report',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="report-top">
        <a routerLink="/campaigns" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Campaigns
        </a>
      </div>

      <div class="loading-state" *ngIf="loading">Loading campaign report…</div>
      <div class="error-state" *ngIf="!loading && error">{{ error }}</div>

      <ng-container *ngIf="!loading && campaign">
        <div class="page-header">
          <div>
            <h1 class="page-title">{{ campaign.name }}</h1>
            <p class="page-subtitle">{{ resolvedSubject }}</p>
          </div>
          <div class="header-actions">
            <button type="button" class="btn-secondary" [routerLink]="['/campaigns']" [queryParams]="{ edit: campaign.id }">
              Edit campaign
            </button>
            <span class="badge" [ngClass]="'badge-' + campaign.status">{{ campaign.status }}</span>
          </div>
        </div>

        <div class="glass-card report-hero" *ngIf="campaign.status === 'sent'">
          <div class="hero-stat primary">
            <span class="hero-val">{{ campaign.sent | number }}</span>
            <span class="hero-label">Emails Sent</span>
          </div>
          <div class="hero-stat">
            <span class="hero-val">{{ displayOpenRate }}%</span>
            <span class="hero-label">Open Rate</span>
            <div class="hero-bar"><div class="hero-bar-fill blue" [style.width.%]="displayOpenRate"></div></div>
          </div>
          <div class="hero-stat">
            <span class="hero-val accent">{{ displayClickRate }}%</span>
            <span class="hero-label">Click Rate</span>
            <div class="hero-bar"><div class="hero-bar-fill purple" [style.width.%]="displayClickRate * 3"></div></div>
          </div>
        </div>

        <div class="glass-card notice" *ngIf="campaign.status !== 'sent'">
          <p *ngIf="campaign.status === 'draft'">This campaign is still a draft. Send it to start collecting performance data.</p>
          <p *ngIf="campaign.status === 'scheduled'">This campaign is scheduled to send on {{ scheduledDisplay }}.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Status</span>
            <span class="stat-value"><span class="badge" [ngClass]="'badge-' + campaign.status">{{ campaign.status }}</span></span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Sent</span>
            <span class="stat-value">{{ campaign.sent > 0 ? (campaign.sent | number) : '—' }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Open Rate</span>
            <span class="stat-value">{{ campaign.status === 'sent' ? displayOpenRate + '%' : '—' }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Click Rate</span>
            <span class="stat-value">{{ campaign.status === 'sent' ? displayClickRate + '%' : '—' }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ campaign.status === 'scheduled' ? 'Scheduled for' : 'Date' }}</span>
            <span class="stat-value">{{ displayDate }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Unique Opens</span>
            <span class="stat-value">{{ uniqueOpens }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Unique Clicks</span>
            <span class="stat-value">{{ uniqueClicks }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Conversion Rate</span>
            <span class="stat-value">{{ conversionRate }}</span>
          </div>
        </div>

        <div class="glass-card details-card">
          <h2 class="section-title">Campaign Details</h2>
          <dl class="details-grid">
            <div><dt>Campaign type</dt><dd>{{ typeLabel }}</dd></div>
            <div><dt>Template</dt><dd>{{ templateLabel }}</dd></div>
            <div><dt>From name</dt><dd>{{ campaign.fromName || '—' }}</dd></div>
            <div><dt>Audience</dt><dd>{{ audienceLabel }}</dd></div>
            <div class="full">
              <dt>Email preview</dt>
              <dd class="preview-wrap">
                <div *ngIf="campaign.content && isHtml(campaign.content)" class="email-preview-frame" [innerHTML]="safePreviewContent"></div>
                <p *ngIf="campaign.content && !isHtml(campaign.content)" class="text-preview">{{ resolvedContent }}</p>
                <p *ngIf="!campaign.content" class="text-muted">—</p>
              </dd>
            </div>
          </dl>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 1.5rem 2rem 2.5rem; max-width: 1100px; }
    .report-top { margin-bottom: 1rem; }
    .back-link {
      display: inline-flex; align-items: center; gap: .35rem;
      color: #64748b; text-decoration: none; font-size: .875rem; font-weight: 600;
    }
    .back-link:hover { color: #2563eb; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .header-actions { display: flex; align-items: center; gap: .75rem; flex-shrink: 0; }
    .page-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 .25rem; letter-spacing: -.02em; }
    .page-subtitle { font-size: .9375rem; color: #64748b; margin: 0; }
    .loading-state, .error-state { padding: 2rem; text-align: center; color: #64748b; }
    .error-state { color: #dc2626; }
    .report-hero {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
      padding: 1.5rem; margin-bottom: 1.25rem;
    }
    .hero-stat { display: flex; flex-direction: column; gap: .35rem; }
    .hero-val { font-size: 2rem; font-weight: 800; color: #0f172a; letter-spacing: -.03em; }
    .hero-val.accent { color: #6366f1; }
    .hero-label { font-size: .75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
    .hero-bar { height: 6px; background: #e2e8f0; border-radius: 100px; overflow: hidden; margin-top: .25rem; }
    .hero-bar-fill { height: 100%; border-radius: 100px; }
    .hero-bar-fill.blue { background: linear-gradient(90deg, #3b82f6, rgba(59,130,246,.5)); }
    .hero-bar-fill.purple { background: linear-gradient(90deg, #6366f1, rgba(99,102,241,.5)); }
    .notice { padding: 1rem 1.25rem; margin-bottom: 1.25rem; color: #64748b; font-size: .875rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
    .stat-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      padding: 1rem 1.125rem; display: flex; flex-direction: column; gap: .5rem;
    }
    .stat-label { font-size: .7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
    .stat-value { font-size: 1.125rem; font-weight: 700; color: #0f172a; }
    .details-card { padding: 1.5rem; }
    .section-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 1rem; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; margin: 0; }
    .details-grid .full { grid-column: 1 / -1; }
    .details-grid dt { font-size: .75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: .25rem; }
    .details-grid dd { margin: 0; font-size: .875rem; color: #334155; line-height: 1.5; }
    .preview-wrap { margin-top: .25rem; }
    .email-preview-frame {
      border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;
      max-height: 520px; overflow-y: auto; background: #f8fafc;
    }
    .text-preview { white-space: pre-wrap; margin: 0; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .text-muted { color: #94a3b8; margin: 0; }
    .badge { display: inline-block; padding: .25rem .65rem; border-radius: 100px; font-size: .7rem; font-weight: 700; text-transform: capitalize; }
    .badge-sent { background: rgba(16,185,129,.1); color: #059669; }
    .badge-draft { background: #f1f5f9; color: #64748b; }
    .badge-scheduled { background: rgba(59,130,246,.1); color: #2563eb; }
    @media (max-width: 900px) {
      .report-hero, .stats-grid { grid-template-columns: 1fr 1fr; }
      .details-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .page-wrapper { padding: 1rem; }
      .report-hero, .stats-grid { grid-template-columns: 1fr; }
      .header-actions { width: 100%; justify-content: space-between; }
    }
  `]
})
export class CampaignReportComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private campaignApi = inject(CampaignApiService);
  private audienceApi = inject(AudienceApiService);
  private contentApi = inject(ContentApiService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private campaignId = '';

  campaign: Campaign | null = null;
  loading = true;
  error = '';
  audienceLabel = '—';
  templateLabel = '—';
  lists: { id: string; name: string }[] = [];
  segments: { id: string; name: string }[] = [];

  readonly isHtml = isHtmlContent;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/campaigns']);
      return;
    }
    this.campaignId = id;

    this.audienceApi.getListsSegments().subscribe({
      next: bundle => {
        this.lists = bundle.lists;
        this.segments = bundle.segments;
        this.refreshLabels();
      },
    });

    this.loadCampaign(true);
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private loadCampaign(initial = false) {
    this.campaignApi.getCampaign(this.campaignId).subscribe({
      next: c => {
        this.campaign = c;
        this.refreshLabels();
        if (initial) {
          this.loading = false;
          if (c.status === 'sent') {
            this.refreshTimer = setInterval(() => this.loadCampaign(), 15_000);
          }
        }
        this.cdr.detectChanges();
      },
      error: err => {
        if (initial) {
          this.error = err.message || 'Could not load campaign report.';
          this.loading = false;
        }
        this.cdr.detectChanges();
      },
    });
  }

  private refreshLabels() {
    if (!this.campaign) return;
    const extras = this.campaign.extras ?? {};
    this.audienceLabel = resolveAudienceLabel(
      this.campaign.sendToSegment,
      extras,
      this.lists,
      this.segments,
    );
    this.loadTemplateLabel(extras);
  }

  private loadTemplateLabel(extras: Record<string, string>) {
    const name = extras['templateName']?.trim();
    if (name) {
      this.templateLabel = name;
      return;
    }

    const templateId = extras['emailTemplateId']?.trim();
    if (!templateId) {
      this.templateLabel = this.campaign?.content?.trim() ? 'Custom content' : '—';
      return;
    }

    this.templateLabel = 'Loading…';
    this.contentApi.getTemplate(templateId).subscribe({
      next: t => {
        this.templateLabel = t.name?.trim() || 'Email template';
        this.cdr.detectChanges();
      },
      error: () => {
        this.templateLabel = 'Email template';
        this.cdr.detectChanges();
      },
    });
  }

  get previewOverrides(): Record<string, string> {
    return buildPreviewOverridesFromExtras(this.campaign?.extras, this.campaign?.fromName);
  }

  get typeLabel(): string {
    return campaignTypeLabel(this.campaign?.campaignType);
  }

  get resolvedSubject(): string {
    return applyPreviewMergeTags(this.campaign?.subject || '', this.previewOverrides);
  }

  get resolvedContent(): string {
    return applyPreviewMergeTags(this.campaign?.content || '', this.previewOverrides);
  }

  get safePreviewContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.resolvedContent);
  }

  get displayOpenRate(): number {
    if (!this.campaign || this.campaign.sent <= 0) return 0;
    const opens = this.campaign.uniqueOpens ?? 0;
    if (opens > 0) return Math.round(opens * 1000 / this.campaign.sent) / 10;
    return Number(this.campaign.openRate) || 0;
  }

  get displayClickRate(): number {
    if (!this.campaign || this.campaign.sent <= 0) return 0;
    const clicks = this.campaign.uniqueClicks ?? 0;
    if (clicks > 0) return Math.round(clicks * 1000 / this.campaign.sent) / 10;
    return Number(this.campaign.clickRate) || 0;
  }

  get displayDate(): string {
    return formatCampaignDateTime(this.campaign);
  }

  get scheduledDisplay(): string {
    if (!this.campaign?.scheduledAt) return this.displayDate;
    return formatCampaignDateTime({ ...this.campaign, status: 'scheduled' });
  }

  get uniqueOpens(): string {
    if (!this.campaign || this.campaign.sent <= 0) return '—';
    const count = this.campaign.uniqueOpens ?? 0;
    return count > 0 ? count.toLocaleString() : '0';
  }

  get uniqueClicks(): string {
    if (!this.campaign || this.campaign.sent <= 0) return '—';
    const count = this.campaign.uniqueClicks ?? 0;
    return count > 0 ? count.toLocaleString() : '0';
  }

  get conversionRate(): string {
    if (!this.campaign || this.campaign.sent <= 0) return '—';
    const opens = this.campaign.uniqueOpens ?? 0;
    const clicks = this.campaign.uniqueClicks ?? 0;
    if (opens === 0) return '0%';
    const rate = this.campaign.conversionRate ?? Math.round(clicks * 1000 / opens) / 10;
    return `${rate}%`;
  }
}
