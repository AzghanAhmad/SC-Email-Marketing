import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-flow-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flow-card" [class.active]="flow.status === 'active'" [class.paused]="flow.status === 'paused'">

      <!-- Top row: icon + status badge -->
      <div class="card-top">
        <div class="flow-icon-wrap" [ngClass]="'icon-' + flow.family">
          <svg *ngIf="flow.family === 'onboarding'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <svg *ngIf="flow.family === 'transaction'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <svg *ngIf="flow.family === 'launch'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <svg *ngIf="flow.family === 'retention'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="card-badges">
          <span class="family-badge" [ngClass]="'family-' + flow.family">{{ familyLabel }}</span>
          <span class="status-badge" [ngClass]="'status-' + flow.status">{{ flow.status }}</span>
        </div>
      </div>

      <!-- Name + description -->
      <h3 class="flow-name">{{ flow.name }}</h3>
      <p class="flow-desc">{{ flow.description }}</p>

      <!-- Stats row -->
      <div class="flow-stats">
        <div class="flow-stat">
          <span class="stat-val">{{ flow.triggers | number }}</span>
          <span class="stat-label">triggered</span>
        </div>
        <div class="flow-stat">
          <span class="stat-val">{{ flow.steps.length }}</span>
          <span class="stat-label">steps</span>
        </div>
        <div class="flow-stat" *ngIf="flow.priority">
          <span class="priority-chip" [ngClass]="'priority-' + flow.priority">{{ priorityLabel }}</span>
        </div>
      </div>

      <!-- Step dots preview -->
      <div class="step-dots">
        <div class="step-dot" *ngFor="let step of flow.steps"
             [ngClass]="'dot-' + step.type"
             [title]="step.label">
        </div>
      </div>

      <!-- Goal exit -->
      <div class="goal-exit-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/>
        </svg>
        <span>Goal: {{ flow.goalExit }}</span>
      </div>

      <!-- Action -->
      <button class="view-btn" (click)="onOpen.emit(flow)">
        Open Builder
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .flow-card {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.375rem; cursor: default;
      transition: border-color .2s, box-shadow .2s;
    }
    .flow-card:hover { border-color: #bfdbfe; box-shadow: 0 4px 16px rgba(59,130,246,.08); }

    .card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .flow-icon-wrap {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .icon-onboarding { background: rgba(99,102,241,.1); color: #6366f1; }
    .icon-transaction { background: rgba(16,185,129,.1); color: #059669; }
    .icon-launch { background: rgba(245,158,11,.1); color: #d97706; }
    .icon-retention { background: rgba(236,72,153,.1); color: #db2777; }

    .card-badges { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; justify-content: flex-end; }

    .family-badge {
      padding: .2rem .55rem; border-radius: 20px;
      font-size: .67rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    .family-onboarding { background: rgba(99,102,241,.1); color: #6366f1; }
    .family-transaction { background: rgba(16,185,129,.1); color: #059669; }
    .family-launch { background: rgba(245,158,11,.1); color: #d97706; }
    .family-retention { background: rgba(236,72,153,.1); color: #db2777; }

    .status-badge {
      padding: .2rem .55rem; border-radius: 20px;
      font-size: .67rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    .status-active { background: #dcfce7; color: #16a34a; }
    .status-paused { background: #fef3c7; color: #d97706; }
    .status-draft { background: #f1f5f9; color: #64748b; }

    .flow-name { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .flow-desc { font-size: .8rem; color: #64748b; margin: 0 0 1rem; line-height: 1.5; }

    .flow-stats { display: flex; align-items: center; gap: 1.25rem; margin-bottom: .875rem; }
    .flow-stat { display: flex; flex-direction: column; }
    .stat-val { font-size: 1.1rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
    .stat-label { font-size: .68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }

    .priority-chip {
      padding: .2rem .55rem; border-radius: 20px;
      font-size: .67rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    }
    .priority-day-one { background: #fef9c3; color: #ca8a04; }
    .priority-pre-store { background: #dcfce7; color: #16a34a; }
    .priority-pre-launch { background: #dbeafe; color: #2563eb; }
    .priority-mature { background: #f3e8ff; color: #7c3aed; }

    .step-dots { display: flex; gap: .3rem; margin-bottom: .75rem; flex-wrap: wrap; }
    .step-dot { width: 9px; height: 9px; border-radius: 50%; }
    .dot-trigger { background: #d97706; }
    .dot-billing-trigger { background: #059669; }
    .dot-email { background: #3b82f6; }
    .dot-wait { background: #94a3b8; }
    .dot-condition { background: #8b5cf6; }
    .dot-goal-exit { background: #10b981; }

    .goal-exit-row {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .75rem; color: #64748b; margin-bottom: 1rem;
      padding: .5rem .625rem; background: #f8fafc; border-radius: 8px;
      border: 1px solid #f1f5f9; line-height: 1.4;
    }
    .goal-exit-row svg { flex-shrink: 0; margin-top: 1px; color: #10b981; }

    .view-btn {
      display: flex; align-items: center; gap: .35rem;
      width: 100%; justify-content: center;
      padding: .55rem; background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 10px; font-size: .8125rem; font-weight: 600; color: #64748b;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .view-btn:hover { background: #eff6ff; border-color: #93c5fd; color: #3b82f6; }
  `]
})
export class FlowCardComponent {
  @Input() flow!: Flow;
  @Output() onOpen = new EventEmitter<Flow>();

  get familyLabel(): string {
    const map: Record<string, string> = {
      onboarding: 'Onboarding',
      transaction: 'Transaction',
      launch: 'Launch',
      retention: 'Retention'
    };
    return map[this.flow.family] ?? this.flow.family;
  }

  get priorityLabel(): string {
    const map: Record<string, string> = {
      'day-one': 'Day One',
      'pre-store': 'Pre-Store',
      'pre-launch': 'Pre-Launch',
      'mature': 'Mature List'
    };
    return map[this.flow.priority ?? ''] ?? '';
  }
}
