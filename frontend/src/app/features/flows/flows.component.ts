import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow, FlowTemplate } from '../../core/services/mock-data.service';
import { FlowApiService } from '../../core/services/flow-api.service';
import { FlowsHeaderComponent, FlowsTab } from './flows-header.component';
import { FlowsGridComponent } from './flows-grid.component';
import { FlowBuildingBlocksComponent } from './flow-building-blocks.component';
import { FlowBuilderComponent } from './flow-builder.component';
import { FlowLibraryComponent } from './flow-library.component';
import { FlowWalkthroughModalComponent } from './flow-walkthrough-modal.component';
import { FlowQualitiesComponent } from './flow-qualities.component';
import { FlowConnectedBusinessComponent } from './flow-connected-business.component';

@Component({
  selector: 'app-flows',
  standalone: true,
  imports: [
    CommonModule,
    FlowsHeaderComponent,
    FlowsGridComponent,
    FlowBuildingBlocksComponent,
    FlowBuilderComponent,
    FlowLibraryComponent,
    FlowWalkthroughModalComponent,
    FlowQualitiesComponent,
    FlowConnectedBusinessComponent,
  ],
  template: `
    <div class="page-wrapper">

      <!-- Header + tabs (hidden when builder is open) -->
      <app-flows-header
        *ngIf="!selectedFlow()"
        [activeTab]="activeTab()"
        [flowCount]="flows.length"
        (onTabChange)="activeTab.set($event)"
        (onNewFlow)="openLibrary()"
        (onOpenWalkthrough)="walkthroughOpen.set(true)">
      </app-flows-header>

      <!-- Walkthrough modal -->
      <app-flow-walkthrough-modal
        *ngIf="walkthroughOpen()"
        (onClose)="walkthroughOpen.set(false)">
      </app-flow-walkthrough-modal>

      <!-- ── My Flows tab ─────────────────────────────────────────────── -->
      <div class="flows-layout" *ngIf="!selectedFlow() && activeTab() === 'my-flows'">
        <app-flows-grid
          [flows]="flows"
          (onOpenFlow)="selectedFlow.set($event)"
          (onBrowseLibrary)="activeTab.set('library')">
        </app-flows-grid>

        <div class="sidebar-stack">
          <app-flow-building-blocks></app-flow-building-blocks>
          <app-flow-qualities></app-flow-qualities>
          <app-flow-connected-business></app-flow-connected-business>
        </div>
      </div>

      <!-- ── Flow Library tab ─────────────────────────────────────────── -->
      <div *ngIf="!selectedFlow() && activeTab() === 'library'">
        <app-flow-library
          [templates]="templates"
          (onInstall)="installTemplate($event)">
        </app-flow-library>
      </div>

      <!-- ── Flow Builder (replaces page when a flow is open) ─────────── -->
      <app-flow-builder
        *ngIf="selectedFlow()"
        [flow]="selectedFlow()!"
        (onBack)="selectedFlow.set(null)"
        (onFlowUpdated)="onFlowUpdated($event)">
      </app-flow-builder>

    </div>
  `,
  styles: [`
    .page-wrapper { padding: 2rem; max-width: 1400px; margin: 0 auto; }

    .flows-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.75rem;
      align-items: start;
    }
    @media (max-width: 1100px) {
      .flows-layout { grid-template-columns: 1fr; }
    }

    .sidebar-stack {
      display: flex; flex-direction: column; gap: 1.25rem;
      position: sticky; top: 80px;
    }
  `]
})
export class FlowsComponent implements OnInit {
  flows: Flow[] = [];
  templates: FlowTemplate[] = [];
  loading = signal(true);
  loadError = signal('');
  selectedFlow = signal<Flow | null>(null);
  activeTab = signal<FlowsTab>('my-flows');
  walkthroughOpen = signal(false);

  constructor(private flowApi: FlowApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.flowApi.getMyFlows().subscribe({
      next: flows => {
        this.flows = flows;
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: err => {
        this.loadError.set(err.message);
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
    this.flowApi.getTemplates().subscribe({
      next: templates => {
        this.templates = templates;
        this.cdr.detectChanges();
      },
      error: () => { /* templates may still show empty */ }
    });
  }

  openLibrary() {
    this.activeTab.set('library');
  }

  installTemplate(tpl: FlowTemplate) {
    this.flowApi.installTemplate(tpl.id).subscribe({
      next: newFlow => {
        this.flows = [newFlow, ...this.flows];
        this.selectedFlow.set(newFlow);
        this.activeTab.set('my-flows');
        this.cdr.detectChanges();
      },
      error: err => {
        this.loadError.set(err.message);
        this.cdr.detectChanges();
      }
    });
  }

  onFlowUpdated(flow: Flow) {
    this.flows = this.flows.map(f => f.id === flow.id ? flow : f);
    this.selectedFlow.set(flow);
    this.cdr.detectChanges();
  }
}
