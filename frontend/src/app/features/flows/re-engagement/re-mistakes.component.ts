import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-mistakes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-mistakes">
      <h4 class="rem-title">Common mistakes to avoid</h4>
      <p class="rem-sub">
        The re-engagement flow is straightforward, but these errors undermine its purpose or
        damage the relationship you are trying to preserve.
      </p>

      <div class="rem-list">
        <div class="rem-item" *ngFor="let m of mistakes">
          <div class="rem-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
          <div class="rem-body">
            <h5 class="rem-name">{{ m.title }}</h5>
            <p class="rem-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .re-mistakes { margin-bottom: 1.25rem; }
    .rem-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .rem-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .rem-list { display: flex; flex-direction: column; gap: .5rem; }
    .rem-item {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .75rem; background: #fff; border: 1.5px solid #fee2e2; border-radius: 10px;
    }
    .rem-icon {
      width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
      background: rgba(239,68,68,0.1); color: #dc2626;
      display: flex; align-items: center; justify-content: center;
    }
    .rem-name { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .rem-desc { font-size: .72rem; color: #374151; margin: 0; line-height: 1.55; }
  `]
})
export class ReMistakesComponent {
  mistakes = [
    {
      title: 'Treating it like a win-back campaign',
      desc: 'Leading with discounts, free books, or promotional content signals desperation rather than respect. The first email should feel like a genuine check-in, not a sales pitch disguised as concern.',
    },
    {
      title: 'Setting the inactivity threshold too short',
      desc: 'Flagging readers after 30 days when you send monthly emails removes people who are simply on a natural reading rhythm. Match the threshold to your actual send frequency.',
    },
    {
      title: 'Never actually removing anyone',
      desc: 'Sending re-engagement emails indefinitely without following through on removal defeats the entire purpose. Ghost subscribers continue dragging down deliverability and distorting metrics.',
    },
    {
      title: 'Guilt-tripping or emotional manipulation',
      desc: 'Phrases like "We miss you so much!" followed by heavy promotional content feel manipulative. Readers who have genuinely moved on deserve a clean, respectful exit.',
    },
    {
      title: 'Skipping the removal notification',
      desc: 'Silently removing subscribers without the Author\'s Choice email leaves readers confused if they discover they are no longer subscribed. Transparency protects your reputation.',
    },
    {
      title: 'Ignoring list health before the flow runs',
      desc: 'The dashboard exists so you can see flagged subscribers before action is taken. Review trends regularly rather than discovering deliverability problems only after inbox placement drops.',
    },
  ];
}
