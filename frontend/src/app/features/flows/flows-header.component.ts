import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FlowsTab = 'my-flows' | 'library';

@Component({
  selector: 'app-flows-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flows-page-header">
      <div class="flows-page-header-left">
        <h1 class="page-title">Flows</h1>
        <p class="page-subtitle">Automated reader relationship engine — runs while you write</p>
      </div>
      <div class="flows-page-header-right">
        <div class="quiet-hours-badge" title="ScribeCount Email applies quiet hours across all flows by default — flows that trigger at midnight send at a reasonable morning hour.">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          Quiet hours on
        </div>
        <button class="btn-walkthrough" (click)="onOpenWalkthrough.emit()" title="Email Flows — Overview & Orientation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          How Flows Work
        </button>
        <button class="btn-primary" (click)="onNewFlow.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Flow
        </button>
      </div>
    </div>

    <div class="flows-tabs">
      <button class="flows-tab" [class.active]="activeTab === 'my-flows'" (click)="onTabChange.emit('my-flows')">
        My Flows
        <span class="tab-count">{{ flowCount }}</span>
      </button>
      <button class="flows-tab" [class.active]="activeTab === 'library'" (click)="onTabChange.emit('library')">
        Flow Library
        <span class="tab-badge">Install</span>
      </button>
    </div>
  `,
  styles: [`
    .flows-page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
    }
    .flows-page-header-right { display: flex; align-items: center; gap: .75rem; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 .25rem; letter-spacing: -.02em; }
    .page-subtitle { font-size: .8125rem; color: #94a3b8; margin: 0; }

    .quiet-hours-badge {
      display: flex; align-items: center; gap: .35rem;
      padding: .3rem .7rem; border-radius: 20px;
      background: rgba(99,102,241,.08); border: 1px solid rgba(99,102,241,.2);
      color: #6366f1; font-size: .72rem; font-weight: 600;
      cursor: help; white-space: nowrap;
    }

    .btn-walkthrough {
      display: flex; align-items: center; gap: .4rem;
      padding: .5rem 1rem; background: #f8fafc; color: #334155;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: .8125rem; font-weight: 600;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .btn-walkthrough:hover { background: #eff6ff; border-color: #93c5fd; color: #3b82f6; }

    .btn-primary {
      display: flex; align-items: center; gap: .4rem;
      padding: .55rem 1.1rem; background: #3b82f6; color: #fff;
      border: none; border-radius: 10px; font-size: .875rem; font-weight: 600;
      font-family: inherit; cursor: pointer; transition: background .15s;
    }
    .btn-primary:hover { background: #2563eb; }

    .flows-tabs {
      display: flex; gap: .25rem; border-bottom: 2px solid #f1f5f9;
      margin-bottom: 1.75rem;
    }
    .flows-tab {
      display: flex; align-items: center; gap: .5rem;
      padding: .6rem 1rem; background: none; border: none;
      font-size: .875rem; font-weight: 500; color: #94a3b8;
      font-family: inherit; cursor: pointer; border-bottom: 2px solid transparent;
      margin-bottom: -2px; transition: color .15s, border-color .15s;
    }
    .flows-tab:hover { color: #334155; }
    .flows-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; font-weight: 600; }
    .tab-count {
      background: #f1f5f9; color: #64748b; border-radius: 20px;
      padding: .1rem .45rem; font-size: .7rem; font-weight: 700;
    }
    .flows-tab.active .tab-count { background: #dbeafe; color: #3b82f6; }
    .tab-badge {
      background: #dcfce7; color: #16a34a; border-radius: 20px;
      padding: .1rem .45rem; font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    }
  `]
})
export class FlowsHeaderComponent {
  @Input() activeTab: FlowsTab = 'my-flows';
  @Input() flowCount = 0;
  @Output() onTabChange = new EventEmitter<FlowsTab>();
  @Output() onNewFlow = new EventEmitter<void>();
  @Output() onOpenWalkthrough = new EventEmitter<void>();
}
