import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowTemplate } from '../../core/services/mock-data.service';

type LibraryFilter = 'all' | 'onboarding' | 'transaction' | 'launch' | 'retention';

@Component({
  selector: 'app-flow-library',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="library-wrapper">

      <!-- Intro -->
      <div class="library-intro">
        <div class="library-intro-text">
          <h2 class="library-heading">Flow Library</h2>
          <p class="library-sub">Every flow ships with a complete pre-built structure and editable sample content. Browse by goal, choose a flow, fill in your details, and activate — in under an hour.</p>
        </div>
        <div class="library-legend">
          <span class="legend-item day-one">Day One</span>
          <span class="legend-item pre-store">Pre-Store</span>
          <span class="legend-item pre-launch">Pre-Launch</span>
          <span class="legend-item mature">Mature List</span>
        </div>
      </div>

      <!-- Family filter -->
      <div class="lib-filter-bar">
        <button *ngFor="let f of filters"
                class="lib-filter-btn"
                [class.active]="activeFilter === f.id"
                (click)="setFilter(f.id)">
          {{ f.label }}
          <span class="lib-count">{{ getCount(f.id) }}</span>
        </button>
      </div>

      <!-- Template cards grid -->
      <div class="lib-grid">
        <div class="lib-card" *ngFor="let tpl of filteredTemplates">

          <div class="lib-card-top">
            <div class="lib-family-icon" [ngClass]="'icon-' + tpl.family">
              <svg *ngIf="tpl.family === 'onboarding'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <svg *ngIf="tpl.family === 'transaction'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <svg *ngIf="tpl.family === 'launch'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <svg *ngIf="tpl.family === 'retention'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div class="lib-badges">
              <span class="lib-family-badge" [ngClass]="'family-' + tpl.family">{{ familyLabel(tpl.family) }}</span>
              <span class="lib-priority-badge" *ngIf="tpl.priority" [ngClass]="'priority-' + tpl.priority">{{ priorityLabel(tpl.priority) }}</span>
            </div>
          </div>

          <h3 class="lib-name">{{ tpl.name }}</h3>
          <p class="lib-desc">{{ tpl.description }}</p>

          <!-- Step count + setup time -->
          <div class="lib-meta">
            <span class="lib-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {{ tpl.steps.length }} steps
            </span>
            <span class="lib-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              ~{{ tpl.estimatedSetupMinutes }} min setup
            </span>
          </div>

          <!-- Goal exit -->
          <div class="lib-goal-exit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Goal: {{ tpl.goalExit }}
          </div>

          <!-- Webhook requirement badge -->
          <div class="lib-webhook-badge" *ngIf="tpl.requiresWebhook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Requires connected payment processor
          </div>

          <!-- Step preview dots -->
          <div class="lib-step-dots">
            <div class="lib-dot" *ngFor="let step of tpl.steps"
                 [ngClass]="'dot-' + step.type"
                 [title]="step.label">
            </div>
          </div>

          <!-- Install button -->
          <button class="install-btn" (click)="onInstall.emit(tpl)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Install Flow
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .library-wrapper { display: flex; flex-direction: column; gap: 0; }

    /* Intro */
    .library-intro {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;
    }
    .library-heading { font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0 0 .375rem; }
    .library-sub { font-size: .8125rem; color: #64748b; margin: 0; line-height: 1.55; max-width: 560px; }
    .library-legend { display: flex; gap: .4rem; flex-wrap: wrap; align-items: center; flex-shrink: 0; }
    .legend-item {
      padding: .2rem .6rem; border-radius: 20px;
      font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    }
    .day-one { background: #fefce8; color: #ca8a04; border: 1px solid #fde68a; }
    .pre-store { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .pre-launch { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
    .mature { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }

    /* Filter bar */
    .lib-filter-bar { display: flex; gap: .375rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .lib-filter-btn {
      display: flex; align-items: center; gap: .4rem;
      padding: .4rem .875rem; border-radius: 20px;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      font-size: .8rem; font-weight: 500; color: #64748b;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .lib-filter-btn:hover { border-color: #bfdbfe; color: #3b82f6; background: #eff6ff; }
    .lib-filter-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }
    .lib-filter-btn.active .lib-count { background: rgba(255,255,255,.25); color: #fff; }
    .lib-count {
      background: #e2e8f0; color: #64748b; border-radius: 20px;
      padding: .05rem .4rem; font-size: .68rem; font-weight: 700;
    }

    /* Grid */
    .lib-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.125rem;
    }

    /* Card */
    .lib-card {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.25rem; display: flex; flex-direction: column; gap: 0;
      transition: border-color .2s, box-shadow .2s;
    }
    .lib-card:hover { border-color: #bfdbfe; box-shadow: 0 4px 16px rgba(59,130,246,.07); }

    .lib-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: .875rem; }
    .lib-family-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-onboarding { background: rgba(99,102,241,.1); color: #6366f1; }
    .icon-transaction { background: rgba(16,185,129,.1); color: #059669; }
    .icon-launch { background: rgba(245,158,11,.1); color: #d97706; }
    .icon-retention { background: rgba(236,72,153,.1); color: #db2777; }

    .lib-badges { display: flex; gap: .35rem; flex-wrap: wrap; justify-content: flex-end; }
    .lib-family-badge {
      padding: .18rem .5rem; border-radius: 20px;
      font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    .family-onboarding { background: rgba(99,102,241,.1); color: #6366f1; }
    .family-transaction { background: rgba(16,185,129,.1); color: #059669; }
    .family-launch { background: rgba(245,158,11,.1); color: #d97706; }
    .family-retention { background: rgba(236,72,153,.1); color: #db2777; }

    .lib-priority-badge {
      padding: .18rem .5rem; border-radius: 20px;
      font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    }
    .priority-day-one { background: #fefce8; color: #ca8a04; }
    .priority-pre-store { background: #f0fdf4; color: #16a34a; }
    .priority-pre-launch { background: #eff6ff; color: #2563eb; }
    .priority-mature { background: #faf5ff; color: #7c3aed; }

    .lib-name { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .375rem; }
    .lib-desc { font-size: .78rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; flex: 1; }

    .lib-meta { display: flex; gap: .875rem; margin-bottom: .75rem; }
    .lib-meta-item {
      display: flex; align-items: center; gap: .3rem;
      font-size: .75rem; color: #94a3b8;
    }

    .lib-goal-exit {
      display: flex; align-items: flex-start; gap: .35rem;
      font-size: .74rem; color: #64748b; margin-bottom: .75rem;
      padding: .45rem .6rem; background: #f0fdf4; border-radius: 8px;
      border: 1px solid #bbf7d0; line-height: 1.4;
    }
    .lib-goal-exit svg { flex-shrink: 0; margin-top: 1px; color: #059669; }

    .lib-step-dots { display: flex; gap: .3rem; flex-wrap: wrap; margin-bottom: .875rem; }
    .lib-dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot-trigger { background: #d97706; }
    .dot-billing-trigger { background: #059669; }
    .dot-email { background: #3b82f6; }
    .dot-wait { background: #94a3b8; }
    .dot-condition { background: #8b5cf6; }
    .dot-goal-exit { background: #10b981; }

    .install-btn {
      display: flex; align-items: center; justify-content: center; gap: .4rem;
      width: 100%; padding: .6rem; background: #f0fdf4;
      border: 1.5px solid #bbf7d0; border-radius: 10px;
      font-size: .8125rem; font-weight: 600; color: #059669;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .install-btn:hover { background: #dcfce7; border-color: #4ade80; color: #16a34a; }

    .lib-webhook-badge {
      display: flex; align-items: center; gap: .35rem;
      font-size: .72rem; color: #92400e; margin-bottom: .75rem;
      padding: .35rem .6rem; background: #fffbeb; border-radius: 8px;
      border: 1px solid #fde68a;
    }
    .lib-webhook-badge svg { flex-shrink: 0; color: #d97706; }
  `]
})
export class FlowLibraryComponent implements OnChanges {
  @Input() templates: FlowTemplate[] = [];
  @Output() onInstall = new EventEmitter<FlowTemplate>();

  activeFilter: LibraryFilter = 'all';
  filteredTemplates: FlowTemplate[] = [];

  filters: { id: LibraryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'transaction', label: 'Transaction' },
    { id: 'launch', label: 'Launch' },
    { id: 'retention', label: 'Retention' },
  ];

  ngOnChanges() { this.applyFilter(); }

  setFilter(f: LibraryFilter) {
    this.activeFilter = f;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredTemplates = this.activeFilter === 'all'
      ? this.templates
      : this.templates.filter(t => t.family === this.activeFilter);
  }

  getCount(f: LibraryFilter): number {
    if (f === 'all') return this.templates.length;
    return this.templates.filter(t => t.family === f).length;
  }

  familyLabel(family: string): string {
    const map: Record<string, string> = {
      onboarding: 'Onboarding', transaction: 'Transaction',
      launch: 'Launch', retention: 'Retention'
    };
    return map[family] ?? family;
  }

  priorityLabel(priority: string | undefined): string {
    const map: Record<string, string> = {
      'day-one': 'Day One', 'pre-store': 'Pre-Store',
      'pre-launch': 'Pre-Launch', 'mature': 'Mature List'
    };
    return map[priority ?? ''] ?? '';
  }
}
