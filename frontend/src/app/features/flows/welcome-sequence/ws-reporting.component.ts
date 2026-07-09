import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowApiService, FlowEmailMetrics } from '../../../core/services/flow-api.service';

@Component({
  selector: 'app-ws-reporting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ws-reporting-section">
      <p class="ws-body" *ngIf="!loading && metrics">
        Live stats from emails sent in this welcome sequence — {{ metrics.totalSent | number }} sent,
        {{ metrics.totalDelivered | number }} delivered across {{ metrics.totalTriggers | number }} trigger(s).
      </p>
      <p class="ws-body" *ngIf="loading">Loading reporting data…</p>
      <p class="ws-body ws-empty" *ngIf="!loading && !metrics">No reporting data yet. Trigger the flow to start sending.</p>

      <div class="ws-metrics-grid" *ngIf="!loading && metrics?.emails?.length">
        <div class="ws-metric-card" *ngFor="let m of metrics!.emails; let i = index">
          <div class="ws-metric-val" [style.color]="metricColors[i % metricColors.length]">
            {{ m.sent > 0 ? m.deliveryRate + '%' : '—' }}
          </div>
          <div class="ws-metric-label">{{ m.sent > 0 ? 'Delivery rate' : 'Not sent yet' }}</div>
          <div class="ws-metric-email">{{ m.stepLabel }}</div>
          <div class="ws-metric-counts">{{ m.delivered | number }} / {{ m.sent | number }} delivered</div>
        </div>
      </div>

      <div class="ws-reporting-signals" *ngIf="!loading && metrics?.signals?.length">
        <p class="ws-signals-label">What the data tells you:</p>
        <div class="ws-signal-item" *ngFor="let s of metrics!.signals">
          <div class="ws-signal-icon" [ngClass]="s.type">
            <svg *ngIf="s.type === 'warn'" viewBox="0 0 20 20" fill="#d97706" width="12" height="12">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
            <svg *ngIf="s.type === 'good'" viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span>{{ s.signal }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ws-reporting-section { display:flex; flex-direction:column; gap:.875rem; }
    .ws-body { font-size:.8125rem; color:#334155; line-height:1.6; margin:0; }
    .ws-empty { color:#94a3b8; font-style:italic; }
    .ws-metrics-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.625rem; }
    .ws-metric-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; display:flex; flex-direction:column; gap:.2rem; }
    .ws-metric-val { font-size:1.5rem; font-weight:900; letter-spacing:-.03em; line-height:1; }
    .ws-metric-label { font-size:.75rem; font-weight:600; color:#374151; }
    .ws-metric-email { font-size:.7rem; color:#64748b; }
    .ws-metric-counts { font-size:.68rem; color:#94a3b8; }
    .ws-reporting-signals { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; padding:.875rem; }
    .ws-signals-label { font-size:.75rem; font-weight:600; color:#64748b; margin:0 0 .625rem; }
    .ws-signal-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8rem; color:#374151; line-height:1.45; margin-bottom:.5rem; }
    .ws-signal-item:last-child { margin-bottom:0; }
    .ws-signal-icon { flex-shrink:0; margin-top:1px; }
    @media(max-width:480px) { .ws-metrics-grid { grid-template-columns:1fr; } }
  `],
})
export class WsReportingComponent implements OnChanges {
  @Input() flowId = '';
  private flowApi = inject(FlowApiService);

  loading = false;
  metrics: FlowEmailMetrics | null = null;
  readonly metricColors = ['#6366f1', '#3b82f6', '#f59e0b', '#10b981'];

  ngOnChanges() {
    if (this.flowId) this.load();
  }

  private load() {
    this.loading = true;
    this.flowApi.getFlowEmailMetrics(this.flowId).subscribe({
      next: data => {
        this.metrics = data;
        this.loading = false;
      },
      error: () => {
        this.metrics = null;
        this.loading = false;
      },
    });
  }
}
