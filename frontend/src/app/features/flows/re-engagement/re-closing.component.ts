import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-closing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-closing">
      <div class="rec-inner">
        <h4 class="rec-title">A cleaner list is a better list</h4>
        <p class="rec-body">
          Running a re-engagement flow feels counterintuitive when you are trying to grow your
          subscriber count. Removing people seems like moving backward. But every author who has
          cleaned a list of inactive subscribers and watched their open rates climb knows the truth:
          quality beats quantity every time.
        </p>
        <p class="rec-body">
          The readers who re-engage through this flow are genuinely interested. The readers who
          are removed were not going to buy your next book anyway. And the readers who never hear
          from you again because you never sent the removal email are still counting against your
          deliverability — silently, invisibly, every time you hit send.
        </p>
        <p class="rec-emphasis">
          Give your quiet readers a fair chance to come back. Then let the ones who are gone go
          with grace. Your engaged readers — and your inbox placement — will thank you.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .re-closing { margin-bottom: 1.25rem; }
    .rec-inner {
      padding: 1rem 1.125rem;
      background: linear-gradient(135deg, rgba(219,39,119,0.08) 0%, rgba(190,24,93,0.04) 100%);
      border: 1.5px solid rgba(219,39,119,0.2); border-radius: 12px;
    }
    .rec-title { font-size: .875rem; font-weight: 700; color: #831843; margin: 0 0 .5rem; }
    .rec-body { font-size: .75rem; color: #374151; margin: 0 0 .625rem; line-height: 1.65; }
    .rec-emphasis { font-size: .78rem; color: #9d174d; margin: 0; line-height: 1.6; font-weight: 600; font-style: italic; }
  `]
})
export class ReClosingComponent {}
