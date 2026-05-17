import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reader-community-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rc-guidance">

      <!-- What it is -->
      <div class="rc-callout">
        <div class="rc-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <h4 class="rc-callout-title">This campaign moves readers from passive subscribers to active participants</h4>
          <p class="rc-callout-desc">Email is a one-to-many channel — you write, readers receive, and the relationship flows primarily in one direction. A reader community is different. It's a space where your readers talk to each other as well as to you, where the energy of shared enthusiasm compounds rather than dissipating after each individual email. The community invitation email creates that transition.</p>
        </div>
      </div>

      <!-- What a community makes possible -->
      <div class="rc-section">
        <h4 class="rc-section-title">What a Reader Community Makes Possible</h4>
        <p class="rc-section-intro">These are the outcomes a thriving community creates that an email list alone cannot replicate.</p>
        <div class="rc-outcomes">
          <div class="rc-outcome" *ngFor="let o of communityOutcomes">
            <div class="rc-outcome-icon" [innerHTML]="o.icon"></div>
            <div>
              <span class="rc-outcome-title">{{ o.title }}</span>
              <span class="rc-outcome-desc">{{ o.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Readiness check -->
      <div class="rc-section">
        <h4 class="rc-section-title">Are You Ready to Build a Reader Community?</h4>
        <p class="rc-section-intro">Building a community before you have the audience and energy to sustain it produces the worst possible outcome: a ghost town with your name on it. An empty or low-activity community is worse than no community — the absence of life in a space that was supposed to be vibrant is a negative signal to the readers who do join.</p>
        <div class="rc-readiness">
          <div class="rc-ready-item" *ngFor="let r of readinessChecks" (click)="r.checked = !r.checked" [class.rc-ready-checked]="r.checked">
            <div class="rc-ready-box" [class.checked]="r.checked">
              <svg *ngIf="r.checked" viewBox="0 0 20 20" fill="#ec4899" width="14" height="14">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <span class="rc-ready-title">{{ r.title }}</span>
              <span class="rc-ready-desc">{{ r.desc }}</span>
            </div>
          </div>
        </div>
        <div class="rc-readiness-score" *ngIf="readinessScore > 0">
          <div class="rc-score-bar">
            <div class="rc-score-fill" [style.width]="(readinessScore / readinessChecks.length * 100) + '%'"></div>
          </div>
          <span class="rc-score-label" [class.rc-score-ready]="readinessScore >= 3">
            {{ readinessScore }}/{{ readinessChecks.length }} conditions met —
            {{ readinessScore >= 4 ? 'Ready to launch' : readinessScore >= 3 ? 'Nearly ready' : 'Build your list further first' }}
          </span>
        </div>
      </div>

      <!-- Platform selector -->
      <div class="rc-section">
        <h4 class="rc-section-title">Community Platform</h4>
        <p class="rc-section-intro">Choose the platform that matches where your readers already spend time. The best platform is the one your founding members will actually use.</p>
        <div class="rc-platform-grid">
          <button class="rc-platform-btn" *ngFor="let p of platforms"
            [class.rc-platform-selected]="communityDetails.platform === p.id"
            (click)="communityDetails.platform = p.id">
            <div class="rc-platform-icon" [innerHTML]="p.icon"></div>
            <span class="rc-platform-name">{{ p.name }}</span>
            <span class="rc-platform-note">{{ p.note }}</span>
          </button>
        </div>
        <div class="rc-platform-tip" *ngIf="selectedPlatform">
          <svg viewBox="0 0 20 20" fill="#ec4899" width="13" height="13">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/>
          </svg>
          <span>{{ selectedPlatform.tip }}</span>
        </div>
      </div>

      <!-- Paint the interior -->
      <div class="rc-section">
        <h4 class="rc-section-title">Paint the Interior, Not Just the Exterior</h4>
        <div class="rc-interior-compare">
          <div class="rc-compare-bad">
            <div class="rc-compare-label bad">
              <svg viewBox="0 0 20 20" fill="#ef4444" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
              Exterior description — tells readers what the community technically is
            </div>
            <p class="rc-compare-text">"Join my Facebook group for updates and exclusive content."</p>
            <p class="rc-compare-why">Doesn't tell the reader what it feels like to be inside it. Generic enough to describe any author's group.</p>
          </div>
          <div class="rc-compare-good">
            <div class="rc-compare-label good">
              <svg viewBox="0 0 20 20" fill="#10b981" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              Interior description — tells readers what it feels like to be inside
            </div>
            <p class="rc-compare-text">"This is where I post first chapters before they go anywhere else, where the current conversation is about whether [Character] made the right choice at the end of Book Two, and where I drop in most days to answer questions and share things that don't make it into the newsletter."</p>
            <p class="rc-compare-why">Specific, immediate, grounded in what they'll actually experience. Gives the reader a reason to join that is real rather than abstract.</p>
          </div>
        </div>
      </div>

      <!-- Email structure -->
      <div class="rc-section">
        <h4 class="rc-section-title">How to Structure the Invitation Email</h4>
        <div class="rc-struct-steps">
          <div class="rc-struct-step" *ngFor="let s of emailStructure">
            <div class="rc-struct-num">{{ s.num }}</div>
            <div>
              <span class="rc-struct-title">{{ s.title }}</span>
              <span class="rc-struct-desc">{{ s.desc }}</span>
              <div class="rc-struct-example" *ngIf="s.example">
                <span class="rc-example-label">Example:</span>
                <span class="rc-example-text">{{ s.example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Founding member framing -->
      <div class="rc-section rc-founding-section">
        <div class="rc-founding-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <h4 class="rc-section-title" style="margin:0">Founding Member Framing</h4>
        </div>
        <p class="rc-section-intro" style="margin-top:.75rem">The first invitation should go to your most engaged subscribers. Give founding members a sense of their role — it makes early joiners feel chosen rather than recruited, which increases both their likelihood of joining and their likelihood of being active contributors once they do.</p>
        <div class="rc-founding-examples">
          <div class="rc-founding-ex" *ngFor="let ex of foundingExamples">
            <svg viewBox="0 0 20 20" fill="#ec4899" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>"{{ ex }}"</span>
          </div>
        </div>
        <div class="rc-founding-avoid">
          <h5 class="rc-avoid-title">What to leave out of the invitation</h5>
          <div class="rc-avoid-item" *ngFor="let a of avoidItems">
            <svg viewBox="0 0 20 20" fill="#ef4444" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
            <div><strong>{{ a.label }}</strong> — {{ a.desc }}</div>
          </div>
        </div>
      </div>

      <!-- Subject line examples -->
      <div class="rc-section">
        <h4 class="rc-section-title">Subject Line Examples</h4>
        <p class="rc-section-intro">The subject line should feel like a personal invitation, not a broadcast announcement. Readers who feel specifically chosen are more likely to open and act.</p>
        <div class="rc-subject-list">
          <div class="rc-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="rc-subject-line">"{{ s.line }}"</div>
            <div class="rc-subject-why">{{ s.why }}</div>
            <button class="rc-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Targeting -->
      <div class="rc-section">
        <h4 class="rc-section-title">Who Gets the First Invitation</h4>
        <p class="rc-section-intro">Lead with your most engaged subscribers. These readers are your founding members, and founding members set the culture and energy that determines whether late arrivals find a thriving space or a quiet one.</p>
        <div class="rc-targeting-criteria">
          <div class="rc-target-item" *ngFor="let t of targetingCriteria">
            <svg viewBox="0 0 20 20" fill="#ec4899" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ t }}</span>
          </div>
        </div>
        <div class="rc-segment-note">
          <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <span>Don't send to your full list first. A smaller, better-targeted founding group consistently produces a more active community than a large, unfocused launch. Send to the full list only after the community has established energy and culture.</span>
        </div>
      </div>

      <!-- Friction & CTA -->
      <div class="rc-section">
        <h4 class="rc-section-title">Make Joining as Simple as Possible</h4>
        <div class="rc-friction-tips">
          <div class="rc-friction-tip" *ngFor="let tip of frictionTips">
            <svg viewBox="0 0 20 20" fill="#ec4899" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ tip }}</span>
          </div>
        </div>
        <div class="rc-approval-note" *ngIf="communityDetails.platform === 'facebook'">
          <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>Facebook Groups require an approval step. Tell readers to expect a brief delay: <em>"I review all join requests personally, so you may see a short delay before your membership is confirmed."</em> Readers who click and encounter an unexpected wait without context sometimes assume the invitation didn't work and give up.</span>
        </div>
      </div>

      <!-- Long-term sustainability -->
      <div class="rc-section">
        <h4 class="rc-section-title">Building for the Long Term</h4>
        <p class="rc-section-intro">The invitation email gets readers into the community. What keeps them there is a consistent rhythm of new content, regular author presence, and ongoing conversation prompts that give members a reason to engage even when there isn't a major announcement.</p>
        <div class="rc-rhythm-items">
          <div class="rc-rhythm-item" *ngFor="let r of communityRhythm">
            <div class="rc-rhythm-icon" [innerHTML]="r.icon"></div>
            <div>
              <span class="rc-rhythm-title">{{ r.title }}</span>
              <span class="rc-rhythm-desc">{{ r.desc }}</span>
            </div>
          </div>
        </div>
        <div class="rc-scribecount-note">
          <div class="rc-sc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <div>
            <span class="rc-sc-title">Community Members as a Distinct Segment</span>
            <p class="rc-sc-desc">ScribeCount Email allows you to tag community members as a distinct segment. Community members who are deeply engaged often self-select as your best ARC readers, your most likely survey respondents, and your most enthusiastic launch-week buyers. Tag them and design campaigns specifically for this group — community-member-only previews, exclusive early access offers, or behind-the-scenes content that rewards the deeper engagement these readers have chosen.</p>
          </div>
        </div>
      </div>

      <!-- Community details form -->
      <div class="rc-section">
        <h4 class="rc-section-title">Community Details</h4>
        <div class="rc-form-grid">
          <div class="form-group">
            <label class="form-label">Community Name</label>
            <input type="text" class="form-input" [(ngModel)]="communityDetails.name" placeholder="e.g. The Ember Chronicles Reader Circle" />
          </div>
          <div class="form-group">
            <label class="form-label">Join Link</label>
            <input type="url" class="form-input" [(ngModel)]="communityDetails.joinLink" placeholder="https://..." />
            <span class="field-help">Direct link to the join page — not an intermediate page explaining what the community is. The email already did that work.</span>
          </div>
          <div class="form-group rc-form-full">
            <label class="form-label">What's happening in the community right now (1–2 sentences)</label>
            <textarea class="form-input" [(ngModel)]="communityDetails.currentActivity" rows="2"
              placeholder="e.g. We're currently debating whether Kira made the right choice at the end of Book Two, and I just posted the first three pages of the next chapter..."></textarea>
            <span class="field-help">This is the "interior description" — the specific, immediate reason to join that makes the invitation feel real rather than generic.</span>
          </div>
          <div class="form-group rc-form-full">
            <label class="form-label">What you share there that you don't share anywhere else</label>
            <textarea class="form-input" [(ngModel)]="communityDetails.exclusives" rows="2"
              placeholder="e.g. First chapters before they go anywhere else, cover reveals, deleted scenes, monthly behind-the-scenes writing updates..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Community Member Tag</label>
            <input type="text" class="form-input" [(ngModel)]="communityDetails.memberTag" placeholder="e.g. community-member" />
            <span class="field-help">Applied to readers who join. Enables community-specific campaigns and segments in ScribeCount.</span>
          </div>
        </div>
      </div>

      <!-- Pre-send checklist -->
      <div class="rc-section">
        <h4 class="rc-section-title">Pre-Send Checklist</h4>
        <div class="rc-checklist">
          <div class="rc-check-item" *ngFor="let c of preflightItems" (click)="c.checked = !c.checked">
            <div class="rc-check-box" [class.checked]="c.checked">
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
    .rc-guidance { display:flex; flex-direction:column; gap:1rem; }
    .rc-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(236,72,153,0.06); border-left:3px solid #ec4899; border-radius:0 10px 10px 0; }
    .rc-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(236,72,153,0.1); color:#ec4899; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rc-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .rc-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .rc-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .rc-founding-section { background:rgba(236,72,153,0.03); border-color:rgba(236,72,153,0.15); }
    .rc-founding-header { display:flex; align-items:center; gap:.625rem; color:#be185d; }
    .rc-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .rc-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .rc-outcomes { display:flex; flex-direction:column; gap:.625rem; }
    .rc-outcome { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .rc-outcome-icon { width:32px; height:32px; border-radius:8px; background:rgba(236,72,153,0.08); color:#ec4899; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rc-outcome-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .rc-outcome-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .rc-readiness { display:flex; flex-direction:column; gap:.5rem; margin-bottom:.875rem; }
    .rc-ready-item { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:all .15s; }
    .rc-ready-item:hover { border-color:#ec4899; }
    .rc-ready-item.rc-ready-checked { border-color:rgba(236,72,153,0.3); background:rgba(236,72,153,0.03); }
    .rc-ready-box { width:20px; height:20px; border-radius:5px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
    .rc-ready-box.checked { border-color:#ec4899; background:rgba(236,72,153,0.08); }
    .rc-ready-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .rc-ready-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.4; }
    .rc-readiness-score { display:flex; align-items:center; gap:.75rem; margin-top:.25rem; }
    .rc-score-bar { flex:1; height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
    .rc-score-fill { height:100%; background:linear-gradient(90deg,#ec4899,#be185d); border-radius:3px; transition:width .3s; }
    .rc-score-label { font-size:.75rem; color:#64748b; white-space:nowrap; }
    .rc-score-label.rc-score-ready { color:#059669; font-weight:600; }
    .rc-platform-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; margin-bottom:.75rem; }
    .rc-platform-btn { display:flex; flex-direction:column; align-items:center; gap:.375rem; padding:.875rem .5rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; transition:all .15s; }
    .rc-platform-btn:hover { border-color:#ec4899; }
    .rc-platform-btn.rc-platform-selected { border-color:#ec4899; background:rgba(236,72,153,0.05); }
    .rc-platform-icon { width:28px; height:28px; border-radius:7px; background:rgba(236,72,153,0.1); color:#ec4899; display:flex; align-items:center; justify-content:center; }
    .rc-platform-name { font-size:.8125rem; font-weight:600; color:#0f172a; }
    .rc-platform-note { font-size:.7rem; color:#94a3b8; text-align:center; line-height:1.3; }
    .rc-platform-tip { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(236,72,153,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .rc-interior-compare { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .rc-compare-bad { padding:.875rem; background:rgba(239,68,68,0.04); border:1.5px solid rgba(239,68,68,0.15); border-radius:10px; }
    .rc-compare-good { padding:.875rem; background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.15); border-radius:10px; }
    .rc-compare-label { display:flex; align-items:center; gap:.375rem; font-size:.75rem; font-weight:700; margin-bottom:.5rem; }
    .rc-compare-label.bad { color:#dc2626; }
    .rc-compare-label.good { color:#059669; }
    .rc-compare-text { font-size:.8rem; color:#374151; font-style:italic; line-height:1.5; margin:0 0 .5rem; }
    .rc-compare-why { font-size:.75rem; color:#94a3b8; margin:0; line-height:1.4; }
    .rc-struct-steps { display:flex; flex-direction:column; gap:.625rem; }
    .rc-struct-step { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .rc-struct-num { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#ec4899,#be185d); color:#fff; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rc-struct-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .rc-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .rc-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(236,72,153,0.04); border-radius:6px; }
    .rc-example-label { font-size:.7rem; font-weight:700; color:#ec4899; white-space:nowrap; }
    .rc-example-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .rc-founding-examples { display:flex; flex-direction:column; gap:.375rem; margin-bottom:.875rem; }
    .rc-founding-ex { display:flex; align-items:flex-start; gap:.5rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; font-size:.8125rem; color:#374151; font-style:italic; line-height:1.4; }
    .rc-founding-avoid { margin-top:.875rem; }
    .rc-avoid-title { font-size:.75rem; font-weight:700; color:#64748b; margin:0 0 .5rem; }
    .rc-avoid-item { display:flex; align-items:flex-start; gap:.625rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; margin-bottom:.375rem; }
    .rc-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .rc-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .rc-subject-item:hover { border-color:#ec4899; }
    .rc-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .rc-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .rc-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(236,72,153,0.25); border-radius:6px; background:rgba(236,72,153,0.06); color:#be185d; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .rc-use-btn:hover { background:rgba(236,72,153,0.12); border-color:#ec4899; }
    .rc-targeting-criteria { display:flex; flex-direction:column; gap:.375rem; margin-bottom:.75rem; }
    .rc-target-item { display:flex; align-items:flex-start; gap:.625rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.5; }
    .rc-segment-note { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(217,119,6,0.06); border:1px solid rgba(217,119,6,0.15); border-radius:8px; font-size:.8rem; color:#78350f; line-height:1.5; }
    .rc-friction-tips { display:flex; flex-direction:column; gap:.375rem; margin-bottom:.75rem; }
    .rc-friction-tip { display:flex; align-items:flex-start; gap:.625rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .rc-approval-note { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.15); border-radius:8px; font-size:.8rem; color:#1e3a5f; line-height:1.5; margin-top:.75rem; }
    .rc-rhythm-items { display:flex; flex-direction:column; gap:.625rem; margin-bottom:.875rem; }
    .rc-rhythm-item { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .rc-rhythm-icon { width:28px; height:28px; border-radius:7px; background:rgba(236,72,153,0.08); color:#ec4899; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rc-rhythm-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .rc-rhythm-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .rc-scribecount-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(236,72,153,0.04); border:1.5px solid rgba(236,72,153,0.12); border-radius:10px; }
    .rc-sc-icon { width:32px; height:32px; border-radius:8px; background:rgba(236,72,153,0.1); color:#ec4899; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rc-sc-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .rc-sc-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .rc-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; }
    .rc-form-full { grid-column:1/-1; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; resize:vertical; }
    .form-input:focus { border-color:#ec4899; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.35rem; line-height:1.4; }
    .rc-checklist { display:flex; flex-direction:column; gap:.5rem; }
    .rc-check-item { display:flex; align-items:center; gap:.75rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; cursor:pointer; }
    .rc-check-item:hover { background:#f8fafc; }
    .rc-check-box { width:20px; height:20px; border-radius:5px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
    .rc-check-box.checked { border-color:#059669; background:rgba(16,185,129,0.08); }
    .rc-check-item span { font-size:.8125rem; color:#374151; line-height:1.4; }
    .rc-check-item span.checked-text { color:#94a3b8; text-decoration:line-through; }
    @media(max-width:700px) { .rc-platform-grid { grid-template-columns:repeat(2,1fr); } .rc-interior-compare { grid-template-columns:1fr; } .rc-form-grid { grid-template-columns:1fr; } .rc-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class ReaderCommunityGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  communityDetails = {
    platform: '',
    name: '',
    joinLink: '',
    currentActivity: '',
    exclusives: '',
    memberTag: 'community-member',
  };

  readonly communityOutcomes = [
    {
      title: 'Organic word-of-mouth amplification',
      desc: 'Readers who discuss your books with each other in a community setting become natural advocates who bring in new readers without any prompting from you.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: 'Real-time feedback on work in progress',
      desc: 'Community members who are invested in your writing journey become an informal advisory group for covers, titles, series decisions, and chapter-level feedback.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    },
    {
      title: 'Launch-day energy that feels collective',
      desc: 'A community of excited readers celebrating a launch creates social proof and enthusiasm that can be felt by new readers who discover you through those members.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
    },
    {
      title: 'Durable connection during writing gaps',
      desc: 'Between releases, a community keeps your most loyal readers engaged with each other and with you, preventing the subscriber drift that can occur during long gaps between publications.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    },
  ];

  readinessChecks = [
    { title: 'Engaged subscriber base', desc: 'You have at least a few hundred subscribers who regularly open and respond to your emails — the founding membership comes from this group.', checked: false },
    { title: 'Multiple published titles', desc: 'You have enough published work that readers have multiple books to discuss with each other. A community built around a single debut title has limited conversation fuel.', checked: false },
    { title: 'Consistent time to be present', desc: 'You have time to be active in the community at least a few times per week, particularly in the early months when your presence is the primary reason new members stay engaged.', checked: false },
    { title: 'Clear sense of purpose', desc: 'You know what the community is for — the conversations, the exclusives, the shared experiences that justify the invitation and give members a reason to show up regularly.', checked: false },
  ];

  get readinessScore() {
    return this.readinessChecks.filter(r => r.checked).length;
  }

  readonly platforms = [
    { id: 'facebook', name: 'Facebook Group', note: 'Largest reach, familiar to most readers', tip: 'Facebook Groups require an approval step before members are granted access. Tell readers to expect a brief delay so they don\'t assume the invitation didn\'t work.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
    { id: 'discord', name: 'Discord Server', note: 'Best for highly engaged, younger audiences', tip: 'Discord works best for readers who are already comfortable with the platform. Consider whether your audience skews toward Discord users before choosing it as your primary community home.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { id: 'patreon', name: 'Patreon', note: 'Combines community with paid membership tiers', tip: 'Patreon works well when you have exclusive content worth a monthly subscription. The community aspect is secondary to the content offering — make sure the content justifies the ask.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="14.5" cy="9.5" r="6.5"/><line x1="4" y1="22" x2="4" y2="2"/></svg>' },
    { id: 'circle', name: 'Circle / Mighty Networks', note: 'Purpose-built community platforms', tip: 'Circle and Mighty Networks are purpose-built for communities and offer more control than Facebook. The tradeoff is that readers need to create a new account on a platform they may not know.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>' },
    { id: 'substack', name: 'Substack Chat', note: 'Built into Substack if you publish there', tip: 'Substack Chat is the lowest-friction option if you already publish on Substack — readers are already in the ecosystem. Limited compared to dedicated community platforms but requires no additional setup.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'private', name: 'Private / Own Platform', note: 'Maximum control, requires more setup', tip: 'Hosting your own community gives you full control and no platform dependency, but requires readers to create yet another account. Best for authors with a highly engaged, tech-comfortable audience.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  ];

  get selectedPlatform() {
    return this.platforms.find(p => p.id === this.communityDetails.platform) || null;
  }

  readonly emailStructure = [
    { num: '1', title: 'Subject line — personal invitation, not broadcast', desc: 'Write it like you\'re inviting a specific person, not announcing to a list. "I\'m opening something new — and I want you to be part of it" feels different from "Join my reader group."', example: '"You\'re invited: I\'m opening my reader community to my most loyal subscribers first"' },
    { num: '2', title: 'Opening — why you built this and who it\'s for', desc: 'A short, personal paragraph explaining what prompted you to create the community and why this reader specifically belongs in it. Founding-member framing goes here.', example: '"I\'ve been thinking about building a space for readers who want more than the newsletter — somewhere we can actually talk about the books, the characters, the choices I made that you might not agree with."' },
    { num: '3', title: 'Paint the interior — what it\'s like right now', desc: 'The most important paragraph. Describe what\'s happening inside the community at this moment — the current conversation, what you\'ve shared recently, what members are talking about. Specific and immediate, not abstract and promotional.', example: '"Right now we\'re debating whether Kira made the right choice at the end of Book Two. I posted my answer last week — and I was outvoted."' },
    { num: '4', title: 'What you share there that you don\'t share anywhere else', desc: 'Name the exclusives explicitly. First chapters, cover reveals, deleted scenes, behind-the-scenes writing updates, early access to ARCs. The more specific, the more compelling.', example: null },
    { num: '5', title: 'One button — direct to the join page', desc: 'One CTA. The reader lands on the join page for your community, not on an intermediate page explaining what the community is. The email already did that work.', example: '"Join the community" or "I want in" — action-forward, immediately visible.' },
  ];

  readonly foundingExamples = [
    "I'm opening the community to my most loyal readers first — and if you've been reading my newsletter for a while, you're exactly who I had in mind when I built this space.",
    "I'm putting together a small group of readers whose opinions I trust, and I'd love for you to be part of it.",
    "Before I open this to everyone, I wanted to give my newsletter readers first access.",
  ];

  readonly avoidItems = [
    { label: 'Pressure', desc: '"I really need members to make this work." Readers who feel pressured either comply resentfully or don\'t reply at all.' },
    { label: 'Vague promises', desc: '"Exclusive content and updates" describes every author group on the internet. Be specific about what you actually share there.' },
    { label: 'Over-explaining the platform', desc: 'Save technical instructions for the confirmation email. The invitation should feel light and exciting, not like an onboarding document.' },
  ];

  readonly subjectExamples = [
    { line: "You're invited: I'm opening my reader community to my most loyal subscribers first", why: 'Founding-member framing — signals exclusivity and personal selection before the reader even opens' },
    { line: "I built something new — and I want you to be part of it", why: 'Curiosity-driven, personal tone. Works well for authors with a strong newsletter voice' },
    { line: "The conversation I can\'t have in a newsletter", why: 'Positions the community as something qualitatively different from email — not just more of the same' },
    { line: "First access: [Community Name] is open", why: 'Direct and clear — works when the community name itself is compelling' },
    { line: "Come talk about the books with me (and each other)", why: 'Warm and specific — names the actual activity rather than the abstract concept of "community"' },
  ];

  readonly targetingCriteria = [
    'Subscribers who have opened and clicked your emails consistently over the past 3–6 months',
    'Readers who have replied to your newsletter or responded to a question you\'ve posed',
    'Readers who have purchased multiple titles — especially series readers',
    'Subscribers tagged as superfans through purchase history or engagement scoring',
    'Readers who explicitly expressed interest in deeper engagement in a previous survey',
  ];

  readonly frictionTips = [
    'One button, one click — the reader lands directly on the join page, not an intermediate page explaining what the community is.',
    'If your platform requires an approval step, tell readers to expect a brief delay and explain what happens next.',
    'Don\'t ask readers to create a new account in the invitation email itself — let the join page handle that.',
    'Test the join link before sending. A broken link on a community invitation is a trust signal in the wrong direction.',
  ];

  readonly communityRhythm = [
    { title: 'Weekly discussion question', desc: 'A prompt that gives members a reason to engage even when there isn\'t a major announcement — character debates, "what would you do" scenarios, reading recommendations.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { title: 'Monthly behind-the-scenes thread', desc: 'Share progress on your current project — where you are emotionally in the story, a scene that surprised you, a research rabbit hole. The kind of update that doesn\'t fit in a newsletter.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
    { title: 'Regular "what are you reading" thread', desc: 'Lets readers discover each other\'s tastes and builds the peer-to-peer connections that make a community feel alive rather than author-dependent.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
    { title: 'Exclusive early access', desc: 'First chapters before they go anywhere else, cover reveals, deleted scenes. The content that makes membership feel like a genuine perk rather than just another place to follow you.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  ];

  preflightItems = [
    { label: 'Community platform set up and join link tested', checked: false },
    { label: 'Audience segment targeted to engaged subscribers only (not full list)', checked: false },
    { label: 'Interior description written — specific current activity, not generic promises', checked: false },
    { label: 'Exclusives named explicitly in the email body', checked: false },
    { label: 'Founding-member framing included in opening paragraph', checked: false },
    { label: 'Approval delay explained if platform requires it (e.g. Facebook Groups)', checked: false },
    { label: 'Community member tag configured in ScribeCount for post-join segmentation', checked: false },
  ];

  selectSubject(line: string) {
    this.onSubjectSuggestion.emit(line);
  }
}
