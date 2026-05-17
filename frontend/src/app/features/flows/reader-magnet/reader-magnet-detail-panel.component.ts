import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmdOverviewComponent } from './rmd-overview.component';
import { RmdDeliveryEmailComponent } from './rmd-delivery-email.component';
import { RmdFollowupLogicComponent } from './rmd-followup-logic.component';
import { RmdReportingComponent } from './rmd-reporting.component';

type RmdTab = 'overview' | 'delivery' | 'followup' | 'reporting';

@Component({
  selector: 'app-reader-magnet-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    RmdOverviewComponent,
    RmdDeliveryEmailComponent,
    RmdFollowupLogicComponent,
    RmdReportingComponent,
  ],
  template: `
    <div class="rmd-panel">

      <!-- Header -->
      <div class="rmd-panel-header">
        <div class="rmd-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div>
          <p class="rmd-panel-title">Reader Magnet Delivery</p>
          <p class="rmd-panel-sub">2 emails · Conditional branch · 934 triggered</p>
        </div>
      </div>

      <!-- Tab nav -->
      <div class="rmd-tabs">
        <button *ngFor="let t of tabs"
                class="rmd-tab"
                [class.active]="activeTab === t.id"
                (click)="activeTab = t.id">
          {{ t.label }}
        </button>
      </div>

      <!-- Tab content -->
      <div class="rmd-tab-content">
        <app-rmd-overview *ngIf="activeTab === 'overview'"></app-rmd-overview>
        <app-rmd-delivery-email
          *ngIf="activeTab === 'delivery'"
          (subjectSelected)="onSubjectSelected($event)">
        </app-rmd-delivery-email>
        <app-rmd-followup-logic
          *ngIf="activeTab === 'followup'"
          (subjectSelected)="onSubjectSelected($event)">
        </app-rmd-followup-logic>
        <app-rmd-reporting *ngIf="activeTab === 'reporting'"></app-rmd-reporting>
      </div>

    </div>
  `,
  styles: [`
    .rmd-panel {
      background:#fff; border:1.5px solid #e2e8f0; border-radius:16px;
      padding:1.25rem; display:flex; flex-direction:column; gap:1rem;
      position:sticky; top:80px;
    }
    .rmd-panel-header { display:flex; align-items:center; gap:.625rem; }
    .rmd-panel-icon {
      width:36px; height:36px; border-radius:10px; flex-shrink:0;
      background:rgba(16,185,129,.1); color:#059669;
      display:flex; align-items:center; justify-content:center;
    }
    .rmd-panel-title { font-size:.875rem; font-weight:700; color:#0f172a; margin:0 0 .1rem; }
    .rmd-panel-sub { font-size:.72rem; color:#94a3b8; margin:0; }
    .rmd-tabs {
      display:flex; gap:.25rem; border-bottom:1.5px solid #f1f5f9;
      overflow-x:auto; scrollbar-width:none;
    }
    .rmd-tabs::-webkit-scrollbar { display:none; }
    .rmd-tab {
      padding:.4rem .75rem; background:none; border:none;
      font-size:.75rem; font-weight:500; color:#94a3b8;
      font-family:inherit; cursor:pointer;
      border-bottom:2px solid transparent; margin-bottom:-1.5px;
      transition:color .15s, border-color .15s; white-space:nowrap;
    }
    .rmd-tab:hover { color:#334155; }
    .rmd-tab.active { color:#059669; border-bottom-color:#059669; font-weight:600; }
    .rmd-tab-content { min-height:200px; }
  `]
})
export class ReaderMagnetDetailPanelComponent {
  activeTab: RmdTab = 'overview';

  readonly tabs: { id: RmdTab; label: string }[] = [
    { id: 'overview',  label: 'Overview' },
    { id: 'delivery',  label: 'Delivery Email' },
    { id: 'followup',  label: 'Follow-Up & Logic' },
    { id: 'reporting', label: 'Reporting' },
  ];

  onSubjectSelected(line: string) {
    navigator.clipboard?.writeText(line).catch(() => {});
  }
}
