import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FlowApiService, PublicFlowEnrollment } from '../../core/services/flow-api.service';
import { FlowStep } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-flow-respond',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <div class="brand">ScribeCount</div>

        <div *ngIf="loading" class="state">Loading…</div>
        <div *ngIf="error" class="state error">{{ error }}</div>

        <ng-container *ngIf="!loading && !error && enrollment">
          <h1>{{ enrollment.flowName }}</h1>
          <p class="lead">Hi {{ enrollment.subscriberName }}, complete step {{ enrollment.stepIndex }} of {{ enrollment.totalSteps }}.</p>

          <div class="completed" *ngIf="enrollment.completed">
            <p>{{ enrollment.message || 'Thank you — you have completed this flow.' }}</p>
          </div>

          <ng-container *ngIf="!enrollment.completed && enrollment.currentStep as step">
            <p class="step-detail">{{ step.detail }}</p>

            <div *ngIf="step.type === 'email'" class="email-body" [innerHTML]="step.emailBody || step.detail"></div>

            <form class="step-form" (ngSubmit)="submit()">
              <ng-container *ngIf="step.type === 'form'">
                <div class="form-group" *ngFor="let field of step.formFields || []">
                  <label>{{ field.label }}<span *ngIf="field.required"> *</span></label>
                  <input *ngIf="field.type === 'text'" class="input" [(ngModel)]="responses[field.id]" [name]="field.id" [required]="!!field.required">
                  <textarea *ngIf="field.type === 'textarea'" class="input" rows="4" [(ngModel)]="responses[field.id]" [name]="field.id" [required]="!!field.required"></textarea>
                  <select *ngIf="field.type === 'select'" class="input" [(ngModel)]="responses[field.id]" [name]="field.id" [required]="!!field.required">
                    <option value="">Select…</option>
                    <option *ngFor="let opt of field.options || []" [value]="opt">{{ opt }}</option>
                  </select>
                </div>
              </ng-container>

              <ng-container *ngIf="step.type === 'condition'">
                <label class="choice" *ngFor="let opt of conditionOptions(step)">
                  <input type="radio" name="choice" [(ngModel)]="responses['choice']" [value]="opt.value">
                  {{ opt.label }}
                </label>
              </ng-container>

              <button class="btn-primary" type="submit" [disabled]="submitting">
                {{ submitting ? 'Submitting…' : (step.type === 'email' ? 'Continue' : 'Submit') }}
              </button>
            </form>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; background:linear-gradient(160deg,#f8fafc 0%,#eef2ff 100%); }
    .card { width:100%; max-width:640px; background:#fff; border-radius:20px; padding:2rem; box-shadow:0 20px 50px rgba(15,23,42,.08); border:1px solid #e2e8f0; }
    .brand { font-size:.75rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#6366f1; margin-bottom:1rem; }
    h1 { margin:0 0 .5rem; font-size:1.5rem; color:#0f172a; }
    .lead { margin:0 0 1.25rem; color:#64748b; line-height:1.6; }
    .step-detail { color:#374151; margin-bottom:1rem; }
    .email-body { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem; margin-bottom:1rem; line-height:1.6; }
    .form-group { margin-bottom:1rem; display:flex; flex-direction:column; gap:.35rem; }
    .input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; }
    .choice { display:block; margin-bottom:.5rem; cursor:pointer; }
    .btn-primary { margin-top:.5rem; padding:.75rem 1.25rem; background:#3b82f6; color:#fff; border:none; border-radius:10px; font-weight:600; cursor:pointer; }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
    .completed { padding:1rem; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; color:#065f46; }
    .state { color:#64748b; }
    .state.error { color:#dc2626; }
  `]
})
export class FlowRespondComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private flowApi = inject(FlowApiService);

  enrollment: PublicFlowEnrollment | null = null;
  loading = true;
  error = '';
  submitting = false;
  responses: Record<string, string> = {};
  private token = '';

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.error = 'Invalid flow link.';
      this.loading = false;
      return;
    }
    this.load();
  }

  conditionOptions(step: FlowStep) {
    const map: Record<string, string> = {
      opened_email: 'I opened the previous email',
      clicked_link: 'I clicked a link in the email',
      has_tag: 'This applies to me',
      purchased_book: 'I purchased a book',
    };
    return [{ value: step.conditionType || 'yes', label: map[step.conditionType || ''] || 'Yes, continue' }];
  }

  submit() {
    if (!this.token) return;
    this.submitting = true;
    this.flowApi.submitFlowStep(this.token, this.responses).subscribe({
      next: res => {
        this.enrollment = res;
        this.responses = {};
        this.submitting = false;
      },
      error: err => {
        this.error = err.message || 'Could not submit your response.';
        this.submitting = false;
      },
    });
  }

  private load() {
    this.flowApi.getPublicEnrollment(this.token).subscribe({
      next: res => {
        this.enrollment = res;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'This flow link is invalid.';
        this.loading = false;
      },
    });
  }
}
