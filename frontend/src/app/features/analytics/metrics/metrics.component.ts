import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Metrics</h1>
          <p class="page-subtitle">Track your key email marketing performance metrics over time</p>
        </div>
        <select class="period-select">
          <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option>
        </select>
      </div>

      <div class="metrics-grid">
        <div class="glass-card metric-card" *ngFor="let m of metrics">
          <div class="mc-header">
            <span class="mc-label">{{ m.label }}</span>
            <span class="mc-change" [class.up]="m.change > 0" [class.down]="m.change < 0">
              {{ m.change > 0 ? '+' : '' }}{{ m.change }}%
            </span>
          </div>
          <span class="mc-val">{{ m.value }}</span>
          <div class="mc-sparkline">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
              <polyline [attr.points]="m.sparkline" fill="none" [attr.stroke]="m.color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="mc-period">vs previous period</span>
        </div>
      </div>

      <div class="glass-card detail-card">
        <h3 class="detail-title">Metric Details</h3>
        <table class="data-table">
          <thead><tr><th>Metric</th><th>Current</th><th>Previous</th><th>Change</th><th>Trend</th></tr></thead>
          <tbody>
            <tr *ngFor="let m of detailMetrics">
              <td class="metric-name">{{ m.name }}</td>
              <td class="metric-current">{{ m.current }}</td>
              <td class="muted">{{ m.previous }}</td>
              <td>
                <span class="change-badge" [class.up]="m.changeNum > 0" [class.down]="m.changeNum < 0">
                  {{ m.changeNum > 0 ? '+' : '' }}{{ m.changeNum }}%
                </span>
              </td>
              <td>
                <div class="spark-mini">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none">
                    <polyline [attr.points]="m.spark" fill="none" [attr.stroke]="m.changeNum >= 0 ? '#10b981' : '#ef4444'" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .period-select { padding:.55rem 1rem; background:white; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .metrics-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .metric-card { padding:1.375rem; }
    .mc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.375rem; }
    .mc-label { font-size:.75rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
    .mc-change { font-size:.7rem; font-weight:700; padding:.15rem .4rem; border-radius:5px; }
    .mc-change.up { color:#059669; background:rgba(16,185,129,0.1); }
    .mc-change.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .mc-val { font-size:1.75rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .mc-sparkline { height:30px; margin:.5rem 0 .25rem; }
    .mc-sparkline svg { width:100%; height:100%; }
    .mc-period { font-size:.7rem; color:#94a3b8; }

    .detail-card { padding:1.5rem; }
    .detail-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .metric-name { font-weight:600; color:#0f172a; }
    .metric-current { font-weight:700; color:#0f172a; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .change-badge { font-size:.75rem; font-weight:700; padding:.2rem .5rem; border-radius:5px; }
    .change-badge.up { color:#059669; background:rgba(16,185,129,0.1); }
    .change-badge.down { color:#dc2626; background:rgba(239,68,68,0.1); }
    .spark-mini { width:60px; height:20px; }
    .spark-mini svg { width:100%; height:100%; }

    @media(max-width:900px) { .metrics-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .metrics-grid { grid-template-columns:1fr; } }
  `]
})
export class MetricsComponent {
  metrics = [
    { label: 'Open Rate', value: '54.2%', change: 3.2, color: '#3b82f6', sparkline: '0,25 20,18 40,22 60,12 80,8 100,5' },
    { label: 'Click Rate', value: '12.8%', change: 1.4, color: '#8b5cf6', sparkline: '0,22 20,20 40,18 60,15 80,12 100,8' },
    { label: 'Bounce Rate', value: '2.5%', change: -0.3, color: '#ef4444', sparkline: '0,8 20,10 40,12 60,15 80,18 100,20' },
    { label: 'Unsubscribe Rate', value: '0.4%', change: -0.1, color: '#f59e0b', sparkline: '0,15 20,12 40,14 60,10 80,8 100,6' },
    { label: 'Revenue/Email', value: '$0.17', change: 12.4, color: '#10b981', sparkline: '0,28 20,22 40,18 60,14 80,10 100,5' },
    { label: 'List Growth', value: '+521', change: 6.2, color: '#6366f1', sparkline: '0,25 20,20 40,22 60,15 80,10 100,8' },
  ];

  detailMetrics = [
    { name: 'Total Opens', current: '13,474', previous: '11,842', changeNum: 13.8, spark: '0,18 15,14 30,16 45,10 60,8' },
    { name: 'Unique Clicks', current: '3,178', previous: '2,940', changeNum: 8.1, spark: '0,16 15,14 30,12 45,10 60,6' },
    { name: 'Deliverability', current: '97.5%', previous: '96.8%', changeNum: 0.7, spark: '0,10 15,8 30,9 45,6 60,4' },
    { name: 'Spam Complaints', current: '0.09%', previous: '0.12%', changeNum: -25.0, spark: '0,15 15,12 30,14 45,10 60,8' },
    { name: 'Revenue (Total)', current: '$4,280', previous: '$3,490', changeNum: 22.6, spark: '0,18 15,15 30,12 45,8 60,4' },
  ];
}
