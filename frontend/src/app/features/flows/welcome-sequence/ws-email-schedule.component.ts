import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlowStep } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-ws-email-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ws-schedule-field" *ngIf="step">
      <label class="ws-schedule-label">Send date &amp; time <span class="req">*</span></label>
      <input
        type="datetime-local"
        class="form-input"
        [class.input-error]="showError && !localValue"
        [ngModel]="localValue"
        (ngModelChange)="onChange($event)"
        [min]="minLocal"
      />
      <span class="field-error" *ngIf="showError && !localValue">Set when this email should send before triggering the flow.</span>
      <span class="field-hint" *ngIf="localValue">Scheduled for {{ displayScheduled }}</span>
    </div>
  `,
  styles: [`
    .ws-schedule-field { display:flex; flex-direction:column; gap:.35rem; margin-bottom:.875rem; }
    .ws-schedule-label { font-size:.75rem; font-weight:600; color:#334155; }
    .req { color:#dc2626; }
    .field-error { font-size:.72rem; color:#dc2626; }
    .field-hint { font-size:.72rem; color:#64748b; }
    .input-error { border-color:#fca5a5 !important; }
    .form-input {
      width:100%; padding:.65rem .875rem; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:.875rem; font-family:inherit; outline:none;
    }
    .form-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.12); }
  `],
})
export class WsEmailScheduleComponent {
  @Input() step: FlowStep | null = null;
  @Input() showError = false;
  @Output() scheduleChange = new EventEmitter<string>();

  get localValue(): string {
    if (!this.step?.scheduledAt) return '';
    const d = new Date(this.step.scheduledAt);
    if (Number.isNaN(d.getTime())) return '';
    return this.toLocalInput(d);
  }

  get displayScheduled(): string {
    if (!this.step?.scheduledAt) return '';
    const d = new Date(this.step.scheduledAt);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
  }

  get minLocal(): string {
    return this.toLocalInput(new Date());
  }

  onChange(value: string) {
    const iso = value ? new Date(value).toISOString() : '';
    this.scheduleChange.emit(iso);
  }

  private toLocalInput(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
