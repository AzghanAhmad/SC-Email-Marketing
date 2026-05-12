import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flow-qualities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="qualities-panel">
      <h3 class="qualities-title">What Every Great Flow Has in Common</h3>
      <p class="qualities-intro">These qualities separate high-performing flows from functional-but-forgettable ones. They apply across every flow type in the library.</p>

      <div class="quality-item" *ngFor="let q of qualities">
        <div class="quality-icon" [ngClass]="q.color">
          <svg *ngIf="q.icon === 'voice'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <svg *ngIf="q.icon === 'reader'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <svg *ngIf="q.icon === 'job'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="quality-text">
          <p class="quality-name">{{ q.name }}</p>
          <p class="quality-desc">{{ q.desc }}</p>
          <div class="quality-example" *ngIf="q.example">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            {{ q.example }}
          </div>
        </div>
      </div>

      <!-- Infrastructure callout -->
      <div class="infra-callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <p>
          If campaigns are the moments you show up for your readers, flows are the system that
          takes care of readers whether or not you're available. They run while you write. They
          run while you sleep. Every flow you add is permanent infrastructure — working in the
          background, indefinitely, for every reader who triggers it.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .qualities-panel {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.375rem; display: flex; flex-direction: column; gap: 1rem;
    }
    .qualities-title {
      font-size: .75rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .07em; margin: 0;
    }
    .qualities-intro {
      font-size: .8rem; color: #64748b; margin: 0; line-height: 1.5;
    }

    .quality-item {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .75rem; background: #f8fafc; border-radius: 10px;
      border: 1px solid #f1f5f9; transition: background .15s, border-color .15s;
    }
    .quality-item:hover { background: #f0f7ff; border-color: #bfdbfe; }

    .quality-icon {
      width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .quality-icon.blue { background: rgba(59,130,246,.1); color: #3b82f6; }
    .quality-icon.purple { background: rgba(139,92,246,.1); color: #8b5cf6; }
    .quality-icon.green { background: rgba(16,185,129,.1); color: #059669; }

    .quality-name { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .2rem; }
    .quality-desc { font-size: .75rem; color: #64748b; margin: 0 0 .375rem; line-height: 1.45; }
    .quality-example {
      display: flex; align-items: flex-start; gap: .3rem;
      font-size: .72rem; color: #94a3b8; font-style: italic; line-height: 1.4;
    }
    .quality-example svg { flex-shrink: 0; margin-top: 1px; color: #cbd5e1; }

    .infra-callout {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .875rem 1rem; background: #f0f7ff;
      border-left: 3px solid #3b82f6; border-radius: 0 10px 10px 0;
      font-size: .78rem; color: #1e40af; line-height: 1.55;
    }
    .infra-callout svg { flex-shrink: 0; margin-top: 2px; color: #3b82f6; }
    .infra-callout p { margin: 0; }
  `]
})
export class FlowQualitiesComponent {
  qualities = [
    {
      icon: 'voice',
      color: 'blue',
      name: 'It Sounds Like You, Not Like Automation',
      desc: 'The most common failure mode is copy that sounds like it was written by a machine for a generic recipient. Your flows should read exactly like your best campaign emails — in your voice, specific to your books, warm in the way that only an author who actually wrote the books can be warm.',
      example: '"Dear subscriber, thank you for your recent purchase" confirms the reader is dealing with a system. The template gives you the structure. Your editing gives it the soul.'
    },
    {
      icon: 'reader',
      color: 'purple',
      name: 'It Meets Readers Where They Actually Are',
      desc: 'A good flow uses triggers, conditions, and goal exits to adapt to what each reader does. A reader who buys immediately after your first abandoned cart email does not need the second and third emails in that sequence.',
      example: 'The flow should feel like a conversation that responds to the reader, not a script that runs regardless of their participation.'
    },
    {
      icon: 'job',
      color: 'green',
      name: 'It Has a Clear Job and Knows When It\'s Done',
      desc: 'Every flow should have a specific answer to: what does success look like for a reader who goes through this? Flows without defined success criteria accumulate unnecessary steps and eventually become cluttered and confusing.',
      example: 'Welcome sequence: reader knows who you are and takes a first step. Abandoned cart: completed purchase. Re-engagement: re-engaged reader or clean removal.'
    },
  ];
}
