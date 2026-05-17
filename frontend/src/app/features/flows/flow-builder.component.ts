import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow, FlowStep, SubscriptionMetrics } from '../../core/services/mock-data.service';
import { UnsubscribeDetailPanelComponent } from './unsubscribe/unsubscribe-detail-panel.component';
import { WelcomeSequenceDetailPanelComponent } from './welcome-sequence/welcome-sequence-detail-panel.component';
import { ReaderMagnetDetailPanelComponent } from './reader-magnet/reader-magnet-detail-panel.component';
import { PostPurchaseDetailPanelComponent } from './post-purchase/post-purchase-detail-panel.component';
import { AbandonedCartDetailPanelComponent } from './abandoned-cart/abandoned-cart-detail-panel.component';
import { PreorderDetailPanelComponent } from './preorder/preorder-detail-panel.component';
import { SeriesCompletionDetailPanelComponent } from './series-completion/series-completion-detail-panel.component';
import { ReEngagementDetailPanelComponent } from './re-engagement/re-engagement-detail-panel.component';
import { MilestoneCelebrationDetailPanelComponent } from './milestone-celebration/milestone-celebration-detail-panel.component';

@Component({
  selector: 'app-flow-builder',
  standalone: true,
  imports: [CommonModule, UnsubscribeDetailPanelComponent, WelcomeSequenceDetailPanelComponent, ReaderMagnetDetailPanelComponent, PostPurchaseDetailPanelComponent, AbandonedCartDetailPanelComponent, PreorderDetailPanelComponent, SeriesCompletionDetailPanelComponent, ReEngagementDetailPanelComponent, MilestoneCelebrationDetailPanelComponent],
  template: `
    <div class="builder-wrapper">

      <!-- Builder header -->
      <div class="builder-header">
        <button class="back-btn" (click)="onBack.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Flows
        </button>

        <div class="builder-title-row">
          <div class="builder-family-icon" [ngClass]="'icon-' + flow.family">
            <svg *ngIf="flow.family === 'onboarding'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <svg *ngIf="flow.family === 'transaction'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <svg *ngIf="flow.family === 'launch'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <svg *ngIf="flow.family === 'retention'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2 class="builder-title">{{ flow.name }}</h2>
          <span class="status-badge" [ngClass]="'status-' + flow.status">{{ flow.status }}</span>
        </div>

        <div class="builder-actions">
          <button class="btn-secondary" (click)="toggleStatus()">
            {{ flow.status === 'active' ? 'Pause Flow' : 'Activate Flow' }}
          </button>
          <button class="btn-primary">Save Changes</button>
        </div>
      </div>

      <!-- Webhook requirement notice (subscription flows only) -->
      <div class="webhook-notice" *ngIf="flow.requiresWebhook">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        <div class="webhook-notice-text">
          <strong>Requires connected payment processor.</strong>
          This flow is triggered by billing events via real-time webhook — not email list events.
          Confirm your payment processor is connected and test with a real billing event before going live.
        </div>
      </div>

      <!-- Builder body -->
      <div class="builder-body">

        <!-- Steps canvas -->
        <div class="steps-canvas">
          <div class="step-wrapper" *ngFor="let step of flow.steps; let i = index; let last = last">

            <div class="flow-step"
                 [ngClass]="['step-' + step.type, selectedStep?.id === step.id ? 'selected' : '']"
                 (click)="selectStep(step)">
              <div class="step-icon" [ngClass]="'icon-' + step.type">
                <!-- trigger -->
                <svg *ngIf="step.type === 'trigger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <!-- billing-trigger -->
                <svg *ngIf="step.type === 'billing-trigger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  <line x1="6" y1="15" x2="10" y2="15"/>
                </svg>
                <!-- email -->
                <svg *ngIf="step.type === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <!-- wait -->
                <svg *ngIf="step.type === 'wait'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <!-- condition -->
                <svg *ngIf="step.type === 'condition'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <!-- goal-exit -->
                <svg *ngIf="step.type === 'goal-exit'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>

              <div class="step-body">
                <span class="step-type-tag">{{ step.type | titlecase }}</span>
                <span class="step-label">{{ step.label }}</span>
                <span class="step-detail">{{ step.detail }}</span>
              </div>

              <span class="step-num">{{ i + 1 }}</span>
            </div>

            <!-- Connector -->
            <div class="connector" *ngIf="!last">
              <div class="connector-line"></div>
              <div class="connector-dot"></div>
            </div>
          </div>

          <!-- Add step -->
          <button class="add-step-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Step
          </button>
        </div>

        <!-- Detail / activity panel -->
        <div class="detail-panel">

          <!-- Unsubscribe flows: use dedicated panel -->
          <app-unsubscribe-detail-panel
            *ngIf="isUnsubscribeFlow"
            [flow]="flow">
          </app-unsubscribe-detail-panel>

          <!-- Welcome Sequence: use dedicated panel -->
          <app-welcome-sequence-detail-panel
            *ngIf="isWelcomeSequenceFlow">
          </app-welcome-sequence-detail-panel>

          <!-- Reader Magnet Delivery: use dedicated panel -->
          <app-reader-magnet-detail-panel
            *ngIf="isReaderMagnetFlow">
          </app-reader-magnet-detail-panel>

          <!-- Post-Purchase flows: use dedicated panel -->
          <app-post-purchase-detail-panel
            *ngIf="isPostPurchaseFlow"
            [flow]="flow">
          </app-post-purchase-detail-panel>

          <!-- Abandoned Cart / Checkout flows: use dedicated panel -->
          <app-abandoned-cart-detail-panel
            *ngIf="isAbandonedFlow"
            [flow]="flow">
          </app-abandoned-cart-detail-panel>

          <!-- Preorder flow: use dedicated panel -->
          <app-preorder-detail-panel
            *ngIf="isPreorderFlow"
            [flow]="flow">
          </app-preorder-detail-panel>

          <!-- Series Completion flow: use dedicated panel -->
          <app-series-completion-detail-panel
            *ngIf="isSeriesCompletionFlow"
            [flow]="flow">
          </app-series-completion-detail-panel>

          <!-- Re-engagement flow: use dedicated panel -->
          <app-re-engagement-detail-panel
            *ngIf="isReEngagementFlow"
            [flow]="flow">
          </app-re-engagement-detail-panel>

          <!-- Milestone Celebration flow: use dedicated panel -->
          <app-milestone-celebration-detail-panel
            *ngIf="isMilestoneCelebrationFlow"
            [flow]="flow">
          </app-milestone-celebration-detail-panel>

          <!-- All other flows: standard detail panel -->
          <ng-container *ngIf="!isUnsubscribeFlow && !isWelcomeSequenceFlow && !isReaderMagnetFlow && !isPostPurchaseFlow && !isAbandonedFlow && !isPreorderFlow && !isSeriesCompletionFlow && !isReEngagementFlow && !isMilestoneCelebrationFlow">

            <!-- No step selected: flow overview -->
            <ng-container *ngIf="!selectedStep">
              <h3 class="detail-heading">Flow Details</h3>
              <div class="detail-stats">
                <div class="d-stat">
                  <span class="d-val">{{ flow.triggers | number }}</span>
                  <span class="d-label">Total Triggered</span>
                </div>
                <div class="d-stat">
                  <span class="d-val">{{ flow.steps.length }}</span>
                  <span class="d-label">Steps</span>
                </div>
              </div>

              <!-- Goal exit -->
              <div class="goal-exit-panel">
                <div class="goal-exit-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Goal Exit
                </div>
                <p class="goal-exit-text">{{ flow.goalExit }}</p>
              </div>

              <p class="detail-hint">Click any step to see its details and the activity log.</p>

              <!-- Subscription metrics (billing flows only) -->
              <div class="sub-metrics-panel" *ngIf="flow.subscriptionMetrics">
                <div class="sub-metrics-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  Billing Metrics
                </div>
                <div class="sub-metric" *ngIf="flow.subscriptionMetrics.paymentUpdateRate !== undefined">
                  <span class="sub-metric-val">{{ flow.subscriptionMetrics.paymentUpdateRate }}%</span>
                  <span class="sub-metric-label">Payment update rate</span>
                </div>
                <div class="sub-metric" *ngIf="flow.subscriptionMetrics.retentionRateDunning !== undefined">
                  <span class="sub-metric-val">{{ flow.subscriptionMetrics.retentionRateDunning }}%</span>
                  <span class="sub-metric-label">Retention through dunning</span>
                </div>
                <div class="sub-metric" *ngIf="flow.subscriptionMetrics.cancellationRate !== undefined">
                  <span class="sub-metric-val">{{ flow.subscriptionMetrics.cancellationRate }}%</span>
                  <span class="sub-metric-label">Cancellation rate</span>
                </div>
                <div class="sub-metric" *ngIf="flow.subscriptionMetrics.resubscriptionRate !== undefined">
                  <span class="sub-metric-val">{{ flow.subscriptionMetrics.resubscriptionRate }}%</span>
                  <span class="sub-metric-label">Re-subscription rate</span>
                </div>
              </div>
            </ng-container>

            <!-- Step selected: step detail + why panel -->
            <ng-container *ngIf="selectedStep">
              <div class="step-detail-header">
                <h3 class="detail-heading">{{ selectedStep.label }}</h3>
                <span class="step-type-badge" [ngClass]="'badge-' + selectedStep.type">{{ selectedStep.type }}</span>
              </div>
              <p class="step-detail-text">{{ selectedStep.detail }}</p>

              <!-- Why did this send? -->
              <div class="why-panel">
                <div class="why-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Why did this send?
                </div>
                <div class="why-row">
                  <span class="why-key">Event</span>
                  <span class="why-val">{{ getWhyEvent(selectedStep) }}</span>
                </div>
                <div class="why-row">
                  <span class="why-key">Timestamp</span>
                  <span class="why-val">Mar 15, 2026 at 9:42 AM</span>
                </div>
                <div class="why-row">
                  <span class="why-key">Triggered for</span>
                  <span class="why-val">{{ flow.triggers | number }} subscribers</span>
                </div>
                <div class="why-row" *ngIf="selectedStep.type === 'wait'">
                  <span class="why-key">Quiet hours</span>
                  <span class="why-val why-green">Applied — sent at 9:00 AM local time</span>
                </div>
              </div>

              <!-- Goal exit reminder if this is the goal-exit step -->
              <div class="goal-exit-panel" *ngIf="selectedStep.type === 'goal-exit'">
                <div class="goal-exit-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Goal Exit
                </div>
                <p class="goal-exit-text">{{ flow.goalExit }}</p>
                <p class="goal-exit-note">Readers who reach this step are removed from the sequence and move to the next appropriate stage of their journey.</p>
              </div>
            </ng-container>

          </ng-container>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .builder-wrapper { display: flex; flex-direction: column; gap: 0; }

    /* Header */
    .builder-header {
      display: flex; align-items: center; gap: 1.25rem;
      margin-bottom: 2rem; flex-wrap: wrap;
    }
    .back-btn {
      display: flex; align-items: center; gap: .4rem;
      padding: .45rem .875rem; background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 9px; font-size: .8125rem; font-weight: 600; color: #64748b;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .back-btn:hover { border-color: #93c5fd; color: #3b82f6; background: #eff6ff; }

    .builder-title-row { display: flex; align-items: center; gap: .75rem; flex: 1; min-width: 0; }
    .builder-family-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-onboarding { background: rgba(99,102,241,.1); color: #6366f1; }
    .icon-transaction { background: rgba(16,185,129,.1); color: #059669; }
    .icon-launch { background: rgba(245,158,11,.1); color: #d97706; }
    .icon-retention { background: rgba(236,72,153,.1); color: #db2777; }

    .builder-title {
      font-size: 1.25rem; font-weight: 800; color: #0f172a;
      margin: 0; letter-spacing: -.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .status-badge {
      padding: .25rem .6rem; border-radius: 20px;
      font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; flex-shrink: 0;
    }
    .status-active { background: #dcfce7; color: #16a34a; }
    .status-paused { background: #fef3c7; color: #d97706; }
    .status-draft { background: #f1f5f9; color: #64748b; }

    .builder-actions { display: flex; gap: .625rem; flex-shrink: 0; }
    .btn-secondary {
      padding: .5rem 1rem; background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 9px; font-size: .8125rem; font-weight: 600; color: #334155;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .btn-secondary:hover { border-color: #bfdbfe; color: #3b82f6; }
    .btn-primary {
      padding: .5rem 1rem; background: #3b82f6; border: none;
      border-radius: 9px; font-size: .8125rem; font-weight: 600; color: #fff;
      font-family: inherit; cursor: pointer; transition: background .15s;
    }
    .btn-primary:hover { background: #2563eb; }

    /* Body — detail panel gets more width than the steps canvas */
    .builder-body {
      display: grid;
      grid-template-columns: minmax(260px, 0.85fr) minmax(380px, 1.35fr);
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 1100px) {
      .builder-body {
        grid-template-columns: minmax(220px, 0.75fr) minmax(320px, 1.25fr);
        gap: 1.25rem;
      }
    }
    @media (max-width: 900px) {
      .builder-body { grid-template-columns: 1fr; }
      .detail-panel { order: -1; }
    }

    /* Steps canvas */
    .steps-canvas {
      display: flex; flex-direction: column; align-items: center;
      min-width: 0; max-width: 100%;
    }
    .step-wrapper {
      display: flex; flex-direction: column; align-items: center;
      width: 100%; max-width: min(500px, 100%);
    }

    .flow-step {
      width: 100%; display: flex; align-items: center; gap: .875rem;
      padding: 1rem 1.125rem; background: #fff;
      border: 1.5px solid #e2e8f0; border-radius: 14px;
      cursor: pointer; transition: all .18s;
      box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }
    .flow-step:hover { border-color: #bfdbfe; transform: translateX(3px); box-shadow: 0 4px 12px rgba(59,130,246,.08); }
    .flow-step.selected { border-color: #3b82f6; background: #f0f7ff; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
    .step-goal-exit { border-style: dashed; border-color: #10b981; }
    .step-goal-exit:hover { border-color: #059669; }
    .step-goal-exit.selected { border-color: #059669; background: #f0fdf4; box-shadow: 0 0 0 3px rgba(16,185,129,.12); }

    .step-icon {
      width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-trigger { background: rgba(245,158,11,.1); color: #d97706; }
    .icon-billing-trigger { background: rgba(16,185,129,.1); color: #059669; }
    .icon-email { background: rgba(59,130,246,.1); color: #3b82f6; }
    .icon-wait { background: #f1f5f9; color: #64748b; }
    .icon-condition { background: rgba(139,92,246,.1); color: #8b5cf6; }
    .icon-goal-exit { background: rgba(16,185,129,.1); color: #059669; }

    .step-body { flex: 1; display: flex; flex-direction: column; gap: .1rem; min-width: 0; }
    .step-type-tag { font-size: .63rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; }
    .step-label { font-size: .875rem; font-weight: 600; color: #0f172a; }
    .step-detail { font-size: .76rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .step-num {
      width: 22px; height: 22px; border-radius: 50%; background: #f1f5f9;
      display: flex; align-items: center; justify-content: center;
      font-size: .68rem; font-weight: 700; color: #94a3b8; flex-shrink: 0;
    }

    .connector { display: flex; flex-direction: column; align-items: center; height: 28px; }
    .connector-line { width: 2px; flex: 1; background: #e2e8f0; }
    .connector-dot { width: 7px; height: 7px; border-radius: 50%; background: #cbd5e1; }

    .add-step-btn {
      display: flex; align-items: center; gap: .5rem; margin-top: .875rem;
      padding: .65rem 1.5rem; background: #f8fafc;
      border: 1.5px dashed #cbd5e1; border-radius: 12px;
      color: #94a3b8; font-size: .8125rem; font-weight: 500; font-family: inherit;
      cursor: pointer; transition: all .18s;
    }
    .add-step-btn:hover { background: #f0f7ff; border-color: #93c5fd; color: #3b82f6; }

    /* Detail panel */
    .detail-panel {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.375rem; position: sticky; top: 80px;
      min-width: 0; width: 100%; overflow: hidden; box-sizing: border-box;
    }
    .detail-panel > * { min-width: 0; max-width: 100%; }
    .detail-heading { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 1rem; }
    .detail-stats { display: flex; gap: 1.5rem; margin-bottom: 1.25rem; }
    .d-stat { display: flex; flex-direction: column; }
    .d-val { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
    .d-label { font-size: .68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
    .detail-hint { font-size: .78rem; color: #94a3b8; margin: 1rem 0 0; }

    /* Goal exit panel */
    .goal-exit-panel {
      background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px;
      padding: .875rem; margin-bottom: 1rem;
    }
    .goal-exit-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
      color: #059669; margin-bottom: .5rem;
    }
    .goal-exit-text { font-size: .8125rem; color: #166534; margin: 0 0 .375rem; line-height: 1.45; }
    .goal-exit-note { font-size: .75rem; color: #4ade80; margin: 0; }

    /* Step detail */
    .step-detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .75rem; }
    .step-type-badge {
      padding: .2rem .55rem; border-radius: 6px;
      font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    .badge-trigger { background: rgba(245,158,11,.1); color: #d97706; }
    .badge-billing-trigger { background: rgba(16,185,129,.1); color: #059669; }
    .badge-email { background: rgba(59,130,246,.1); color: #3b82f6; }
    .badge-wait { background: #f1f5f9; color: #64748b; }
    .badge-condition { background: rgba(139,92,246,.1); color: #8b5cf6; }
    .badge-goal-exit { background: rgba(16,185,129,.1); color: #059669; }
    .step-detail-text { font-size: .8125rem; color: #64748b; margin: 0 0 1.25rem; line-height: 1.5; }

    /* Why panel */
    .why-panel {
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: .875rem; margin-bottom: 1rem;
    }
    .why-title {
      display: flex; align-items: center; gap: .375rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
      color: #64748b; margin-bottom: .75rem;
    }
    .why-row { display: flex; gap: .5rem; margin-bottom: .4rem; font-size: .8rem; }
    .why-row:last-child { margin-bottom: 0; }
    .why-key { color: #94a3b8; font-weight: 600; min-width: 95px; flex-shrink: 0; }
    .why-val { color: #334155; }
    .why-green { color: #059669; font-weight: 600; }

    /* Webhook notice */
    .webhook-notice {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .875rem 1rem; margin-bottom: 1.5rem;
      background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px;
      font-size: .8125rem; color: #92400e; line-height: 1.5;
    }
    .webhook-notice svg { flex-shrink: 0; margin-top: 1px; color: #d97706; }
    .webhook-notice-text strong { font-weight: 700; display: block; margin-bottom: .2rem; }

    /* Subscription metrics panel */
    .sub-metrics-panel {
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: .875rem; margin-top: 1rem;
    }
    .sub-metrics-title {
      display: flex; align-items: center; gap: .375rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
      color: #64748b; margin-bottom: .75rem;
    }
    .sub-metric { display: flex; align-items: baseline; gap: .5rem; margin-bottom: .5rem; }
    .sub-metric:last-child { margin-bottom: 0; }
    .sub-metric-val { font-size: 1.125rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
    .sub-metric-label { font-size: .75rem; color: #94a3b8; }
  `]
})
export class FlowBuilderComponent {
  @Input() flow!: Flow;
  @Output() onBack = new EventEmitter<void>();

  selectedStep: FlowStep | null = null;

  get isUnsubscribeFlow(): boolean {
    return this.flow?.id === '13a' || this.flow?.id === '13b';
  }

  get isWelcomeSequenceFlow(): boolean {
    return this.flow?.id === '1';
  }

  get isReaderMagnetFlow(): boolean {
    return this.flow?.id === '2';
  }

  /** Post-purchase transaction flows: Order Confirmation, Thank You, Follow-Up, Review Request, Repeat Thank You */
  get isPostPurchaseFlow(): boolean {
    return ['3', '4', '20', '21', '22'].includes(this.flow?.id ?? '');
  }

  /** Abandoned Cart and Abandoned Checkout flows */
  get isAbandonedFlow(): boolean {
    return ['5', '6'].includes(this.flow?.id ?? '');
  }

  /** Preorder Confirmation & Nurture flow */
  get isPreorderFlow(): boolean {
    return this.flow?.id === '8';
  }

  /** Series Completion flow */
  get isSeriesCompletionFlow(): boolean {
    return this.flow?.id === '9';
  }

  /** Re-engagement flow */
  get isReEngagementFlow(): boolean {
    return this.flow?.id === '11';
  }

  /** Milestone Celebration flow */
  get isMilestoneCelebrationFlow(): boolean {
    return this.flow?.id === '12';
  }

  selectStep(step: FlowStep) {
    this.selectedStep = this.selectedStep?.id === step.id ? null : step;
  }

  toggleStatus() {
    this.flow = {
      ...this.flow,
      status: this.flow.status === 'active' ? 'paused' : 'active'
    };
  }

  getWhyEvent(step: FlowStep): string {
    const map: Record<string, string> = {
      trigger: 'Subscriber action matched trigger condition',
      'billing-trigger': 'Billing event received via webhook from payment processor',
      email: 'Previous step completed successfully',
      wait: 'Timer elapsed (quiet hours applied)',
      condition: 'Subscriber behavior evaluated',
      'goal-exit': 'Goal condition met — subscriber exited flow'
    };
    return map[step.type] ?? 'Unknown event';
  }
}
