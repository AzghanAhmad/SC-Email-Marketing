import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsOverviewComponent } from './ws-overview.component';
import { WsEmail1Component } from './ws-email1.component';
import { WsEmail2Component } from './ws-email2.component';
import { WsEmail3Component } from './ws-email3.component';
import { WsEmail4Component } from './ws-email4.component';
import { WsLogicComponent } from './ws-logic.component';
import { WsReportingComponent } from './ws-reporting.component';

type WsTab = 'overview' | 'email1' | 'email2' | 'email3' | 'email4' | 'logic' | 'reporting';

@Component({
  selector: 'app-welcome-sequence-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    WsOverviewComponent,
    WsEmail1Component,
    WsEmail2Component,
    WsEmail3Component,
    WsEmail4Component,
    WsLogicComponent,
    WsReportingComponent,
  ],
  template: `
    <div class="ws-panel">

      <!-- Header -->
      <div class="ws-panel-header">
        <div class="ws-panel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <p class="ws-panel-title">Welcome Sequence</p>
          <p class="ws-panel-sub">4 emails · Day One priority · 1,842 triggered</p>
        </div>
      </div>

      <!-- Tab nav -->
      <div class="ws-tabs">
        <button *ngFor="let t of tabs"
                class="ws-tab"
                [class.active]="activeTab === t.id"
                (click)="activeTab = t.id">
          {{ t.label }}
        </button>
      </div>

      <!-- Tab content -->
      <div class="ws-tab-content">
        <app-ws-overview
          *ngIf="activeTab === 'overview'"
          (tabSelect)="setTab($event)">
        </app-ws-overview>

        <app-ws-email1
          *ngIf="activeTab === 'email1'"
          (subjectSelected)="onSubjectSelected($event)">
        </app-ws-email1>

        <app-ws-email2
          *ngIf="activeTab === 'email2'"
          (subjectSelected)="onSubjectSelected($event)">
        </app-ws-email2>

        <app-ws-email3
          *ngIf="activeTab === 'email3'"
          (subjectSelected)="onSubjectSelected($event)">
        </app-ws-email3>

        <app-ws-email4
          *ngIf="activeTab === 'email4'"
          (subjectSelected)="onSubjectSelected($event)">
        </app-ws-email4>

        <app-ws-logic *ngIf="activeTab === 'logic'"></app-ws-logic>

        <app-ws-reporting *ngIf="activeTab === 'reporting'"></app-ws-reporting>
      </div>

    </div>
  `,
  styles: [`
    .ws-panel {
      background:#fff; border:1.5px solid #e2e8f0; border-radius:16px;
      padding:1.25rem; display:flex; flex-direction:column; gap:1rem;
      position:sticky; top:80px;
    }
    .ws-panel-header { display:flex; align-items:center; gap:.625rem; }
    .ws-panel-icon {
      width:36px; height:36px; border-radius:10px; flex-shrink:0;
      background:rgba(99,102,241,.1); color:#6366f1;
      display:flex; align-items:center; justify-content:center;
    }
    .ws-panel-title { font-size:.875rem; font-weight:700; color:#0f172a; margin:0 0 .1rem; }
    .ws-panel-sub { font-size:.72rem; color:#94a3b8; margin:0; }
    .ws-tabs {
      display:flex; gap:.25rem; border-bottom:1.5px solid #f1f5f9;
      overflow-x:auto; scrollbar-width:none; flex-wrap:nowrap;
    }
    .ws-tabs::-webkit-scrollbar { display:none; }
    .ws-tab {
      padding:.4rem .65rem; background:none; border:none;
      font-size:.72rem; font-weight:500; color:#94a3b8;
      font-family:inherit; cursor:pointer;
      border-bottom:2px solid transparent; margin-bottom:-1.5px;
      transition:color .15s, border-color .15s; white-space:nowrap;
    }
    .ws-tab:hover { color:#334155; }
    .ws-tab.active { color:#6366f1; border-bottom-color:#6366f1; font-weight:600; }
    .ws-tab-content { min-height:200px; }
  `]
})
export class WelcomeSequenceDetailPanelComponent {
  activeTab: WsTab = 'overview';

  readonly tabs: { id: WsTab; label: string }[] = [
    { id: 'overview',   label: 'Overview' },
    { id: 'email1',     label: 'Email 1' },
    { id: 'email2',     label: 'Email 2' },
    { id: 'email3',     label: 'Email 3' },
    { id: 'email4',     label: 'Email 4' },
    { id: 'logic',      label: 'Logic & Tags' },
    { id: 'reporting',  label: 'Reporting' },
  ];

  onSubjectSelected(line: string) {
    // Subject line copied to clipboard for use in the email editor
    navigator.clipboard?.writeText(line).catch(() => {});
  }

  setTab(tab: string) {
    this.activeTab = tab as WsTab;
  }
}
