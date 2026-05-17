import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type GuideTab = 'cart' | 'checkout';

@Component({
  selector: 'app-ac-writing-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="writing-guide">
      <h4 class="wg-title">Writing Guide</h4>

      <div class="wg-tabs">
        <button class="wg-tab" [class.active]="activeTab() === 'cart'" (click)="activeTab.set('cart')">
          Abandoned Cart
        </button>
        <button class="wg-tab" [class.active]="activeTab() === 'checkout'" (click)="activeTab.set('checkout')">
          Abandoned Checkout
        </button>
      </div>

      <!-- CART WRITING GUIDE -->
      <div *ngIf="activeTab() === 'cart'">

        <div class="wg-email-block">
          <div class="wg-email-header">
            <span class="wg-email-num">Email 1</span>
            <span class="wg-email-timing">1 hour after abandonment</span>
          </div>

          <div class="wg-subject-example">
            <span class="wg-subject-label">Subject example</span>
            <span class="wg-subject-text">"[Title] is still waiting for you"</span>
            <span class="wg-subject-why">Leads with the book, not the cart. Reconnects reader to why they were interested.</span>
          </div>

          <div class="wg-section">
            <div class="wg-section-title">Lead with the book, not the cart</div>
            <p class="wg-section-body">
              Open with a brief, specific mention of the book rather than "you left something in your cart."
              The reader knows what they left. What they need is a reminder of why they wanted it.
              Include the cover image — a visual anchor to the specific book reinforces the connection
              to the reader's original interest.
            </p>
          </div>

          <div class="wg-section">
            <div class="wg-section-title">Address the three common hesitations</div>
            <div class="wg-hesitations">
              <div class="wg-hesitation">
                <span class="wg-h-q">Is this book right for me?</span>
                <span class="wg-h-a">One line of compelling reader praise — specific, genuine, from a real review</span>
              </div>
              <div class="wg-hesitation">
                <span class="wg-h-q">Can I trust this author?</span>
                <span class="wg-h-a">Social proof from readers who already loved the book answers this simultaneously</span>
              </div>
              <div class="wg-hesitation">
                <span class="wg-h-q">Is the price worth it?</span>
                <span class="wg-h-a">A confident articulation of value — not a discount, but an honest statement of what the reader gets</span>
              </div>
            </div>
          </div>

          <div class="wg-section">
            <div class="wg-section-title">Make the return path effortless</div>
            <p class="wg-section-body">
              One button. One link. Goes directly back to the product page or, if your store supports it,
              directly back to the pre-populated cart. Every extra step between clicking the email and
              completing the purchase is a meaningful drop in recovery rate.
            </p>
          </div>

          <div class="wg-incentive-warning">
            <div class="wg-iw-header">
              <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13">
                <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
              </svg>
              <span class="wg-iw-title">Discount incentive — use with intention</span>
            </div>
            <p class="wg-iw-body">
              A 10–15% discount works commercially but carries a risk: readers who learn that abandoning
              their cart produces a discount have an incentive to abandon deliberately on future visits.
              If you use a discount, make it a one-time offer clearly stated as such. For many authors,
              a well-written warm reminder without a discount performs well enough that the incentive
              isn't necessary. Test both; your data will tell you which works for your audience.
            </p>
          </div>
        </div>

        <div class="wg-email-block second">
          <div class="wg-email-header">
            <span class="wg-email-num">Email 2</span>
            <span class="wg-email-timing">24 hours after Email 1 (if no purchase)</span>
          </div>

          <div class="wg-subject-example">
            <span class="wg-subject-label">Subject example</span>
            <span class="wg-subject-text">"[Title] is still in your cart in case you've been meaning to come back"</span>
          </div>

          <div class="wg-do-dont">
            <div class="wg-do">
              <div class="wg-do-label">Do</div>
              <div class="wg-do-item">Two or three sentences maximum — brief and light</div>
              <div class="wg-do-item">Acknowledge this is a reminder, not a fresh pitch</div>
              <div class="wg-do-item">One clear link back to the book</div>
            </div>
            <div class="wg-dont">
              <div class="wg-dont-label">Don't</div>
              <div class="wg-dont-item">No urgency language ("last chance," "expires soon")</div>
              <div class="wg-dont-item">No artificial deadlines that don't reflect reality</div>
              <div class="wg-dont-item">No third email — two is the limit before it feels like chasing</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CHECKOUT WRITING GUIDE -->
      <div *ngIf="activeTab() === 'checkout'">

        <div class="wg-email-block">
          <div class="wg-email-header">
            <span class="wg-email-num">Email 1</span>
            <span class="wg-email-timing">30 minutes after abandonment</span>
          </div>

          <div class="wg-subject-example">
            <span class="wg-subject-label">Subject example</span>
            <span class="wg-subject-text">"It looks like you didn't quite make it through checkout for [Title]"</span>
            <span class="wg-subject-why">Direct acknowledgment. Slightly self-deprecating — suggests the problem might be on your end, not the reader's.</span>
          </div>

          <div class="wg-section">
            <div class="wg-section-title">Open with direct acknowledgment</div>
            <p class="wg-section-body">
              Don't dance around what happened. This reader was in the process of buying — they don't
              need to be reminded why they wanted the book. They need reassurance, friction removal,
              and the clearest possible path back to where they stopped.
            </p>
          </div>

          <div class="wg-section">
            <div class="wg-section-title">Address technical and process friction directly</div>
            <div class="wg-friction-list">
              <div class="wg-friction-item">
                <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                <span>List accepted payment methods by name — reader who couldn't pay one way may not know alternatives exist</span>
              </div>
              <div class="wg-friction-item">
                <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                <span>Mention guest checkout option if readers sometimes miss it</span>
              </div>
              <div class="wg-friction-item">
                <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                <span>State your money-back guarantee clearly — purchase risk is most salient at this moment</span>
              </div>
              <div class="wg-friction-item">
                <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                <span>"Hit reply and I'll sort it out personally" — opens a direct support channel, reduces anonymity of the purchase process</span>
              </div>
            </div>
          </div>

          <div class="wg-section">
            <div class="wg-section-title">Return link — restore the cart if possible</div>
            <p class="wg-section-body">
              Ideally, the link returns the reader as close as possible to where they stopped — a
              pre-populated cart or direct-to-checkout link. If your store platform supports cart
              restoration links, use them here. If not, a direct product page link is the next best option.
            </p>
          </div>
        </div>

        <div class="wg-email-block second">
          <div class="wg-email-header">
            <span class="wg-email-num">Email 2</span>
            <span class="wg-email-timing">24 hours after Email 1 (if no purchase)</span>
          </div>

          <div class="wg-subject-example">
            <span class="wg-subject-label">Subject example</span>
            <span class="wg-subject-text">"Still thinking about [Title]?"</span>
          </div>

          <p class="wg-section-body" style="margin-bottom:.75rem">
            Shorter, warmer. Closes with a clear invitation to reach out if anything went wrong.
            After two emails, the flow ends. The reader who didn't complete after two prompts has
            made their decision — continuing would be intrusive rather than helpful.
          </p>

          <div class="wg-closing-line">
            <span class="wg-cl-label">Closing line example</span>
            <span class="wg-cl-text">"Still thinking about [Title]? The link is below, and I'm always happy to help if something didn't work the way it should have."</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .writing-guide { margin-bottom: 1.25rem; }
    .wg-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .75rem; }

    .wg-tabs {
      display: flex; gap: .25rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: .875rem;
    }
    .wg-tab {
      flex: 1; padding: .4rem .5rem; border-radius: 8px; border: none;
      background: transparent; color: #64748b; font-size: .75rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .wg-tab:hover { color: #0f172a; }
    .wg-tab.active { background: #fff; color: #0f172a; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

    .wg-email-block {
      border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: .75rem;
    }
    .wg-email-block.second { border-color: #f1f5f9; }

    .wg-email-header {
      display: flex; align-items: center; gap: .75rem;
      padding: .625rem .875rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9;
    }
    .wg-email-num {
      font-size: .72rem; font-weight: 700; padding: .15rem .5rem;
      background: #1e3a5f; color: #fff; border-radius: 100px;
    }
    .wg-email-timing { font-size: .72rem; color: #64748b; font-style: italic; }

    .wg-subject-example {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .625rem .875rem; background: rgba(59,130,246,0.04);
      border-bottom: 1px solid #f1f5f9;
    }
    .wg-subject-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #3b82f6; }
    .wg-subject-text { font-size: .8125rem; color: #0f172a; font-style: italic; font-weight: 600; }
    .wg-subject-why { font-size: .72rem; color: #64748b; }

    .wg-section { padding: .75rem .875rem; border-bottom: 1px solid #f1f5f9; }
    .wg-section:last-child { border-bottom: none; }
    .wg-section-title { font-size: .75rem; font-weight: 700; color: #0f172a; margin-bottom: .375rem; }
    .wg-section-body { font-size: .78rem; color: #374151; margin: 0; line-height: 1.55; }

    .wg-hesitations { display: flex; flex-direction: column; gap: .5rem; }
    .wg-hesitation { display: flex; flex-direction: column; gap: .1rem; padding: .5rem .625rem; background: #f8fafc; border-radius: 7px; }
    .wg-h-q { font-size: .75rem; font-weight: 600; color: #0f172a; font-style: italic; }
    .wg-h-a { font-size: .72rem; color: #64748b; }

    .wg-incentive-warning {
      padding: .75rem .875rem; background: rgba(245,158,11,0.05);
      border-top: 1px solid rgba(245,158,11,0.15);
    }
    .wg-iw-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .375rem; }
    .wg-iw-title { font-size: .75rem; font-weight: 700; color: #92400e; }
    .wg-iw-body { font-size: .75rem; color: #374151; margin: 0; line-height: 1.55; }

    .wg-do-dont { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; padding: .75rem .875rem; }
    .wg-do, .wg-dont { display: flex; flex-direction: column; gap: .35rem; }
    .wg-do-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #059669; margin-bottom: .1rem; }
    .wg-dont-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #dc2626; margin-bottom: .1rem; }
    .wg-do-item { font-size: .75rem; color: #374151; padding-left: .625rem; border-left: 2px solid rgba(16,185,129,0.3); line-height: 1.4; }
    .wg-dont-item { font-size: .75rem; color: #374151; padding-left: .625rem; border-left: 2px solid rgba(239,68,68,0.3); line-height: 1.4; }

    .wg-friction-list { display: flex; flex-direction: column; gap: .375rem; }
    .wg-friction-item { display: flex; align-items: flex-start; gap: .4rem; font-size: .75rem; color: #374151; line-height: 1.45; }

    .wg-closing-line {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .625rem .75rem; background: rgba(99,102,241,0.05);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 8px;
      margin: 0 .875rem .875rem;
    }
    .wg-cl-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6366f1; }
    .wg-cl-text { font-size: .78rem; color: #0f172a; font-style: italic; line-height: 1.5; }

    @media (max-width: 500px) { .wg-do-dont { grid-template-columns: 1fr; } }
  `]
})
export class AcWritingGuideComponent {
  activeTab = signal<GuideTab>('cart');
}
