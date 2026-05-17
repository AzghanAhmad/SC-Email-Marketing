import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-announcement-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ev-guidance">

      <!-- What it is -->
      <div class="ev-callout">
        <div class="ev-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <h4 class="ev-callout-title">The event announcement email is the closest thing to a genuine human invitation</h4>
          <p class="ev-callout-desc">You're asking your readers to show up — not just to click a link or open a file, but to be present in the same physical or virtual space as you, at the same time, for an experience that only exists because both of you are there. That's a more significant ask than most email campaigns make, and it requires a different kind of email to match.</p>
        </div>
      </div>

      <!-- Event type selector -->
      <div class="ev-section">
        <h4 class="ev-section-title">Event Type</h4>
        <p class="ev-section-intro">Select the type of event you're announcing. Each type has slightly different logistics to communicate, but the structural core is consistent across all of them.</p>
        <div class="ev-type-grid">
          <button class="ev-type-btn" *ngFor="let et of eventTypes"
            [class.ev-type-selected]="eventDetails.type === et.id"
            (click)="eventDetails.type = et.id">
            <div class="ev-type-icon" [innerHTML]="et.icon"></div>
            <span class="ev-type-label">{{ et.label }}</span>
          </button>
        </div>
        <div class="ev-type-desc" *ngIf="selectedEventType">
          <svg viewBox="0 0 20 20" fill="#10b981" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>{{ selectedEventType.desc }}</span>
        </div>
      </div>

      <!-- Non-negotiable structure -->
      <div class="ev-section">
        <h4 class="ev-section-title">The Non-Negotiable Structure — Answer the Key Questions First</h4>
        <p class="ev-section-intro">Answer the five essential questions in the first three to four sentences. Not buried in the body copy. Not after an introductory paragraph about how excited you are. In the opening, where readers who scan rather than read will find them immediately.</p>
        <div class="ev-five-questions">
          <div class="ev-q-item" *ngFor="let q of fiveQuestions">
            <div class="ev-q-num" [style.background]="q.color">{{ q.num }}</div>
            <div>
              <span class="ev-q-title">{{ q.title }}</span>
              <span class="ev-q-desc">{{ q.desc }}</span>
              <div class="ev-q-tip" *ngIf="q.tip">
                <svg viewBox="0 0 20 20" fill="#10b981" width="11" height="11"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                <span>{{ q.tip }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Geographic segmentation -->
      <div class="ev-section">
        <h4 class="ev-section-title">Geographic Segmentation for In-Person Events</h4>
        <div class="ev-geo-callout">
          <div class="ev-geo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div>
            <span class="ev-geo-title">Don't send a Nashville signing announcement to your Edinburgh readers</span>
            <p class="ev-geo-desc">Sending a geographically specific event to your entire list isn't just irrelevant — it's a small signal that your email program treats everyone identically regardless of who they are or where they live, which subtly undermines the personal quality you've worked to build.</p>
            <p class="ev-geo-desc" style="margin-top:.5rem">ScribeCount Email stores subscriber location data based on IP address, form inputs, and purchase location. Geographic segmentation produces better open rates because the email is genuinely relevant to the readers who receive it.</p>
          </div>
        </div>
        <div class="ev-geo-workaround">
          <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <span>If you don't yet have sufficient location data, acknowledge the location in the subject line: <em>"Nashville readers: come find me at [Bookstore] on Saturday."</em> Readers elsewhere recognize immediately that the email isn't for them and can ignore it without feeling their inbox was wasted.</span>
        </div>
        <div class="ev-geo-segments">
          <div class="ev-geo-seg-label">Available geographic segments in your audience:</div>
          <div class="ev-geo-seg-list">
            <div class="ev-geo-seg-item" *ngFor="let seg of geoSegments" (click)="toggleGeoSeg(seg.id)" [class.ev-geo-seg-selected]="selectedGeoSegs.includes(seg.id)">
              <span class="ev-geo-seg-flag">{{ seg.flag }}</span>
              <span class="ev-geo-seg-name">{{ seg.name }}</span>
              <span class="ev-geo-seg-count">{{ seg.count | number }} subscribers</span>
              <svg *ngIf="selectedGeoSegs.includes(seg.id)" viewBox="0 0 20 20" fill="#10b981" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Email structure -->
      <div class="ev-section">
        <h4 class="ev-section-title">How to Structure the Announcement Email</h4>
        <div class="ev-struct-steps">
          <div class="ev-struct-step" *ngFor="let s of emailStructure">
            <div class="ev-struct-icon" [innerHTML]="s.icon"></div>
            <div>
              <span class="ev-struct-title">{{ s.title }}</span>
              <span class="ev-struct-desc">{{ s.desc }}</span>
              <div class="ev-struct-example" *ngIf="s.example">
                <span class="ev-example-label">Example:</span>
                <span class="ev-example-text">{{ s.example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject line examples -->
      <div class="ev-section">
        <h4 class="ev-section-title">Subject Line Examples</h4>
        <p class="ev-section-intro">Your subject line should communicate the event type and create a sense of personal invitation. Readers who feel specifically addressed are more likely to open and act.</p>
        <div class="ev-subject-list">
          <div class="ev-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="ev-subject-line">"{{ s.line }}"</div>
            <div class="ev-subject-why">{{ s.why }}</div>
            <button class="ev-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Follow-up reminder sequence -->
      <div class="ev-section">
        <h4 class="ev-section-title">Follow-Up Reminder Sequence</h4>
        <p class="ev-section-intro">Every event announcement should be paired with at least one follow-up reminder. For virtual events, a three-email sequence performs significantly better than a single announcement.</p>
        <div class="ev-sequence">
          <div class="ev-seq-item" *ngFor="let e of emailSequence" [class.ev-seq-virtual]="e.virtualOnly">
            <div class="ev-seq-num" [style.background]="e.color">{{ e.num }}</div>
            <div class="ev-seq-body">
              <div class="ev-seq-header">
                <span class="ev-seq-title">{{ e.title }}</span>
                <span class="ev-seq-badge virtual" *ngIf="e.virtualOnly">Virtual events</span>
                <span class="ev-seq-badge both" *ngIf="!e.virtualOnly">All events</span>
              </div>
              <span class="ev-seq-timing">{{ e.timing }}</span>
              <span class="ev-seq-desc">{{ e.desc }}</span>
            </div>
          </div>
        </div>
        <div class="ev-seq-note">
          <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>For virtual events, consider a behavioral segment: readers who clicked the original announcement but didn't register. A targeted reminder with a subject line that acknowledges they're already familiar — <em>"You still have time to register for [Event]"</em> — converts at higher rates than a generic re-announcement.</span>
        </div>
      </div>

      <!-- Virtual event tips -->
      <div class="ev-section ev-virtual-section">
        <div class="ev-virtual-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
          <h4 class="ev-section-title" style="margin:0">Virtual Events — Maximizing Attendance</h4>
        </div>
        <p class="ev-section-intro" style="margin-top:.75rem">Virtual events remove the geographic barrier to attendance, but introduce a different kind of friction: the ease of registering is also the ease of forgetting. The same-day reminder is particularly important — readers who registered weeks ago benefit from a timely email that creates immediacy.</p>
        <div class="ev-virtual-tips">
          <div class="ev-virtual-tip" *ngFor="let tip of virtualTips">
            <svg viewBox="0 0 20 20" fill="#10b981" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ tip }}</span>
          </div>
        </div>
      </div>

      <!-- Event details form -->
      <div class="ev-section">
        <h4 class="ev-section-title">Event Details</h4>
        <div class="ev-form-grid">
          <div class="form-group">
            <label class="form-label">Event Name</label>
            <input type="text" class="form-input" [(ngModel)]="eventDetails.name" placeholder="e.g. The Ember Crown Signing at Parnassus Books" />
          </div>
          <div class="form-group">
            <label class="form-label">Event Date</label>
            <input type="date" class="form-input" [(ngModel)]="eventDetails.date" />
          </div>
          <div class="form-group">
            <label class="form-label">Event Time</label>
            <input type="time" class="form-input" [(ngModel)]="eventDetails.time" />
          </div>
          <div class="form-group">
            <label class="form-label">Time Zone</label>
            <select class="form-input" [(ngModel)]="eventDetails.timezone">
              <option value="ET">Eastern Time (ET)</option>
              <option value="CT">Central Time (CT)</option>
              <option value="MT">Mountain Time (MT)</option>
              <option value="PT">Pacific Time (PT)</option>
              <option value="GMT">GMT / London</option>
              <option value="CET">Central European Time (CET)</option>
              <option value="AEST">Australian Eastern (AEST)</option>
            </select>
          </div>
          <div class="form-group" *ngIf="isInPerson">
            <label class="form-label">Venue Name</label>
            <input type="text" class="form-input" [(ngModel)]="eventDetails.venue" placeholder="e.g. Parnassus Books" />
          </div>
          <div class="form-group" *ngIf="isInPerson">
            <label class="form-label">City &amp; State / Country</label>
            <input type="text" class="form-input" [(ngModel)]="eventDetails.city" placeholder="e.g. Nashville, TN" />
          </div>
          <div class="form-group" *ngIf="isInPerson">
            <label class="form-label">Venue Website or Google Maps Link</label>
            <input type="url" class="form-input" [(ngModel)]="eventDetails.venueLink" placeholder="https://..." />
          </div>
          <div class="form-group" *ngIf="!isInPerson">
            <label class="form-label">Platform</label>
            <select class="form-input" [(ngModel)]="eventDetails.platform">
              <option value="Zoom">Zoom</option>
              <option value="YouTube Live">YouTube Live</option>
              <option value="Instagram Live">Instagram Live</option>
              <option value="Facebook Live">Facebook Live</option>
              <option value="Crowdcast">Crowdcast</option>
              <option value="StreamYard">StreamYard</option>
            </select>
          </div>
          <div class="form-group" *ngIf="!isInPerson">
            <label class="form-label">Direct Join / Registration Link</label>
            <input type="url" class="form-input" [(ngModel)]="eventDetails.joinLink" placeholder="https://..." />
            <span class="field-help">Include the direct link in the email — not a link to a page where they can find the link. Every extra step is a reader you lose.</span>
          </div>
          <div class="form-group ev-form-full">
            <label class="form-label">Why Readers Should Attend (1–2 sentences)</label>
            <textarea class="form-input" [(ngModel)]="eventDetails.whyAttend" rows="2" placeholder="e.g. I'll be reading the first chapter of The Ember Crown, signing copies, and answering questions about the series..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">RSVP / Registration Link</label>
            <input type="url" class="form-input" [(ngModel)]="eventDetails.rsvpLink" placeholder="https://... (leave blank if no registration required)" />
          </div>
        </div>
        <div class="ev-datetime-preview" *ngIf="eventDetails.date && eventDetails.time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Event: <strong>{{ formatEventDateTime() }}</strong></span>
        </div>
      </div>

      <!-- Pre-send checklist -->
      <div class="ev-section">
        <h4 class="ev-section-title">Pre-Send Checklist</h4>
        <div class="ev-checklist">
          <div class="ev-check-item" *ngFor="let c of preflightItems">
            <div class="ev-check-box" [class.checked]="c.checked" (click)="c.checked = !c.checked">
              <svg *ngIf="c.checked" viewBox="0 0 20 20" fill="#059669" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            </div>
            <span [class.checked-text]="c.checked">{{ c.label }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .ev-guidance { display:flex; flex-direction:column; gap:1rem; }
    .ev-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(16,185,129,0.06); border-left:3px solid #10b981; border-radius:0 10px 10px 0; }
    .ev-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(16,185,129,0.1); color:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ev-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .ev-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .ev-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .ev-virtual-section { background:rgba(16,185,129,0.04); border-color:rgba(16,185,129,0.15); }
    .ev-virtual-header { display:flex; align-items:center; gap:.625rem; color:#059669; }
    .ev-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .ev-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .ev-type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.5rem; margin-bottom:.75rem; }
    .ev-type-btn { display:flex; flex-direction:column; align-items:center; gap:.375rem; padding:.75rem .5rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; transition:all .15s; }
    .ev-type-btn:hover { border-color:#10b981; }
    .ev-type-btn.ev-type-selected { border-color:#10b981; background:rgba(16,185,129,0.06); }
    .ev-type-icon { width:28px; height:28px; border-radius:7px; background:rgba(16,185,129,0.1); color:#10b981; display:flex; align-items:center; justify-content:center; }
    .ev-type-label { font-size:.7rem; font-weight:600; color:#374151; text-align:center; line-height:1.3; }
    .ev-type-desc { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(16,185,129,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .ev-five-questions { display:flex; flex-direction:column; gap:.625rem; }
    .ev-q-item { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .ev-q-num { width:28px; height:28px; border-radius:50%; color:#fff; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ev-q-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ev-q-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .ev-q-tip { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(16,185,129,0.05); border-radius:6px; font-size:.75rem; color:#374151; line-height:1.4; }
    .ev-geo-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.12); border-radius:10px; margin-bottom:.75rem; }
    .ev-geo-icon { width:32px; height:32px; border-radius:8px; background:rgba(16,185,129,0.1); color:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ev-geo-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .ev-geo-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .ev-geo-workaround { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(217,119,6,0.06); border:1px solid rgba(217,119,6,0.15); border-radius:8px; font-size:.8rem; color:#78350f; line-height:1.5; margin-bottom:.875rem; }
    .ev-geo-segments { margin-top:.875rem; }
    .ev-geo-seg-label { font-size:.75rem; font-weight:600; color:#64748b; margin-bottom:.5rem; }
    .ev-geo-seg-list { display:flex; flex-direction:column; gap:.375rem; }
    .ev-geo-seg-item { display:flex; align-items:center; gap:.75rem; padding:.5rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:all .15s; }
    .ev-geo-seg-item:hover { border-color:#10b981; }
    .ev-geo-seg-item.ev-geo-seg-selected { border-color:#10b981; background:rgba(16,185,129,0.05); }
    .ev-geo-seg-flag { font-size:1rem; }
    .ev-geo-seg-name { font-size:.8125rem; font-weight:600; color:#0f172a; flex:1; }
    .ev-geo-seg-count { font-size:.75rem; color:#94a3b8; }
    .ev-struct-steps { display:flex; flex-direction:column; gap:.75rem; }
    .ev-struct-step { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; }
    .ev-struct-icon { width:28px; height:28px; border-radius:7px; background:rgba(16,185,129,0.08); color:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ev-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ev-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .ev-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(16,185,129,0.04); border-radius:6px; }
    .ev-example-label { font-size:.7rem; font-weight:700; color:#10b981; white-space:nowrap; }
    .ev-example-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .ev-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .ev-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .ev-subject-item:hover { border-color:#10b981; }
    .ev-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .ev-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .ev-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(16,185,129,0.25); border-radius:6px; background:rgba(16,185,129,0.06); color:#059669; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .ev-use-btn:hover { background:rgba(16,185,129,0.12); border-color:#10b981; }
    .ev-sequence { display:flex; flex-direction:column; gap:.625rem; margin-bottom:.875rem; }
    .ev-seq-item { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .ev-seq-num { width:28px; height:28px; border-radius:50%; color:#fff; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ev-seq-body { flex:1; }
    .ev-seq-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.15rem; }
    .ev-seq-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .ev-seq-badge { font-size:.65rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }
    .ev-seq-badge.virtual { background:rgba(99,102,241,0.1); color:#6366f1; }
    .ev-seq-badge.both { background:rgba(16,185,129,0.1); color:#059669; }
    .ev-seq-timing { display:block; font-size:.75rem; font-weight:600; color:#10b981; margin-bottom:.25rem; }
    .ev-seq-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .ev-seq-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(59,130,246,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .ev-virtual-tips { display:flex; flex-direction:column; gap:.5rem; }
    .ev-virtual-tip { display:flex; align-items:flex-start; gap:.625rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .ev-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .ev-form-full { grid-column:1/-1; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; resize:vertical; }
    .form-input:focus { border-color:#10b981; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.35rem; line-height:1.4; }
    .ev-datetime-preview { display:flex; align-items:center; gap:.5rem; padding:.625rem .875rem; background:rgba(16,185,129,0.06); border-radius:8px; font-size:.8125rem; color:#374151; }
    .ev-checklist { display:flex; flex-direction:column; gap:.5rem; }
    .ev-check-item { display:flex; align-items:center; gap:.75rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; cursor:pointer; }
    .ev-check-item:hover { background:#f8fafc; }
    .ev-check-box { width:20px; height:20px; border-radius:5px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
    .ev-check-box.checked { border-color:#059669; background:rgba(16,185,129,0.08); }
    .ev-check-item span { font-size:.8125rem; color:#374151; line-height:1.4; }
    .ev-check-item span.checked-text { color:#94a3b8; text-decoration:line-through; }
    @media(max-width:700px) { .ev-type-grid { grid-template-columns:repeat(2,1fr); } .ev-form-grid { grid-template-columns:1fr; } .ev-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class EventAnnouncementGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  eventDetails = {
    type: '',
    name: '',
    date: '',
    time: '',
    timezone: 'ET',
    venue: '',
    city: '',
    venueLink: '',
    platform: 'Zoom',
    joinLink: '',
    whyAttend: '',
    rsvpLink: '',
  };

  selectedGeoSegs: string[] = [];

  readonly eventTypes = [
    { id: 'signing', label: 'In-Person Signing', desc: 'Appearance at a bookstore, library, or festival where readers can meet you and get books signed.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
    { id: 'festival', label: 'Book Festival', desc: 'Panel, reading, or signing slot at a genre convention, literary festival, or regional book event.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
    { id: 'virtual-qa', label: 'Virtual Q&A', desc: 'Live session on Zoom, YouTube, or social platforms where readers can ask questions in real time.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
    { id: 'reading', label: 'Live Reading', desc: 'Author-hosted event where you read from a new or upcoming work before it\'s available.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
    { id: 'launch-party', label: 'Launch Party', desc: 'Virtual or in-person celebration of a new release, often combined with giveaways and early purchase incentives.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    { id: 'workshop', label: 'Workshop', desc: 'Teaching event for aspiring writers that provides genuine value beyond book promotion.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>' },
    { id: 'podcast', label: 'Podcast Appearance', desc: 'Newsletter mention with a link to the episode — typically a brief mention rather than a dedicated announcement.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' },
  ];

  readonly fiveQuestions = [
    { num: '1', color: '#10b981', title: 'What — state the event type first', desc: 'State the type of event in the first sentence. The reader needs to know what kind of thing they\'re being invited to before any other detail matters to them.', tip: '"I\'ll be at [Bookstore] in [City] for a signing and reading." or "Join me for a live Q&A this Thursday on Zoom."' },
    { num: '2', color: '#3b82f6', title: 'When — specific date, time, and time zone', desc: 'Specific date, specific time, and time zone for virtual events. Do not make readers calculate what "3pm on the 14th" means for their time zone.', tip: 'State multiple time zones for international audiences: "3pm Eastern / 12pm Pacific / 8pm London"' },
    { num: '3', color: '#8b5cf6', title: 'Where — venue or direct link', desc: 'For in-person: venue name, city, and a link to the venue\'s website or Google Maps. For virtual: the platform and a direct link to join or register.', tip: 'Not "you can find the link on my website" — the link, in the email, immediately accessible.' },
    { num: '4', color: '#f59e0b', title: 'Why — what makes this worth their time', desc: 'One or two sentences explaining what makes this event worth attending. What\'s being celebrated, what topic the Q&A focuses on, what makes attendance more rewarding than simply buying the book.', tip: null },
    { num: '5', color: '#ec4899', title: 'How — one clear call to action', desc: 'A registration link, an RSVP link, or a direct link to join. For events that don\'t require advance registration, a "Save the date" or "Add to calendar" link serves this function.', tip: 'Make the path from interest to attendance as short and frictionless as possible.' },
  ];

  readonly geoSegments = [
    { id: 'us-southeast', flag: '🇺🇸', name: 'US — Southeast', count: 1842 },
    { id: 'us-northeast', flag: '🇺🇸', name: 'US — Northeast', count: 1204 },
    { id: 'us-midwest', flag: '🇺🇸', name: 'US — Midwest', count: 987 },
    { id: 'us-west', flag: '🇺🇸', name: 'US — West Coast', count: 1103 },
    { id: 'uk', flag: '🇬🇧', name: 'United Kingdom', count: 743 },
    { id: 'canada', flag: '🇨🇦', name: 'Canada', count: 512 },
    { id: 'australia', flag: '🇦🇺', name: 'Australia', count: 389 },
  ];

  readonly emailStructure = [
    { title: 'Subject line — event type and date up front', desc: 'Lead with what the event is and when it is. Readers make a split-second decision about whether this event is worth considering — put the essential information where it can\'t be missed.', example: '"Nashville readers: signing at Parnassus Books this Saturday" or "Live Q&A Thursday — bring your questions"', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { title: 'Opening — answer all five questions in 3–4 sentences', desc: 'What, when, where, why, and how to attend — in the opening, before any other content. Readers who scan will find everything they need without reading further.', example: null, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="21" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' },
    { title: 'Context — why this event is worth their time', desc: 'A short paragraph with the genuine reason to attend. For a signing: the book being celebrated and what readers can expect. For a virtual Q&A: the specific topic that makes this session different from a generic ask-me-anything.', example: null, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { title: 'Call to action — one link, immediately accessible', desc: 'A registration link, RSVP link, or direct join link. For events without advance registration, an "Add to calendar" link. One CTA, not multiple competing options.', example: '"Reserve your spot" or "Add to calendar" or "Join the Zoom"', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>' },
    { title: 'Close — warm and brief', desc: 'A short closing that expresses genuine welcome. The sense that you want this specific reader to be there is what separates an event announcement that fills seats from one that receives polite passes.', example: '"I\'d love to see you there."', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  ];

  readonly subjectExamples = [
    { line: '[City] readers: come find me at [Bookstore] on Saturday', why: 'Geographic address makes local readers feel specifically invited — others recognize it\'s not for them' },
    { line: 'Live Q&A this Thursday — bring your questions about [Title]', why: 'States the format, the timing, and the topic — reader knows exactly what they\'re being invited to' },
    { line: 'You\'re invited: launch party for [Title] — this Friday', why: 'Personal invitation framing with the event type and urgency of timing' },
    { line: 'I\'m reading the first chapter of [Title] live — join me', why: 'Specific and exclusive — something they can\'t get anywhere else' },
    { line: 'Reminder: [Event Name] is tomorrow — hope to see you there', why: 'For the follow-up reminder — clear, friendly, appropriately brief' },
  ];

  readonly emailSequence = [
    { num: '1', color: '#10b981', title: 'Initial Announcement', timing: 'When registration opens or 1–2 weeks before the event', desc: 'Full announcement with all five essential questions answered in the opening. Include the direct join or registration link. For in-person events, include venue link or Google Maps.', virtualOnly: false },
    { num: '2', color: '#059669', title: 'Follow-Up Reminder', timing: '1–2 days before the event', desc: 'Shorter than the original announcement. Assumes the reader has already seen the invitation and needs only the essential details refreshed: date, time, location or link, and a single call to action.', virtualOnly: false },
    { num: '3', color: '#6366f1', title: 'Same-Day Reminder', timing: 'Morning of the event', desc: 'For virtual events only. Creates immediacy and makes showing up feel urgent without being pressured. Include the direct join link — test it before the email sends.', virtualOnly: true },
  ];

  readonly virtualTips = [
    'Include a direct join link in every email in the sequence — not a link to the page where they can find the join link.',
    'On the day of the event, test the join link before the email sends.',
    'The same-day reminder is particularly important — readers who registered weeks ago may have the event on their calendar but benefit from a timely nudge.',
    'For events with advance registration, target readers who clicked the original announcement but didn\'t register — they expressed interest and didn\'t follow through.',
    'State the time zone explicitly in every email: "3pm Eastern / 12pm Pacific / 8pm London" removes friction for international audiences.',
  ];

  preflightItems = [
    { label: 'Event date, time, and time zone confirmed and correct in email', checked: false },
    { label: 'Join link or venue link tested and resolving correctly', checked: false },
    { label: 'Registration link (if required) tested and working', checked: false },
    { label: 'Geographic segment selected for in-person events', checked: false },
    { label: 'Follow-up reminder email scheduled (1–2 days before)', checked: false },
    { label: 'Same-day reminder scheduled for virtual events', checked: false },
    { label: 'Add-to-calendar link included for events without registration', checked: false },
  ];

  get selectedEventType() {
    return this.eventTypes.find(et => et.id === this.eventDetails.type) || null;
  }

  get isInPerson() {
    return ['signing', 'festival', 'reading', 'launch-party', 'workshop'].includes(this.eventDetails.type);
  }

  toggleGeoSeg(id: string) {
    const idx = this.selectedGeoSegs.indexOf(id);
    if (idx > -1) this.selectedGeoSegs.splice(idx, 1);
    else this.selectedGeoSegs.push(id);
  }

  selectSubject(line: string) {
    this.onSubjectSuggestion.emit(line);
  }

  formatEventDateTime(): string {
    if (!this.eventDetails.date || !this.eventDetails.time) return '';
    const d = new Date(this.eventDetails.date + 'T' + this.eventDetails.time);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) +
      ' ' + this.eventDetails.timezone;
  }
}
