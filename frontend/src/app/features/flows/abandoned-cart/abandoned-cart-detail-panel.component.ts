import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { AcIntroComponent } from './ac-intro.component';
import { AcTwoFlowsComponent } from './ac-two-flows.component';
import { AcWritingGuideComponent } from './ac-writing-guide.component';
import { AcRequirementsComponent } from './ac-requirements.component';
import { AcPerformanceComponent } from './ac-performance.component';

type AcTab = 'overview' | 'writing' | 'requirements' | 'performance';

@Component({
  selector: 'app-abandoned-cart-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    AcIntroComponent,
    AcTwoFlowsComponent,
    AcWritingGuideComponent,
    AcRequirementsComponent,
    AcPerformanceComponent,
  ],
  template: `
    <div class="ac-panel">

      <!-- Panel header -->
      <div class="ac-panel-header">
        <div class="ac-panel-icon" [ngClass]="isCheckout ? 'icon-checkout' : 'icon-cart'">
          <svg *ngIf="!isCheckout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <svg *ngIf="isCheckout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <div class="ac-panel-title-block">
          <h3 class="ac-panel-title">{{ isCheckout ? 'Abandoned Checkout' : 'Abandoned Cart' }}</h3>
          <span class="ac-panel-sub">
            {{ isCheckout
              ? 'Transaction family · 30-min trigger · 2 emails · High intent'
              : 'Transaction family · 1-hour trigger · 2 emails · Recovery flow' }}
          </span>
        </div>
      </div>

      <!-- Tab nav -->
      <div class="ac-tabs">
        <button class="ac-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="ac-tab" [class.active]="activeTab === 'writing'" (click)="activeTab = 'writing'">Writing Guide</button>
        <button class="ac-tab" [class.active]="activeTab === 'requirements'" (click)="activeTab = 'requirements'">Requirements</button>
        <button class="ac-tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Stats</button>
      </div>

      <!-- Tab content -->
      <div class="ac-tab-content">

        <div *ngIf="activeTab === 'overview'">
          <app-ac-intro></app-ac-intro>
          <app-ac-two-flows></app-ac-two-flows>
        </div>

        <div *ngIf="activeTab === 'writing'">
          <app-ac-writing-guide></app-ac-writing-guide>
        </div>

        <div *ngIf="activeTab === 'requirements'">
          <app-ac-requirements></app-ac-requirements>
        </div>

        <div *ngIf="activeTab === 'performance'">
          <app-ac-performance></app-ac-performance>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .ac-panel { display: flex; flex-direction: column; gap: 0; }

    .ac-panel-header {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
    }
    .ac-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-cart { background: rgba(245,158,11,0.1); color: #d97706; }
    .icon-checkout { background: rgba(99,102,241,0.1); color: #6366f1; }

    .ac-panel-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .ac-panel-sub { font-size: .72rem; color: #94a3b8; }

    .ac-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .ac-tab {
      flex: 1; min-width: 0; padding: .4rem .5rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .72rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .ac-tab:hover { color: #0f172a; }
    .ac-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
  `]
})
export class AbandonedCartDetailPanelComponent {
  @Input() flow!: Flow;
  activeTab: AcTab = 'overview';

  get isCheckout(): boolean {
    return this.flow?.id === '6';
  }
}
