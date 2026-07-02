import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Flow, FlowFormField, FlowStep } from '../../core/services/mock-data.service';
import { FlowApiService, FlowResults } from '../../core/services/flow-api.service';
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
          <button class="btn-secondary" (click)="viewResults()">View Results</button>
          <button class="btn-primary" (click)="saveFlow()" [disabled]="saving">Save Changes</button>
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
          <p class="steps-reorder-hint" *ngIf="flow.steps.length > 1">Drag steps to reorder</p>
          <div class="step-wrapper"
               *ngFor="let step of flow.steps; let i = index; let last = last"
               [class.drag-over-above]="dragOverIndex === i && dragOverPosition === 'above'"
               [class.drag-over-below]="dragOverIndex === i && dragOverPosition === 'below'"
               (dragover)="onStepDragOver($event, i)"
               (dragleave)="onStepDragLeave($event, i)"
               (drop)="onStepDrop($event, i)">

            <div class="flow-step"
                 [ngClass]="['step-' + step.type, selectedStep?.id === step.id ? 'selected' : '', canDragStep(step) ? 'draggable' : '', draggedStepIndex === i ? 'dragging' : '']"
                 [attr.draggable]="canDragStep(step) ? true : null"
                 (dragstart)="onDragStart($event, i)"
                 (dragend)="onDragEnd()"
                 (click)="selectStep(step)">
              <button type="button"
                      class="drag-handle"
                      *ngIf="canDragStep(step)"
                      title="Drag to reorder"
                      (click)="$event.stopPropagation()"
                      (mousedown)="$event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                  <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                  <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                </svg>
              </button>
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
              <button class="menu-item" (click)="addNewStep('form')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                + Collect Info
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
                    <label class="form-label">Email Message Body</label>
                    <textarea class="form-textarea" rows="8" [(ngModel)]="selectedStep.emailBody" placeholder="Hi Reader, write your message here..."></textarea>
                  </div>
                </ng-container>

                <ng-container *ngIf="selectedStep.type === 'form'">
                  <div class="form-group">
                    <label class="form-label">Form Fields</label>
                    <div class="form-field-block" *ngFor="let field of selectedStep.formFields; let fi = index">
                      <div class="form-field-row">
                        <input type="text" class="form-input" [(ngModel)]="field.label" placeholder="Field label">
                        <select class="form-select" [(ngModel)]="field.type" (ngModelChange)="onFormFieldTypeChange(field, $event)">
                          <option value="text">Short text</option>
                          <option value="textarea">Long text</option>
                          <option value="select">Choice</option>
                        </select>
                        <button type="button" class="remove-field-btn" (click)="removeFormField(selectedStep, fi)">×</button>
                      </div>
                      <div class="choice-options-panel" *ngIf="field.type === 'select'">
                        <label class="form-label">Choice options</label>
                        <p class="field-help">Add each option readers can pick from.</p>
                        <div class="choice-option-row" *ngFor="let opt of field.options; let oi = index; trackBy: trackByIndex">
                          <input type="text" class="form-input" [(ngModel)]="field.options![oi]" placeholder="Option {{ oi + 1 }}">
                          <button type="button" class="remove-field-btn" (click)="removeChoiceOption(field, oi)" [disabled]="(field.options?.length || 0) <= 1">×</button>
                        </div>
                        <button type="button" class="btn-ghost btn-sm" (click)="addChoiceOption(field)">+ Add option</button>
                      </div>
                    </div>
                    <button type="button" class="btn-ghost btn-sm" (click)="addFormField(selectedStep)">+ Add field</button>
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
      <div class="toast" [class.toast-error]="toastIsError" *ngIf="showTriggerToast">
        <div class="toast-content">
          <svg *ngIf="!toastIsError" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16" class="toast-icon">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg *ngIf="toastIsError" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16" class="toast-icon toast-icon-error">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div class="toast-text">
            <strong>{{ toastTitle }}</strong>
            <span>{{ toastDescription }}</span>
          </div>
        </div>
      </div>

      <div class="results-backdrop" *ngIf="showResults" (click)="showResults = false">
        <div class="results-modal" (click)="$event.stopPropagation()">
          <div class="results-header">
            <h3>Flow Results</h3>
            <button type="button" class="close-btn" (click)="showResults = false">×</button>
          </div>
          <div class="results-loading" *ngIf="resultsLoading">Loading results…</div>
          <ng-container *ngIf="!resultsLoading && results">
            <div class="results-stats">
              <div><span class="stat-label">Runs</span><span class="stat-value">{{ results.totalRuns }}</span></div>
              <div><span class="stat-label">Enrolled</span><span class="stat-value">{{ results.totalEnrollments }}</span></div>
              <div><span class="stat-label">Completed</span><span class="stat-value">{{ results.completedEnrollments }}</span></div>
              <div><span class="stat-label">In progress</span><span class="stat-value">{{ results.inProgressEnrollments }}</span></div>
            </div>
            <div class="results-table-wrap" *ngIf="results.responses.length > 0">
              <table class="results-table">
                <thead><tr><th>Subscriber</th><th>Step</th><th>Response</th><th>When</th></tr></thead>
                <tbody>
                  <tr *ngFor="let row of results.responses">
                    <td>{{ row.subscriberName }}<br><span class="sub-email">{{ row.subscriberEmail }}</span></td>
                    <td>{{ row.stepLabel }}</td>
                    <td>{{ row.responseSummary }}</td>
                    <td>{{ row.submittedAt | date:'short' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="results-empty" *ngIf="results.responses.length === 0">No responses yet. Trigger the flow to enroll subscribers.</p>
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
    .steps-reorder-hint {
      margin: 0 0 .75rem;
      font-size: .72rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .06em;
    }
    .step-wrapper {
      display: flex; flex-direction: column; align-items: center;
      width: 100%; max-width: min(500px, 100%);
      position: relative;
    }
    .step-wrapper.drag-over-above::before,
    .step-wrapper.drag-over-below::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      background: #3b82f6;
      border-radius: 100px;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      z-index: 2;
      pointer-events: none;
    }
    .step-wrapper.drag-over-above::before { top: -6px; }
    .step-wrapper.drag-over-below::after { bottom: -6px; }

    .flow-step {
      width: 100%; display: flex; align-items: center; gap: .875rem;
      padding: 1rem 1.125rem; background: #fff;
      border: 1.5px solid #e2e8f0; border-radius: 14px;
      cursor: pointer; transition: all .18s;
      box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }
    .flow-step.draggable { cursor: grab; }
    .flow-step.draggable:active { cursor: grabbing; }
    .flow-step.dragging {
      opacity: .55;
      border-color: #93c5fd;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.12);
      transform: scale(1.01);
    }
    .drag-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 38px;
      margin: -0.25rem 0;
      padding: 0;
      border: none;
      background: transparent;
      color: #cbd5e1;
      border-radius: 6px;
      cursor: grab;
      flex-shrink: 0;
      transition: color .15s, background .15s;
    }
    .drag-handle:hover {
      color: #64748b;
      background: #f8fafc;
    }
    .flow-step:hover { border-color: #bfdbfe; transform: translateX(3px); box-shadow: 0 4px 12px rgba(59,130,246,.08); }
    .flow-step.dragging:hover { transform: scale(1.01); }
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
    .toast-error {
      background: #450a0a;
      border-color: rgba(248, 113, 113, 0.25);
    }
    .toast-icon-error {
      color: #f87171;
      background: rgba(248, 113, 113, 0.15);
    }
    .toast-error .toast-text span {
      color: #fecaca;
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
    .form-field-block { margin-bottom: .875rem; }
    .form-field-row { display:grid; grid-template-columns:1fr 120px auto; gap:.5rem; align-items:center; }
    .choice-options-panel {
      margin-top: .625rem;
      padding: .75rem;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }
    .choice-option-row { display: grid; grid-template-columns: 1fr auto; gap: .5rem; align-items: center; }
    .btn-ghost.btn-sm {
      align-self: flex-start;
      padding: .35rem .65rem;
      background: transparent;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      color: #64748b;
      font-size: .75rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-ghost.btn-sm:hover { border-color: #93c5fd; color: #3b82f6; background: #f8fafc; }
    .remove-field-btn { border:none; background:#fee2e2; color:#dc2626; width:28px; height:28px; border-radius:8px; cursor:pointer; }
    .remove-field-btn:disabled { opacity: .4; cursor: not-allowed; }
    .results-backdrop { position:fixed; inset:0; background:rgba(15,23,42,.45); display:flex; align-items:center; justify-content:center; z-index:1200; padding:1rem; }
    .results-modal { background:#fff; border-radius:16px; width:100%; max-width:900px; max-height:85vh; overflow:auto; padding:1.5rem; }
    .results-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
    .results-header h3 { margin:0; font-size:1.125rem; }
    .close-btn { border:none; background:none; font-size:1.5rem; cursor:pointer; color:#64748b; }
    .results-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:.75rem; margin-bottom:1rem; }
    .stat-label { display:block; font-size:.7rem; color:#94a3b8; text-transform:uppercase; font-weight:700; }
    .stat-value { font-size:1.25rem; font-weight:700; color:#0f172a; }
    .results-table { width:100%; border-collapse:collapse; font-size:.8125rem; }
    .results-table th, .results-table td { padding:.625rem; border-bottom:1px solid #f1f5f9; text-align:left; vertical-align:top; }
    .sub-email { color:#94a3b8; font-size:.75rem; }
    .results-empty, .results-loading { color:#64748b; font-size:.875rem; }
    @media(max-width:700px) { .results-stats { grid-template-columns:1fr 1fr; } }
  `]
})
export class FlowBuilderComponent {
  @Input() flow!: Flow;
  @Output() onBack = new EventEmitter<void>();
  @Output() onFlowUpdated = new EventEmitter<Flow>();

  constructor(private flowApi: FlowApiService) {}

  selectedStep: FlowStep | null = null;
  showAddStepSelector = false;
  showTriggerToast = false;
  showResults = false;
  resultsLoading = false;
  results: FlowResults | null = null;
  saving = false;
  toastTitle = 'Flow Triggered!';
  toastDescription = 'Successfully initiated flow for test subscriber.';
  toastIsError = false;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;
  draggedStepIndex: number | null = null;
  dragOverIndex: number | null = null;
  dragOverPosition: 'above' | 'below' | null = null;

  private persistFlow(onSuccess?: () => void) {
    this.saving = true;
    this.flowApi.updateFlow(this.flow.id, {
      name: this.flow.name,
      description: this.flow.description,
      status: this.flow.status,
      steps: this.flow.steps,
    }).subscribe({
      next: updated => {
        this.flow = { ...this.flow, ...updated, steps: updated.steps ?? this.flow.steps };
        this.onFlowUpdated.emit(this.flow);
        this.saving = false;
        onSuccess?.();
      },
      error: err => {
        this.saving = false;
        this.showToast('Save failed', err.message || 'Could not save flow.', true);
      },
    });
  }

  triggerFlow() {
    this.persistFlow(() => {
      this.flowApi.triggerFlow(this.flow.id).subscribe({
        next: res => {
          this.flow.triggers += 1;
          this.showToast('Flow Triggered!', res.message);
        },
        error: err => {
          this.showToast('Trigger failed', err.message || 'Could not trigger flow.', true);
        },
      });
    });
  }

  saveFlow() {
    this.persistFlow(() => {
      this.showToast('Changes Saved!', 'Flow and steps saved to your account.');
    });
  }

  private showToast(title: string, description: string, isError = false) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastTitle = title;
    this.toastDescription = description;
    this.toastIsError = isError;
    this.showTriggerToast = true;
    const duration = isError ? 5000 : 4500;
    this.toastTimeout = setTimeout(() => {
      this.showTriggerToast = false;
      this.toastTimeout = null;
    }, duration);
  }

  viewResults() {
    this.showResults = true;
    this.resultsLoading = true;
    this.flowApi.getFlowResults(this.flow.id).subscribe({
      next: res => { this.results = res; this.resultsLoading = false; },
      error: () => { this.resultsLoading = false; this.results = null; },
    });
  }

  toggleStatus() {
    this.flow = { ...this.flow, status: this.flow.status === 'active' ? 'paused' : 'active' };
    this.persistFlow();
  }

  deleteStep(step: FlowStep) {
    const index = this.flow.steps.findIndex(s => s.id === step.id);
    if (index > -1) {
      this.flow.steps.splice(index, 1);
      this.selectedStep = null;
      this.persistFlow();
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

  addNewStep(type: 'email' | 'wait' | 'condition' | 'form' | 'goal-exit') {
    const stepLabels: Record<string, string> = {
      email: 'Send Campaign Email',
      wait: 'Wait Duration',
      condition: 'Check Email Engagement',
      form: 'Collect Subscriber Info',
      'goal-exit': 'Exit Flow Sequence'
    };

    const stepDetails: Record<string, string> = {
      email: 'Deliver the next follow-up message to the user',
      wait: 'Wait 3 days before moving to next step',
      condition: 'Split path: if user opened previous email, continue',
      form: 'Ask subscribers to submit information',
      'goal-exit': 'Cleanly terminate automated campaign'
    };

    const newStep: FlowStep = {
      id: `${Date.now()}`,
      type: type as FlowStep['type'],
      label: stepLabels[type],
      detail: stepDetails[type]
    };

    if (type === 'email') {
      newStep.subject = 'Follow-up Email';
      newStep.emailBody = 'Hello! Write your email content here.';
    } else if (type === 'wait') {
      newStep.waitDuration = 3;
      newStep.waitUnit = 'days';
    } else if (type === 'condition') {
      newStep.conditionType = 'opened_email';
    } else if (type === 'form') {
      newStep.formFields = [{ id: 'field1', label: 'Your answer', type: 'text', required: true }];
    }

    this.flow.steps.push(newStep);
    this.selectedStep = newStep;
    this.showAddStepSelector = false;
    this.persistFlow();
  }

  addFormField(step: FlowStep) {
    step.formFields = step.formFields ?? [];
    step.formFields.push({ id: `field${Date.now()}`, label: 'New field', type: 'text', required: false });
  }

  removeFormField(step: FlowStep, index: number) {
    step.formFields?.splice(index, 1);
  }

  onFormFieldTypeChange(field: FlowFormField, type: FlowFormField['type']) {
    field.type = type;
    if (type === 'select') {
      if (!field.options?.length) {
        field.options = ['Option 1', 'Option 2'];
      }
    } else {
      delete field.options;
    }
  }

  addChoiceOption(field: FlowFormField) {
    field.options = field.options ?? [];
    field.options.push(`Option ${field.options.length + 1}`);
  }

  removeChoiceOption(field: FlowFormField, index: number) {
    if (!field.options || field.options.length <= 1) return;
    field.options.splice(index, 1);
  }

  trackByIndex(index: number) {
    return index;
  }

  private tplId(): string {
    return this.flow?.templateId ?? '';
  }

  get isUnsubscribeFlow(): boolean {
    return this.tplId() === 't13' || this.tplId() === 't14';
  }

  get isWelcomeSequenceFlow(): boolean {
    return this.tplId() === 't1';
  }

  get isReaderMagnetFlow(): boolean {
    return this.tplId() === 't2';
  }

  get isPostPurchaseFlow(): boolean {
    return ['t3', 't4a', 't4b', 't4c', 't4d'].includes(this.tplId());
  }

  get isAbandonedFlow(): boolean {
    return ['t5', 't5b', 't5c'].includes(this.tplId());
  }

  get isPreorderFlow(): boolean {
    return this.tplId().startsWith('t8');
  }

  get isSeriesCompletionFlow(): boolean {
    return this.tplId() === 't9';
  }

  get isReEngagementFlow(): boolean {
    return this.tplId() === 't11';
  }

  get isMilestoneCelebrationFlow(): boolean {
    return this.tplId() === 't12';
  }

  selectStep(step: FlowStep) {
    if (step.type === 'form' && step.formFields) {
      for (const field of step.formFields) {
        if (field.type === 'select' && !field.options?.length) {
          field.options = ['Option 1', 'Option 2'];
        }
      }
    }
    this.selectedStep = this.selectedStep?.id === step.id ? null : step;
  }

  canDragStep(step: FlowStep): boolean {
    return step.type !== 'trigger' && step.type !== 'billing-trigger';
  }

  private minReorderIndex(): number {
    const first = this.flow.steps[0];
    return first && (first.type === 'trigger' || first.type === 'billing-trigger') ? 1 : 0;
  }

  onDragStart(event: DragEvent, index: number) {
    const step = this.flow.steps[index];
    if (!this.canDragStep(step)) {
      event.preventDefault();
      return;
    }
    this.draggedStepIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd() {
    this.draggedStepIndex = null;
    this.dragOverIndex = null;
    this.dragOverPosition = null;
  }

  onStepDragOver(event: DragEvent, index: number) {
    if (this.draggedStepIndex === null) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const position: 'above' | 'below' = event.clientY < rect.top + rect.height / 2 ? 'above' : 'below';
    let insertAt = position === 'above' ? index : index + 1;

    if (insertAt < this.minReorderIndex()) {
      this.dragOverIndex = this.minReorderIndex();
      this.dragOverPosition = 'above';
      return;
    }

    this.dragOverIndex = index;
    this.dragOverPosition = position;
  }

  onStepDragLeave(event: DragEvent, index: number) {
    const related = event.relatedTarget as Node | null;
    const current = event.currentTarget as HTMLElement;
    if (related && current.contains(related)) return;
    if (this.dragOverIndex === index) {
      this.dragOverIndex = null;
      this.dragOverPosition = null;
    }
  }

  onStepDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const from = this.draggedStepIndex;
    if (from === null) return;

    const position = this.dragOverPosition ?? 'below';
    let insertAt = position === 'above' ? index : index + 1;
    insertAt = Math.max(this.minReorderIndex(), insertAt);

    if (from !== insertAt && from !== insertAt - 1) {
      const steps = [...this.flow.steps];
      const [moved] = steps.splice(from, 1);
      if (from < insertAt) insertAt -= 1;
      steps.splice(insertAt, 0, moved);
      this.flow.steps = steps;
      this.persistFlow();
    }

    this.onDragEnd();
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
