import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-overview-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-intro">
      <h4 class="mci-title">The email that makes your most loyal readers feel genuinely seen</h4>
      <p class="mci-lead">
        Most flows exist because something needs to happen: a book delivered, a cart recovered,
        a quiet subscriber reached. The milestone celebration flow is different. It exists because
        something worth acknowledging has happened — a year on your list, a birthday, a meaningful
        point in their journey through your catalog.
      </p>
      <div class="mci-callout">
        <p>
          There is no revenue at stake, no deliverability problem, no cart to recover. The only
          thing at stake is whether the reader feels known. It arrives simply to say: I noticed.
        </p>
      </div>
      <p class="mci-body">
        That distinction is why this flow builds loyalty no other automation can replicate. It
        arrives without warning, without a commercial purpose, and without anything being asked
        in return — and creates a disproportionate impression relative to how little effort
        it requires to deliver.
      </p>
    </div>
  `,
  styles: [`
    .mc-intro { margin-bottom: 1.25rem; }
    .mci-title { font-size: .875rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; line-height: 1.35; }
    .mci-lead { font-size: .78rem; color: #374151; margin: 0 0 .75rem; line-height: 1.65; }
    .mci-callout {
      padding: .875rem 1rem; margin-bottom: .75rem;
      background: rgba(217,119,6,0.08); border-left: 3px solid #d97706;
      border-radius: 0 10px 10px 0;
    }
    .mci-callout p { font-size: .78rem; color: #92400e; margin: 0; line-height: 1.6; font-weight: 500; }
    .mci-body { font-size: .75rem; color: #64748b; margin: 0; line-height: 1.6; }
  `]
})
export class McOverviewIntroComponent {}
