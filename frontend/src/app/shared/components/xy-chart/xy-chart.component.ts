import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartSeries {
  name: string;
  color: string;
  values: number[];
}

@Component({
  selector: 'app-xy-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="xy-chart" [style.minHeight.px]="height + (showLegend && series.length > 1 ? 72 : 48)">
      <div class="xy-body">
        <div class="xy-y-axis">
          <div class="xy-y-label" *ngIf="yAxisLabel">{{ yAxisLabel }}</div>
          <div class="xy-y-ticks">
            <span *ngFor="let tick of yTicks">{{ tick }}</span>
          </div>
        </div>
        <div class="xy-plot">
          <svg [attr.viewBox]="'0 0 ' + plotW + ' ' + plotH" preserveAspectRatio="none" class="xy-svg">
            <line *ngFor="let y of gridYs" [attr.x1]="padL" [attr.y1]="y" [attr.x2]="plotW - padR" [attr.y2]="y" stroke="#e2e8f0" stroke-width="1"/>
            <ng-container *ngIf="type === 'line'">
              <g *ngFor="let s of series">
                <polygon [attr.points]="areaPoints(s.values)" [attr.fill]="s.color" fill-opacity="0.12"/>
                <polyline [attr.points]="linePoints(s.values)" fill="none" [attr.stroke]="s.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                <circle *ngFor="let pt of lineDots(s.values); let i = index" [attr.cx]="pt.x" [attr.cy]="pt.y" r="4" [attr.fill]="s.color" stroke="#fff" stroke-width="2"/>
              </g>
            </ng-container>
            <ng-container *ngIf="type === 'bar'">
              <g *ngFor="let i of labelIndexes">
                <rect *ngFor="let s of series; let si = index"
                  [attr.x]="barX(i, si)"
                  [attr.y]="barY(s.values[i])"
                  [attr.width]="barWidth"
                  [attr.height]="barH(s.values[i])"
                  [attr.fill]="s.color"
                  rx="3"/>
              </g>
            </ng-container>
          </svg>
          <div class="xy-x-labels">
            <span *ngFor="let l of labels">{{ l }}</span>
          </div>
          <div class="xy-x-title" *ngIf="xAxisLabel">{{ xAxisLabel }}</div>
        </div>
      </div>
      <div class="xy-legend" *ngIf="showLegend && series.length > 1">
        <span class="xy-legend-item" *ngFor="let s of series">
          <span class="xy-dot" [style.background]="s.color"></span>{{ s.name }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .xy-chart { display:flex; flex-direction:column; gap:.625rem; width:100%; }
    .xy-body { display:flex; gap:.5rem; flex:1; min-height:0; align-items:stretch; }
    .xy-y-axis { display:flex; flex-direction:column; width:48px; flex-shrink:0; gap:.35rem; }
    .xy-y-label { font-size:.65rem; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.04em; text-align:right; line-height:1.2; }
    .xy-y-ticks { display:flex; flex-direction:column; justify-content:space-between; flex:1; font-size:.65rem; color:#64748b; font-weight:500; text-align:right; padding-bottom:1.75rem; min-height:140px; }
    .xy-plot { flex:1; min-width:0; display:flex; flex-direction:column; }
    .xy-svg { width:100%; height:140px; display:block; }
    .xy-x-labels { display:flex; justify-content:space-between; font-size:.68rem; color:#64748b; margin-top:.35rem; padding:0 2px; gap:.25rem; }
    .xy-x-labels span { flex:1; text-align:center; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .xy-x-title { font-size:.68rem; color:#94a3b8; text-align:center; margin-top:.25rem; }
    .xy-legend { display:flex; flex-wrap:wrap; gap:.875rem; margin-top:.125rem; padding-top:.25rem; }
    .xy-legend-item { display:flex; align-items:center; gap:.35rem; font-size:.75rem; color:#64748b; font-weight:500; }
    .xy-dot { width:8px; height:8px; border-radius:50%; }
  `]
})
export class XyChartComponent implements OnChanges {
  @Input() type: 'bar' | 'line' = 'line';
  @Input() labels: string[] = [];
  @Input() series: ChartSeries[] = [];
  @Input() height = 180;
  @Input() yAxisLabel = '';
  @Input() xAxisLabel = '';
  @Input() showLegend = true;

  plotW = 400;
  plotH = 160;
  padL = 8;
  padR = 8;
  padT = 12;
  padB = 8;
  yTicks: string[] = [];
  gridYs: number[] = [];
  labelIndexes: number[] = [];
  barWidth = 12;
  private yMin = 0;
  private yMax = 1;

  ngOnChanges() {
    this.labelIndexes = this.labels.map((_, i) => i);
    this.computeScale();
  }

  private computeScale() {
    const all = this.series.flatMap(s => s.values);
    const max = Math.max(1, ...all, 0);
    const min = Math.min(0, ...all);
    this.yMin = min;
    this.yMax = max <= min ? min + 1 : max;
    const steps = 4;
    this.yTicks = [];
    this.gridYs = [];
    for (let i = steps; i >= 0; i--) {
      const val = this.yMin + (i / steps) * (this.yMax - this.yMin);
      this.yTicks.push(this.formatTick(val));
      const y = this.padT + ((steps - i) / steps) * (this.plotH - this.padT - this.padB);
      this.gridYs.push(y);
    }
    const groups = Math.max(1, this.labels.length);
    const groupW = (this.plotW - this.padL - this.padR) / groups;
    this.barWidth = Math.max(6, Math.min(18, (groupW - 4) / Math.max(1, this.series.length)));
  }

  private formatTick(v: number): string {
    if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k';
    if (this.yMax <= 100 && this.yMax > 10) return v.toFixed(0) + '%';
    if (this.yMax <= 10) return v.toFixed(1);
    return v.toFixed(0);
  }

  private valY(v: number): number {
    const range = this.yMax - this.yMin || 1;
    return this.padT + (1 - (v - this.yMin) / range) * (this.plotH - this.padT - this.padB);
  }

  linePoints(values: number[]): string {
    if (!values.length) return '';
    return values.map((v, i) => {
      const x = this.padL + (values.length === 1 ? (this.plotW - this.padL - this.padR) / 2 : (i / (values.length - 1)) * (this.plotW - this.padL - this.padR));
      return `${x},${this.valY(v)}`;
    }).join(' ');
  }

  areaPoints(values: number[]): string {
    if (!values.length) return '';
    const line = values.map((v, i) => {
      const x = this.padL + (values.length === 1 ? (this.plotW - this.padL - this.padR) / 2 : (i / (values.length - 1)) * (this.plotW - this.padL - this.padR));
      return `${x},${this.valY(v)}`;
    });
    const firstX = this.padL;
    const lastX = this.padL + (values.length === 1 ? (this.plotW - this.padL - this.padR) / 2 : this.plotW - this.padL - this.padR);
    return `${firstX},${this.plotH - this.padB} ${line.join(' ')} ${lastX},${this.plotH - this.padB}`;
  }

  lineDots(values: number[]) {
    return values.map((v, i) => ({
      x: this.padL + (values.length === 1 ? (this.plotW - this.padL - this.padR) / 2 : (i / (values.length - 1)) * (this.plotW - this.padL - this.padR)),
      y: this.valY(v),
    }));
  }

  barX(index: number, seriesIndex: number): number {
    const groups = Math.max(1, this.labels.length);
    const groupW = (this.plotW - this.padL - this.padR) / groups;
    const groupStart = this.padL + index * groupW;
    const offset = (groupW - this.barWidth * this.series.length) / 2;
    return groupStart + offset + seriesIndex * this.barWidth;
  }

  barY(v: number): number {
    return this.valY(Math.max(0, v));
  }

  barH(v: number): number {
    return Math.max(2, this.plotH - this.padB - this.valY(Math.max(0, v)));
  }
}
