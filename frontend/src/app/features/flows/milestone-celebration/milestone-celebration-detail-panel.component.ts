import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { McOverviewIntroComponent } from './mc-overview-intro.component';
import { McWhyLoyaltyComponent } from './mc-why-loyalty.component';
import { McThreeTypesComponent } from './mc-three-types.component';
import { McAnniversaryComponent } from './mc-anniversary.component';
import { McBirthdayComponent } from './mc-birthday.component';
import { McCatalogComponent } from './mc-catalog.component';
import { McWritingPrinciplesComponent } from './mc-writing-principles.component';
import { McScribecountSetupComponent } from './mc-scribecount-setup.component';
import { McFlowPathComponent } from './mc-flow-path.component';
import { McClosingComponent } from './mc-closing.component';
import { McPerformanceComponent } from './mc-performance.component';

type McTab = 'overview' | 'milestones' | 'setup' | 'writing' | 'performance';

@Component({
  selector: 'app-milestone-celebration-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    McOverviewIntroComponent,
    McWhyLoyaltyComponent,
    McThreeTypesComponent,
    McAnniversaryComponent,
    McBirthdayComponent,
    McCatalogComponent,
    McWritingPrinciplesComponent,
    McScribecountSetupComponent,
    McFlowPathComponent,
    McClosingComponent,
    McPerformanceComponent,
  ],
  template: `
    <div class="mc-panel">

      <div class="mc-panel-header">
        <div class="mc-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <path d="M12 14v7"/><path d="M8 18h8"/>
          </svg>
        </div>
        <div class="mc-panel-title-block">
          <h3 class="mc-panel-title">Milestone Celebration</h3>
          <span class="mc-panel-sub">Retention family · 3 milestone types · Relationship-forward · {{ flow.triggers }} triggered</span>
        </div>
      </div>

      <div class="mc-tabs">
        <button class="mc-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="mc-tab" [class.active]="activeTab === 'milestones'" (click)="activeTab = 'milestones'">3 Milestones</button>
        <button class="mc-tab" [class.active]="activeTab === 'setup'" (click)="activeTab = 'setup'">Setup</button>
        <button class="mc-tab" [class.active]="activeTab === 'writing'" (click)="activeTab = 'writing'">Writing</button>
        <button class="mc-tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Stats</button>
      </div>

      <div class="mc-tab-content">

        <div *ngIf="activeTab === 'overview'">
          <app-mc-overview-intro></app-mc-overview-intro>
          <app-mc-why-loyalty></app-mc-why-loyalty>
          <app-mc-three-types></app-mc-three-types>
          <app-mc-flow-path></app-mc-flow-path>
          <app-mc-closing></app-mc-closing>
        </div>

        <div *ngIf="activeTab === 'milestones'">
          <app-mc-anniversary></app-mc-anniversary>
          <app-mc-birthday></app-mc-birthday>
          <app-mc-catalog></app-mc-catalog>
        </div>

        <div *ngIf="activeTab === 'setup'">
          <app-mc-scribecount-setup></app-mc-scribecount-setup>
        </div>

        <div *ngIf="activeTab === 'writing'">
          <app-mc-writing-principles></app-mc-writing-principles>
        </div>

        <div *ngIf="activeTab === 'performance'">
          <app-mc-performance></app-mc-performance>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .mc-panel { display: flex; flex-direction: column; gap: 0; min-width: 0; width: 100%; }
    .mc-tab-content { min-width: 0; overflow: hidden; }

    .mc-panel-header {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
    }
    .mc-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(217,119,6,0.12); color: #d97706;
      display: flex; align-items: center; justify-content: center;
    }
    .mc-panel-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .mc-panel-sub { font-size: .72rem; color: #94a3b8; }

    .mc-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .mc-tab {
      flex: 1 1 auto; min-width: max-content; padding: .4rem .65rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .7rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .mc-tab:hover { color: #0f172a; }
    .mc-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
  `]
})
export class MilestoneCelebrationDetailPanelComponent {
  @Input() flow!: Flow;
  activeTab: McTab = 'overview';
}
