import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { ReOverviewIntroComponent } from './re-overview-intro.component';
import { ReWhyInactiveComponent } from './re-why-inactive.component';
import { ReInactivityThresholdComponent } from './re-inactivity-threshold.component';
import { ReThreeEmailsComponent } from './re-three-emails.component';
import { ReCleanRemovalComponent } from './re-clean-removal.component';
import { ReScribecountSetupComponent } from './re-scribecount-setup.component';
import { ReFlowPathComponent } from './re-flow-path.component';
import { ReListHealthDashboardComponent } from './re-list-health-dashboard.component';
import { ReMistakesComponent } from './re-mistakes.component';
import { ReClosingComponent } from './re-closing.component';
import { RePerformanceComponent } from './re-performance.component';

type ReTab = 'overview' | 'sequence' | 'setup' | 'performance';

@Component({
  selector: 'app-re-engagement-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReOverviewIntroComponent,
    ReWhyInactiveComponent,
    ReInactivityThresholdComponent,
    ReThreeEmailsComponent,
    ReCleanRemovalComponent,
    ReScribecountSetupComponent,
    ReFlowPathComponent,
    ReListHealthDashboardComponent,
    ReMistakesComponent,
    ReClosingComponent,
    RePerformanceComponent,
  ],
  template: `
    <div class="re-panel">

      <div class="re-panel-header">
        <div class="re-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="re-panel-title-block">
          <h3 class="re-panel-title">Re-engagement</h3>
          <span class="re-panel-sub">Retention family · 3-email sequence · List hygiene · {{ flow.triggers }} triggered</span>
        </div>
      </div>

      <div class="re-tabs">
        <button class="re-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="re-tab" [class.active]="activeTab === 'sequence'" (click)="activeTab = 'sequence'">Sequence</button>
        <button class="re-tab" [class.active]="activeTab === 'setup'" (click)="activeTab = 'setup'">Setup</button>
        <button class="re-tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Stats</button>
      </div>

      <div class="re-tab-content">

        <div *ngIf="activeTab === 'overview'">
          <app-re-overview-intro></app-re-overview-intro>
          <app-re-why-inactive></app-re-why-inactive>
          <app-re-inactivity-threshold></app-re-inactivity-threshold>
          <app-re-flow-path></app-re-flow-path>
          <app-re-closing></app-re-closing>
        </div>

        <div *ngIf="activeTab === 'sequence'">
          <app-re-three-emails></app-re-three-emails>
          <app-re-clean-removal></app-re-clean-removal>
          <app-re-mistakes></app-re-mistakes>
        </div>

        <div *ngIf="activeTab === 'setup'">
          <app-re-scribecount-setup></app-re-scribecount-setup>
          <app-re-list-health-dashboard></app-re-list-health-dashboard>
        </div>

        <div *ngIf="activeTab === 'performance'">
          <app-re-performance></app-re-performance>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .re-panel { display: flex; flex-direction: column; gap: 0; min-width: 0; width: 100%; }
    .re-tab-content { min-width: 0; overflow: hidden; }

    .re-panel-header {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
    }
    .re-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(219,39,119,0.1); color: #db2777;
      display: flex; align-items: center; justify-content: center;
    }
    .re-panel-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .re-panel-sub { font-size: .72rem; color: #94a3b8; }

    .re-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .re-tab {
      flex: 1 1 auto; min-width: max-content; padding: .4rem .65rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .7rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .re-tab:hover { color: #0f172a; }
    .re-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
  `]
})
export class ReEngagementDetailPanelComponent {
  @Input() flow!: Flow;
  activeTab: ReTab = 'overview';
}
