import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-clean-removal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-removal">
      <h4 class="rer-title">After the sequence: clean removal done right</h4>
      <p class="rer-sub">
        When a subscriber completes the sequence without engaging, removal is not a failure — it is
        the flow doing exactly what it was designed to do.
      </p>

      <div class="rer-card">
        <h5 class="rer-card-title">Author's Choice Unsubscribe email</h5>
        <p class="rer-card-desc">
          ScribeCount sends a brief, respectful note informing them they have been removed due to
          inactivity and explaining how they can re-subscribe. This protects your reputation and
          leaves the door genuinely open.
        </p>
        <div class="rer-example">
          <span class="rer-ex-label">Example removal email</span>
          <span class="rer-ex-text">"Hi [Name] — I have removed you from my mailing list because your address has not been active recently, and I would rather send emails to people who are genuinely interested than clog up an inbox that has moved on. If you would like to re-subscribe, the link is below — and I would genuinely be glad to have you back. No pressure either way."</span>
        </div>
      </div>

      <div class="rer-retain">
        <h5 class="rer-retain-title">What gets removed vs. what gets retained</h5>
        <div class="rer-retain-grid">
          <div class="rer-retain-col removed">
            <span class="rer-retain-label">Removed from</span>
            <ul>
              <li *ngFor="let r of removed">{{ r }}</li>
            </ul>
          </div>
          <div class="rer-retain-col kept">
            <span class="rer-retain-label">Retained in account</span>
            <ul>
              <li *ngFor="let k of kept">{{ k }}</li>
            </ul>
          </div>
        </div>
        <p class="rer-retain-note">
          A reader who bought two books, went quiet for a year, and re-subscribed is not a new reader.
          Their purchase history should inform how they are welcomed back.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .re-removal { margin-bottom: 1.25rem; }
    .rer-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .rer-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .rer-card {
      padding: .875rem; margin-bottom: .875rem;
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
    }
    .rer-card-title { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .rer-card-desc { font-size: .75rem; color: #374151; margin: 0 0 .625rem; line-height: 1.55; }
    .rer-example { display: flex; flex-direction: column; gap: .15rem; padding: .5rem .625rem; background: #fff; border-radius: 7px; border: 1px solid #e2e8f0; }
    .rer-ex-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; color: #db2777; }
    .rer-ex-text { font-size: .72rem; color: #0f172a; font-style: italic; line-height: 1.5; }

    .rer-retain { background: #fdf2f8; border: 1.5px solid #fce7f3; border-radius: 12px; padding: .875rem; }
    .rer-retain-title { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; }
    .rer-retain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; margin-bottom: .5rem; }
    .rer-retain-col { padding: .625rem; border-radius: 8px; font-size: .72rem; }
    .rer-retain-col.removed { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); }
    .rer-retain-col.kept { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); }
    .rer-retain-label { font-weight: 700; display: block; margin-bottom: .35rem; font-size: .68rem; text-transform: uppercase; }
    .rer-retain-col.removed .rer-retain-label { color: #dc2626; }
    .rer-retain-col.kept .rer-retain-label { color: #059669; }
    .rer-retain-col ul { margin: 0; padding-left: 1rem; color: #374151; line-height: 1.5; }
    .rer-retain-note { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.45; font-style: italic; }

    @media (max-width: 500px) { .rer-retain-grid { grid-template-columns: 1fr; } }
  `]
})
export class ReCleanRemovalComponent {
  removed = ['Active sending list (campaigns, newsletters, flows)', 'Promotional and nurture sends'];
  kept = ['Purchase history', 'Engagement history', 'Tag data (configurable retention period)'];
}
