import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-closing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-closing">
      <div class="mccl-inner">
        <h4 class="mccl-title">The emails that build the career, not just the launch</h4>
        <p class="mccl-body">
          The milestone celebration flow does not recover revenue, re-engage lapsed readers, or
          optimize conversion rates. What it does — quietly, consistently — is remind readers they
          matter to you as a person rather than as a subscriber.
        </p>
        <p class="mccl-body">
          Readers who receive anniversary emails and reply are the readers who preorder without a
          campaign. Readers who get a birthday message and feel delighted recommend you with personal
          advocacy. Readers recognized at catalog milestones become the founding culture of your
          reader community.
        </p>
        <p class="mccl-emphasis">
          These readers are your career over the long arc — not the launch week or the flash sale,
          but the readers who stay, who come back, who tell others, and who feel you actually know
          they are there. The milestone flow builds that, one anniversary and one birthday at a time.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .mc-closing { margin-bottom: 1.25rem; }
    .mccl-inner {
      padding: 1rem 1.125rem;
      background: linear-gradient(135deg, rgba(217,119,6,0.1) 0%, rgba(245,158,11,0.04) 100%);
      border: 1.5px solid rgba(217,119,6,0.25); border-radius: 12px;
    }
    .mccl-title { font-size: .875rem; font-weight: 700; color: #92400e; margin: 0 0 .5rem; }
    .mccl-body { font-size: .75rem; color: #374151; margin: 0 0 .625rem; line-height: 1.65; }
    .mccl-emphasis { font-size: .78rem; color: #b45309; margin: 0; line-height: 1.6; font-weight: 600; font-style: italic; }
  `]
})
export class McClosingComponent {}
