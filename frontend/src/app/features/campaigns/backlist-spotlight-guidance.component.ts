import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backlist-spotlight-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bl-guidance">

      <!-- What it is -->
      <div class="bl-callout">
        <div class="bl-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div>
          <h4 class="bl-callout-title">A confident recommendation, not a clearance sale</h4>
          <p class="bl-callout-desc">The backlist spotlight is a deliberate, focused recommendation of a specific title from your catalog, sent to subscribers who don't yet own it, written the way an author who genuinely loves their own work would describe it to a reader who's ready to hear about it. It's not a desperate plea to notice a book that didn't perform as expected. It's a confident, warm recommendation from an author who knows their readers well enough to say: this is the one you should read next.</p>
        </div>
      </div>

      <!-- Why backlist needs active promotion -->
      <div class="bl-section">
        <h4 class="bl-section-title">Why Your Backlist Needs Active Promotion</h4>
        <div class="bl-why-grid">
          <div class="bl-why-card" *ngFor="let w of whyCards">
            <div class="bl-why-icon" [innerHTML]="w.icon"></div>
            <span class="bl-why-title">{{ w.title }}</span>
            <span class="bl-why-desc">{{ w.desc }}</span>
          </div>
        </div>
        <div class="bl-roi-note">
          <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
          </svg>
          <span>Your backlist is work you've already done. The books are written, edited, and published. The revenue they generate doesn't require additional creative output — it requires marketing attention. A focused backlist spotlight is one of the highest-return marketing activities available to a catalog author.</span>
        </div>
      </div>

      <!-- Audience selector -->
      <div class="bl-section">
        <h4 class="bl-section-title">Who Are You Spotlighting For?</h4>
        <p class="bl-section-intro">The right title to feature depends entirely on who's receiving the email. Select the audience type to see the recommended spotlight strategy.</p>
        <div class="bl-audience-tabs">
          <button class="bl-aud-tab" *ngFor="let a of audienceTypes"
            [class.bl-aud-selected]="selectedAudience === a.id"
            (click)="selectedAudience = a.id">
            <div class="bl-aud-icon" [innerHTML]="a.icon"></div>
            <span class="bl-aud-label">{{ a.label }}</span>
          </button>
        </div>
        <div class="bl-audience-detail" *ngIf="activeAudience">
          <div class="bl-aud-detail-header">
            <span class="bl-aud-detail-title">{{ activeAudience.label }}</span>
            <span class="bl-aud-detail-badge">{{ activeAudience.badge }}</span>
          </div>
          <p class="bl-aud-detail-desc">{{ activeAudience.desc }}</p>
          <div class="bl-aud-detail-strategy">
            <span class="bl-aud-strategy-label">Recommended title to feature:</span>
            <span class="bl-aud-strategy-value">{{ activeAudience.strategy }}</span>
          </div>
          <div class="bl-aud-detail-framing">
            <span class="bl-aud-strategy-label">Framing:</span>
            <span class="bl-aud-strategy-value">{{ activeAudience.framing }}</span>
          </div>
        </div>
      </div>

      <!-- Tone guidance -->
      <div class="bl-section">
        <h4 class="bl-section-title">Tonal Target: Confident Recommendation</h4>
        <p class="bl-section-intro">Write about the book the way you'd write about a favorite book you're recommending to a friend who hasn't read it yet. The reviews are in. The readers have spoken. You know the book.</p>
        <div class="bl-tone-compare">
          <div class="bl-tone-bad">
            <div class="bl-tone-label bad">
              <svg viewBox="0 0 20 20" fill="#ef4444" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
              Apologetic — signals insecurity
            </div>
            <p class="bl-tone-text">"I know this book has been out for a while, but you might have missed it when it first came out..."</p>
            <p class="bl-tone-why">Defensive framing makes the reader wonder why you're apologizing. If the book is good, its age is irrelevant.</p>
          </div>
          <div class="bl-tone-good">
            <div class="bl-tone-label good">
              <svg viewBox="0 0 20 20" fill="#10b981" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              Confident — treats the book as current
            </div>
            <p class="bl-tone-text">"I want to tell you about [Title]."</p>
            <p class="bl-tone-why">For many of the readers receiving this email, the book genuinely is new to them. Write it that way. A book that was good when it was published is still good.</p>
          </div>
        </div>
      </div>

      <!-- Email structure -->
      <div class="bl-section">
        <h4 class="bl-section-title">How to Structure the Spotlight Email</h4>
        <div class="bl-struct-steps">
          <div class="bl-struct-step" *ngFor="let s of emailStructure">
            <div class="bl-struct-num">{{ s.num }}</div>
            <div>
              <span class="bl-struct-title">{{ s.title }}</span>
              <span class="bl-struct-desc">{{ s.desc }}</span>
              <div class="bl-struct-example" *ngIf="s.example">
                <span class="bl-example-label">Example:</span>
                <span class="bl-example-text">{{ s.example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Review material guidance -->
      <div class="bl-section bl-review-section">
        <div class="bl-review-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <h4 class="bl-section-title" style="margin:0">Use Your Best Review Material</h4>
        </div>
        <p class="bl-section-intro" style="margin-top:.75rem">A backlist title has something a new release doesn't: a body of reviews you can draw from. A line or two from a particularly resonant review is the most effective social proof available for a backlist spotlight.</p>
        <div class="bl-review-tips">
          <div class="bl-review-tip good">
            <div class="bl-review-tip-label good">
              <svg viewBox="0 0 20 20" fill="#10b981" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              High-value review line
            </div>
            <p class="bl-review-tip-text">"This kept me up until 3am and I don't regret a thing."</p>
            <p class="bl-review-tip-why">Captures the reading experience in language a prospective reader will recognize as meaningful. Specific, emotional, memorable.</p>
          </div>
          <div class="bl-review-tip bad">
            <div class="bl-review-tip-label bad">
              <svg viewBox="0 0 20 20" fill="#ef4444" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
              Low-value review line
            </div>
            <p class="bl-review-tip-text">"★★★★★ Great book, highly recommend."</p>
            <p class="bl-review-tip-why">A five-star rating with no context tells the reader nothing about the reading experience. Choose reviews that describe what it feels like to read the book.</p>
          </div>
        </div>
        <div class="form-group" style="margin-top:.875rem">
          <label class="form-label">Best Review Line for This Title</label>
          <textarea class="form-input" [(ngModel)]="spotlightDetails.reviewLine" rows="2"
            placeholder='e.g. "This kept me up until 3am and I don&#39;t regret a thing." — Goodreads reviewer'></textarea>
        </div>
      </div>

      <!-- Subject line examples -->
      <div class="bl-section">
        <h4 class="bl-section-title">Subject Line Examples</h4>
        <p class="bl-section-intro">Lead with what makes the book special — not its publication history. Write the subject line as if the book is current, because for many of the readers receiving it, it genuinely is.</p>
        <div class="bl-subject-list">
          <div class="bl-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="bl-subject-line">"{{ s.line }}"</div>
            <div class="bl-subject-why">{{ s.why }}</div>
            <button class="bl-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Rotation planner -->
      <div class="bl-section">
        <h4 class="bl-section-title">Backlist Spotlight Rotation</h4>
        <p class="bl-section-intro">A strategic rotation cycles through your backlist systematically — one title per period, each spotlight targeting readers who don't yet own that title. Authors who build this into their annual calendar have a reason to email their list every month that doesn't depend on a new release.</p>
        <div class="bl-rotation-explainer">
          <div class="bl-rotation-item" *ngFor="let r of rotationBenefits">
            <svg viewBox="0 0 20 20" fill="#64748b" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ r }}</span>
          </div>
        </div>
        <div class="bl-rotation-form">
          <div class="bl-rotation-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
            </svg>
            <span class="bl-rotation-title">Plan Your Rotation</span>
          </div>
          <div class="bl-rotation-cadence">
            <label class="form-label">Rotation Cadence</label>
            <div class="bl-cadence-btns">
              <button class="bl-cadence-btn" *ngFor="let c of cadenceOptions"
                [class.bl-cadence-selected]="spotlightDetails.cadence === c.id"
                (click)="spotlightDetails.cadence = c.id">
                {{ c.label }}
                <span class="bl-cadence-note">{{ c.note }}</span>
              </button>
            </div>
          </div>
          <div class="bl-catalog-titles">
            <label class="form-label">Your Catalog Titles (for rotation planning)</label>
            <div class="bl-catalog-list">
              <div class="bl-catalog-item" *ngFor="let t of catalogTitles; let i = index">
                <span class="bl-catalog-num">{{ i + 1 }}</span>
                <input type="text" class="form-input bl-catalog-input" [(ngModel)]="t.title" placeholder="Title name..." />
                <select class="form-input bl-catalog-select" [(ngModel)]="t.status">
                  <option value="not-spotlighted">Not yet spotlighted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                </select>
                <button class="bl-catalog-remove" (click)="removeCatalogTitle(i)" *ngIf="catalogTitles.length > 1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <button class="bl-add-title-btn" (click)="addCatalogTitle()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add title
            </button>
          </div>
          <div class="bl-rotation-summary" *ngIf="catalogTitles.length > 0 && spotlightDetails.cadence">
            <svg viewBox="0 0 20 20" fill="#64748b" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
            <span>{{ catalogTitles.length }} titles at {{ activeCadenceLabel }} cadence = <strong>{{ rotationSummary }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Spotlight details form -->
      <div class="bl-section">
        <h4 class="bl-section-title">This Spotlight's Details</h4>
        <div class="bl-form-grid">
          <div class="form-group">
            <label class="form-label">Title Being Spotlighted</label>
            <input type="text" class="form-input" [(ngModel)]="spotlightDetails.title" placeholder="e.g. The Ashford Inheritance" />
          </div>
          <div class="form-group">
            <label class="form-label">Publication Year</label>
            <input type="text" class="form-input" [(ngModel)]="spotlightDetails.year" placeholder="e.g. 2022" />
          </div>
          <div class="form-group">
            <label class="form-label">Primary Purchase Link</label>
            <input type="url" class="form-input" [(ngModel)]="spotlightDetails.buyLink" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">Series "Start from the Beginning" Link</label>
            <input type="url" class="form-input" [(ngModel)]="spotlightDetails.seriesLink" placeholder="https://... (optional — for series spotlights only)" />
            <span class="field-help">Secondary link positioned visually below the primary CTA. Appropriate when introducing a series to new readers.</span>
          </div>
          <div class="form-group bl-form-full">
            <label class="form-label">What Makes This Book Special (1–2 sentences)</label>
            <textarea class="form-input" [(ngModel)]="spotlightDetails.hook" rows="2"
              placeholder="What's distinctive about it? What do its readers love most? What reading experience does it deliver that your other books don't?"></textarea>
            <span class="field-help">Lead with this in your opening — not the publication history, not its place in your catalog.</span>
          </div>
        </div>
      </div>

      <!-- Suppression note -->
      <div class="bl-suppression-note">
        <div class="bl-supp-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
        <div>
          <span class="bl-supp-title">Suppress existing buyers automatically</span>
          <p class="bl-supp-desc">ScribeCount connects your email audience to your direct store's purchase history. For each title in your rotation, the audience is readers who don't yet own that specific book — ScribeCount builds that segment automatically and updates it as new purchases come in. No manual list management required.</p>
        </div>
      </div>

      <!-- Pre-send checklist -->
      <div class="bl-section">
        <h4 class="bl-section-title">Pre-Send Checklist</h4>
        <div class="bl-checklist">
          <div class="bl-check-item" *ngFor="let c of preflightItems" (click)="c.checked = !c.checked">
            <div class="bl-check-box" [class.checked]="c.checked">
              <svg *ngIf="c.checked" viewBox="0 0 20 20" fill="#059669" width="14" height="14">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span [class.checked-text]="c.checked">{{ c.label }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .bl-guidance { display:flex; flex-direction:column; gap:1rem; }
    .bl-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(100,116,139,0.06); border-left:3px solid #64748b; border-radius:0 10px 10px 0; }
    .bl-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(100,116,139,0.1); color:#64748b; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bl-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .bl-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .bl-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .bl-review-section { background:rgba(245,158,11,0.03); border-color:rgba(245,158,11,0.15); }
    .bl-review-header { display:flex; align-items:center; gap:.625rem; color:#d97706; }
    .bl-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .bl-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .bl-why-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.625rem; margin-bottom:.875rem; }
    .bl-why-card { display:flex; flex-direction:column; gap:.375rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .bl-why-icon { width:28px; height:28px; border-radius:7px; background:rgba(100,116,139,0.08); color:#64748b; display:flex; align-items:center; justify-content:center; }
    .bl-why-title { font-size:.8125rem; font-weight:600; color:#0f172a; }
    .bl-why-desc { font-size:.75rem; color:#64748b; line-height:1.5; }
    .bl-roi-note { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.15); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .bl-audience-tabs { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; margin-bottom:.75rem; }
    .bl-aud-tab { display:flex; flex-direction:column; align-items:center; gap:.375rem; padding:.875rem .5rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; transition:all .15s; }
    .bl-aud-tab:hover { border-color:#64748b; }
    .bl-aud-tab.bl-aud-selected { border-color:#64748b; background:rgba(100,116,139,0.05); }
    .bl-aud-icon { width:28px; height:28px; border-radius:7px; background:rgba(100,116,139,0.1); color:#64748b; display:flex; align-items:center; justify-content:center; }
    .bl-aud-label { font-size:.75rem; font-weight:600; color:#374151; text-align:center; line-height:1.3; }
    .bl-audience-detail { padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .bl-aud-detail-header { display:flex; align-items:center; gap:.625rem; margin-bottom:.5rem; }
    .bl-aud-detail-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .bl-aud-detail-badge { font-size:.7rem; font-weight:700; padding:.2rem .55rem; background:rgba(100,116,139,0.1); color:#475569; border-radius:100px; }
    .bl-aud-detail-desc { font-size:.8rem; color:#374151; margin:0 0 .75rem; line-height:1.5; }
    .bl-aud-detail-strategy { display:flex; flex-direction:column; gap:.2rem; padding:.625rem .875rem; background:#f8fafc; border-radius:8px; margin-bottom:.375rem; }
    .bl-aud-detail-framing { display:flex; flex-direction:column; gap:.2rem; padding:.625rem .875rem; background:#f8fafc; border-radius:8px; }
    .bl-aud-strategy-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; }
    .bl-aud-strategy-value { font-size:.8125rem; color:#374151; line-height:1.4; }
    .bl-tone-compare { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .bl-tone-bad { padding:.875rem; background:rgba(239,68,68,0.04); border:1.5px solid rgba(239,68,68,0.15); border-radius:10px; }
    .bl-tone-good { padding:.875rem; background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.15); border-radius:10px; }
    .bl-tone-label { display:flex; align-items:center; gap:.375rem; font-size:.75rem; font-weight:700; margin-bottom:.5rem; }
    .bl-tone-label.bad { color:#dc2626; }
    .bl-tone-label.good { color:#059669; }
    .bl-tone-text { font-size:.8rem; color:#374151; font-style:italic; line-height:1.5; margin:0 0 .5rem; }
    .bl-tone-why { font-size:.75rem; color:#94a3b8; margin:0; line-height:1.4; }
    .bl-struct-steps { display:flex; flex-direction:column; gap:.625rem; }
    .bl-struct-step { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .bl-struct-num { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#64748b,#475569); color:#fff; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bl-struct-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .bl-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .bl-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(100,116,139,0.05); border-radius:6px; }
    .bl-example-label { font-size:.7rem; font-weight:700; color:#64748b; white-space:nowrap; }
    .bl-example-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .bl-review-tips { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .bl-review-tip { padding:.875rem; border-radius:10px; }
    .bl-review-tip.good { background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.15); }
    .bl-review-tip.bad { background:rgba(239,68,68,0.04); border:1.5px solid rgba(239,68,68,0.15); }
    .bl-review-tip-label { display:flex; align-items:center; gap:.375rem; font-size:.75rem; font-weight:700; margin-bottom:.5rem; }
    .bl-review-tip-label.good { color:#059669; }
    .bl-review-tip-label.bad { color:#dc2626; }
    .bl-review-tip-text { font-size:.8rem; color:#374151; font-style:italic; line-height:1.5; margin:0 0 .5rem; }
    .bl-review-tip-why { font-size:.75rem; color:#94a3b8; margin:0; line-height:1.4; }
    .bl-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .bl-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .bl-subject-item:hover { border-color:#64748b; }
    .bl-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .bl-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .bl-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(100,116,139,0.25); border-radius:6px; background:rgba(100,116,139,0.06); color:#475569; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .bl-use-btn:hover { background:rgba(100,116,139,0.12); border-color:#64748b; }
    .bl-rotation-explainer { display:flex; flex-direction:column; gap:.375rem; margin-bottom:.875rem; }
    .bl-rotation-item { display:flex; align-items:flex-start; gap:.625rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .bl-rotation-form { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .bl-rotation-header { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.875rem; }
    .bl-rotation-title { font-size:.8125rem; font-weight:600; color:#374151; }
    .bl-rotation-cadence { margin-bottom:.875rem; }
    .bl-cadence-btns { display:flex; gap:.5rem; margin-top:.4rem; flex-wrap:wrap; }
    .bl-cadence-btn { display:flex; flex-direction:column; align-items:center; padding:.5rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; font-family:inherit; font-size:.8125rem; font-weight:600; color:#374151; transition:all .15s; }
    .bl-cadence-btn:hover { border-color:#64748b; }
    .bl-cadence-btn.bl-cadence-selected { border-color:#64748b; background:rgba(100,116,139,0.06); color:#0f172a; }
    .bl-cadence-note { font-size:.7rem; color:#94a3b8; font-weight:400; margin-top:.15rem; }
    .bl-catalog-list { display:flex; flex-direction:column; gap:.375rem; margin:.4rem 0 .625rem; }
    .bl-catalog-item { display:flex; align-items:center; gap:.5rem; }
    .bl-catalog-num { font-size:.75rem; font-weight:700; color:#94a3b8; width:16px; text-align:right; flex-shrink:0; }
    .bl-catalog-input { flex:2; }
    .bl-catalog-select { flex:1; font-size:.8rem; }
    .bl-catalog-remove { background:none; border:none; cursor:pointer; color:#cbd5e1; padding:.25rem; border-radius:4px; display:flex; transition:color .15s; }
    .bl-catalog-remove:hover { color:#ef4444; }
    .bl-add-title-btn { display:flex; align-items:center; gap:.375rem; padding:.375rem .75rem; background:none; border:1.5px dashed #e2e8f0; border-radius:8px; color:#94a3b8; font-size:.8rem; font-family:inherit; cursor:pointer; transition:all .15s; }
    .bl-add-title-btn:hover { border-color:#64748b; color:#64748b; }
    .bl-rotation-summary { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(100,116,139,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; margin-top:.75rem; }
    .bl-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; }
    .bl-form-full { grid-column:1/-1; }
    .bl-suppression-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(100,116,139,0.04); border:1.5px solid rgba(100,116,139,0.12); border-radius:10px; }
    .bl-supp-icon { width:32px; height:32px; border-radius:8px; background:rgba(100,116,139,0.1); color:#64748b; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bl-supp-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .bl-supp-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; resize:vertical; }
    .form-input:focus { border-color:#64748b; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.35rem; line-height:1.4; }
    .bl-checklist { display:flex; flex-direction:column; gap:.5rem; }
    .bl-check-item { display:flex; align-items:center; gap:.75rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; cursor:pointer; }
    .bl-check-item:hover { background:#f8fafc; }
    .bl-check-box { width:20px; height:20px; border-radius:5px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
    .bl-check-box.checked { border-color:#059669; background:rgba(16,185,129,0.08); }
    .bl-check-item span { font-size:.8125rem; color:#374151; line-height:1.4; }
    .bl-check-item span.checked-text { color:#94a3b8; text-decoration:line-through; }
    @media(max-width:700px) { .bl-why-grid,.bl-tone-compare,.bl-review-tips,.bl-form-grid { grid-template-columns:1fr; } .bl-audience-tabs { grid-template-columns:1fr; } .bl-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class BacklistSpotlightGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  selectedAudience = 'new-subscribers';

  spotlightDetails = {
    title: '',
    year: '',
    buyLink: '',
    seriesLink: '',
    hook: '',
    reviewLine: '',
    cadence: 'monthly',
  };

  catalogTitles: { title: string; status: string }[] = [
    { title: '', status: 'not-spotlighted' },
  ];

  readonly audienceTypes = [
    {
      id: 'new-subscribers',
      label: 'New Subscribers',
      badge: 'Joined last 3–6 months',
      desc: 'Readers who joined your list recently and haven\'t purchased anything yet. They came interested in your work but haven\'t made a purchase decision. A spotlight on the title most likely to turn them into buyers gives them the specific recommendation they were missing.',
      strategy: 'Your best-reviewed backlist title, your series starter, or the book that best represents your voice and genre.',
      framing: 'Write as a fresh introduction — these readers have never heard of this book. No "you might remember" or "as you may know." Treat it as a new discovery.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>'
    },
    {
      id: 'partial-series',
      label: 'Partial-Series Readers',
      badge: 'Bought Book 1, not Book 2',
      desc: 'A reader who purchased Book One of your series but hasn\'t bought Book Two is exactly the right recipient for a spotlight on Book Two framed as a natural continuation. ScribeCount identifies this segment precisely from your purchase history.',
      strategy: 'The next book in the series they\'ve started — the logical next step in their reading journey.',
      framing: 'Acknowledge what they\'ve read and point them to the next step. "If you read [Book 1], you already know [Character] — here\'s what happens next." Personal, not generic.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
      id: 'long-term',
      label: 'Long-Term Subscribers',
      badge: 'On list 1+ year, catalog gaps',
      desc: 'Readers who have been on your list for a year or more and have purchased multiple titles but have gaps in their reading of your catalog. Good candidates for a "hidden gem" spotlight — a book they haven\'t read that you genuinely think they\'d love based on what they have read.',
      strategy: 'A title they haven\'t read that connects to what they have read — the most personal version of the spotlight.',
      framing: 'Assume a relationship deep enough to make a specific recommendation. "Based on what I know about your taste, this is the one I think you\'d love most." Requires the most precise targeting to land well.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
  ];

  get activeAudience() {
    return this.audienceTypes.find(a => a.id === this.selectedAudience) || null;
  }

  readonly whyCards = [
    {
      title: 'Algorithmic visibility decays',
      desc: 'Without ongoing sales activity, a title\'s algorithmic visibility diminishes over time. A targeted spotlight creates a fresh burst of activity that refreshes placement.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
    },
    {
      title: 'New subscribers don\'t know your catalog',
      desc: 'The reader who joined six months ago because of your latest release has never heard of the standalone you published three years ago that your longtime readers consider your best work.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    },
    {
      title: 'Highest-return marketing activity',
      desc: 'Your backlist is work you\'ve already done. The revenue it generates doesn\'t require additional creative output — it requires marketing attention. Converting existing inventory using an existing audience.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
    },
    {
      title: 'Generates new reviews',
      desc: 'A well-written spotlight can do for an older title what a launch campaign does for a new one: create a concentrated burst of sales activity that generates new reviews and reminds the market the book exists.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    },
  ];

  readonly emailStructure = [
    { num: '1', title: 'Subject line — lead with what makes the book special', desc: 'Not its publication history, not its place in your catalog. What\'s distinctive about it? What do its readers love most? Write the subject line as if the book is current — for many readers receiving it, it genuinely is.', example: '"The book my readers call my best work" or "I want to tell you about [Title]"' },
    { num: '2', title: 'Opening — what makes this book worth their time right now', desc: 'Your opening sentences should capture what\'s distinctive about this specific book. Not a summary of the plot. What kind of reading experience does it deliver? What do its readers love most? Lead with that.', example: null },
    { num: '3', title: 'Premise — the minimum information needed to decide', desc: 'Two to three sentences. Not your full blurb. The essence of what the book is, written for a reader who\'s deciding in seconds whether this is for them.', example: null },
    { num: '4', title: 'Social proof — your best review line', desc: 'One or two lines from a particularly resonant review that captures the reading experience in language a prospective reader will recognize as meaningful. Choose carefully — experiential reviews outperform star ratings.', example: '"This kept me up until 3am and I don\'t regret a thing." — Goodreads reviewer' },
    { num: '5', title: 'Call to action — one link, directly to purchase', desc: 'One clear CTA, one link. For a series spotlight introducing new readers, a secondary "see the full series" link is appropriate — positioned visually below the primary CTA and clearly secondary to it.', example: null },
  ];

  readonly subjectExamples = [
    { line: 'The book my readers call my best work', why: 'Confident recommendation framing — positions the book through reader consensus, not author self-promotion' },
    { line: 'I want to tell you about [Title]', why: 'Direct and personal — the exact framing the article recommends. Treats the book as current regardless of publication date' },
    { line: 'If you loved [Book 1], this is what happens next', why: 'For partial-series readers — acknowledges what they\'ve read and points to the logical next step' },
    { line: 'The one my longtime readers say you need to read', why: 'Social proof in the subject line — leverages existing reader enthusiasm before the email is even opened' },
    { line: '[Title] — the hidden gem in my catalog', why: 'Works well for long-term subscribers who have read most of your catalog but have gaps' },
  ];

  readonly rotationBenefits = [
    'A four-title catalog means four spotlights per cycle — a twelve-title catalog at monthly cadence gives you a year of content without requiring new releases.',
    'Each spotlight reaches the readers for whom that title is a genuine discovery, suppresses readers who already own it, and generates a fresh burst of sales activity.',
    'New subscribers who join through each subsequent launch encounter a list that routinely introduces them to catalog titles they haven\'t read.',
    'The system is always running — not just during launch windows, not just when something new is happening.',
  ];

  readonly cadenceOptions = [
    { id: 'monthly', label: 'Monthly', note: 'Best for catalogs of 4+ titles' },
    { id: 'bimonthly', label: 'Every 2 months', note: 'Good for smaller catalogs' },
    { id: 'quarterly', label: 'Quarterly', note: 'Minimal — 4 spotlights/year' },
  ];

  get activeCadenceLabel() {
    return this.cadenceOptions.find(c => c.id === this.spotlightDetails.cadence)?.label.toLowerCase() || '';
  }

  get rotationSummary() {
    const n = this.catalogTitles.filter(t => t.title.trim()).length || this.catalogTitles.length;
    const map: Record<string, string> = { monthly: 'month', bimonthly: '2 months', quarterly: 'quarter' };
    const period = map[this.spotlightDetails.cadence] || 'period';
    const months: Record<string, number> = { monthly: 1, bimonthly: 2, quarterly: 3 };
    const m = months[this.spotlightDetails.cadence] || 1;
    const totalMonths = n * m;
    return `full rotation every ${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
  }

  addCatalogTitle() {
    this.catalogTitles.push({ title: '', status: 'not-spotlighted' });
  }

  removeCatalogTitle(i: number) {
    this.catalogTitles.splice(i, 1);
  }

  preflightItems = [
    { label: 'Audience segment targets non-buyers of this specific title only', checked: false },
    { label: 'Buyer suppression rule enabled — existing owners excluded', checked: false },
    { label: 'Opening written as confident recommendation, not apologetic mention', checked: false },
    { label: 'Best review line included — experiential, not just a star rating', checked: false },
    { label: 'Purchase link tested and resolving correctly', checked: false },
    { label: 'Series link included and positioned as secondary CTA (if applicable)', checked: false },
    { label: 'Next spotlight in rotation scheduled', checked: false },
  ];

  selectSubject(line: string) {
    this.onSubjectSuggestion.emit(line);
  }
}
