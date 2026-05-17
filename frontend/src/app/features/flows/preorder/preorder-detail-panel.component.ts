import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { PreorderWhyComponent } from './preorder-why.component';
import { PreorderThreePhasesComponent } from './preorder-three-phases.component';
import { PreorderWritingGuideComponent } from './preorder-writing-guide.component';
import { PreorderPerformanceComponent } from './preorder-performance.component';

type PoTab = 'overview' | 'phases' | 'writing' | 'performance';

@Component({
  selector: 'app-preorder-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    PreorderWhyComponent,
    PreorderThreePhasesComponent,
    PreorderWritingGuideComponent,
    PreorderPerformanceComponent,
  ],
  template: `
    <div class="po-panel">

      <!-- Header -->
      <div class="po-panel-header">
        <div class="po-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="po-panel-title-block">
          <h3 class="po-panel-title">Preorder Confirmation & Nurture</h3>
          <span class="po-panel-sub">Launch family · 3 phases · Release-date anchored · 312 triggered</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="po-tabs">
        <button class="po-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="po-tab" [class.active]="activeTab === 'phases'" (click)="activeTab = 'phases'">3 Phases</button>
        <button class="po-tab" [class.active]="activeTab === 'writing'" (click)="activeTab = 'writing'">Writing Guide</button>
        <button class="po-tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Stats</button>
      </div>

      <!-- Content -->
      <div class="po-tab-content">

        <div *ngIf="activeTab === 'overview'">
          <app-preorder-why></app-preorder-why>
          <div class="po-scribecount-note">
            <div class="po-sc-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <span>How ScribeCount Email handles the preorder flow</span>
            </div>
            <p>
              ScribeCount Email's preorder flow templates cover all three phases, connected to your
              direct store's preorder events through the same real-time webhook system that handles
              post-purchase and abandonment flows. The release date is the flow's anchor — all nurture
              emails are scheduled relative to it. Updating the release date automatically reschedules
              every email in the sequence.
            </p>
            <p>
              When a new preorder is received, ScribeCount checks the current date against the release
              date anchor and places the reader at the correct point in the nurture sequence — ensuring
              every preorder reader receives a coherent, appropriately timed set of emails regardless
              of when in the preorder window they committed.
            </p>
          </div>
        </div>

        <div *ngIf="activeTab === 'phases'">
          <app-preorder-three-phases></app-preorder-three-phases>
        </div>

        <div *ngIf="activeTab === 'writing'">
          <app-preorder-writing-guide></app-preorder-writing-guide>
        </div>

        <div *ngIf="activeTab === 'performance'">
          <app-preorder-performance></app-preorder-performance>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .po-panel { display: flex; flex-direction: column; gap: 0; min-width: 0; width: 100%; }
    .po-tab-content { min-width: 0; overflow: hidden; }

    .po-panel-header {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
    }
    .po-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(245,158,11,0.1); color: #d97706;
      display: flex; align-items: center; justify-content: center;
    }
    .po-panel-title-block { min-width: 0; flex: 1; }
    .po-panel-title {
      font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem;
      line-height: 1.3; word-wrap: break-word;
    }
    .po-panel-sub { font-size: .72rem; color: #94a3b8; line-height: 1.4; }

    .po-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1rem;
      flex-wrap: wrap; overflow-x: auto;
    }
    .po-tab {
      flex: 1 1 auto; min-width: max-content; padding: .4rem .65rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .7rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .po-tab:hover { color: #0f172a; }
    .po-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .po-scribecount-note {
      background: rgba(245,158,11,0.04);
      border: 1.5px solid rgba(245,158,11,0.15);
      border-radius: 12px; padding: 1rem;
    }
    .po-sc-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #d97706; margin-bottom: .625rem;
    }
    .po-scribecount-note p {
      font-size: .78rem; color: #374151; margin: 0 0 .5rem; line-height: 1.6;
    }
    .po-scribecount-note p:last-child { margin-bottom: 0; }
  `]
})
export class PreorderDetailPanelComponent {
  @Input() flow!: Flow;
  activeTab: PoTab = 'overview';
}
