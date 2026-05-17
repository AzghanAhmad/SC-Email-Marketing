import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { ScOverviewIntroComponent } from './sc-overview-intro.component';
import { ScTimingComponent } from './sc-timing.component';
import { ScThreeJobsComponent } from './sc-three-jobs.component';
import { ScFlowPathComponent } from './sc-flow-path.component';
import { ScAuthorvaultComponent } from './sc-authorvault.component';
import { ScFourScenariosComponent } from './sc-four-scenarios.component';
import { ScTriggerRoutingComponent } from './sc-trigger-routing.component';
import { ScWritingGuideComponent } from './sc-writing-guide.component';
import { ScMomentBetweenStoriesComponent } from './sc-moment-between-stories.component';
import { ScPerformanceComponent } from './sc-performance.component';

type ScTab = 'overview' | 'scenarios' | 'routing' | 'writing' | 'performance';

@Component({
  selector: 'app-series-completion-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    ScOverviewIntroComponent,
    ScTimingComponent,
    ScThreeJobsComponent,
    ScFlowPathComponent,
    ScAuthorvaultComponent,
    ScFourScenariosComponent,
    ScTriggerRoutingComponent,
    ScWritingGuideComponent,
    ScMomentBetweenStoriesComponent,
    ScPerformanceComponent,
  ],
  template: `
    <div class="sc-panel">

      <div class="sc-panel-header">
        <div class="sc-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="sc-panel-title-block">
          <h3 class="sc-panel-title">Series Completion</h3>
          <span class="sc-panel-sub">Launch family · 4 routing scenarios · AuthorVault-connected · {{ flow.triggers }} triggered</span>
        </div>
      </div>

      <div class="sc-tabs">
        <button class="sc-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="sc-tab" [class.active]="activeTab === 'scenarios'" (click)="activeTab = 'scenarios'">4 Scenarios</button>
        <button class="sc-tab" [class.active]="activeTab === 'routing'" (click)="activeTab = 'routing'">Routing</button>
        <button class="sc-tab" [class.active]="activeTab === 'writing'" (click)="activeTab = 'writing'">Writing Guide</button>
        <button class="sc-tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Stats</button>
      </div>

      <div class="sc-tab-content">

        <div *ngIf="activeTab === 'overview'">
          <app-sc-overview-intro></app-sc-overview-intro>
          <app-sc-timing></app-sc-timing>
          <app-sc-three-jobs></app-sc-three-jobs>
          <app-sc-flow-path></app-sc-flow-path>
          <app-sc-authorvault></app-sc-authorvault>
        </div>

        <div *ngIf="activeTab === 'scenarios'">
          <app-sc-four-scenarios></app-sc-four-scenarios>
        </div>

        <div *ngIf="activeTab === 'routing'">
          <app-sc-trigger-routing></app-sc-trigger-routing>
        </div>

        <div *ngIf="activeTab === 'writing'">
          <app-sc-writing-guide></app-sc-writing-guide>
          <app-sc-moment-between-stories></app-sc-moment-between-stories>
        </div>

        <div *ngIf="activeTab === 'performance'">
          <app-sc-performance></app-sc-performance>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .sc-panel { display: flex; flex-direction: column; gap: 0; min-width: 0; width: 100%; }
    .sc-tab-content { min-width: 0; overflow: hidden; }

    .sc-panel-header {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
    }
    .sc-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(99,102,241,0.1); color: #6366f1;
      display: flex; align-items: center; justify-content: center;
    }
    .sc-panel-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .sc-panel-sub { font-size: .72rem; color: #94a3b8; }

    .sc-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .sc-tab {
      flex: 1 1 auto; min-width: max-content; padding: .4rem .65rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .7rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .sc-tab:hover { color: #0f172a; }
    .sc-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
  `]
})
export class SeriesCompletionDetailPanelComponent {
  @Input() flow!: Flow;
  activeTab: ScTab = 'overview';
}
