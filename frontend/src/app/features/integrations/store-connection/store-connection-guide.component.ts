import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScStoreOverviewComponent } from './sc-store-overview.component';
import { ScStoreConnectionComponent } from './sc-store-connection.component';
import { ScStoreEventsComponent } from './sc-store-events.component';
import { ScStoreExamplesComponent } from './sc-store-examples.component';
import { ScStoreSendbackComponent } from './sc-store-sendback.component';
import { ScStorePrivacyComponent } from './sc-store-privacy.component';
import { ScStoreTroubleshootingComponent } from './sc-store-troubleshooting.component';
import { ScStoreSummaryComponent } from './sc-store-summary.component';

type StoreTab = 'overview' | 'events' | 'sync' | 'help';

@Component({
  selector: 'app-store-connection-guide',
  standalone: true,
  imports: [
    CommonModule,
    ScStoreOverviewComponent,
    ScStoreConnectionComponent,
    ScStoreEventsComponent,
    ScStoreExamplesComponent,
    ScStoreSendbackComponent,
    ScStorePrivacyComponent,
    ScStoreTroubleshootingComponent,
    ScStoreSummaryComponent,
  ],
  template: `
    <div class="store-guide glass-card">
      <div class="sg-header">
        <div class="sg-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            <path d="M12 15v2"/><path d="M8 15h8"/>
          </svg>
        </div>
        <div>
          <h2 class="sg-title">How ScribeCount Email works with your store</h2>
          <p class="sg-sub">Automatic, secure communication between your store and your email system</p>
        </div>
      </div>

      <div class="sg-tabs">
        <button class="sg-tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Overview</button>
        <button class="sg-tab" [class.active]="activeTab === 'events'" (click)="activeTab = 'events'">Store → Email</button>
        <button class="sg-tab" [class.active]="activeTab === 'sync'" (click)="activeTab = 'sync'">Email → Store</button>
        <button class="sg-tab" [class.active]="activeTab === 'help'" (click)="activeTab = 'help'">Privacy and Help</button>
      </div>

      <div class="sg-content">
        <div *ngIf="activeTab === 'overview'">
          <app-sc-store-overview></app-sc-store-overview>
          <app-sc-store-connection></app-sc-store-connection>
          <app-sc-store-summary></app-sc-store-summary>
        </div>
        <div *ngIf="activeTab === 'events'">
          <app-sc-store-events></app-sc-store-events>
          <app-sc-store-examples></app-sc-store-examples>
        </div>
        <div *ngIf="activeTab === 'sync'">
          <app-sc-store-sendback></app-sc-store-sendback>
        </div>
        <div *ngIf="activeTab === 'help'">
          <app-sc-store-privacy></app-sc-store-privacy>
          <app-sc-store-troubleshooting></app-sc-store-troubleshooting>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .store-guide { padding: 1.5rem; margin-bottom: 2rem; }
    .sg-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.25rem; }
    .sg-icon {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      background: rgba(59,130,246,0.1); color: #3b82f6;
      display: flex; align-items: center; justify-content: center;
    }
    .sg-title { font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .sg-sub { font-size: .875rem; color: #94a3b8; margin: 0; }

    .sg-tabs {
      display: flex; gap: .2rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: 1.25rem; flex-wrap: wrap;
    }
    .sg-tab {
      flex: 1 1 auto; min-width: max-content; padding: .45rem .75rem;
      border-radius: 8px; border: none; background: transparent;
      color: #64748b; font-size: .78rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .sg-tab:hover { color: #0f172a; }
    .sg-tab.active {
      background: #fff; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .sg-content { min-width: 0; }
  `]
})
export class StoreConnectionGuideComponent {
  activeTab: StoreTab = 'overview';
}
