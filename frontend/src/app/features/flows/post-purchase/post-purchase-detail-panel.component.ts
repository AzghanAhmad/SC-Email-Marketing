import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { PostPurchaseSequenceIntroComponent } from './post-purchase-sequence-intro.component';
import { PostPurchaseSixEmailsComponent } from './post-purchase-six-emails.component';
import { PostPurchaseEmailGuidesComponent } from './post-purchase-email-guides.component';
import { PostPurchaseConditionalRoutingComponent } from './post-purchase-conditional-routing.component';
import { PostPurchaseReviewRequestComponent } from './post-purchase-review-request.component';
import { PostPurchasePerformanceComponent } from './post-purchase-performance.component';

type PanelTab = 'overview' | 'emails' | 'routing' | 'review' | 'performance';

@Component({
  selector: 'app-post-purchase-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    PostPurchaseSequenceIntroComponent,
    PostPurchaseSixEmailsComponent,
    PostPurchaseEmailGuidesComponent,
    PostPurchaseConditionalRoutingComponent,
    PostPurchaseReviewRequestComponent,
    PostPurchasePerformanceComponent,
  ],
  template: `
    <div class="pp-panel">

      <!-- Panel header -->
      <div class="pp-panel-header">
        <div class="pp-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <div class="pp-panel-title-block">
          <h3 class="pp-panel-title">Post-Purchase Flows</h3>
          <span class="pp-panel-sub">Transaction family · 6 emails</span>
        </div>
      </div>

      <!-- Tab nav -->
      <div class="pp-tabs">
        <button class="pp-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="pp-tab" [class.active]="activeTab === 'emails'" (click)="activeTab = 'emails'">Email Guides</button>
        <button class="pp-tab" [class.active]="activeTab === 'routing'" (click)="activeTab = 'routing'">Routing</button>
        <button class="pp-tab" [class.active]="activeTab === 'review'" (click)="activeTab = 'review'">Reviews</button>
        <button class="pp-tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Stats</button>
      </div>

      <!-- Tab content -->
      <div class="pp-tab-content">

        <!-- Overview -->
        <div *ngIf="activeTab === 'overview'">
          <app-post-purchase-sequence-intro></app-post-purchase-sequence-intro>
          <app-post-purchase-six-emails></app-post-purchase-six-emails>
          <div class="pp-scribecount-note">
            <div class="pp-sc-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <span>How ScribeCount Email connects the sequence</span>
            </div>
            <p>
              When a purchase is completed, your store sends a purchase event to ScribeCount Email
              in real time — not on a schedule, not at the next sync window, but immediately.
              ScribeCount receives the event, identifies the reader, checks their purchase history,
              and begins routing them through the appropriate sequence within seconds.
            </p>
            <p>
              The order confirmation and digital delivery fire within that first minute. The
              post-purchase thank you follows immediately after. The follow-up and review request
              are queued at the appropriate delays and fire automatically when those windows arrive,
              regardless of whether you're available to monitor anything.
            </p>
          </div>
        </div>

        <!-- Email Guides -->
        <div *ngIf="activeTab === 'emails'">
          <app-post-purchase-email-guides></app-post-purchase-email-guides>
        </div>

        <!-- Routing -->
        <div *ngIf="activeTab === 'routing'">
          <app-post-purchase-conditional-routing></app-post-purchase-conditional-routing>
          <div class="pp-timing-guide">
            <h4 class="pp-timing-title">Timing Reference</h4>
            <div class="pp-timing-list">
              <div class="pp-timing-row" *ngFor="let t of timingRows">
                <div class="pp-timing-when">{{ t.when }}</div>
                <div class="pp-timing-what">
                  <span class="pp-timing-name">{{ t.name }}</span>
                  <span class="pp-timing-note">{{ t.note }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Request -->
        <div *ngIf="activeTab === 'review'">
          <app-post-purchase-review-request></app-post-purchase-review-request>
        </div>

        <!-- Performance -->
        <div *ngIf="activeTab === 'performance'">
          <app-post-purchase-performance></app-post-purchase-performance>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .pp-panel { display: flex; flex-direction: column; gap: 0; }

    .pp-panel-header {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
    }
    .pp-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(16,185,129,0.1); color: #059669;
      display: flex; align-items: center; justify-content: center;
    }
    .pp-panel-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .pp-panel-sub { font-size: .72rem; color: #94a3b8; }

    /* Tabs */
    .pp-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .pp-tab {
      flex: 1; min-width: 0; padding: .4rem .5rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .72rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s;
      white-space: nowrap;
    }
    .pp-tab:hover { color: #0f172a; }
    .pp-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .pp-tab-content { }

    /* ScribeCount note */
    .pp-scribecount-note {
      background: rgba(16,185,129,0.04);
      border: 1.5px solid rgba(16,185,129,0.15);
      border-radius: 12px; padding: 1rem;
    }
    .pp-sc-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #059669; margin-bottom: .625rem;
    }
    .pp-scribecount-note p {
      font-size: .78rem; color: #374151; margin: 0 0 .5rem; line-height: 1.6;
    }
    .pp-scribecount-note p:last-child { margin-bottom: 0; }

    /* Timing guide */
    .pp-timing-guide {
      background: #f8fafc; border: 1.5px solid #f1f5f9;
      border-radius: 12px; padding: 1.125rem;
    }
    .pp-timing-title {
      font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .75rem;
    }
    .pp-timing-list { display: flex; flex-direction: column; gap: 0; }
    .pp-timing-row {
      display: flex; gap: .875rem; padding: .625rem 0;
      border-bottom: 1px solid #f1f5f9; align-items: flex-start;
    }
    .pp-timing-row:last-child { border-bottom: none; }
    .pp-timing-when {
      font-size: .72rem; font-weight: 700; color: #3b82f6;
      min-width: 110px; flex-shrink: 0; padding-top: .1rem;
    }
    .pp-timing-what { display: flex; flex-direction: column; gap: .15rem; }
    .pp-timing-name { font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .pp-timing-note { font-size: .72rem; color: #64748b; line-height: 1.4; }
  `]
})
export class PostPurchaseDetailPanelComponent {
  @Input() flow!: Flow;

  activeTab: PanelTab = 'overview';

  timingRows = [
    {
      when: 'Within seconds',
      name: 'Order Confirmation',
      note: 'Fires the moment the purchase event is received — before the reader has refreshed their inbox once'
    },
    {
      when: 'Immediately after',
      name: 'Digital Delivery',
      note: 'Fires alongside or right after the confirmation — puts the book in the reader\'s hands'
    },
    {
      when: 'Same minute',
      name: 'Post-Purchase Thank You',
      note: 'First-time buyers only — conditional routing fires immediately after delivery'
    },
    {
      when: '3–5 days',
      name: 'Post-Purchase Follow-Up',
      note: 'Timed to land when the reader has had a realistic opportunity to make meaningful progress'
    },
    {
      when: '4–7 days',
      name: 'Review Request',
      note: 'Shorter reads: 4 days. Novels: 6–7 days. Goal exit fires when reader clicks any review link'
    },
    {
      when: 'On return purchase',
      name: 'Repeat Purchase Thank You',
      note: 'Fires instead of the standard thank you — routing is automatic based on purchase history'
    },
  ];
}
