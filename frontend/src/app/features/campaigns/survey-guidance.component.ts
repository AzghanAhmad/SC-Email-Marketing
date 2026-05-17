import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-survey-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sv-guidance">

      <!-- Why surveys matter -->
      <div class="sv-callout">
        <div class="sv-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div>
          <h4 class="sv-callout-title">Your email list is your most valuable research team</h4>
          <p class="sv-callout-desc">The readers on your list have self-selected. They know your work. They have opinions — sometimes strong ones — about what you do well and what they wish you did differently. And in most cases, if you simply ask them, they'll tell you. The survey email is the campaign that asks.</p>
        </div>
      </div>

      <!-- Why surveys fail -->
      <div class="sv-section">
        <h4 class="sv-section-title">Why Most Author Surveys Fail — and How to Avoid It</h4>
        <div class="sv-failure-grid">
          <div class="sv-failure-item" *ngFor="let f of failureModes">
            <div class="sv-failure-icon">
              <svg viewBox="0 0 20 20" fill="#ef4444" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <span class="sv-failure-title">{{ f.title }}</span>
              <span class="sv-failure-desc">{{ f.desc }}</span>
              <div class="sv-failure-fix">
                <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                <span>{{ f.fix }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Three question categories -->
      <div class="sv-section">
        <h4 class="sv-section-title">The Three Categories of High-Value Survey Questions</h4>
        <div class="sv-question-cats">
          <div class="sv-q-cat" *ngFor="let cat of questionCategories">
            <div class="sv-q-cat-header">
              <div class="sv-q-cat-icon" [style.background]="cat.bg" [style.color]="cat.color" [innerHTML]="cat.icon"></div>
              <span class="sv-q-cat-title">{{ cat.title }}</span>
            </div>
            <p class="sv-q-cat-desc">{{ cat.desc }}</p>
            <div class="sv-q-examples">
              <div class="sv-q-example" *ngFor="let ex of cat.examples">
                <svg viewBox="0 0 20 20" fill="#0ea5e9" width="11" height="11"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
                <span>{{ ex }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Question builder -->
      <div class="sv-section">
        <h4 class="sv-section-title">Build Your Survey Questions</h4>
        <p class="sv-section-intro">3–5 questions is the sweet spot. More than five and completion rates drop significantly. Use concrete options (multiple choice, ranking) for decisions you need data on, and one open-ended field for insights you didn't know to ask about.</p>
        <div class="sv-questions-list">
          <div class="sv-question-row" *ngFor="let q of surveyQuestions; let i = index">
            <div class="sv-q-num">{{ i + 1 }}</div>
            <div class="sv-q-fields">
              <input type="text" class="form-input" [(ngModel)]="q.text" [placeholder]="'Question ' + (i + 1) + ' — e.g. Which series idea sounds most interesting to you?'" />
              <select class="form-input sv-q-type" [(ngModel)]="q.type">
                <option value="multiple">Multiple choice</option>
                <option value="ranking">Ranking</option>
                <option value="scale">1–5 scale</option>
                <option value="open">Open-ended</option>
                <option value="yesno">Yes / No</option>
              </select>
            </div>
            <button class="sv-q-remove" (click)="removeQuestion(i)" *ngIf="surveyQuestions.length > 1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <button class="sv-add-q-btn" (click)="addQuestion()" *ngIf="surveyQuestions.length < 5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add question ({{ surveyQuestions.length }}/5)
        </button>
        <div class="sv-q-limit-note" *ngIf="surveyQuestions.length >= 5">
          <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <span>5 questions is the maximum recommended. More than this and completion rates drop significantly — you'll get data from only your most motivated respondents.</span>
        </div>
      </div>

      <!-- Email structure -->
      <div class="sv-section">
        <h4 class="sv-section-title">Writing the Survey Email</h4>
        <p class="sv-section-intro">The survey email is shorter and more focused than most campaigns. Its single job is to get readers to click the survey link and complete it. Everything in the email should serve that goal.</p>
        <div class="sv-struct-steps">
          <div class="sv-struct-step" *ngFor="let s of emailStructure">
            <div class="sv-struct-num">{{ s.num }}</div>
            <div>
              <span class="sv-struct-title">{{ s.title }}</span>
              <span class="sv-struct-desc">{{ s.desc }}</span>
              <div class="sv-struct-example" *ngIf="s.example">
                <span class="sv-example-label">Example:</span>
                <span class="sv-example-text">{{ s.example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject lines -->
      <div class="sv-section">
        <h4 class="sv-section-title">Subject Lines</h4>
        <p class="sv-section-intro">Signal that something different is happening — this isn't a promotional email, it's an invitation to participate in something that matters.</p>
        <div class="sv-subject-list">
          <div class="sv-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="sv-subject-line">"{{ s.line }}"</div>
            <div class="sv-subject-why">{{ s.why }}</div>
            <button class="sv-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Incentive guidance -->
      <div class="sv-incentive">
        <div class="sv-incentive-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
        </div>
        <div>
          <span class="sv-incentive-title">The Incentive — Optional but Effective</span>
          <p class="sv-incentive-desc">A small incentive increases survey completion rates, but it doesn't need to be elaborate. Keep it proportional to the ask — a two-minute survey doesn't require a major prize, just a token of genuine appreciation.</p>
          <div class="sv-incentive-options">
            <span class="sv-incentive-chip" *ngFor="let opt of incentiveOptions">{{ opt }}</span>
          </div>
        </div>
      </div>

      <!-- What to do with answers -->
      <div class="sv-section">
        <h4 class="sv-section-title">What to Do With the Answers</h4>
        <div class="sv-followup-steps">
          <div class="sv-followup-step" *ngFor="let s of followupSteps">
            <div class="sv-followup-icon" [style.background]="s.bg" [style.color]="s.color" [innerHTML]="s.icon"></div>
            <div>
              <span class="sv-followup-title">{{ s.title }}</span>
              <span class="sv-followup-desc">{{ s.desc }}</span>
            </div>
          </div>
        </div>
        <div class="sv-scribecount-note">
          <svg viewBox="0 0 20 20" fill="#0ea5e9" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>ScribeCount Email connects survey responses to subscriber profiles. Readers who tell you they prefer audio books can be tagged for audiobook-specific announcements. Readers who indicate they discovered you through a specific channel can be segmented to evaluate the long-term retention and engagement quality of that acquisition source.</span>
        </div>
      </div>

      <!-- Survey details form -->
      <div class="sv-section">
        <h4 class="sv-section-title">Survey Details</h4>
        <div class="sv-form-grid">
          <div class="form-group">
            <label class="form-label">Survey Purpose</label>
            <input type="text" class="form-input" [(ngModel)]="surveyDetails.purpose" placeholder="e.g. Deciding between two series directions" />
          </div>
          <div class="form-group">
            <label class="form-label">Estimated Completion Time</label>
            <select class="form-input" [(ngModel)]="surveyDetails.duration">
              <option value="1 minute">1 minute</option>
              <option value="2 minutes">2 minutes</option>
              <option value="3 minutes">3 minutes</option>
              <option value="5 minutes">5 minutes</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Survey Link</label>
            <input type="url" class="form-input" [(ngModel)]="surveyDetails.link" placeholder="https://forms.google.com/... or https://typeform.com/..." />
          </div>
          <div class="form-group">
            <label class="form-label">Incentive <span class="form-label-hint">(optional)</span></label>
            <input type="text" class="form-input" [(ngModel)]="surveyDetails.incentive" placeholder="e.g. Chance to win a signed copy of The Ember Crown" />
          </div>
        </div>
        <div class="sv-time-preview" *ngIf="surveyDetails.duration && surveyDetails.purpose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>State upfront in the email: "This survey has {{ surveyQuestions.length }} question{{ surveyQuestions.length !== 1 ? 's' : '' }} and takes about {{ surveyDetails.duration }} to complete."</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .sv-guidance { display:flex; flex-direction:column; gap:1rem; }
    .sv-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(14,165,233,0.06); border-left:3px solid #0ea5e9; border-radius:0 10px 10px 0; }
    .sv-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(14,165,233,0.1); color:#0ea5e9; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sv-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .sv-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .sv-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .sv-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .sv-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .sv-failure-grid { display:flex; flex-direction:column; gap:.625rem; }
    .sv-failure-item { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; }
    .sv-failure-icon { flex-shrink:0; margin-top:.1rem; }
    .sv-failure-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .sv-failure-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; margin-bottom:.375rem; }
    .sv-failure-fix { display:flex; align-items:flex-start; gap:.375rem; font-size:.75rem; color:#059669; line-height:1.4; }
    .sv-question-cats { display:flex; flex-direction:column; gap:.75rem; }
    .sv-q-cat { padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .sv-q-cat-header { display:flex; align-items:center; gap:.625rem; margin-bottom:.5rem; }
    .sv-q-cat-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sv-q-cat-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .sv-q-cat-desc { font-size:.8rem; color:#64748b; margin:0 0 .625rem; line-height:1.5; }
    .sv-q-examples { display:flex; flex-direction:column; gap:.3rem; }
    .sv-q-example { display:flex; align-items:flex-start; gap:.375rem; font-size:.75rem; color:#374151; line-height:1.4; font-style:italic; }
    .sv-questions-list { display:flex; flex-direction:column; gap:.5rem; margin-bottom:.75rem; }
    .sv-question-row { display:flex; align-items:center; gap:.625rem; }
    .sv-q-num { width:22px; height:22px; border-radius:50%; background:#0ea5e9; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sv-q-fields { display:flex; gap:.5rem; flex:1; }
    .sv-q-fields .form-input:first-child { flex:1; }
    .sv-q-type { width:160px; flex-shrink:0; }
    .sv-q-remove { background:rgba(239,68,68,0.06); border:1.5px solid rgba(239,68,68,0.2); border-radius:7px; color:#dc2626; cursor:pointer; padding:.375rem; display:flex; transition:all .15s; }
    .sv-q-remove:hover { background:rgba(239,68,68,0.12); }
    .sv-add-q-btn { display:flex; align-items:center; gap:.375rem; padding:.5rem .875rem; border:1.5px dashed #e2e8f0; border-radius:8px; background:transparent; color:#64748b; font-size:.8125rem; font-family:inherit; cursor:pointer; transition:all .15s; }
    .sv-add-q-btn:hover { border-color:#0ea5e9; color:#0ea5e9; background:rgba(14,165,233,0.04); }
    .sv-q-limit-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(217,119,6,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .sv-struct-steps { display:flex; flex-direction:column; gap:.625rem; }
    .sv-struct-step { display:flex; align-items:flex-start; gap:.75rem; }
    .sv-struct-num { width:22px; height:22px; border-radius:50%; background:#0ea5e9; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .sv-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .sv-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .sv-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(14,165,233,0.04); border-radius:6px; }
    .sv-example-label { font-size:.7rem; font-weight:700; color:#0ea5e9; white-space:nowrap; }
    .sv-example-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .sv-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .sv-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .sv-subject-item:hover { border-color:#0ea5e9; }
    .sv-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .sv-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .sv-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(14,165,233,0.25); border-radius:6px; background:rgba(14,165,233,0.06); color:#0ea5e9; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .sv-use-btn:hover { background:rgba(14,165,233,0.12); border-color:#0ea5e9; }
    .sv-incentive { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(245,158,11,0.04); border:1.5px solid rgba(245,158,11,0.15); border-radius:10px; }
    .sv-incentive-icon { width:32px; height:32px; border-radius:8px; background:rgba(245,158,11,0.1); color:#d97706; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sv-incentive-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .sv-incentive-desc { font-size:.8rem; color:#374151; margin:0 0 .625rem; line-height:1.6; }
    .sv-incentive-options { display:flex; flex-wrap:wrap; gap:.375rem; }
    .sv-incentive-chip { padding:.25rem .625rem; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); border-radius:100px; font-size:.75rem; color:#92400e; }
    .sv-followup-steps { display:flex; flex-direction:column; gap:.625rem; margin-bottom:.875rem; }
    .sv-followup-step { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; }
    .sv-followup-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sv-followup-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .sv-followup-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .sv-scribecount-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(14,165,233,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .sv-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; display:flex; align-items:center; gap:.375rem; }
    .form-label-hint { font-size:.75rem; font-weight:400; color:#94a3b8; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#0ea5e9; }
    .sv-time-preview { display:flex; align-items:center; gap:.5rem; padding:.625rem .875rem; background:rgba(14,165,233,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    @media(max-width:700px) { .sv-form-grid { grid-template-columns:1fr; } .sv-subject-item { flex-direction:column; align-items:flex-start; } .sv-q-fields { flex-direction:column; } .sv-q-type { width:100%; } }
  `]
})
export class SurveyGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  surveyDetails = { purpose: '', duration: '2 minutes', link: '', incentive: '' };
  surveyQuestions: { text: string; type: string }[] = [
    { text: '', type: 'multiple' },
    { text: '', type: 'open' },
  ];

  readonly failureModes = [
    {
      title: 'Too long',
      desc: 'A survey that asks twenty questions takes ten or more minutes to complete. Most readers abandon it partway through, and the completion data is skewed toward your most loyal readers — not your broader audience.',
      fix: '3–5 well-chosen questions that can be answered in two minutes will deliver better data from a larger and more representative sample.'
    },
    {
      title: 'Too vague',
      desc: '"Do you like my books?" is not a useful research question. Questions that ask for abstract opinions produce abstract answers that are hard to act on.',
      fix: '"Which of these series ideas sounds most interesting to you?" with four specific options is a useful research question. Concrete options produce preferences you can actually use.'
    },
    {
      title: 'No explanation of purpose',
      desc: 'Readers who receive a generic "we value your feedback" invitation that doesn\'t explain what their input will actually do are less likely to engage thoughtfully.',
      fix: 'Tell readers exactly why you\'re asking and exactly what you\'ll do with the answers. A reader who knows their input will shape your next series will give you their honest, considered opinion.'
    },
  ];

  readonly questionCategories = [
    {
      title: 'Discovery Questions',
      desc: 'Understanding how readers find you. This data tells you where your marketing is actually working versus where you think it\'s working — and often produces surprises.',
      bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      examples: [
        'Where did you first hear about my books?',
        'Which platform do you read on most often?',
        'Did you discover me through a recommendation, a retailer algorithm, an ad, or a friend?',
      ]
    },
    {
      title: 'Preference Questions',
      desc: 'Understanding what readers want more of. Most valuable when they offer specific, concrete options rather than open-ended fields.',
      bg: 'rgba(99,102,241,0.1)', color: '#6366f1',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      examples: [
        'Which of these series ideas sounds most interesting to you?',
        'Would you prefer a spinoff about Character A or Character B?',
        'Do you primarily read ebooks, print, or audio?',
      ]
    },
    {
      title: 'Experience Questions',
      desc: 'Understanding what\'s working in your email program. These produce direct, actionable feedback on the newsletter that the survey itself is part of.',
      bg: 'rgba(16,185,129,0.1)', color: '#059669',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      examples: [
        'What would you most like to see more of in my newsletter?',
        'How often would you prefer to hear from me?',
        'Did you feel like the emails you received when you first joined gave you a good introduction to who I am?',
      ]
    },
  ];

  readonly emailStructure = [
    { num: '1', title: 'Subject line — lead with why', desc: 'Signal that something different is happening. This isn\'t a promotional email — it\'s an invitation to participate in something that matters.', example: '"Help me decide what to write next" or "3 questions, 2 minutes — can you help?"' },
    { num: '2', title: 'Opening — explain the purpose specifically', desc: 'Not "your feedback is important to us," but a specific explanation of what you\'re trying to decide and how their input will influence it.', example: '"I\'m trying to decide between two directions for my next series, and I genuinely want to know what my readers think. The results are going to have a real influence on what I write next."' },
    { num: '3', title: 'State the time commitment upfront', desc: 'Tell readers explicitly how long the survey takes before they click. Readers who know what they\'re committing to are more likely to actually complete the survey rather than starting and abandoning.', example: '"This survey has four questions and takes about two minutes to complete."' },
    { num: '4', title: 'Mention the incentive (if any)', desc: 'A brief, honest mention of what readers get for participating. Keep it proportional — a two-minute survey doesn\'t require a major prize, just a token of genuine appreciation.', example: null },
    { num: '5', title: 'One button — the survey link', desc: 'One call to action. One button. "Start the survey" or "Share your thoughts." The link goes directly to the survey — no intermediary pages, no prerequisite reading.', example: null },
  ];

  readonly subjectExamples = [
    { line: 'Help me decide what to write next', why: 'Tells the reader immediately that their input will have a real consequence for something they care about' },
    { line: '3 questions, 2 minutes — can you help?', why: 'Sets expectations clearly about the time commitment before the reader even opens' },
    { line: 'I have a question for you', why: 'Personal and direct — signals a genuine one-to-one ask rather than a broadcast survey' },
    { line: 'Quick question about my newsletter', why: 'Works for experience questions — signals the survey is about the email program itself' },
  ];

  readonly incentiveOptions = [
    'Chance to win a signed copy',
    'Early access to a chapter',
    'Name in the acknowledgments',
    'Exclusive excerpt',
    'Reader magnet download',
  ];

  readonly followupSteps = [
    {
      title: 'Act on the data',
      desc: 'The data from a reader survey is only as valuable as what you do with it. Authors who send surveys, collect responses, and never act on the data have wasted their readers\' time and diminished the goodwill that made those readers willing to participate.',
      bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
    },
    {
      title: 'Close the loop with a follow-up email',
      desc: 'Send a brief follow-up — either standalone or as a section in your next newsletter — reporting what you learned and what you\'re going to do about it. This validates that their participation had an actual effect and builds the kind of participatory relationship that makes future surveys more likely to generate a response.',
      bg: 'rgba(16,185,129,0.1)', color: '#059669',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    },
    {
      title: 'Use responses for segmentation',
      desc: 'Tag subscribers based on their answers. Readers who prefer audio books get tagged for audiobook announcements. Readers who discovered you through a specific channel get segmented to evaluate long-term retention quality of that acquisition source.',
      bg: 'rgba(99,102,241,0.1)', color: '#6366f1',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>'
    },
  ];

  addQuestion() {
    if (this.surveyQuestions.length < 5) {
      this.surveyQuestions.push({ text: '', type: 'multiple' });
    }
  }

  removeQuestion(i: number) {
    if (this.surveyQuestions.length > 1) {
      this.surveyQuestions.splice(i, 1);
    }
  }

  selectSubject(line: string) { this.onSubjectSuggestion.emit(line); }
}
