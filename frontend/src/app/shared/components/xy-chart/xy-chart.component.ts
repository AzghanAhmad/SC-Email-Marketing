import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
  Filler,
  ChartConfiguration,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
  Filler,
);

export interface ChartSeries {
  name: string;
  color: string;
  values: number[];
  /** Per-segment colors for multi-slice doughnut charts */
  colors?: string[];
}

@Component({
  selector: 'app-xy-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="xy-chart" [style.minHeight.px]="height + (showLegend && series.length > 1 && type !== 'doughnut' ? 56 : 24)">
      <div class="xy-canvas-wrap" [style.height.px]="height">
        <canvas #canvas></canvas>
      </div>
      <div class="xy-axis-labels" *ngIf="yAxisLabel || xAxisLabel">
        <span class="xy-y" *ngIf="yAxisLabel">{{ yAxisLabel }}</span>
        <span class="xy-x" *ngIf="xAxisLabel">{{ xAxisLabel }}</span>
      </div>
    </div>
  `,
  styles: [`
    .xy-chart { display:flex; flex-direction:column; gap:.5rem; width:100%; }
    .xy-canvas-wrap { position:relative; width:100%; }
    .xy-canvas-wrap canvas { width:100% !important; height:100% !important; }
    .xy-axis-labels { display:flex; justify-content:space-between; font-size:.68rem; color:#94a3b8; padding:0 .25rem; }
    .xy-y { font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
    .xy-x { font-weight:500; }
  `],
})
export class XyChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() type: 'bar' | 'line' | 'doughnut' | 'horizontalBar' = 'line';
  @Input() labels: string[] = [];
  @Input() series: ChartSeries[] = [];
  @Input() height = 220;
  @Input() yAxisLabel = '';
  @Input() xAxisLabel = '';
  @Input() showLegend = true;
  /** Doughnut cutout percentage (0–90). Default 72 for ring gauges. */
  @Input() cutout = '72%';

  @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges() {
    this.render();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private render() {
    if (!isPlatformBrowser(this.platformId) || !this.canvasRef?.nativeElement) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart?.destroy();

    const config = this.buildConfig();
    if (!config) return;

    this.chart = new Chart(ctx, config);
  }

  private buildConfig(): ChartConfiguration | null {
    if (!this.labels.length && this.type !== 'doughnut') return null;
    if (!this.series.length) return null;

    const isHorizontal = this.type === 'horizontalBar';
    const isDoughnut = this.type === 'doughnut';
    const chartType = isHorizontal ? 'bar' : isDoughnut ? 'doughnut' : this.type;

    const datasets = isDoughnut
      ? [{
          label: this.series[0]?.name ?? '',
          data: this.series[0]?.values ?? [],
          backgroundColor: this.series[0]?.values.length === 2
            ? [this.series[0].color, '#f1f5f9']
            : (this.series[0]?.colors ?? this.series.map(s => s.color)),
          borderColor: '#fff',
          borderWidth: 2,
          hoverBorderColor: '#3b82f6',
          hoverBorderWidth: 3,
        }]
      : this.series.map(s => ({
          label: s.name,
          data: s.values,
          backgroundColor: this.type === 'line' ? s.color + '22' : s.color,
          borderColor: s.color,
          borderWidth: this.type === 'line' ? 2.5 : 0,
          pointBackgroundColor: s.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: this.type === 'line' ? 4 : 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#3b82f6',
          pointHoverBorderColor: '#fff',
          fill: this.type === 'line',
          tension: 0.35,
          borderRadius: this.type === 'bar' || isHorizontal ? 6 : 0,
          maxBarThickness: isHorizontal ? 28 : 42,
        }));

    const basePlugins = {
      legend: {
        display: this.showLegend && this.series.length > 1 && !isDoughnut,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          color: '#64748b',
          font: { size: 12, weight: 500 as const },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    };

    if (isDoughnut) {
      const doughnutConfig: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: { labels: this.labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: this.cutout,
          rotation: this.series[0]?.values.length === 2 ? -90 : 0,
          circumference: this.series[0]?.values.length === 2 ? 360 : undefined,
          animation: { duration: 900, easing: 'easeOutQuart' },
          plugins: { ...basePlugins, legend: { display: false } },
        },
      };
      return doughnutConfig;
    }

    return {
      type: chartType as 'bar' | 'line',
      data: {
        labels: this.labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isHorizontal ? 'y' : 'x',
        animation: {
          duration: 900,
          easing: 'easeOutQuart',
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: basePlugins,
        scales: {
          x: {
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          },
        },
      },
    };
  }
}
