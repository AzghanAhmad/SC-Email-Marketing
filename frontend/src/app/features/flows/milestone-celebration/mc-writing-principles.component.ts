import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-writing-principles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-principles">
      <h4 class="mcp-title">Writing principles across all milestone emails</h4>
      <p class="mcp-sub">What separates emails that create genuine loyalty from ones that feel formulaic despite the personal occasion.</p>

      <div class="mcp-list">
        <div class="mcp-item" *ngFor="let p of principles">
          <h5 class="mcp-name">{{ p.title }}</h5>
          <p class="mcp-desc">{{ p.desc }}</p>
        </div>
      </div>

      <div class="mcp-voice">
        <h5 class="mcp-voice-title">Write it yourself, in your own voice</h5>
        <p>
          ScribeCount templates are starting points, not finished products. Replace every word that
          sounds like a template with how you would actually write a birthday message, an anniversary
          note, a genuine expression of appreciation. The template gives structure. Your editing gives it soul.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .mc-principles { margin-bottom: 1.25rem; }
    .mcp-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcp-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .mcp-list { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .875rem; }
    .mcp-item {
      padding: .75rem; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px;
    }
    .mcp-name { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcp-desc { font-size: .72rem; color: #374151; margin: 0; line-height: 1.55; }

    .mcp-voice {
      padding: .875rem; background: rgba(217,119,6,0.06);
      border: 1.5px solid rgba(217,119,6,0.15); border-radius: 10px;
    }
    .mcp-voice-title { font-size: .78rem; font-weight: 700; color: #92400e; margin: 0 0 .35rem; }
    .mcp-voice p { font-size: .72rem; color: #374151; margin: 0; line-height: 1.55; }
  `]
})
export class McWritingPrinciplesComponent {
  principles = [
    {
      title: 'Lead with the milestone, not the offer',
      desc: 'Open with specific acknowledgment before anything else. "Happy anniversary — here\'s 20% off" has its priorities inverted. The milestone is the point; the offer follows.',
    },
    {
      title: 'Be specific about what you\'re celebrating',
      desc: '"Thank you for being a subscriber" doesn\'t land like "one year ago today." ScribeCount personalization fields pull anniversary date, birth date, or purchase number directly into content.',
    },
    {
      title: 'Don\'t ask for anything major',
      desc: 'A small optional offer is fine. Inviting a reply is fine. Using the milestone as a launch platform for a sales campaign, review drive, or referral program converts recognition into a transaction.',
    },
    {
      title: 'Match tone to the occasion',
      desc: 'Warmer than your newsletter, more personal than a campaign — closer to a letter between friends than an author managing their platform.',
    },
  ];
}
