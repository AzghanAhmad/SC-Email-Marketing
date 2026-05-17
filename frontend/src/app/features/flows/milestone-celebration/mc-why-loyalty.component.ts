import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-why-loyalty',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-why">
      <h4 class="mcw-title">Why milestone emails create loyalty other flows cannot</h4>
      <p class="mcw-sub">
        Most marketing communication is transactional at its core. Readers engage as audience members,
        not as individuals being personally recognized. A milestone email breaks that pattern entirely.
      </p>

      <div class="mcw-callout">
        <p>
          The milestone email turns a subscriber into a reader who feels personally connected to you
          as an author — not because you sold them something, but because you noticed them.
        </p>
      </div>

      <div class="mcw-points">
        <div class="mcw-point" *ngFor="let p of points">
          <svg viewBox="0 0 20 20" fill="#d97706" width="11" height="11">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
          </svg>
          <span>{{ p }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mc-why { margin-bottom: 1.25rem; }
    .mcw-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcw-sub { font-size: .75rem; color: #64748b; margin: 0 0 .75rem; line-height: 1.55; }
    .mcw-callout {
      padding: .875rem 1rem; margin-bottom: .75rem;
      background: rgba(217,119,6,0.06); border: 1.5px solid rgba(217,119,6,0.2); border-radius: 10px;
    }
    .mcw-callout p { font-size: .75rem; color: #92400e; margin: 0; line-height: 1.6; font-weight: 500; }
    .mcw-points { display: flex; flex-direction: column; gap: .4rem; }
    .mcw-point { display: flex; align-items: flex-start; gap: .35rem; font-size: .72rem; color: #374151; line-height: 1.45; }
  `]
})
export class McWhyLoyaltyComponent {
  points = [
    'Anniversary and birthday emails often generate the highest reply rates in an author\'s program',
    'Readers who feel celebrated write back — thank you, what your books have meant to them',
    'That investment cannot be replicated by a promotional email that says "We appreciate you"',
    'The power comes from surprise recognition on a day that matters to the reader',
  ];
}
