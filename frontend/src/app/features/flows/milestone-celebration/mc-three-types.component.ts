import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-three-types',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-types">
      <h4 class="mct-title">The three milestone types that matter most</h4>
      <p class="mct-sub">Each draws from a different data source and serves a distinct relationship purpose.</p>

      <div class="mct-grid">
        <div class="mct-card" *ngFor="let t of types">
          <span class="mct-num">{{ t.num }}</span>
          <h5 class="mct-name">{{ t.name }}</h5>
          <p class="mct-trigger"><strong>Trigger:</strong> {{ t.trigger }}</p>
          <p class="mct-desc">{{ t.desc }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mc-types { margin-bottom: 1.25rem; }
    .mct-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mct-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }
    .mct-grid { display: flex; flex-direction: column; gap: .5rem; }
    .mct-card {
      padding: .875rem; background: #fffbeb; border: 1.5px solid #fde68a;
      border-radius: 10px;
    }
    .mct-num {
      display: inline-block; font-size: .65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #d97706; margin-bottom: .25rem;
    }
    .mct-name { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .mct-trigger { font-size: .72rem; color: #374151; margin: 0 0 .35rem; line-height: 1.45; }
    .mct-trigger strong { color: #92400e; }
    .mct-desc { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.5; }
  `]
})
export class McThreeTypesComponent {
  types = [
    {
      num: 'Milestone 1',
      name: 'Subscriber Anniversary',
      trigger: 'Join date — one year (or configured intervals: 6mo, 2yr, 5yr)',
      desc: 'Most universally applicable. Every subscriber has a join date. Acknowledges durable, sustained interest through twelve months of newsletters, launches, and quiet stretches.',
    },
    {
      num: 'Milestone 2',
      name: 'Birthday Email',
      trigger: 'Birth month and day in subscriber profile',
      desc: 'Most personal milestone — only works if birth date was collected consensually at opt-in or preference form. Must land on or immediately before the birthday to feel timely.',
    },
    {
      num: 'Milestone 3',
      name: 'Catalog Reading Milestone',
      trigger: 'Purchase count crosses threshold via direct store webhook',
      desc: 'Purchase-triggered: third or fifth purchase, series completion complement, or full catalog completion. Leads with recognition, then optional gift or community invitation.',
    },
  ];
}
