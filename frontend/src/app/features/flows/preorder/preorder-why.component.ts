import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preorder-why',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="po-why">
      <div class="po-why-callout">
        <div class="po-why-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div>
          <h4 class="po-why-title">Preorder readers are your most motivated early advocates</h4>
          <p class="po-why-desc">
            A reader who preorders your book committed to a purchase weeks or months before they can
            use what they bought. They handed over their trust on the basis of a promise. That level
            of advance commitment is not casually given, and it shouldn't be casually received.
          </p>
        </div>
      </div>

      <div class="po-functions">
        <h5 class="po-functions-title">Two commercial functions preorders serve</h5>
        <div class="po-function-grid">
          <div class="po-function">
            <div class="po-function-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <div class="po-function-name">Aggregate sales velocity</div>
              <p class="po-function-desc">
                Preorder sales count toward first-day and first-week totals on most retail platforms.
                A book with 300 preorders hits the charts on day one with 300 sales already registered —
                improving algorithmic placement, driving category ranking, and creating social proof
                that makes new readers more willing to take a chance.
              </p>
            </div>
          </div>
          <div class="po-function">
            <div class="po-function-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div class="po-function-name">Create a committed reader audience before the book exists</div>
              <p class="po-function-desc">
                Preorder readers open launch-week emails at higher rates than your general list.
                They leave reviews sooner. They recommend the book with the confidence of someone
                who was part of the inner circle rather than the general audience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="po-risk-note">
        <div class="po-risk-header">
          <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
          </svg>
          <span class="po-risk-title">The risk the flow protects against: reader drift</span>
        </div>
        <p class="po-risk-desc">
          A reader who preorders a book releasing in four months and then hears nothing may still
          receive their book — but by the time it arrives, it can feel like a surprising charge on
          their credit card rather than the arrival of something they were genuinely waiting for.
          The nurture sequence prevents that drift by keeping enthusiasm actively engaged through the wait.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .po-why { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }

    .po-why-callout {
      display: flex; align-items: flex-start; gap: .875rem;
      padding: .875rem 1rem;
      background: rgba(245,158,11,0.06); border: 1.5px solid rgba(245,158,11,0.2);
      border-radius: 12px;
    }
    .po-why-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(245,158,11,0.12); color: #d97706;
      display: flex; align-items: center; justify-content: center;
    }
    .po-why-title { font-size: .875rem; font-weight: 700; color: #92400e; margin: 0 0 .35rem; }
    .po-why-desc { font-size: .78rem; color: #374151; margin: 0; line-height: 1.6; }

    .po-functions { }
    .po-functions-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .625rem; }
    .po-function-grid { display: flex; flex-direction: column; gap: .625rem; }
    .po-function {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .75rem .875rem; background: #f8fafc;
      border: 1px solid #f1f5f9; border-radius: 10px;
    }
    .po-function-icon {
      width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
      background: rgba(99,102,241,0.1); color: #6366f1;
      display: flex; align-items: center; justify-content: center;
    }
    .po-function-name { font-size: .8125rem; font-weight: 700; color: #0f172a; margin-bottom: .25rem; }
    .po-function-desc { font-size: .75rem; color: #64748b; margin: 0; line-height: 1.5; }

    .po-risk-note {
      padding: .875rem 1rem;
      background: rgba(245,158,11,0.04); border: 1.5px solid rgba(245,158,11,0.15);
      border-radius: 10px;
    }
    .po-risk-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .375rem; }
    .po-risk-title { font-size: .78rem; font-weight: 700; color: #92400e; }
    .po-risk-desc { font-size: .75rem; color: #374151; margin: 0; line-height: 1.55; }
  `]
})
export class PreorderWhyComponent {}
