import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, UnsubscribeDetailPanelComponent, WelcomeSequenceDetailPanelComponent, ReaderMagnetDetailPanelComponent, PostPurchaseDetailPanelComponent, AbandonedCartDetailPanelComponent, PreorderDetailPanelComponent, SeriesCompletionDetailPanelComponent, ReEngagementDetailPanelComponent, MilestoneCelebrationDetailPanelComponent],
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
          <button class="btn-trigger" (click)="triggerFlow()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Trigger Flow
          </button>
          <button class="btn-secondary" (click)="toggleStatus()">
            {{ flow.status === 'active' ? 'Pause Flow' : 'Activate Flow' }}
          </button>
          <button class="btn-primary" (click)="saveFlow()">Save Changes</button>
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

          <!-- Add step container & menu -->
          <div class="add-step-container">
            <button class="add-step-btn" (click)="showAddStepSelector = !showAddStepSelector">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Step
            </button>

            <div class="add-step-menu" *ngIf="showAddStepSelector">
              <button class="menu-item" (click)="addNewStep('email')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                + Email
              </button>
              <button class="menu-item" (click)="addNewStep('wait')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                + Wait
              </button>
              <button class="menu-item" (click)="addNewStep('condition')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                + Condition
              </button>
              <button class="menu-item" (click)="addNewStep('goal-exit')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                + Exit
              </button>
            </div>
          </div>
        </div>

        <!-- Detail / activity panel -->
        <div class="detail-panel">

          <!-- 1. Edit Step Panel (shown if selectedStep is defined) -->
          <ng-container *ngIf="selectedStep">
            <div class="edit-step-panel">
              <div class="edit-step-header">
                <div class="header-left">
                  <h3 class="detail-heading" style="margin: 0; font-size: 1rem;">Edit Step Settings</h3>
                  <span class="step-type-badge" [ngClass]="'badge-' + selectedStep.type">{{ selectedStep.type }}</span>
                </div>
                <button class="btn-delete-step" (click)="deleteStep(selectedStep)" title="Delete this step">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete Step
                </button>
              </div>

              <!-- Form Fields -->
              <div class="edit-step-fields">
                <div class="form-group">
                  <label class="form-label">Step Label</label>
                  <input type="text" class="form-input" [(ngModel)]="selectedStep.label" (ngModelChange)="updateStepDetail(selectedStep)">
                </div>

                <div class="form-group">
                  <label class="form-label">Helper / Description Text</label>
                  <textarea class="form-textarea" rows="2" [(ngModel)]="selectedStep.detail"></textarea>
                </div>

                <!-- Type specific fields -->
                <!-- Trigger / Billing Trigger -->
                <div class="form-group" *ngIf="selectedStep.type === 'trigger' || selectedStep.type === 'billing-trigger'">
                  <label class="form-label">Trigger Event Source</label>
                  <select class="form-select" [(ngModel)]="selectedStep.triggerEvent" (ngModelChange)="onTriggerEventChange(selectedStep)">
                    <option value="subscription">Subscriber joins standard email list</option>
                    <option value="checkout_started">Checkout initiated (payment processor)</option>
                    <option value="purchase_completed">Purchase completed (payment processor)</option>
                    <option value="tag_added">Custom tag applied by automation</option>
                    <option value="billing_failed">Payment failing (dunning active)</option>
                    <option value="subscription_canceled">Subscription canceled by subscriber</option>
                  </select>
                </div>

                <!-- Email fields -->
                <ng-container *ngIf="selectedStep.type === 'email'">
                  <div class="form-group">
                    <label class="form-label">Email Subject</label>
                    <input type="text" class="form-input" [(ngModel)]="selectedStep.subject" placeholder="Enter engaging subject line...">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Preview Text</label>
                    <input type="text" class="form-input" [(ngModel)]="selectedStep.previewText" placeholder="Inbox summary text...">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email Message Body</label>
                    <textarea class="form-textarea" rows="8" [(ngModel)]="selectedStep.emailBody" placeholder="Hi Reader, write your message here..."></textarea>
                  </div>
                </ng-container>

                <!-- Wait fields -->
                <ng-container *ngIf="selectedStep.type === 'wait'">
                  <div class="form-row">
                    <div class="form-group col-half">
                      <label class="form-label">Duration</label>
                      <input type="number" class="form-input" [(ngModel)]="selectedStep.waitDuration" (ngModelChange)="onWaitChange(selectedStep)" min="1">
                    </div>
                    <div class="form-group col-half">
                      <label class="form-label">Unit</label>
                      <select class="form-select" [(ngModel)]="selectedStep.waitUnit" (ngModelChange)="onWaitChange(selectedStep)">
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>
                </ng-container>

                <!-- Condition fields -->
                <div class="form-group" *ngIf="selectedStep.type === 'condition'">
                  <label class="form-label">Filter Condition Rule</label>
                  <select class="form-select" [(ngModel)]="selectedStep.conditionType" (ngModelChange)="onConditionChange(selectedStep)">
                    <option value="opened_email">Opened previous email in sequence</option>
                    <option value="clicked_link">Clicked any link in previous email</option>
                    <option value="has_tag">Subscriber has custom tag</option>
                    <option value="purchased_book">Subscriber purchased any book</option>
                  </select>
                </div>
              </div>

              <button class="btn-save-step" (click)="selectedStep = null">
                Apply & Close Step Editor
              </button>
            </div>
          </ng-container>

          <!-- 2. Overview / Setup Mode (shown when no step is selected) -->
          <ng-container *ngIf="!selectedStep">
            
            <!-- Flow Settings (always editable) -->
            <div class="flow-settings-card">
              <h3 class="detail-heading" style="margin-top: 0; font-size: 1rem;">Flow Settings</h3>
              <div class="form-group">
                <label class="form-label">Flow Name</label>
                <input type="text" class="form-input" [(ngModel)]="flow.name">
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" rows="2" [(ngModel)]="flow.description"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Goal Exit Condition</label>
                <input type="text" class="form-input" [(ngModel)]="flow.goalExit">
              </div>
            </div>

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
              <div class="d-stat-summary">
                <h4 class="form-label" style="margin-bottom: 0.5rem;">Engagement Summary</h4>
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
              </div>
            </ng-container>

          </ng-container>

        </div>
      </div>

      <!-- Toast notification -->
      <div class="toast" *ngIf="showTriggerToast">
        <div class="toast-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16" class="toast-icon">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div class="toast-text">
            <strong>{{ toastTitle }}</strong>
            <span>{{ toastDescription }}</span>
          </div>
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
    /* Toast notification styling */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #fff;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 380px;
    }
    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .toast-icon {
      color: #10b981;
      background: rgba(16, 185, 129, 0.15);
      padding: 4px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .toast-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.8125rem;
    }
    .toast-text strong {
      font-weight: 600;
      color: #fff;
    }
    .toast-text span {
      color: #94a3b8;
    }
    @keyframes slideIn {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .btn-trigger {
      padding: .5rem 1rem; background: #10b981; border: none;
      border-radius: 9px; font-size: .8125rem; font-weight: 600; color: #fff;
      font-family: inherit; cursor: pointer; transition: background .15s;
      display: flex; align-items: center; justify-content: center; gap: 0.25rem;
    }
    .btn-trigger:hover { background: #059669; }

    .add-step-container {
      position: relative;
      margin-top: .875rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .add-step-menu {
      position: absolute;
      top: 100%;
      margin-top: 8px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 50;
      width: 180px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 4px;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #334155;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 0.15s;
    }
    .menu-item:hover {
      background: #f1f5f9;
      color: #2563eb;
    }
    .menu-item svg {
      color: #64748b;
    }
    .menu-item:hover svg {
      color: #2563eb;
    }

    /* Form & Editor Styles */
    .edit-step-panel, .flow-settings-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      text-align: left;
    }
    .flow-settings-card {
      margin-bottom: 1.25rem;
      background: #fafafb;
    }
    .edit-step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-start;
    }
    .btn-delete-step {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.4rem 0.75rem;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 8px;
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .btn-delete-step:hover {
      background: #fee2e2;
      border-color: #fca5a5;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      align-items: flex-start;
      width: 100%;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      width: 100%;
    }
    .col-half {
      flex: 1;
    }
    .form-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.8125rem;
      color: #0f172a;
      background: #ffffff;
      font-family: inherit;
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
      box-sizing: border-box;
    }
    .form-input:focus, .form-textarea:focus, .form-select:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .form-textarea {
      resize: vertical;
      line-height: 1.5;
    }
    .field-help {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 0.125rem;
    }
    .btn-save-step {
      margin-top: 0.5rem;
      padding: 0.625rem;
      background: #3b82f6;
      border: none;
      border-radius: 9px;
      color: #ffffff;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s;
      text-align: center;
      width: 100%;
    }
    .btn-save-step:hover {
      background: #2563eb;
    }
    .step-type-badge {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      width: fit-content;
    }
    .badge-trigger { background: #fef3c7; color: #d97706; }
    .badge-billing-trigger { background: #d1fae5; color: #065f46; }
    .badge-email { background: #dbeafe; color: #1e40af; }
    .badge-wait { background: #f1f5f9; color: #475569; }
    .badge-condition { background: #f3e8ff; color: #5b21b6; }
    .badge-goal-exit { background: #dcfce7; color: #166534; }
  `]
})
export class FlowBuilderComponent {
  @Input() flow!: Flow;
  @Output() onBack = new EventEmitter<void>();

  selectedStep: FlowStep | null = null;
  showAddStepSelector = false;
  showTriggerToast = false;
  toastTitle = 'Flow Triggered!';
  toastDescription = 'Successfully initiated flow for test subscriber.';

  triggerFlow() {
    this.flow.triggers++;
    this.toastTitle = 'Flow Triggered!';
    this.toastDescription = `Successfully initiated flow for test subscriber (Total Triggers: ${this.flow.triggers}).`;
    this.showTriggerToast = true;
    setTimeout(() => {
      this.showTriggerToast = false;
    }, 4000);
  }

  saveFlow() {
    this.toastTitle = 'Changes Saved!';
    this.toastDescription = 'All changes to the flow and steps have been saved successfully.';
    this.showTriggerToast = true;
    setTimeout(() => {
      this.showTriggerToast = false;
    }, 4000);
  }

  deleteStep(step: FlowStep) {
    const index = this.flow.steps.findIndex(s => s.id === step.id);
    if (index > -1) {
      this.flow.steps.splice(index, 1);
      this.selectedStep = null;
    }
  }

  updateStepDetail(step: FlowStep) {
    // Optional additional custom reactions
  }

  onWaitChange(step: FlowStep) {
    if (step.waitDuration && step.waitUnit) {
      step.detail = `Wait ${step.waitDuration} ${step.waitUnit} before moving to next step`;
    }
  }

  onConditionChange(step: FlowStep) {
    const map: Record<string, string> = {
      opened_email: 'Split path: if user opened previous email, continue',
      clicked_link: 'Split path: if user clicked any link, continue',
      has_tag: 'Split path: if user has custom tag, continue',
      purchased_book: 'Split path: if user purchased any book, continue'
    };
    step.detail = map[step.conditionType || ''] || step.detail;
  }

  onTriggerEventChange(step: FlowStep) {
    const map: Record<string, string> = {
      subscription: 'Triggered when a subscriber joins the list',
      checkout_started: 'Triggered when checkout is initiated',
      purchase_completed: 'Triggered when a purchase completes',
      tag_added: 'Triggered when a custom tag is applied',
      billing_failed: 'Triggered on billing payment failure',
      subscription_canceled: 'Triggered when subscription is canceled'
    };
    step.detail = map[step.triggerEvent || ''] || step.detail;
  }

  addNewStep(type: 'email' | 'wait' | 'condition' | 'goal-exit') {
    const stepLabels: Record<string, string> = {
      email: 'Send Campaign Email',
      wait: 'Wait Duration',
      condition: 'Check Email Engagement',
      'goal-exit': 'Exit Flow Sequence'
    };

    const stepDetails: Record<string, string> = {
      email: 'Deliver the next follow-up message to the user',
      wait: 'Wait 3 days before moving to next step',
      condition: 'Split path: if user opened previous email, continue',
      'goal-exit': 'Cleanly terminate automated campaign'
    };

    const newStep: FlowStep = {
      id: `${Date.now()}`,
      type: type as any,
      label: stepLabels[type],
      detail: stepDetails[type]
    };

    if (type === 'email') {
      newStep.subject = 'Follow-up Email';
      newStep.previewText = 'A quick message for you...';
      newStep.emailBody = 'Hello! Write your email content here.';
    } else if (type === 'wait') {
      newStep.waitDuration = 3;
      newStep.waitUnit = 'days';
    } else if (type === 'condition') {
      newStep.conditionType = 'opened_email';
    }

    this.flow.steps.push(newStep);
    this.selectedStep = newStep;
    this.showAddStepSelector = false;
  }

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
