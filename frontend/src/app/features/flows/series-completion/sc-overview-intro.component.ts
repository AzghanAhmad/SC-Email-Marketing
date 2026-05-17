import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-overview-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-intro">
      <div class="sci-hero">
        <h4 class="sci-title">Catching readers at the moment their enthusiasm is highest</h4>
        <p class="sci-lead">
          There is a specific feeling when a reader finishes the last book in a series they loved —
          satisfaction and loss together. That emotional state is fragile and time-limited. It is
          also, for an author with more books to offer, one of the most commercially significant
          moments in the entire reader journey.
        </p>
      </div>

      <div class="sci-points">
        <div class="sci-point" *ngFor="let p of points">
          <div class="sci-point-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p>{{ p }}</p>
        </div>
      </div>

      <div class="sci-callout">
        <p>
          The gap between finishing one book and beginning another — when the reader is between
          worlds and looking for somewhere new to go — is the narrowest it will ever be. The series
          completion flow exists to fill that gap before it widens.
        </p>
      </div>

      <p class="sci-footer">
        It delivers your recommendation at the moment of highest readiness, bridges the emotional
        transition from one book to the next, and eliminates the search behavior that can send a
        reader toward a different author when there is no immediate bridge within your catalog. For
        catalog authors, it is one of the most reliably profitable automations in the flow library —
        and the one most often left unbuilt.
      </p>
    </div>
  `,
  styles: [`
    .sc-intro { margin-bottom: 1.25rem; }
    .sci-hero { margin-bottom: 1rem; }
    .sci-title { font-size: .875rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; line-height: 1.35; }
    .sci-lead { font-size: .78rem; color: #374151; margin: 0; line-height: 1.65; }

    .sci-points { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1rem; }
    .sci-point {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .625rem .75rem; background: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9;
    }
    .sci-point-icon {
      width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
      background: rgba(99,102,241,0.1); color: #6366f1;
      display: flex; align-items: center; justify-content: center; margin-top: .1rem;
    }
    .sci-point p { font-size: .75rem; color: #374151; margin: 0; line-height: 1.55; }

    .sci-callout {
      padding: .875rem 1rem; margin-bottom: .75rem;
      background: rgba(99,102,241,0.06); border-left: 3px solid #6366f1;
      border-radius: 0 10px 10px 0;
    }
    .sci-callout p { font-size: .78rem; color: #3730a3; margin: 0; line-height: 1.6; font-weight: 500; }
    .sci-footer { font-size: .75rem; color: #64748b; margin: 0; line-height: 1.6; }
  `]
})
export class ScOverviewIntroComponent {
  points = [
    'A reader who just closed the final chapter is more open to your next recommendation than at any other point in their experience with your catalog.',
    'Their trust in you as a storyteller is freshest. Their appetite for the kind of reading experience you provide is most acute.',
    'The series completion email does not create desire for more of your work — it catches that desire while it is already present, before the window closes.',
  ];
}
