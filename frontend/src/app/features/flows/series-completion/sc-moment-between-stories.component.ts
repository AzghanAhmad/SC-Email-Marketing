import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-moment-between-stories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-moment">
      <h4 class="scm-title">The moment between stories</h4>

      <div class="scm-compare">
        <div class="scm-col good">
          <div class="scm-col-label">Builds trust</div>
          <p>
            A reader who finishes your series and receives a recommendation clearly chosen for them —
            specific, warm, calibrated to the experience they just had — feels known. They feel like
            the author they just spent hours with is paying attention, has more to offer, and cares
            enough to point them in the right direction.
          </p>
        </div>
        <div class="scm-col bad">
          <div class="scm-col-label">Breaks trust</div>
          <p>
            A reader who finishes your series and receives a generic promotional email, or nothing at
            all, feels like a transaction that has concluded. Their next book will come from wherever
            their attention lands next — which might be you and might not.
          </p>
        </div>
      </div>

      <div class="scm-closing">
        <p>
          The series completion flow catches readers in the moment between stories. It arrives when
          their appetite for your work is highest, when their trust in you as a storyteller is
          freshest, and when the decision to read more of your catalog requires the least persuasion.
          Build it well, keep it current, and let it turn one reader relationship into a lifetime of
          reading.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .sc-moment { margin-bottom: 1.25rem; }
    .scm-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .75rem; }

    .scm-compare { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; margin-bottom: .875rem; }
    .scm-col { padding: .875rem; border-radius: 10px; }
    .scm-col.good { background: rgba(16,185,129,0.05); border: 1.5px solid rgba(16,185,129,0.15); }
    .scm-col.bad { background: rgba(239,68,68,0.05); border: 1.5px solid rgba(239,68,68,0.15); }
    .scm-col-label {
      font-size: .68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; margin-bottom: .4rem;
    }
    .scm-col.good .scm-col-label { color: #059669; }
    .scm-col.bad .scm-col-label { color: #dc2626; }
    .scm-col p { font-size: .75rem; color: #374151; margin: 0; line-height: 1.55; }

    .scm-closing {
      padding: .875rem 1rem;
      background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04));
      border: 1.5px solid rgba(99,102,241,0.15); border-radius: 12px;
    }
    .scm-closing p { font-size: .78rem; color: #3730a3; margin: 0; line-height: 1.65; font-weight: 500; }

    @media (max-width: 500px) { .scm-compare { grid-template-columns: 1fr; } }
  `]
})
export class ScMomentBetweenStoriesComponent {}
