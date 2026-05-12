import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unsubscribe-preference-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pref-panel">
      <div class="pref-header">
        <div class="pref-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
        </div>
        <div>
          <p class="pref-title">Preference Center</p>
          <p class="pref-sub">Prevent unsubscribes before they happen</p>
        </div>
      </div>

      <p class="pref-body">
        The most effective unsubscribe management strategy is not the unsubscribe email itself —
        it is the preference center that gives readers an alternative to unsubscribing entirely.
      </p>

      <div class="pref-reasons">
        <p class="pref-reasons-label">Readers unsubscribe because:</p>
        <div class="pref-reason" *ngFor="let r of reasons">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          {{ r }}
        </div>
      </div>

      <p class="pref-body">
        Any of these situations is resolvable without losing the reader — if you offer them a way
        to tell you what they actually want.
      </p>

      <div class="pref-options">
        <div class="pref-option" *ngFor="let opt of prefOptions">
          <div class="pref-option-icon" [ngClass]="opt.color">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <span>{{ opt.label }}</span>
        </div>
      </div>

      <div class="pref-tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>
          Label the preference link clearly: <strong>"Manage my email preferences"</strong> or
          <strong>"Choose what I receive"</strong> — not the vague "Update preferences" that most
          email footers use. Place it close to the unsubscribe link but visually distinct from it.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .pref-panel {
      background: #f0f7ff; border: 1.5px solid #bfdbfe; border-radius: 12px;
      padding: 1rem; display: flex; flex-direction: column; gap: .875rem;
    }
    .pref-header { display: flex; align-items: flex-start; gap: .625rem; }
    .pref-icon {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      background: #3b82f6; color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .pref-title { font-size: .8125rem; font-weight: 700; color: #1e40af; margin: 0 0 .1rem; }
    .pref-sub { font-size: .72rem; color: #3b82f6; margin: 0; }
    .pref-body { font-size: .78rem; color: #1e3a5f; line-height: 1.55; margin: 0; }

    .pref-reasons { display: flex; flex-direction: column; gap: .3rem; }
    .pref-reasons-label { font-size: .75rem; font-weight: 600; color: #1e40af; margin: 0 0 .375rem; }
    .pref-reason {
      display: flex; align-items: center; gap: .4rem;
      font-size: .75rem; color: #334155;
    }
    .pref-reason svg { flex-shrink: 0; color: #3b82f6; }

    .pref-options { display: flex; flex-direction: column; gap: .35rem; }
    .pref-option {
      display: flex; align-items: center; gap: .5rem;
      font-size: .78rem; color: #1e3a5f; font-weight: 500;
    }
    .pref-option-icon {
      width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .pref-option-icon.blue { background: rgba(59,130,246,.15); color: #3b82f6; }
    .pref-option-icon.green { background: rgba(16,185,129,.15); color: #059669; }
    .pref-option-icon.purple { background: rgba(139,92,246,.15); color: #8b5cf6; }

    .pref-tip {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .625rem .75rem; background: #fff; border-radius: 8px;
      border: 1px solid #bfdbfe; font-size: .75rem; color: #1e40af; line-height: 1.5;
    }
    .pref-tip svg { flex-shrink: 0; margin-top: 1px; color: #3b82f6; }
    .pref-tip p { margin: 0; }
    .pref-tip strong { font-weight: 700; }
  `]
})
export class UnsubscribePreferenceCenterComponent {
  reasons = [
    'Frequency is too high for their current inbox management',
    'Content has shifted away from what they originally signed up for',
    'They receive promotional emails but only wanted release announcements',
    'They love newsletters but not campaign emails',
  ];

  prefOptions = [
    { label: 'Reduce email frequency', color: 'blue' },
    { label: 'Opt out of promotional content while staying on newsletter', color: 'green' },
    { label: 'Receive only new release announcements', color: 'purple' },
  ];
}
