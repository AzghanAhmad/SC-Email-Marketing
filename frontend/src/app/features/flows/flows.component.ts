import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Flow, FlowStep } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-flows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Flows</h1>
          <p class="page-subtitle">Automate your reader journey with email sequences</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a new automation flow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Flow
        </button>
      </div>

      <div class="flows-layout" *ngIf="!selectedFlow()">
        <!-- Flow Cards -->
        <div class="flows-grid">
          <div class="glass-card flow-card" *ngFor="let flow of flows" (click)="selectedFlow.set(flow)">
            <div class="flow-card-header">
              <div class="flow-icon" [class.active]="flow.status === 'active'" [class.paused]="flow.status === 'paused'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <span class="badge" [ngClass]="flow.status === 'active' ? 'badge-active' : 'badge-paused'">{{ flow.status }}</span>
            </div>
            <h3 class="flow-name">{{ flow.name }}</h3>
            <p class="flow-desc">{{ flow.description }}</p>
            <div class="flow-meta">
              <div class="flow-stat">
                <span class="flow-stat-val">{{ flow.triggers | number }}</span>
                <span class="flow-stat-label">triggered</span>
              </div>
              <div class="flow-stat">
                <span class="flow-stat-val">{{ flow.steps.length }}</span>
                <span class="flow-stat-label">steps</span>
              </div>
            </div>
            <div class="flow-steps-preview">
              <div class="step-dot" *ngFor="let step of flow.steps" [class]="'step-dot-' + step.type" [attr.data-tooltip]="step.label"></div>
            </div>
            <button class="btn-ghost btn-sm view-btn" data-tooltip="Open flow builder">
              View Builder
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <!-- Info Panel -->
        <div class="glass-card info-panel">
          <h3 class="info-title">About Flows</h3>
          <p class="info-desc">Flows are automated email sequences that trigger based on subscriber actions or conditions.</p>
          <div class="info-items">
            <div class="info-item" data-tooltip="A trigger starts the flow when a condition is met">
              <div class="info-icon-wrap trigger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <p class="info-item-title">Trigger</p>
                <p class="info-item-sub">Starts the flow</p>
              </div>
            </div>
            <div class="info-item" data-tooltip="Send an email to the subscriber at this step">
              <div class="info-icon-wrap email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p class="info-item-title">Email</p>
                <p class="info-item-sub">Send a message</p>
              </div>
            </div>
            <div class="info-item" data-tooltip="Pause the flow for a set amount of time">
              <div class="info-icon-wrap wait">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p class="info-item-title">Wait</p>
                <p class="info-item-sub">Delay before next step</p>
              </div>
            </div>
            <div class="info-item" data-tooltip="Branch the flow based on subscriber behavior">
              <div class="info-icon-wrap condition">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div>
                <p class="info-item-title">Condition</p>
                <p class="info-item-sub">Branch on behavior</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Flow Builder -->
      <div *ngIf="selectedFlow()">
        <div class="builder-header">
          <button class="btn-ghost" (click)="selectedFlow.set(null)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Flows
          </button>
          <div class="builder-title-row">
            <h2 class="builder-title">{{ selectedFlow()!.name }}</h2>
            <span class="badge" [ngClass]="selectedFlow()!.status === 'active' ? 'badge-active' : 'badge-paused'">{{ selectedFlow()!.status }}</span>
          </div>
          <div class="builder-actions">
            <button class="btn-secondary btn-sm" data-tooltip="Pause or resume this flow">
              {{ selectedFlow()!.status === 'active' ? 'Pause Flow' : 'Activate Flow' }}
            </button>
            <button class="btn-primary btn-sm" data-tooltip="Save changes to this flow">Save Changes</button>
          </div>
        </div>

        <div class="builder-layout">
          <!-- Steps -->
          <div class="steps-column">
            <div class="step-wrapper" *ngFor="let step of selectedFlow()!.steps; let i = index; let last = last">
              <div class="flow-step" [class]="'step-' + step.type" (click)="selectedStep.set(step)">
                <div class="step-icon-wrap" [class]="'icon-' + step.type">
                  <svg *ngIf="step.type === 'trigger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <svg *ngIf="step.type === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <svg *ngIf="step.type === 'wait'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <svg *ngIf="step.type === 'condition'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div class="step-content">
                  <span class="step-type-label">{{ step.type | titlecase }}</span>
                  <span class="step-label">{{ step.label }}</span>
                  <span class="step-detail">{{ step.detail }}</span>
                </div>
                <div class="step-num">{{ i + 1 }}</div>
              </div>
              <div class="step-connector" *ngIf="!last">
                <div class="connector-line"></div>
                <div class="connector-dot"></div>
              </div>
            </div>
            <button class="add-step-btn" data-tooltip="Add a new step to this flow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Step
            </button>
          </div>

          <!-- Detail Panel -->
          <div class="glass-card detail-panel">
            <div *ngIf="!selectedStep()">
              <h3 class="detail-title">Flow Details</h3>
              <div class="detail-stat-row">
                <div class="detail-stat">
                  <span class="ds-val">{{ selectedFlow()!.triggers | number }}</span>
                  <span class="ds-label">Total Triggered</span>
                </div>
                <div class="detail-stat">
                  <span class="ds-val">{{ selectedFlow()!.steps.length }}</span>
                  <span class="ds-label">Steps</span>
                </div>
              </div>
              <p class="detail-hint">Click any step to see its details and edit settings.</p>
            </div>

            <div *ngIf="selectedStep()">
              <div class="detail-step-header">
                <h3 class="detail-title">{{ selectedStep()!.label }}</h3>
                <span class="step-type-badge" [class]="'type-' + selectedStep()!.type">{{ selectedStep()!.type }}</span>
              </div>
              <p class="detail-step-detail">{{ selectedStep()!.detail }}</p>

              <div class="why-panel">
                <h4 class="why-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Why did this send?
                </h4>
                <div class="why-event">
                  <span class="why-label">Event:</span>
                  <span class="why-val">{{ getWhyEvent(selectedStep()!) }}</span>
                </div>
                <div class="why-event">
                  <span class="why-label">Timestamp:</span>
                  <span class="why-val">Mar 15, 2026 at 9:42 AM</span>
                </div>
                <div class="why-event">
                  <span class="why-label">Triggered for:</span>
                  <span class="why-val">{{ selectedFlow()!.triggers | number }} subscribers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flows-layout { display:grid; grid-template-columns:1fr 280px; gap:1.5rem; align-items:start; }
    .flows-grid { display:flex; flex-direction:column; gap:1.25rem; }
    .flow-card { padding:1.5rem; cursor:pointer; }
    .flow-card:hover { border-color:#bfdbfe; }
    .flow-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
    .flow-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
    .flow-icon.active { background:rgba(16,185,129,0.1); color:#059669; }
    .flow-icon.paused { background:rgba(239,68,68,0.1); color:#dc2626; }
    .flow-name { font-size:1.0625rem; font-weight:700; color:#0f172a; margin:0 0 .375rem; }
    .flow-desc { font-size:.8125rem; color:#94a3b8; margin:0 0 1rem; }
    .flow-meta { display:flex; gap:1.5rem; margin-bottom:1rem; }
    .flow-stat { display:flex; flex-direction:column; }
    .flow-stat-val { font-size:1.125rem; font-weight:700; color:#0f172a; }
    .flow-stat-label { font-size:.7rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .flow-steps-preview { display:flex; gap:.375rem; margin-bottom:1rem; }
    .step-dot { width:10px; height:10px; border-radius:50%; }
    .step-dot-trigger { background:#d97706; }
    .step-dot-email { background:#3b82f6; }
    .step-dot-wait { background:#94a3b8; }
    .step-dot-condition { background:#8b5cf6; }
    .view-btn { display:flex; align-items:center; gap:.375rem; color:#94a3b8; }
    .view-btn:hover { color:#3b82f6; }

    .info-panel { padding:1.5rem; position:sticky; top:80px; }
    .info-title { font-size:.8rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin:0 0 .75rem; }
    .info-desc { font-size:.8125rem; color:#64748b; margin:0 0 1.25rem; line-height:1.5; }
    .info-items { display:flex; flex-direction:column; gap:.75rem; }
    .info-item { display:flex; align-items:center; gap:.75rem; padding:.625rem; border-radius:10px; background:#f8fafc; cursor:help; transition:background .15s; border:1px solid #f1f5f9; }
    .info-item:hover { background:#f0f7ff; border-color:#bfdbfe; }
    .info-icon-wrap { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .info-icon-wrap.trigger { background:rgba(245,158,11,0.1); color:#d97706; }
    .info-icon-wrap.email { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .info-icon-wrap.wait { background:#f1f5f9; color:#64748b; }
    .info-icon-wrap.condition { background:rgba(139,92,246,0.1); color:#8b5cf6; }
    .info-item-title { font-size:.8125rem; font-weight:600; color:#0f172a; margin:0 0 .1rem; }
    .info-item-sub { font-size:.75rem; color:#94a3b8; margin:0; }

    .builder-header { display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem; flex-wrap:wrap; }
    .builder-title-row { display:flex; align-items:center; gap:.75rem; flex:1; }
    .builder-title { font-size:1.375rem; font-weight:700; color:#0f172a; margin:0; }
    .builder-actions { display:flex; gap:.75rem; }

    .builder-layout { display:grid; grid-template-columns:1fr 320px; gap:2rem; align-items:start; }
    .steps-column { display:flex; flex-direction:column; align-items:center; }
    .step-wrapper { display:flex; flex-direction:column; align-items:center; width:100%; max-width:480px; }

    .flow-step {
      width:100%; display:flex; align-items:center; gap:1rem;
      padding:1.125rem 1.25rem;
      background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px;
      cursor:pointer; transition:all .2s; position:relative;
      box-shadow:0 1px 3px rgba(0,0,0,0.05);
    }
    .flow-step:hover { background:#f8fafc; border-color:#bfdbfe; transform:translateX(4px); box-shadow:0 4px 12px rgba(0,0,0,0.08); }
    .step-icon-wrap { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .icon-trigger { background:rgba(245,158,11,0.1); color:#d97706; }
    .icon-email { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .icon-wait { background:#f1f5f9; color:#64748b; }
    .icon-condition { background:rgba(139,92,246,0.1); color:#8b5cf6; }
    .step-content { flex:1; display:flex; flex-direction:column; gap:.15rem; }
    .step-type-label { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; }
    .step-label { font-size:.9rem; font-weight:600; color:#0f172a; }
    .step-detail { font-size:.78rem; color:#64748b; }
    .step-num { width:24px; height:24px; border-radius:50%; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; color:#94a3b8; flex-shrink:0; }

    .step-connector { display:flex; flex-direction:column; align-items:center; height:32px; }
    .connector-line { width:2px; flex:1; background:#e2e8f0; }
    .connector-dot { width:8px; height:8px; border-radius:50%; background:#cbd5e1; }

    .add-step-btn {
      display:flex; align-items:center; gap:.5rem; margin-top:1rem;
      padding:.7rem 1.5rem; background:#f8fafc;
      border:1.5px dashed #cbd5e1; border-radius:12px;
      color:#94a3b8; font-size:.875rem; font-weight:500; font-family:inherit;
      cursor:pointer; transition:all .2s;
    }
    .add-step-btn:hover { background:#f0f7ff; border-color:#93c5fd; color:#3b82f6; }

    .detail-panel { padding:1.5rem; position:sticky; top:80px; }
    .detail-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .detail-stat-row { display:flex; gap:1.5rem; margin-bottom:1rem; }
    .detail-stat { display:flex; flex-direction:column; }
    .ds-val { font-size:1.5rem; font-weight:800; color:#0f172a; letter-spacing:-.02em; }
    .ds-label { font-size:.7rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .detail-hint { font-size:.8125rem; color:#94a3b8; }
    .detail-step-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.75rem; }
    .detail-step-detail { font-size:.875rem; color:#64748b; margin:0 0 1.25rem; }
    .step-type-badge { padding:.25rem .6rem; border-radius:6px; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
    .type-trigger { background:rgba(245,158,11,0.1); color:#d97706; }
    .type-email { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .type-wait { background:#f1f5f9; color:#64748b; }
    .type-condition { background:rgba(139,92,246,0.1); color:#8b5cf6; }

    .why-panel { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem; }
    .why-title { display:flex; align-items:center; gap:.375rem; font-size:.8rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.06em; margin:0 0 .875rem; }
    .why-event { display:flex; gap:.5rem; margin-bottom:.5rem; font-size:.8125rem; }
    .why-event:last-child { margin-bottom:0; }
    .why-label { color:#94a3b8; font-weight:600; min-width:90px; }
    .why-val { color:#334155; }

    @media(max-width:1100px) { .builder-layout,.flows-layout { grid-template-columns:1fr; } .detail-panel,.info-panel { position:static; } }
  `]
})
export class FlowsComponent implements OnInit {
  flows: Flow[] = [];
  selectedFlow = signal<Flow | null>(null);
  selectedStep = signal<FlowStep | null>(null);

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.flows = this.mockData.getFlows();
  }

  getWhyEvent(step: FlowStep): string {
    const map: Record<string, string> = {
      trigger: 'Subscriber joined list',
      email: 'Previous step completed',
      wait: 'Timer elapsed',
      condition: 'Behavior evaluated'
    };
    return map[step.type] || 'Unknown event';
  }
}
