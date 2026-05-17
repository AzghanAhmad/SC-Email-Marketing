import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-flow-path',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-path">
      <h4 class="mcpath-title">Flow path</h4>
      <p class="mcpath-sub">Three parallel trigger branches — each fires its own celebration email</p>

      <div class="mcpath-branches">
        <div class="mcpath-branch" *ngFor="let b of branches">
          <span class="mcpath-branch-label" [style.color]="b.color">{{ b.label }}</span>
          <div class="mcpath-steps">
            <div class="mcpath-step" *ngFor="let s of b.steps; let i = index">
              <span class="mcpath-step-num">{{ i + 1 }}</span>
              <div class="mcpath-step-body">
                <span class="mcpath-step-type">{{ s.type }}</span>
                <span class="mcpath-step-name">{{ s.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mcpath-goal">
        <svg viewBox="0 0 20 20" fill="#d97706" width="12" height="12">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
        </svg>
        <span><strong>Goal exit:</strong> Milestone email opened and reader engages — loyalty deepened through genuine recognition.</span>
      </div>
    </div>
  `,
  styles: [`
    .mc-path { margin-bottom: 1.25rem; }
    .mcpath-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .2rem; }
    .mcpath-sub { font-size: .72rem; color: #94a3b8; margin: 0 0 .75rem; }

    .mcpath-branches { display: flex; flex-direction: column; gap: .625rem; margin-bottom: .75rem; }
    .mcpath-branch {
      padding: .75rem; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px;
    }
    .mcpath-branch-label { font-size: .72rem; font-weight: 700; display: block; margin-bottom: .5rem; }
    .mcpath-steps { display: flex; flex-direction: column; gap: .3rem; }
    .mcpath-step { display: flex; align-items: center; gap: .5rem; }
    .mcpath-step-num {
      width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
      background: #fde68a; color: #92400e; font-size: .62rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .mcpath-step-body { display: flex; align-items: center; gap: .35rem; flex-wrap: wrap; }
    .mcpath-step-type {
      font-size: .58rem; font-weight: 700; text-transform: uppercase;
      padding: .08rem .3rem; border-radius: 3px; background: rgba(217,119,6,0.12); color: #d97706;
    }
    .mcpath-step-name { font-size: .72rem; color: #374151; }

    .mcpath-goal {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #374151; line-height: 1.5;
      padding: .5rem .625rem; background: rgba(217,119,6,0.05); border-radius: 8px;
    }
  `]
})
export class McFlowPathComponent {
  branches = [
    {
      label: 'Anniversary branch',
      color: '#d97706',
      steps: [
        { type: 'Trigger', name: 'Join date anniversary reached' },
        { type: 'Email', name: 'Anniversary celebration email' },
        { type: 'Goal Exit', name: 'Opened or engaged' },
      ],
    },
    {
      label: 'Birthday branch',
      color: '#db2777',
      steps: [
        { type: 'Trigger', name: 'Birth month/day matches today' },
        { type: 'Email', name: 'Birthday message + optional gift' },
        { type: 'Goal Exit', name: 'Opened or engaged' },
      ],
    },
    {
      label: 'Catalog branch',
      color: '#6366f1',
      steps: [
        { type: 'Trigger', name: 'Purchase count crosses threshold' },
        { type: 'Email', name: 'Catalog milestone acknowledgment' },
        { type: 'Goal Exit', name: 'Opened, engaged, or community joined' },
      ],
    },
  ];
}
