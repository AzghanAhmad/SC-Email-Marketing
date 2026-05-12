import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../core/services/mock-data.service';
import { FlowCardComponent } from './flow-card.component';

type FamilyFilter = 'all' | 'onboarding' | 'transaction' | 'launch' | 'retention';

@Component({
  selector: 'app-flows-grid',
  standalone: true,
  imports: [CommonModule, FlowCardComponent],
  template: `
    <!-- Family filter bar -->
    <div class="family-filter-bar">
      <button *ngFor="let f of familyFilters"
              class="family-filter-btn"
              [class.active]="activeFamily === f.id"
              (click)="setFamily(f.id)">
        <span class="filter-dot" [ngClass]="'dot-' + f.id" *ngIf="f.id !== 'all'"></span>
        {{ f.label }}
        <span class="filter-count">{{ getCount(f.id) }}</span>
      </button>
    </div>

    <!-- Priority guidance banner -->
    <div class="priority-banner" *ngIf="activeFamily === 'all'">
      <div class="priority-item day-one">
        <span class="p-dot"></span>
        <strong>Day One:</strong> Build your Welcome Sequence before your first campaign
      </div>
      <div class="priority-item pre-store">
        <span class="p-dot"></span>
        <strong>Pre-Store:</strong> Transaction flows must be live before your first sale
      </div>
      <div class="priority-item pre-launch">
        <span class="p-dot"></span>
        <strong>Pre-Launch:</strong> Preorder + Review flows before your next book
      </div>
      <div class="priority-item mature">
        <span class="p-dot"></span>
        <strong>Mature List:</strong> Add Re-engagement + Milestone flows as your list grows
      </div>
    </div>

    <!-- Grid -->
    <div class="flows-grid" *ngIf="filteredFlows.length > 0">
      <app-flow-card
        *ngFor="let flow of filteredFlows"
        [flow]="flow"
        (onOpen)="onOpenFlow.emit($event)">
      </app-flow-card>
    </div>

    <!-- Empty state -->
    <div class="empty-state" *ngIf="filteredFlows.length === 0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      <p>No flows in this family yet.</p>
      <button class="btn-ghost-sm" (click)="onBrowseLibrary.emit()">Browse Flow Library</button>
    </div>
  `,
  styles: [`
    .family-filter-bar {
      display: flex; gap: .375rem; flex-wrap: wrap; margin-bottom: 1.25rem;
    }
    .family-filter-btn {
      display: flex; align-items: center; gap: .4rem;
      padding: .4rem .875rem; border-radius: 20px;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      font-size: .8rem; font-weight: 500; color: #64748b;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .family-filter-btn:hover { border-color: #bfdbfe; color: #3b82f6; background: #eff6ff; }
    .family-filter-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }
    .family-filter-btn.active .filter-count { background: rgba(255,255,255,.25); color: #fff; }

    .filter-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .dot-onboarding { background: #6366f1; }
    .dot-transaction { background: #10b981; }
    .dot-launch { background: #f59e0b; }
    .dot-retention { background: #ec4899; }

    .filter-count {
      background: #e2e8f0; color: #64748b; border-radius: 20px;
      padding: .05rem .4rem; font-size: .68rem; font-weight: 700;
    }

    /* Priority banner */
    .priority-banner {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: .5rem; margin-bottom: 1.5rem;
    }
    .priority-item {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .625rem .875rem; border-radius: 10px;
      font-size: .78rem; color: #334155; line-height: 1.4;
      border: 1px solid transparent;
    }
    .priority-item strong { font-weight: 700; }
    .p-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
    .day-one { background: #fefce8; border-color: #fde68a; }
    .day-one .p-dot { background: #ca8a04; }
    .pre-store { background: #f0fdf4; border-color: #bbf7d0; }
    .pre-store .p-dot { background: #16a34a; }
    .pre-launch { background: #eff6ff; border-color: #bfdbfe; }
    .pre-launch .p-dot { background: #2563eb; }
    .mature { background: #faf5ff; border-color: #e9d5ff; }
    .mature .p-dot { background: #7c3aed; }

    /* Grid */
    .flows-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.125rem;
    }

    /* Empty */
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 3rem; color: #94a3b8; gap: .75rem; text-align: center;
    }
    .empty-state p { font-size: .9rem; margin: 0; }
    .btn-ghost-sm {
      padding: .45rem 1rem; background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 8px; font-size: .8125rem; font-weight: 600; color: #64748b;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .btn-ghost-sm:hover { border-color: #93c5fd; color: #3b82f6; background: #eff6ff; }
  `]
})
export class FlowsGridComponent implements OnChanges {
  @Input() flows: Flow[] = [];
  @Output() onOpenFlow = new EventEmitter<Flow>();
  @Output() onBrowseLibrary = new EventEmitter<void>();

  activeFamily: FamilyFilter = 'all';
  filteredFlows: Flow[] = [];

  familyFilters: { id: FamilyFilter; label: string }[] = [
    { id: 'all', label: 'All Flows' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'transaction', label: 'Transaction' },
    { id: 'launch', label: 'Launch' },
    { id: 'retention', label: 'Retention' },
  ];

  ngOnChanges() { this.applyFilter(); }

  setFamily(f: FamilyFilter) {
    this.activeFamily = f;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredFlows = this.activeFamily === 'all'
      ? this.flows
      : this.flows.filter(f => f.family === this.activeFamily);
  }

  getCount(family: FamilyFilter): number {
    if (family === 'all') return this.flows.length;
    return this.flows.filter(f => f.family === family).length;
  }
}
