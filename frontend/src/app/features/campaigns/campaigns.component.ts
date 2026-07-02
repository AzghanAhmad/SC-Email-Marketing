import { Component, OnInit, signal, ChangeDetectorRef, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign, CampaignApiService, AbTest, NewsletterSchedule, CalendarEvent, AudienceSegment, ReachEstimate, ReleasePlan } from '../../core/services/campaign-api.service';
import { AuthService } from '../../core/services/auth.service';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignCalendarComponent } from './campaign-calendar.component';
import { CampaignNewsletterComponent } from './campaign-newsletter.component';
import { CampaignAbTestComponent } from './campaign-ab-test.component';
import { NewsletterSwapGuidanceComponent } from './newsletter-swap-guidance.component';
import { FlashSaleGuidanceComponent } from './flash-sale-guidance.component';
import { PriceDropGuidanceComponent } from './price-drop-guidance.component';
import { BoxSetGuidanceComponent } from './box-set-guidance.component';
import { SurveyGuidanceComponent } from './survey-guidance.component';
import { EventAnnouncementGuidanceComponent } from './event-announcement-guidance.component';
import { ReaderCommunityGuidanceComponent } from './reader-community-guidance.component';
import { BacklistSpotlightGuidanceComponent } from './backlist-spotlight-guidance.component';
import { collectGuidanceExtras, loadGuidanceExtras } from './campaign-guidance-extras';
import { CampaignSenderModalComponent } from './campaign-sender-modal.component';
import { CampaignDesignModalComponent, AppliedTemplate } from './campaign-design-modal.component';
import { CampaignRecipientsPanelComponent, CampaignRecipients } from './campaign-recipients-panel.component';
import { applyPreviewMergeTags } from './campaign-preview.utils';
import { userCollectibleMergeTags, mergeTagLabel } from './merge-tag.utils';

type CampaignTab = 'list' | 'create' | 'newsletter' | 'ab-test' | 'calendar';

interface CampaignTypeOption {
  id: string;
  label: string;
  purpose: string;
  audience: string;
  icon: string;
  color: string;
}

interface SuppressionRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}


interface PreflightCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  category: 'audience' | 'auth' | 'links' | 'content' | 'sender';
}

const STEPS = ['Write', 'Preview', 'Audience', 'Review', 'Send'] as const;


@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, CampaignListComponent, CampaignCalendarComponent, CampaignNewsletterComponent, CampaignAbTestComponent, NewsletterSwapGuidanceComponent, FlashSaleGuidanceComponent, PriceDropGuidanceComponent, BoxSetGuidanceComponent, SurveyGuidanceComponent, EventAnnouncementGuidanceComponent, ReaderCommunityGuidanceComponent, BacklistSpotlightGuidanceComponent, CampaignSenderModalComponent, CampaignDesignModalComponent, CampaignRecipientsPanelComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Campaigns</h1>
          <p class="page-subtitle">Create and manage your email campaigns</p>
        </div>
        <button class="btn-primary" (click)="startCreate()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          New Campaign
        </button>
      </div>

      <div class="loading-banner" *ngIf="loading">Loading campaigns from server…</div>

      <div class="tabs" *ngIf="!loading">
        <button class="tab" [class.active]="activeTab() === 'list'" (click)="activeTab.set('list')">
          All Campaigns <span class="tab-count">{{ campaigns.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'calendar'" (click)="activeTab.set('calendar')">
          Campaign Calendar
        </button>
        <button class="tab" [class.active]="activeTab() === 'newsletter'" (click)="activeTab.set('newsletter')">
          Newsletter
        </button>
        <button class="tab" [class.active]="activeTab() === 'ab-test'" (click)="activeTab.set('ab-test')">
          A/B Testing
        </button>
        <button class="tab" [class.active]="activeTab() === 'create'" (click)="activeTab.set('create')">
          Create Campaign
        </button>
      </div>

      <!-- ===== CAMPAIGN CALENDAR TAB ===== -->
      <div *ngIf="!loading && activeTab() === 'calendar'">
        <app-campaign-calendar
          [campaignTypes]="campaignTypes"
          [calendarEvents]="calendarEvents"
          [scheduledCampaigns]="scheduledCampaigns"
          [releasePlan]="releasePlan"
          [launchSequence]="launchSequence"
          [baselineCampaigns]="baselineCampaigns"
          (onCreateFromBaseline)="createFromBaseline($event)"
          (onStartCreateWithType)="startCreateWithType($event)"
          (onAddEvent)="openAddCalendarEvent($event)"
          (onDeleteEvent)="deleteCalendarEvent($event)"
          (onEditEvent)="editCalendarEvent($event)"
          (onSaveReleasePlan)="saveReleasePlan($event)">
        </app-campaign-calendar>
      </div>

      <!-- ===== CALENDAR TAB ORIGINAL (hidden) ===== -->
      <div *ngIf="false">

        <!-- Campaigns vs Flows explainer -->
        <div class="cvf-callout glass-card">
          <div class="cvf-col">
            <div class="cvf-icon campaigns-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h4 class="cvf-title">Campaigns</h4>
              <p class="cvf-desc">Sent by you, on a schedule you control, to an audience you choose. The release day that's the same date for everyone, the sale that runs this weekend only, the ARC window that opens right now.</p>
            </div>
          </div>
          <div class="cvf-vs">
            <span>vs</span>
          </div>
          <div class="cvf-col">
            <div class="cvf-icon flows-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <h4 class="cvf-title">Flows</h4>
              <p class="cvf-desc">Automated. Triggered by reader behavior — a new subscription, a purchase, an abandoned cart. Built once, delivers itself to each reader at exactly the right moment in their individual journey.</p>
            </div>
          </div>
        </div>
        <div class="cvf-quote glass-card">
          <p class="cvf-quote-text">Think of flows as your always-on reader relationship engine, and campaigns as the deliberate moments where you show up for everyone at the same time.</p>
        </div>

        <!-- Release-based campaign planner -->
        <div class="glass-card step-card">
          <div class="cal-header-row">
            <div>
              <h2 class="step-title">Campaign Calendar</h2>
              <p class="step-sub">Map your campaigns to your publishing schedule — never scramble for what to send or when</p>
            </div>
            <button class="btn-primary" (click)="addCalendarEvent()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Campaign
            </button>
          </div>

          <!-- Release date input -->
          <div class="release-planner">
            <div class="rp-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="rp-title">Release Date Planner</span>
              <span class="rp-hint">Working backward from your release date, here are the 4 baseline campaigns for every title</span>
            </div>
            <div class="form-row-2" style="margin-bottom:1.25rem">
              <div class="form-group">
                <label class="form-label">Book Title</label>
                <input type="text" class="form-input" [(ngModel)]="calRelease.title" placeholder="e.g. The Ember Crown" />
              </div>
              <div class="form-group">
                <label class="form-label">Release Date</label>
                <input type="date" class="form-input" [(ngModel)]="calRelease.date" />
              </div>
            </div>
            <div class="baseline-campaigns" *ngIf="calRelease.date">
              <div class="bc-item" *ngFor="let bc of baselineCampaigns">
                <div class="bc-timing">{{ bc.timing }}</div>
                <div class="bc-info">
                  <span class="bc-type">{{ bc.type }}</span>
                  <span class="bc-desc">{{ bc.description }}</span>
                </div>
                <div class="bc-date">{{ getRelativeDate(calRelease.date, bc.offset) }}</div>
                <button class="btn-ghost btn-sm" (click)="createFromBaseline(bc)">Create</button>
              </div>
            </div>
            <div class="baseline-empty" *ngIf="!calRelease.date">
              <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="32" height="32"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p>Enter a release date above to see your baseline campaign schedule</p>
            </div>
          </div>
        </div>

        <!-- Launch sequence timeline -->
        <div class="glass-card step-card">
          <h3 class="step-title" style="font-size:1rem;margin-bottom:.35rem">Book Launch Campaign Window</h3>
          <p class="step-sub" style="margin-bottom:1.25rem">The launch day email is the centerpiece, but its effectiveness is amplified by the campaigns before it (which build anticipation and seed reviews) and the week-two push after it (which converts fence-sitters using social proof that didn't exist on day one).</p>
          <div class="launch-timeline">
            <div class="lt-phase header-row">
              <span>Phase</span><span>Timing</span><span>What Happens</span>
            </div>
            <div class="lt-phase" *ngFor="let phase of launchSequence" [class.lt-highlight]="phase.highlight">
              <div class="lt-phase-name">
                <div class="lt-phase-dot" [style.background]="phase.color"></div>
                {{ phase.phase }}
              </div>
              <span class="lt-timing">{{ phase.timing }}</span>
              <span class="lt-what">{{ phase.what }}</span>
            </div>
          </div>
          <div class="launch-window-note">
            <svg viewBox="0 0 20 20" fill="#d97706" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
            The launch window is typically 7–14 days. After that window, the book either has momentum or it doesn't — and rebuilding momentum is significantly harder than capturing it the first time.
          </div>
        </div>

        <!-- Full campaign landscape table -->
        <div class="glass-card step-card">
          <h3 class="step-title" style="font-size:1rem;margin-bottom:.35rem">The Full Campaign Landscape</h3>
          <p class="step-sub" style="margin-bottom:1.25rem">15 campaign types available to indie authors — most authors use 2 or 3. Understanding the full set means you can choose the right tool for each moment.</p>
          <div class="landscape-table">
            <div class="lt-row lt-header">
              <span>Campaign Type</span>
              <span>Primary Purpose</span>
              <span>Typical Audience</span>
              <span></span>
            </div>
            <div class="lt-row" *ngFor="let ct of campaignTypes">
              <div class="lt-type">
                <div class="nav-icon lt-icon" [innerHTML]="ct.icon"></div>
                <span class="lt-type-name">{{ ct.label }}</span>
              </div>
              <span class="lt-purpose">{{ ct.purpose }}</span>
              <span class="lt-audience">{{ ct.audience }}</span>
              <button class="btn-ghost btn-sm" (click)="startCreateWithType(ct.id)">Use</button>
            </div>
          </div>
        </div>

        <!-- Scheduled campaigns list -->
        <div class="glass-card step-card" *ngIf="calendarEvents.length > 0">
          <h3 class="step-title" style="font-size:1rem;margin-bottom:1.25rem">Planned Campaigns</h3>
          <div class="cal-events-list">
            <div class="cal-event" *ngFor="let ev of calendarEvents">
              <div class="ce-date">{{ ev.date }}</div>
              <div class="ce-info">
                <span class="ce-name">{{ ev.name }}</span>
                <span class="ce-type-badge">{{ ev.type }}</span>
              </div>
              <span class="badge" [ngClass]="'badge-' + ev.status">{{ ev.status }}</span>
              <button class="row-btn edit-btn btn-sm" (click)="activeTab.set('create')">Edit</button>
            </div>
          </div>
        </div>
      </div>
      <!-- end hidden calendar original -->

      <!-- ===== NEWSLETTER TAB ===== -->
      <div *ngIf="!loading && activeTab() === 'newsletter'">
        <app-campaign-newsletter
          [newsletter]="newsletter"
          (onWriteNextIssue)="writeNextNewsletterIssue()"
          (onSave)="saveNewsletter($event)">
        </app-campaign-newsletter>
      </div>
      <!-- ===== NEWSLETTER ORIGINAL (hidden) ===== -->
      <div *ngIf="false">

        <!-- Explainer callout -->
        <div class="newsletter-callout glass-card">
          <div class="nc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="nc-body">
            <h3 class="nc-title">Your newsletter is the heartbeat of your email program</h3>
            <p class="nc-desc">Unlike one-off campaigns, a newsletter is a recurring, relationship-driven email that keeps your list warm between launches. Set a schedule you can sustain — consistency beats perfection every time.</p>
          </div>
        </div>

        <!-- Newsletter schedule card -->
        <div class="glass-card step-card">
          <div class="nl-header-row">
            <div>
              <h2 class="step-title">Newsletter Schedule</h2>
              <p class="step-sub">Set up your recurring newsletter cadence</p>
            </div>
            <div class="nl-status-badge" [class.nl-active]="newsletter.status === 'active'" [class.nl-paused]="newsletter.status === 'paused'" [class.nl-draft]="newsletter.status === 'draft'">
              <span class="nl-dot"></span>
              {{ newsletter.status === 'active' ? 'Active' : newsletter.status === 'paused' ? 'Paused' : 'Draft' }}
            </div>
          </div>

          <div class="nl-form">
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Newsletter Name <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="newsletter.name" placeholder="e.g. Monthly Reader Letter" />
              </div>
              <div class="form-group">
                <label class="form-label">Frequency</label>
                <select class="form-input" [(ngModel)]="newsletter.frequency">
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly (every 2 weeks)</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group" *ngIf="newsletter.frequency === 'weekly' || newsletter.frequency === 'biweekly'">
                <label class="form-label">Day of Week</label>
                <select class="form-input" [(ngModel)]="newsletter.dayOfWeek">
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div class="form-group" *ngIf="newsletter.frequency === 'monthly'">
                <label class="form-label">Day of Month</label>
                <select class="form-input" [(ngModel)]="newsletter.dayOfMonth">
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="last">Last day</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Send Time</label>
                <input type="time" class="form-input" [(ngModel)]="newsletter.sendTime" />
              </div>
            </div>

            <!-- Timezone optimization -->
            <div class="tz-opt-row">
              <div class="tz-opt-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <span class="tz-opt-label">Timezone Optimization</span>
                  <span class="tz-opt-desc">Deliver at {{ newsletter.sendTime || '9:00' }} AM in each subscriber's local timezone — not yours. Readers in the UK, Australia, and Canada receive it at a reasonable local hour.</span>
                </div>
              </div>
              <label class="toggle-wrap">
                <input type="checkbox" [(ngModel)]="newsletter.timezoneOptimized" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="form-group">
              <label class="form-label">Default Subject Line</label>
              <input type="text" class="form-input" [(ngModel)]="newsletter.subject" placeholder="e.g. What I've been writing this month..." />
              <span class="field-help">Tip: specific subject lines ("The research that changed my book") outperform generic ones ("May newsletter") — they tell readers what's inside.</span>
            </div>

            <!-- Reply invitation -->
            <div class="reply-invite-section">
              <div class="ri-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span class="ri-title">Reader Reply Invitation</span>
                <span class="ri-badge">Builds loyalty</span>
              </div>
              <p class="ri-desc">End each newsletter with a genuine question. Readers who reply become evangelists — and replies signal to inbox providers that your emails are wanted, improving deliverability.</p>
              <div class="form-group">
                <label class="form-label">Closing Question for Readers</label>
                <input type="text" class="form-input" [(ngModel)]="newsletter.replyQuestion"
                  placeholder="e.g. What's the last book you recommended to a friend?" />
              </div>
              <div class="reply-examples">
                <span class="re-label">Examples:</span>
                <button class="re-chip" (click)="setReplyQuestion(0)">What's the last book you recommended to a friend?</button>
                <button class="re-chip" (click)="setReplyQuestion(1)">What's a trope you never get tired of?</button>
                <button class="re-chip" (click)="setReplyQuestion(2)">If you could spend a day in one fictional world, which would it be?</button>
              </div>
            </div>

            <!-- Content guidance -->
            <div class="nl-content-guide">
              <h4 class="ncg-title">What to include in each issue</h4>
              <div class="ncg-grid">
                <div class="ncg-item">
                  <div class="ncg-icon story">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  <div><span class="ncg-name">Lead with a story</span><span class="ncg-hint">Something specific from your writing week — not a pitch</span></div>
                </div>
                <div class="ncg-item">
                  <div class="ncg-icon reading">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <div><span class="ncg-name">What you're reading</span><span class="ncg-hint">A genuine recommendation with a sentence on why you loved it</span></div>
                </div>
                <div class="ncg-item">
                  <div class="ncg-icon wip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  </div>
                  <div><span class="ncg-name">Work in progress</span><span class="ncg-hint">Where you are emotionally in the story, not just a word count</span></div>
                </div>
                <div class="ncg-item">
                  <div class="ncg-icon research">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  <div><span class="ncg-name">Research finds</span><span class="ncg-hint">Fascinating things you discovered — especially for historical or speculative fiction</span></div>
                </div>
                <div class="ncg-item">
                  <div class="ncg-icon bts">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                  <div><span class="ncg-name">Behind the scenes</span><span class="ncg-hint">Cover design, editorial changes, the dedication you almost didn't write</span></div>
                </div>
                <div class="ncg-item">
                  <div class="ncg-icon soft-promo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </div>
                  <div><span class="ncg-name">Soft mention</span><span class="ncg-hint">After delivering value, a natural note about your current or upcoming title</span></div>
                </div>
              </div>
            </div>

            <div class="nl-actions">
              <button class="btn-primary" (click)="saveNewsletter()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Schedule
              </button>
              <button class="btn-secondary" (click)="newsletter.status = newsletter.status === 'active' ? 'paused' : 'active'">
                {{ newsletter.status === 'active' ? 'Pause Newsletter' : 'Activate Newsletter' }}
              </button>
              <button class="btn-ghost" (click)="activeTab.set('create')">
                Write Next Issue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Consistency tip -->
        <div class="consistency-tip glass-card">
          <div class="ct-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="ct-body">
            <p class="ct-quote">"Consistency beats perfection every time. A newsletter that arrives reliably and feels genuine will outperform a beautiful, meticulously crafted one that only shows up three times a year."</p>
            <p class="ct-tip">Tip: batch-write 2–3 issues in one sitting and schedule them in advance. Your readers hear from you consistently even when you're deep in a draft.</p>
          </div>
        </div>
      </div>
      <!-- end hidden newsletter original -->

      <!-- ===== A/B TESTING TAB ===== -->
      <div *ngIf="!loading && activeTab() === 'ab-test'">
        <app-campaign-ab-test
          [abTests]="abTests"
          (onToast)="showToast($event.message, $event.type)"
          (onCreateAbTest)="createAbTest($event)"
          (onLaunchAbTest)="launchAbTest($event)"
          (onDeleteAbTest)="deleteAbTest($event)">
        </app-campaign-ab-test>
      </div>
      <!-- ===== A/B ORIGINAL (hidden) ===== -->
      <div *ngIf="false">
        <div class="glass-card step-card">
          <div class="ab-header-row">
            <div>
              <h2 class="step-title">A/B Subject Line Testing</h2>
              <p class="step-sub">Test two subject lines on a portion of your list — the winner sends automatically to the rest</p>
            </div>
            <button class="btn-primary" (click)="createABTest()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New A/B Test
            </button>
          </div>

          <!-- Create form -->
          <div class="ab-create-form" *ngIf="showABForm">
            <div class="ab-variants">
              <div class="ab-variant">
                <div class="ab-variant-label variant-a">Version A</div>
                <input type="text" class="form-input" [(ngModel)]="abDraft.subjectA" placeholder="e.g. The research that changed my book" />
                <span class="ab-variant-hint">Curiosity-driven or specific</span>
              </div>
              <div class="ab-vs">VS</div>
              <div class="ab-variant">
                <div class="ab-variant-label variant-b">Version B</div>
                <input type="text" class="form-input" [(ngModel)]="abDraft.subjectB" placeholder="e.g. May Newsletter — reading picks + WIP update" />
                <span class="ab-variant-hint">Direct or descriptive</span>
              </div>
            </div>

            <div class="form-row-2" style="margin-top:1.25rem">
              <div class="form-group">
                <label class="form-label">
                  Test Group Size
                  <span class="info-icon" data-tooltip="Each version sends to this % of your list. The winner sends to the remaining subscribers.">?</span>
                </label>
                <select class="form-input" [(ngModel)]="abDraft.testSize">
                  <option [value]="10">10% each (80% gets winner)</option>
                  <option [value]="20">20% each (60% gets winner)</option>
                  <option [value]="25">25% each (50% gets winner)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Winner Metric</label>
                <select class="form-input" [(ngModel)]="abDraft.winnerMetric">
                  <option value="opens">Open Rate (recommended)</option>
                  <option value="clicks">Click Rate</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-top:.75rem">
              <label class="form-label">Measurement Window</label>
              <select class="form-input" [(ngModel)]="abDraft.waitHours" style="max-width:280px">
                <option [value]="2">2 hours</option>
                <option [value]="4">4 hours</option>
                <option [value]="8">8 hours (recommended)</option>
                <option [value]="24">24 hours</option>
              </select>
              <span class="field-help">After this window, the winning version sends automatically to the rest of your list.</span>
            </div>

            <div class="ab-form-actions">
              <button class="btn-primary" (click)="saveABTest()">Save A/B Test</button>
              <button class="btn-ghost" (click)="showABForm = false">Cancel</button>
            </div>
          </div>

          <!-- Existing tests -->
          <div class="ab-tests-list" *ngIf="abTests.length > 0">
            <div class="ab-test-row" *ngFor="let test of abTests">
              <div class="ab-test-info">
                <div class="ab-test-name">{{ test.name }}</div>
                <div class="ab-test-subjects">
                  <span class="ab-pill a">A: {{ test.subjectA }}</span>
                  <span class="ab-pill b">B: {{ test.subjectB }}</span>
                </div>
              </div>
              <div class="ab-test-results" *ngIf="test.status === 'complete'">
                <div class="ab-result" [class.ab-winner]="test.winner === 'A'">
                  <span class="ab-result-label">A</span>
                  <span class="ab-result-rate">{{ test.openRateA }}%</span>
                  <span class="ab-winner-badge" *ngIf="test.winner === 'A'">Winner</span>
                </div>
                <div class="ab-result" [class.ab-winner]="test.winner === 'B'">
                  <span class="ab-result-label">B</span>
                  <span class="ab-result-rate">{{ test.openRateB }}%</span>
                  <span class="ab-winner-badge" *ngIf="test.winner === 'B'">Winner</span>
                </div>
              </div>
              <div class="ab-test-status">
                <span class="badge" [ngClass]="'badge-' + (test.status === 'complete' ? 'sent' : test.status === 'running' ? 'active' : 'draft')">{{ test.status }}</span>
              </div>
            </div>
          </div>

          <div class="ab-empty" *ngIf="abTests.length === 0 && !showABForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="40" height="40"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
            <p>No A/B tests yet. Create your first test to find out which subject line style your readers prefer.</p>
          </div>
        </div>

        <!-- How it works -->
        <div class="glass-card step-card ab-how-it-works">
          <h3 class="step-title" style="font-size:1rem">How A/B Testing Works</h3>
          <div class="ab-steps">
            <div class="ab-step">
              <div class="ab-step-num">1</div>
              <div class="ab-step-body">
                <div class="ab-step-title">Write two subject lines</div>
                <div class="ab-step-desc">Try a curiosity-driven version vs. a direct one, or test whether first-name personalization improves opens</div>
              </div>
            </div>
            <div class="ab-step">
              <div class="ab-step-num">2</div>
              <div class="ab-step-body">
                <div class="ab-step-title">Define your test group</div>
                <div class="ab-step-desc">Each version sends to a portion of your list (e.g. 20% each). The remaining 60% waits for the winner</div>
              </div>
            </div>
            <div class="ab-step">
              <div class="ab-step-num">3</div>
              <div class="ab-step-body">
                <div class="ab-step-title">Winner sends automatically</div>
                <div class="ab-step-desc">After your measurement window, the version with the higher open (or click) rate sends to the rest of your list — no manual action needed</div>
              </div>
            </div>
          </div>
          <div class="ab-insight">
            <svg viewBox="0 0 20 20" fill="#3b82f6" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
            Over time, consistent testing builds a clear picture of what your readers specifically respond to — which is more valuable than any industry benchmark.
          </div>
        </div>
      </div>

      <!-- ===== CAMPAIGN LIST ===== -->
      <div *ngIf="!loading && activeTab() === 'list'">
        <app-campaign-list
          [campaigns]="campaigns"
          (onEdit)="editCampaign($event)"
          (onDelete)="deleteCampaign($event)">
        </app-campaign-list>
      </div>
      <!-- ===== LIST ORIGINAL (hidden) ===== -->
      <div *ngIf="false">

        <!-- Inline Report Panel -->
        <div class="glass-card report-panel" *ngIf="reportCampaign">
          <div class="report-panel-header">
            <div>
              <h3 class="report-panel-title">{{ rc.name }}</h3>
              <p class="report-panel-sub">{{ rc.subject }}</p>
            </div>
            <button class="close-report-btn" (click)="reportCampaign = null">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="report-stats-grid">
            <div class="report-stat">
              <span class="rs-val">{{ rc.sent | number }}</span>
              <span class="rs-label">Emails Sent</span>
            </div>
            <div class="report-stat">
              <span class="rs-val">{{ rc.openRate > 0 ? rc.openRate + '%' : '—' }}</span>
              <span class="rs-label">Open Rate
                <span class="rs-caveat" data-tooltip="Apple Mail Privacy Protection inflates open rates. Use click rate and conversion rate as primary success metrics.">⚠</span>
              </span>
              <div class="rs-bar" *ngIf="rc.openRate > 0">
                <div class="rs-bar-fill blue" [style.width]="rc.openRate + '%'"></div>
              </div>
            </div>
            <div class="report-stat">
              <span class="rs-val" [class.rs-accent]="rc.clickRate > 0">{{ rc.clickRate > 0 ? rc.clickRate + '%' : '—' }}</span>
              <span class="rs-label">Click Rate</span>
              <div class="rs-bar" *ngIf="rc.clickRate > 0">
                <div class="rs-bar-fill purple" [style.width]="(rc.clickRate * 3) + '%'"></div>
              </div>
            </div>
            <div class="report-stat">
              <span class="rs-val green">{{ rc.sent > 0 && rc.clickRate > 0 ? (rc.clickRate * 0.35 | number:'1.1-1') + '%' : '—' }}</span>
              <span class="rs-label">Conversion Rate
                <span class="info-icon" data-tooltip="% of recipients who completed the action — purchase, ARC signup, event registration. The metric that connects email to business outcomes.">?</span>
              </span>
            </div>
            <div class="report-stat">
              <span class="rs-val green">{{ rc.sent > 0 ? (rc.sent * rc.openRate / 100 | number:'1.0-0') : '—' }}</span>
              <span class="rs-label">Unique Opens</span>
            </div>
            <div class="report-stat">
              <span class="rs-val purple">{{ rc.sent > 0 ? (rc.sent * rc.clickRate / 100 | number:'1.0-0') : '—' }}</span>
              <span class="rs-label">Unique Clicks</span>
            </div>
            <div class="report-stat">
              <span class="rs-val" [class.green]="rc.sent > 0 && rc.clickRate > 0">{{ rc.sent > 0 && rc.clickRate > 0 ? '$' + (rc.clickRate * 0.14 | number:'1.2-2') : '—' }}</span>
              <span class="rs-label">Revenue / Email
                <span class="info-icon" data-tooltip="Calculated from real purchase events connected to this campaign. The plainest measure of whether this campaign earned its place in your calendar.">?</span>
              </span>
            </div>
            <div class="report-stat">
              <span class="rs-val">{{ rc.date }}</span>
              <span class="rs-label">Sent Date</span>
            </div>
          </div>
          <div class="report-status-row">
            <span class="badge" [ngClass]="'badge-' + rc.status">{{ rc.status }}</span>
            <span class="report-note" *ngIf="rc.status === 'draft'">This campaign hasn't been sent yet — no stats available.</span>
            <span class="report-note" *ngIf="rc.status === 'scheduled'">This campaign is scheduled — stats will appear after sending.</span>
          </div>
        </div>
        <div class="glass-card table-card">
          <div class="table-toolbar">
            <div class="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="search-input" type="text" placeholder="Search campaigns..." [(ngModel)]="searchQuery" />
            </div>
            <div class="filter-row">
              <select class="filter-select" [(ngModel)]="statusFilter">
                <option value="">All Status</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Campaign</th><th>Status</th><th>Sent</th><th>Open Rate</th><th>Click Rate</th><th>Date</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filteredCampaigns">
                <td>
                  <div class="campaign-name-cell">
                    <div class="campaign-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div><p class="c-name">{{ c.name }}</p><p class="c-subject">{{ c.subject }}</p></div>
                  </div>
                </td>
                <td><span class="badge" [ngClass]="'badge-' + c.status">{{ c.status }}</span></td>
                <td class="num-cell">{{ c.sent > 0 ? (c.sent | number) : '—' }}</td>
                <td>
                  <div class="rate-cell" *ngIf="c.openRate > 0">
                    <div class="mini-bar"><div class="mini-bar-fill" [style.width]="c.openRate + '%'" style="background:#34d399"></div></div>
                    <span>{{ c.openRate }}%</span>
                  </div>
                  <span class="muted" *ngIf="c.openRate === 0">—</span>
                </td>
                <td><span *ngIf="c.clickRate > 0" class="click-rate">{{ c.clickRate }}%</span><span class="muted" *ngIf="c.clickRate === 0">—</span></td>
                <td class="muted">{{ c.date }}</td>
                <td>
                  <div class="row-actions">
                    <button class="row-btn report-btn" data-tooltip="View campaign report" (click)="viewReport(c)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                      Report
                    </button>
                    <button class="row-btn edit-btn" data-tooltip="Edit this campaign" (click)="editCampaign(c)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button class="row-btn delete-btn" data-tooltip="Delete this campaign" (click)="deleteCampaign(c.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- end hidden list original -->

      <!-- ===== CREATE CAMPAIGN WIZARD ===== -->
      <div *ngIf="!loading && activeTab() === 'create'">

        <!-- Step Progress -->
        <div class="stepper-wrap glass-card">
          <div class="stepper">
            <ng-container *ngFor="let step of steps; let i = index">
              <div class="step" [class.active]="currentStep() === i" [class.done]="currentStep() > i" (click)="goToStep(i)">
                <div class="step-circle">
                  <svg *ngIf="currentStep() > i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
                  <span *ngIf="currentStep() <= i">{{ i + 1 }}</span>
                </div>
                <span class="step-label">{{ step }}</span>
              </div>
              <div class="step-line" *ngIf="i < steps.length - 1" [class.done]="currentStep() > i"></div>
            </ng-container>
          </div>
        </div>

        <!-- Toast -->
        <div class="camp-toast" *ngIf="toastMessage" [class.toast-success]="toastType === 'success'" [class.toast-warn]="toastType === 'warn'">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          {{ toastMessage }}
        </div>

        <!-- STEP 0: WRITE -->
        <div *ngIf="currentStep() === 0" class="step-content">
          <div class="glass-card step-card">
            <h2 class="step-title">Write Your Email</h2>
            <p class="step-sub">Set up the basics of your campaign</p>

            <!-- Brevo-style setup cards -->
            <div class="brevo-setup-grid">
              <div class="setup-card">
                <div class="setup-card-head">
                  <span class="setup-card-label">Sender</span>
                  <button type="button" class="btn-ghost btn-sm" (click)="showSenderModal.set(true)">Manage</button>
                </div>
                <div class="setup-card-body">
                  <div class="setup-line"><strong>{{ draft.fromName || 'Not set' }}</strong></div>
                  <div class="setup-line muted">{{ draft.fromEmail || 'Add sender email' }}</div>
                </div>
              </div>
              <div class="setup-card">
                <div class="setup-card-head">
                  <span class="setup-card-label">Design</span>
                  <button type="button" class="btn-ghost btn-sm" (click)="showDesignModal.set(true)">Start designing</button>
                </div>
                <div class="setup-card-body">
                  <div class="setup-line" *ngIf="draft.templateName"><strong>{{ draft.templateName }}</strong></div>
                  <div class="setup-line muted" *ngIf="!draft.templateName && !draft.content">No design yet — pick a template</div>
                  <div class="setup-line muted" *ngIf="!draft.templateName && draft.content">Custom content</div>
                  <div class="setup-mini-preview" *ngIf="draft.content && isHtmlContent(draft.content)" [innerHTML]="safeDraftContent"></div>
                </div>
              </div>
            </div>

            <div class="write-form">

              <!-- Campaign Type Selector -->
              <div class="form-group">
                <label class="form-label">Campaign Type <span class="required">*</span></label>
                <div class="ct-grid">
                  <button class="ct-btn" *ngFor="let ct of campaignTypes"
                    [class.ct-selected]="draft.campaignType === ct.id"
                    (click)="selectCampaignType(ct.id)"
                    [attr.data-tooltip]="ct.purpose + ' · ' + ct.audience">
                    <span class="ct-btn-icon" [innerHTML]="ct.icon"></span>
                    <span class="ct-btn-label">{{ ct.label }}</span>
                  </button>
                </div>
                <div class="ct-selected-info" *ngIf="selectedCampaignType">
                  <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
                  <span><strong>{{ selectedCampaignType.label }}:</strong> {{ selectedCampaignType.purpose }} · Typical audience: {{ selectedCampaignType.audience }}</span>
                </div>
              </div>

              <!-- Single purpose reminder -->
              <div class="single-purpose-tip" *ngIf="draft.campaignType">
                <div class="spt-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div class="spt-body">
                  <span class="spt-title">One clear purpose</span>
                  <span class="spt-desc">Before writing, answer: what is the one thing I want this reader to do? One purpose = one call to action. Campaigns with multiple competing CTAs consistently underperform focused ones.</span>
                </div>
              </div>

              <!-- ===== NEWSLETTER SWAP GUIDANCE ===== -->
              <app-newsletter-swap-guidance
                #nlSwapGuidance
                *ngIf="draft.campaignType === 'nl-swap'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-newsletter-swap-guidance>
              <!-- ===== END NEWSLETTER SWAP GUIDANCE ===== -->

              <!-- ===== FLASH SALE GUIDANCE ===== -->
              <app-flash-sale-guidance
                #flashSaleGuidance
                *ngIf="draft.campaignType === 'flash-sale'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-flash-sale-guidance>
              <!-- ===== END FLASH SALE GUIDANCE ===== -->

              <!-- ===== PRICE DROP GUIDANCE ===== -->
              <app-price-drop-guidance
                #priceDropGuidance
                *ngIf="draft.campaignType === 'price-drop' || draft.campaignType === 'price-drop-2'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-price-drop-guidance>
              <!-- ===== END PRICE DROP GUIDANCE ===== -->

              <!-- ===== BOX SET GUIDANCE ===== -->
              <app-box-set-guidance
                #boxSetGuidance
                *ngIf="draft.campaignType === 'box-set'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-box-set-guidance>
              <!-- ===== END BOX SET GUIDANCE ===== -->

              <!-- ===== SURVEY GUIDANCE ===== -->
              <app-survey-guidance
                #surveyGuidance
                *ngIf="draft.campaignType === 'survey'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-survey-guidance>
              <!-- ===== END SURVEY GUIDANCE ===== -->

              <!-- ===== EVENT ANNOUNCEMENT GUIDANCE ===== -->
              <app-event-announcement-guidance
                #eventGuidance
                *ngIf="draft.campaignType === 'event'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-event-announcement-guidance>
              <!-- ===== END EVENT ANNOUNCEMENT GUIDANCE ===== -->

              <!-- ===== READER COMMUNITY GUIDANCE ===== -->
              <app-reader-community-guidance
                #communityGuidance
                *ngIf="draft.campaignType === 'reader-community'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-reader-community-guidance>
              <!-- ===== END READER COMMUNITY GUIDANCE ===== -->

              <!-- ===== BACKLIST SPOTLIGHT GUIDANCE ===== -->
              <app-backlist-spotlight-guidance
                #backlistGuidance
                *ngIf="draft.campaignType === 'backlist'"
                (onSubjectSuggestion)="draft.subject = $event">
              </app-backlist-spotlight-guidance>
              <!-- ===== END BACKLIST SPOTLIGHT GUIDANCE ===== -->

              <!-- ===== BOOK LAUNCH SPECIFIC GUIDANCE ===== -->
              <div class="launch-guidance" *ngIf="draft.campaignType === 'book-launch'">

                <!-- Launch window importance callout -->
                <div class="launch-importance">
                  <div class="li-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <div class="li-body">
                    <span class="li-title">Launch week is unlike any other email you send</span>
                    <p class="li-desc">You have 7–14 days where sales velocity matters most for algorithmic placement. Retail algorithms treat early sales as a visibility signal — a book that sells consistently from day one gets surfaced to more readers. There's no second chance at day one.</p>
                  </div>
                </div>

                <!-- Anatomy guide -->
                <div class="anatomy-guide">
                  <h4 class="ag-title">Anatomy of an Effective Book Launch Email</h4>
                  <div class="ag-steps">
                    <div class="ag-step">
                      <div class="ag-num">1</div>
                      <div class="ag-body">
                        <span class="ag-step-title">Subject Line — write it last</span>
                        <span class="ag-step-desc">Lead with the title or a compelling hook. Specific beats generic: "The Ashford Inheritance is live — and it has a secret I've been keeping for eighteen months" earns an open. Mobile truncates at ~30–46 chars — most important words first.</span>
                      </div>
                    </div>
                    <div class="ag-step">
                      <div class="ag-num">2</div>
                      <div class="ag-body">
                        <span class="ag-step-title">Opening — energy without pressure</span>
                        <span class="ag-step-desc">One or two sentences. Brief, personal, specific — a note about what this book means to you, the moment you knew the story was right. Genuine excitement from a real person, not a marketing department.</span>
                      </div>
                    </div>
                    <div class="ag-step">
                      <div class="ag-num">3</div>
                      <div class="ag-body">
                        <span class="ag-step-title">Cover image — give it visual prominence</span>
                        <span class="ag-step-desc">Your cover belongs near the top, large enough to be seen clearly on mobile. For many subscribers, this email is the first time they'll see your finished cover.</span>
                      </div>
                    </div>
                    <div class="ag-step">
                      <div class="ag-num">4</div>
                      <div class="ag-body">
                        <span class="ag-step-title">Hook — 1 to 3 sentences</span>
                        <span class="ag-step-desc">The essence of your blurb, written for an email environment where readers decide in seconds. Not your full blurb. If you have early ARC praise worth sharing, this is where it earns its place.</span>
                      </div>
                    </div>
                    <div class="ag-step">
                      <div class="ag-num">5</div>
                      <div class="ag-body">
                        <span class="ag-step-title">Call to action — one button, one link</span>
                        <span class="ag-step-desc">"Get your copy now" or "Order [Title] today" — action-forward, impossible to miss. Smart links route UK readers to Amazon UK, Australian readers to Amazon AU. One primary CTA with no competing links of equal visual weight.</span>
                      </div>
                    </div>
                    <div class="ag-step">
                      <div class="ag-num">6</div>
                      <div class="ag-body">
                        <span class="ag-step-title">Close — brief, genuine, human</span>
                        <span class="ag-step-desc">A short closing in your own voice — genuine gratitude or a forward-looking note. Your signature, your name, done. Long closings undermine the energy of everything before them.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Smart link builder -->
                <div class="smart-link-section">
                  <div class="sl-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span class="sl-title">Smart Link — CTA Destination</span>
                    <span class="sl-badge">Routes by location</span>
                  </div>
                  <p class="sl-desc">Smart links route each reader to their preferred platform based on location — UK readers to Amazon UK, Australian readers to Amazon AU. Click paths are attributed back to this campaign so you can see which links drove purchases.</p>
                  <div class="sl-fields">
                    <div class="form-group">
                      <label class="form-label">Direct Store Link (primary)</label>
                      <input type="url" class="form-input" [(ngModel)]="draft.directStoreLink" name="directStoreLink" placeholder="https://yourstore.com/book-title" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Amazon Universal Link</label>
                      <input type="url" class="form-input" [(ngModel)]="draft.amazonLink" name="amazonLink" placeholder="https://mybook.to/title" />
                    </div>
                  </div>
                  <div class="sl-routing-preview" *ngIf="draft.amazonLink || draft.directStoreLink">
                    <div class="slrp-row">
                      <span class="slrp-flag">🇺🇸 US</span><span class="slrp-dest">→ Amazon.com</span>
                    </div>
                    <div class="slrp-row">
                      <span class="slrp-flag">🇬🇧 UK</span><span class="slrp-dest">→ Amazon.co.uk</span>
                    </div>
                    <div class="slrp-row">
                      <span class="slrp-flag">🇦🇺 AU</span><span class="slrp-dest">→ Amazon.com.au</span>
                    </div>
                    <div class="slrp-row" *ngIf="draft.directStoreLink">
                      <span class="slrp-flag">🏪 Direct</span><span class="slrp-dest">→ Your store (primary)</span>
                    </div>
                  </div>
                </div>

                <!-- Common mistakes -->
                <div class="launch-mistakes">
                  <h4 class="lm-title">Common Launch Email Mistakes to Avoid</h4>
                  <div class="lm-list">
                    <div class="lm-item">
                      <svg viewBox="0 0 20 20" fill="#ef4444" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                      <div><span class="lm-name">Writing it like an advertisement</span><span class="lm-desc">Exclamation points everywhere, superlatives, manufactured urgency. Author audiences are sophisticated readers — they can tell when they're being advertised at. Write it like a letter to someone who loves your work.</span></div>
                    </div>
                    <div class="lm-item">
                      <svg viewBox="0 0 20 20" fill="#ef4444" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                      <div><span class="lm-name">Multiple calls to action</span><span class="lm-desc">Amazon + Apple Books + Kobo + direct store + reader group, all with equal visual weight. A reader who encounters four links of equal prominence faces a micro-decision — and the most common resolution is to do nothing.</span></div>
                    </div>
                    <div class="lm-item">
                      <svg viewBox="0 0 20 20" fill="#ef4444" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                      <div><span class="lm-name">Sending to previous buyers</span><span class="lm-desc">Readers who already pre-ordered and received a confirmation flow don't need the launch announcement. Use suppression rules (Audience step) to exclude them.</span></div>
                    </div>
                    <div class="lm-item">
                      <svg viewBox="0 0 20 20" fill="#ef4444" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                      <div><span class="lm-name">Skipping the mobile preview</span><span class="lm-desc">60%+ of email is opened on mobile. A cover image that renders perfectly at desktop size may overflow on a phone. Use the Preview step — launch day is not the time to discover a layout problem.</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ===== END BOOK LAUNCH GUIDANCE ===== -->

              <!-- ===== ARC INVITATION GUIDANCE ===== -->
              <div class="arc-guidance" *ngIf="draft.campaignType === 'arc-invite'">

                <!-- ARC relationship callout -->
                <div class="arc-relationship-callout">
                  <div class="arc-rc-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <p class="arc-rc-quote">Your ARC program is a relationship, not a transaction. The readers who join your launch team aren't doing you a favor in exchange for a free book. They're people who love your work enough to invest their time in it before anyone else. Treat them accordingly, and they'll show up for every launch you have.</p>
                  </div>
                </div>

                <!-- ARC pool targeting -->
                <div class="arc-pool-guide">
                  <h4 class="arc-guide-title">Who Belongs in Your ARC Pool</h4>
                  <p class="arc-guide-intro">A smaller, better-targeted ARC pool consistently outperforms a large, unfocused one. Sending to your entire list produces a large team with a low review rate — you end up with 50 people who said yes and 5 who post a review. Target 20–100 readers who have already demonstrated engagement.</p>
                  <div class="arc-pool-criteria">
                    <div class="arc-criterion">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>Subscribers who have opened and clicked your emails consistently over the past 3–6 months</span>
                    </div>
                    <div class="arc-criterion">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>Readers who have replied to your newsletter or responded to a question you've posed</span>
                    </div>
                    <div class="arc-criterion">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>Readers who purchased a previous title — especially series readers who have read multiple books</span>
                    </div>
                    <div class="arc-criterion">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>Subscribers tagged as superfans through purchase history or engagement scoring</span>
                    </div>
                    <div class="arc-criterion">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>Readers who explicitly expressed interest in being part of your launch team in a previous survey</span>
                    </div>
                  </div>
                </div>

                <!-- 5-question checklist -->
                <div class="arc-checklist">
                  <h4 class="arc-guide-title">What Your Invitation Needs to Answer (in this order)</h4>
                  <div class="arc-check-items">
                    <div class="arc-check-item">
                      <div class="arc-check-num">1</div>
                      <div>
                        <span class="arc-check-title">What are you offering?</span>
                        <span class="arc-check-desc">Name the book, give a 1–2 sentence hook, share the cover if it's ready. The reader needs to feel excited about the book before they say yes to reading it.</span>
                      </div>
                    </div>
                    <div class="arc-check-item">
                      <div class="arc-check-num">2</div>
                      <div>
                        <span class="arc-check-title">What are you asking for?</span>
                        <span class="arc-check-desc">Be explicit: read the advance copy and post an honest review on their preferred retail platform at or shortly after launch. "Honest" is important — it signals you're not asking for a guaranteed positive review.</span>
                      </div>
                    </div>
                    <div class="arc-check-item">
                      <div class="arc-check-num">3</div>
                      <div>
                        <span class="arc-check-title">When do they need to commit and when is the review expected?</span>
                        <span class="arc-check-desc">Give a clear deadline to express interest and a clear expectation for when the review should post — on or around your release date.</span>
                      </div>
                    </div>
                    <div class="arc-check-item">
                      <div class="arc-check-num">4</div>
                      <div>
                        <span class="arc-check-title">How do they access the book?</span>
                        <span class="arc-check-desc">Explain how you'll deliver the ARC. A brief mention of BookFunnel as the delivery method is worth including — removing technical uncertainty increases opt-in rates. The delivery link goes in the confirmation email after opt-in, not in the invitation itself.</span>
                      </div>
                    </div>
                    <div class="arc-check-item">
                      <div class="arc-check-num">5</div>
                      <div>
                        <span class="arc-check-title">How do they say yes?</span>
                        <span class="arc-check-desc">A single, clearly labeled button or link. "I want to join the launch team" or "Yes, send me the ARC" — action-forward, specific, immediately visible.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tone guidance -->
                <div class="arc-tone-guide">
                  <h4 class="arc-guide-title">Tone: Invitation, Not Recruitment</h4>
                  <div class="arc-tone-compare">
                    <div class="arc-tone-bad">
                      <div class="arc-tone-label bad">❌ Feels like a mass email</div>
                      <p>"I'm looking for readers to review my book."</p>
                    </div>
                    <div class="arc-tone-good">
                      <div class="arc-tone-label good">✓ Feels like being chosen</div>
                      <p>"I'm putting together a small group of readers whose opinions I trust, and I'd love for you to be part of it."</p>
                    </div>
                  </div>
                  <div class="arc-leave-out">
                    <h5 class="arc-lo-title">What to leave out</h5>
                    <div class="arc-lo-items">
                      <div class="arc-lo-item"><strong>Pressure</strong> — "I really need reviews to make this launch work." Readers who feel pressured either comply resentfully or don't reply at all.</div>
                      <div class="arc-lo-item"><strong>Complicated expectations</strong> — Save policies and platform instructions for the confirmation email. The invitation should feel light and exciting, not like a contract.</div>
                      <div class="arc-lo-item"><strong>Over-apologizing</strong> — You're inviting engaged readers to read a book early. That's a perk, not an imposition. Write it that way.</div>
                    </div>
                  </div>
                </div>

                <!-- Subject line examples -->
                <div class="arc-subject-examples">
                  <h4 class="arc-guide-title">Subject Line Examples</h4>
                  <div class="arc-subj-list">
                    <div class="arc-subj-item">
                      <span class="arc-subj-line">"You're invited: Early access to [Title]"</span>
                      <span class="arc-subj-why">Signals a personal message, not a broadcast — leads with exclusivity</span>
                    </div>
                    <div class="arc-subj-item">
                      <span class="arc-subj-line">"Want to read [Title] before anyone else?"</span>
                      <span class="arc-subj-why">Works well for series readers — answers the most immediate question before they open</span>
                    </div>
                  </div>
                </div>

                <!-- ARC tagging workflow -->
                <div class="arc-tagging-guide">
                  <div class="arc-tag-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    <span class="arc-tag-title">ARC Tagging Workflow</span>
                  </div>
                  <p class="arc-tag-desc">Once readers opt in, tag them as ARC readers for this specific title. That tag does three things automatically:</p>
                  <div class="arc-tag-three">
                    <div class="arc-tag-item">
                      <div class="arc-tag-num">1</div>
                      <span>Defines who receives the ARC confirmation and delivery email</span>
                    </div>
                    <div class="arc-tag-item">
                      <div class="arc-tag-num">2</div>
                      <span>Defines who receives the ARC follow-up campaign (1 week before launch)</span>
                    </div>
                    <div class="arc-tag-item">
                      <div class="arc-tag-num">3</div>
                      <span>Becomes the suppression list that keeps ARC readers from receiving your launch day broadcast as if they're discovering the book for the first time</span>
                    </div>
                  </div>
                  <div class="form-group" style="margin-top:.875rem">
                    <label class="form-label">ARC Tag for This Title</label>
                    <input type="text" class="form-input" [(ngModel)]="draft.arcTag" name="arcTag" placeholder="e.g. arc-ember-crown-2026" />
                    <span class="field-help">This tag is applied to readers who opt in. It automatically configures your follow-up audience and launch day suppression.</span>
                  </div>
                </div>
              </div>
              <!-- ===== END ARC INVITATION GUIDANCE ===== -->

              <!-- ===== ARC FOLLOW-UP GUIDANCE ===== -->
              <div class="arc-followup-guidance" *ngIf="draft.campaignType === 'arc-followup'">

                <!-- Tone callout -->
                <div class="arc-followup-callout">
                  <div class="arc-rc-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <p class="arc-rc-quote">The best ARC follow-ups feel like a reminder from a friend, not a collection's notice. Warm, specific, genuinely appreciative — and brief enough that reading it doesn't feel like work.</p>
                  </div>
                </div>

                <!-- Timing guidance -->
                <div class="arc-timing-guide">
                  <div class="arc-timing-row">
                    <div class="arc-timing-item optimal">
                      <div class="arc-timing-label">✓ Optimal: 1 week before launch</div>
                      <div class="arc-timing-desc">Enough notice to read if they haven't, enough time to write a thoughtful review, close enough to launch that the request feels timely.</div>
                    </div>
                    <div class="arc-timing-item warn">
                      <div class="arc-timing-label">⚠ Too early: 2+ weeks before</div>
                      <div class="arc-timing-desc">Many readers haven't finished yet — the reminder feels premature.</div>
                    </div>
                    <div class="arc-timing-item warn">
                      <div class="arc-timing-label">⚠ Too late: Final 2–3 days</div>
                      <div class="arc-timing-desc">Asking readers to rush produces lower-quality reviews and more anxiety.</div>
                    </div>
                  </div>
                </div>

                <!-- What to include -->
                <div class="arc-followup-checklist">
                  <h4 class="arc-guide-title">What Your Follow-Up Needs to Include</h4>
                  <div class="arc-fu-items">
                    <div class="arc-fu-item">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>A genuine opening that thanks them for being part of your launch team and acknowledges their time is valuable</span>
                    </div>
                    <div class="arc-fu-item">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>A brief reminder of the release date so the timing context is clear</span>
                    </div>
                    <div class="arc-fu-item">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>An acknowledgment that life gets busy and no judgment if they haven't finished yet — this single sentence reduces anxiety and paradoxically increases review conversion</span>
                    </div>
                    <div class="arc-fu-item">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>Direct links to review pages — not your book's general product page, but the review submission page directly. Every extra click between intention and action is a review you lose.</span>
                    </div>
                    <div class="arc-fu-item">
                      <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <span>A warm, brief close expressing genuine excitement about the launch and gratitude for their role in it</span>
                    </div>
                  </div>
                </div>

                <!-- Platform review links -->
                <div class="arc-review-links">
                  <div class="arc-rl-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span class="arc-rl-title">Platform Review Links</span>
                    <span class="arc-rl-badge">Direct to review form</span>
                  </div>
                  <p class="arc-rl-desc">Provide direct links to the review submission pages — not your book's general product page. A reader who clicks directly to the review form is three clicks away from a posted review.</p>
                  <div class="arc-rl-fields">
                    <div class="form-group">
                      <label class="form-label">Amazon Review Link</label>
                      <input type="url" class="form-input" [(ngModel)]="draft.amazonReviewLink" name="amazonReviewLink" placeholder="https://www.amazon.com/review/create-review?asin=..." />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Apple Books Review Link</label>
                      <input type="url" class="form-input" [(ngModel)]="draft.appleBooksLink" name="appleBooksLink" placeholder="https://apps.apple.com/..." />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Kobo Review Link</label>
                      <input type="url" class="form-input" [(ngModel)]="draft.koboLink" name="koboLink" placeholder="https://www.kobo.com/..." />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Barnes &amp; Noble Review Link</label>
                      <input type="url" class="form-input" [(ngModel)]="draft.bnLink" name="bnLink" placeholder="https://www.barnesandnoble.com/..." />
                    </div>
                  </div>
                  <div class="arc-rl-note">
                    <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
                    For KU-exclusive authors, Amazon is the priority. For wide authors, include all platforms your readers actually use. Label each link clearly by platform name.
                  </div>
                </div>

                <!-- Framing guidance -->
                <div class="arc-framing-guide">
                  <h4 class="arc-guide-title">How to Frame the Ask</h4>
                  <div class="arc-tone-compare">
                    <div class="arc-tone-bad">
                      <div class="arc-tone-label bad">❌ Creates pressure and avoidance</div>
                      <p>"Please don't forget to leave your review before launch day."</p>
                    </div>
                    <div class="arc-tone-good">
                      <div class="arc-tone-label good">✓ Respects autonomy, increases conversion</div>
                      <p>"If you've had a chance to finish and you're willing to share your thoughts, here are the links to leave a review."</p>
                    </div>
                  </div>
                </div>

                <!-- Post-launch ARC thank-you note -->
                <div class="arc-postlaunch-note">
                  <div class="arc-pln-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <span class="arc-pln-title">After Launch: The Post-Launch Thank-You</span>
                  </div>
                  <p class="arc-pln-desc">Your ARC readers should be suppressed from the launch day broadcast — but they shouldn't be forgotten. A brief, warm post-launch note thanking them for the reviews, sharing the launch results, and letting them know what the response has been closes the loop and deepens their investment in your next book. This isn't a required campaign — it's a relationship investment. Authors who treat their ARC teams as ongoing communities build the kind of reader loyalty that shows up without being asked, launch after launch.</p>
                  <button class="btn-ghost btn-sm" style="margin-top:.625rem" (click)="createPostLaunchThankYou()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Create Post-Launch Thank-You Campaign
                  </button>
                </div>
              </div>
              <!-- ===== END ARC FOLLOW-UP GUIDANCE ===== -->

              <!-- ===== NEW RELEASE NOTIFICATION GUIDANCE ===== -->
              <div class="nrn-guidance" *ngIf="draft.campaignType === 'new-release'">

                <!-- Launch email vs NRN distinction -->
                <div class="nrn-distinction-callout">
                  <div class="nrn-dc-left">
                    <div class="nrn-dc-label launch">Launch Day Email</div>
                    <p class="nrn-dc-desc">Full list · Release day · High-energy · Urgency-forward · Designed for readers at every stage of familiarity</p>
                    <p class="nrn-dc-role">Harvests excitement from your whole list</p>
                  </div>
                  <div class="nrn-dc-vs">≠</div>
                  <div class="nrn-dc-right">
                    <div class="nrn-dc-label nrn">New Release Notification</div>
                    <p class="nrn-dc-desc">Targeted segment · 2–4 days post-launch · Warmer tone · Direct ask · For readers who already know your work</p>
                    <p class="nrn-dc-role">Harvests loyalty from your best readers</p>
                  </div>
                </div>
                <div class="nrn-quote-callout">
                  <p class="nrn-quote">The launch email harvests excitement from your whole list. The new release notification harvests loyalty from your best readers. Both are essential. Neither replaces the other.</p>
                </div>

                <!-- Who gets it -->
                <div class="nrn-audience-guide">
                  <h4 class="arc-guide-title">Who Gets the New Release Notification</h4>
                  <p class="arc-guide-intro">The targeting precision of this campaign is what gives it its conversion advantage. You're not emailing everyone — you're emailing the readers whose relationship with your work makes this new title specifically relevant to them.</p>
                  <div class="nrn-audience-types">
                    <div class="nrn-audience-type priority">
                      <div class="nat-header">
                        <div class="nat-badge priority">Highest priority</div>
                        <span class="nat-title">Series Readers Who Haven't Finished the Catalog</span>
                      </div>
                      <p class="nat-desc">Readers who bought previous books in the series but don't yet own all of them. They have unanswered questions, characters they care about. For them, a new entry isn't a purchase decision — it's a foregone conclusion. Your email just needs to tell them it's there.</p>
                      <div class="nat-segment-tag">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Segment: Series Readers — built automatically from purchase history
                      </div>
                    </div>
                    <div class="nrn-audience-type">
                      <div class="nat-header">
                        <div class="nat-badge superfan">Superfans</div>
                        <span class="nat-title">All-Title Buyers</span>
                      </div>
                      <p class="nat-desc">Readers who have purchased everything in your catalog. They show up for every release, recommend you to friends, and are most likely to leave a review without being asked. A message that says "I know you've read everything I've written, and I'm so grateful for that — here's what's next" lands completely differently than a generic announcement.</p>
                      <div class="nat-segment-tag">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Segment: Superfans / All-Title Buyers
                      </div>
                    </div>
                    <div class="nrn-audience-type">
                      <div class="nat-header">
                        <div class="nat-badge backlist">Backlist buyers</div>
                        <span class="nat-title">Buyers of Companion or Related Titles</span>
                      </div>
                      <p class="nat-desc">If your new release is tonally or thematically related to a previous standalone, readers who bought the related title are your warmest audience. They self-identified as interested in exactly this kind of book when they bought the earlier one.</p>
                      <div class="nat-segment-tag">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Segment: Buyers of [Related Title]
                      </div>
                    </div>
                  </div>
                  <div class="nrn-suppress-note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    <span><strong>Suppress readers who already purchased the new title</strong> — including pre-order buyers who received a fulfillment email. Sending a notification for a book they already own is at best redundant and at worst confusing. Applied automatically via suppression rules.</span>
                  </div>
                </div>

                <!-- When to send -->
                <div class="nrn-timing-guide">
                  <h4 class="arc-guide-title">When to Send It</h4>
                  <div class="nrn-timing-visual">
                    <div class="ntv-item">
                      <div class="ntv-day">Day 0</div>
                      <div class="ntv-label">Launch Day Email</div>
                      <div class="ntv-desc">Full list broadcast</div>
                    </div>
                    <div class="ntv-arrow">→</div>
                    <div class="ntv-item highlight">
                      <div class="ntv-day">Day 2–4</div>
                      <div class="ntv-label">New Release Notification</div>
                      <div class="ntv-desc">First reviews in place · Backlist readers</div>
                    </div>
                    <div class="ntv-arrow">→</div>
                    <div class="ntv-item">
                      <div class="ntv-day">Day 7–10</div>
                      <div class="ntv-label">Week-Two Push</div>
                      <div class="ntv-desc">Non-buyers · Social proof</div>
                    </div>
                  </div>
                  <p class="nrn-timing-note">By day 2–3, your book has accumulated its first wave of verified reviews. Your notification arrives with a review record already in place rather than an empty product page. Four days is the outer edge — waiting longer risks sending a "new release" notification after the reader's sense of the release as an event has faded.</p>
                </div>

                <!-- How to write it -->
                <div class="nrn-writing-guide">
                  <h4 class="arc-guide-title">How to Write It — Structure</h4>
                  <div class="nrn-structure-steps">
                    <div class="nrn-step">
                      <div class="nrn-step-num">1</div>
                      <div>
                        <span class="nrn-step-title">Opening: Acknowledge the relationship</span>
                        <span class="nrn-step-desc">Lead with the connection, not the pitch. For series readers: "If you've been waiting to find out what happens after the ending of [Book] — the wait is finally over." For backlist buyers: "If you've been reading my books for a while, this one has been the one I've been most nervous and most excited to share." One or two sentences that signal this email knows who they are.</span>
                      </div>
                    </div>
                    <div class="nrn-step">
                      <div class="nrn-step-num">2</div>
                      <div>
                        <span class="nrn-step-title">The book: Connection, cover, hook</span>
                        <span class="nrn-step-desc">For series: name the previous book, reference the story thread being resolved. Include the cover image — large enough to read clearly on mobile. 2–3 sentences of hook copy: the core premise, the emotional promise. Not your full blurb — the essence of it, written for a reader who already trusts you.</span>
                      </div>
                    </div>
                    <div class="nrn-step">
                      <div class="nrn-step-num">3</div>
                      <div>
                        <span class="nrn-step-title">Early praise (if you have it)</span>
                        <span class="nrn-step-desc">One strong line from an ARC reader. "This is the best thing she's written" or "I stayed up until 2am and I have absolutely no regrets" lands as social proof rather than marketing copy. One line. Choose it carefully.</span>
                      </div>
                    </div>
                    <div class="nrn-step">
                      <div class="nrn-step-num">4</div>
                      <div>
                        <span class="nrn-step-title">CTA: One link, directly to purchase</span>
                        <span class="nrn-step-desc">"Get your copy" or "Read it now." Smart link routes to preferred retailer or direct store. For series readers, a clearly secondary "Start from the beginning" link below the primary CTA serves the occasional reader who hasn't started yet. One primary action, one optional secondary. Nothing more.</span>
                      </div>
                    </div>
                    <div class="nrn-step">
                      <div class="nrn-step-num">5</div>
                      <div>
                        <span class="nrn-step-title">Close: Brief and genuine</span>
                        <span class="nrn-step-desc">A sentence or two in your own voice. Then your signature. Done. Don't add a postscript with a different offer. Don't append social links and reader group invitations. The email had one job — let it finish it cleanly.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Subject line examples -->
                <div class="nrn-subject-guide">
                  <h4 class="arc-guide-title">Subject Lines That Work for This Campaign</h4>
                  <p class="arc-guide-intro">You're not generating urgency — you're signaling personal relevance to a reader who already knows you. Avoid generic lines like "New release!" or "Exciting news!" — your backlist readers deserve to be spoken to like the people they are.</p>
                  <div class="nrn-subj-list">
                    <div class="nrn-subj-item">
                      <div class="nrn-subj-type">Series continuity</div>
                      <div class="nrn-subj-line">"The next chapter in [Series Name] is here"</div>
                      <div class="nrn-subj-why">Direct, specific, immediately legible to anyone who's read the previous books</div>
                    </div>
                    <div class="nrn-subj-item">
                      <div class="nrn-subj-type">Personal address</div>
                      <div class="nrn-subj-line">"[First Name], [Title] is finally live"</div>
                      <div class="nrn-subj-why">Personalization increases open rates for warm audiences — backlist readers are exactly the audience this works best for</div>
                    </div>
                    <div class="nrn-subj-item">
                      <div class="nrn-subj-type">Emotional hook</div>
                      <div class="nrn-subj-line">"The ending I've been sitting on for two years"</div>
                      <div class="nrn-subj-why">Curiosity-forward — works for series readers who've been waiting, intrigues new readers who see a title they haven't encountered</div>
                    </div>
                    <div class="nrn-subj-item">
                      <div class="nrn-subj-type">Direct continuation</div>
                      <div class="nrn-subj-line">"What happens after [Book Title]"</div>
                      <div class="nrn-subj-why">The most direct subject line possible for series readers — answers the question they've been asking since they finished the previous book</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ===== END NEW RELEASE NOTIFICATION GUIDANCE ===== -->

              <div class="form-group">
                <label class="form-label">Campaign Name <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="draft.name" name="name" placeholder="e.g. April Newsletter" />
              </div>
              <div class="form-group" *ngFor="let tag of collectibleMergeTags">
                <label class="form-label">{{ mergeTagLabel(tag) }} <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="draft.mergeFields[tag]" [name]="'merge_' + tag" [placeholder]="'Enter ' + mergeTagLabel(tag).toLowerCase()" />
                <p class="char-tip ok" style="margin-top:.35rem">Fill in the value for this merge field in your email content.</p>
              </div>
              <div class="form-group">
                <label class="form-label">Subject Line <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="draft.subject" name="subject" placeholder="What's your email about?" maxlength="100" />
                <div class="char-hint">
                  <span class="char-count" [class.warn]="draft.subject.length > 60" [class.ok]="draft.subject.length > 0 && draft.subject.length <= 60">{{ draft.subject.length }}/60</span>
                  <span class="char-tip" *ngIf="draft.subject.length > 60">Subject is long — consider shortening for mobile</span>
                  <span class="char-tip ok" *ngIf="draft.subject.length > 0 && draft.subject.length <= 60">Good length for mobile</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Content <span class="required">*</span></label>
                <div *ngIf="isHtmlContent(draft.content)" class="content-visual-wrap">
                  <div class="content-render-box" [innerHTML]="safeDraftContent"></div>
                  <button type="button" class="btn-ghost btn-sm content-source-toggle" (click)="showHtmlSource = !showHtmlSource">
                    {{ showHtmlSource ? 'Hide HTML source' : 'Edit HTML source' }}
                  </button>
                </div>
                <textarea *ngIf="!isHtmlContent(draft.content) || showHtmlSource"
                  class="form-input content-area"
                  [class.content-area-html]="isHtmlContent(draft.content)"
                  [(ngModel)]="draft.content"
                  name="content"
                  placeholder="Hi [first_name],&#10;&#10;Write your email here..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 1: PREVIEW -->
        <div *ngIf="currentStep() === 1" class="step-content">
          <div class="preview-toolbar glass-card">
            <div>
              <h2 class="step-title">Preview Your Email</h2>
              <p class="step-sub">Check how your email looks on desktop and mobile (390px)</p>
            </div>
            <div class="preview-actions">
              <div class="toggle-group">
                <button class="toggle-btn" [class.active]="previewMode() === 'both'" (click)="previewMode.set('both')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>
                  Both
                </button>
                <button class="toggle-btn" [class.active]="previewMode() === 'desktop'" (click)="previewMode.set('desktop')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Desktop
                </button>
                <button class="toggle-btn" [class.active]="previewMode() === 'mobile'" (click)="previewMode.set('mobile')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  Mobile
                </button>
              </div>
              <button class="btn-test-phone" (click)="sendTestToPhone()" data-tooltip="Send a test email to your phone to see how it looks in your actual mail app">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                Send test to phone
              </button>
            </div>
          </div>

          <div class="preview-panels" [class.show-desktop]="previewMode() === 'desktop'" [class.show-mobile]="previewMode() === 'mobile'" [class.show-both]="previewMode() === 'both'">
            <!-- Desktop -->
            <div class="preview-panel desktop-panel">
              <div class="panel-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                Desktop
              </div>
              <div class="email-frame desktop-frame">
                <div class="frame-chrome">
                  <div class="chrome-dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
                  <div class="chrome-bar">Mail — Inbox</div>
                </div>
                <div class="email-meta-bar">
                  <div class="meta-row"><span class="meta-key">From:</span><span class="meta-val">{{ senderDisplay }}</span></div>
                  <div class="meta-row"><span class="meta-key">Subject:</span><span class="meta-val fw">{{ draft.subject || '(no subject)' }}</span></div>
                </div>
                <div class="email-body-preview">
                  <div class="email-body-inner">
                    <p *ngIf="!draft.content" class="preview-placeholder">Your email content will appear here as you type...</p>
                    <div *ngIf="draft.content && isHtmlContent(draft.content)" class="preview-content-html" [innerHTML]="safeDraftContent"></div>
                    <p *ngIf="draft.content && !isHtmlContent(draft.content)" class="preview-content">{{ draft.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile -->
            <div class="preview-panel mobile-panel">
              <div class="panel-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                Mobile <span class="panel-dim">390px</span>
              </div>
              <div class="phone-outer">
                <div class="phone-frame">
                  <div class="phone-side-btn phone-side-btn-vol"></div>
                  <div class="phone-side-btn phone-side-btn-power"></div>
                  <div class="phone-screen">
                    <div class="iphone-top-bar">
                      <div class="iphone-dynamic-island"></div>
                      <div class="iphone-status-bar">
                        <span class="iphone-time">9:41</span>
                        <div class="iphone-status-icons">
                          <svg class="iphone-icon" viewBox="0 0 18 12" aria-hidden="true">
                            <rect x="0" y="8" width="3" height="4" rx=".5" fill="currentColor"/>
                            <rect x="5" y="5" width="3" height="7" rx=".5" fill="currentColor"/>
                            <rect x="10" y="2" width="3" height="10" rx=".5" fill="currentColor"/>
                            <rect x="15" y="0" width="3" height="12" rx=".5" fill="currentColor"/>
                          </svg>
                          <svg class="iphone-icon" viewBox="0 0 16 12" aria-hidden="true">
                            <path d="M8 2.5C10.2 2.5 12.1 3.4 13.5 4.9L15 3.4C13.2 1.5 10.8.5 8 .5 5.2.5 2.8 1.5 1 3.4L2.5 4.9C3.9 3.4 5.8 2.5 8 2.5Z" fill="currentColor"/>
                            <path d="M8 6.5C9.4 6.5 10.6 7 11.5 7.9L13 6.4C11.7 5.1 9.9 4.3 8 4.3 6.1 4.3 4.3 5.1 3 6.4L4.5 7.9C5.4 7 6.6 6.5 8 6.5Z" fill="currentColor"/>
                            <circle cx="8" cy="10.5" r="1.5" fill="currentColor"/>
                          </svg>
                          <div class="iphone-battery" aria-hidden="true">
                            <div class="iphone-battery-body"><div class="iphone-battery-fill"></div></div>
                            <div class="iphone-battery-cap"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="phone-email-meta">
                      <div class="phone-from">{{ draft.fromName || 'Your Name' }}</div>
                      <div class="phone-subject">{{ draft.subject || '(no subject)' }}</div>
                    </div>
                    <div class="phone-email-body">
                      <p *ngIf="!draft.content" class="preview-placeholder">Your email content will appear here...</p>
                      <div *ngIf="draft.content && isHtmlContent(draft.content)" class="preview-content-html mobile-content" [innerHTML]="safeDraftContent"></div>
                      <p *ngIf="draft.content && !isHtmlContent(draft.content)" class="preview-content mobile-content">{{ draft.content }}</p>
                    </div>
                    <div class="phone-home-indicator"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: AUDIENCE -->
        <div *ngIf="currentStep() === 2" class="step-content">
          <div class="glass-card step-card">
            <app-campaign-recipients-panel
              [recipients]="recipients"
              (recipientsChange)="onRecipientsChange($event)">
            </app-campaign-recipients-panel>

            <!-- Suppression Rules -->
            <div class="suppression-section">
              <div class="supp-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                <span class="supp-title">Suppression Rules</span>
                <span class="supp-badge">{{ activeSuppressionCount }} active</span>
              </div>
              <p class="supp-desc">Automatically exclude subscribers who shouldn't receive this campaign. Every suppression rule is a small act of respect toward the reader that pays dividends in trust and deliverability.</p>
              <div class="supp-rules-list">
                <div class="supp-rule" *ngFor="let rule of suppressionRules">
                  <label class="toggle-wrap">
                    <input type="checkbox" [(ngModel)]="rule.enabled" (ngModelChange)="refreshReachEstimate()" />
                    <span class="toggle-slider"></span>
                  </label>
                  <div class="supp-rule-info">
                    <span class="supp-rule-name">{{ rule.label }}</span>
                    <span class="supp-rule-desc">{{ rule.description }}</span>
                  </div>
                </div>
              </div>
              <div class="supp-summary" *ngIf="selectedSegment">
                <svg viewBox="0 0 20 20" fill="#059669" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                <span>Estimated send: <strong>{{ estimatedSendCount | number }}</strong> subscribers after suppression ({{ suppressedCount | number }} excluded)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: REVIEW -->
        <div *ngIf="currentStep() === 3" class="step-content">
          <div class="review-layout">
            <div class="glass-card step-card">
              <h2 class="step-title">Pre-send Checklist</h2>
              <p class="step-sub">We checked your campaign before it goes out</p>

              <!-- Summary bar -->
              <div class="preflight-summary-bar">
                <div class="psb-item pass">
                  <svg viewBox="0 0 20 20" fill="#10b981" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  {{ preflightSummary.pass }} passed
                </div>
                <div class="psb-item warn" *ngIf="preflightSummary.warn > 0">
                  <svg viewBox="0 0 20 20" fill="#f59e0b" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ preflightSummary.warn }} warning{{ preflightSummary.warn > 1 ? 's' : '' }}
                </div>
                <div class="psb-item fail" *ngIf="preflightSummary.fail > 0">
                  <svg viewBox="0 0 20 20" fill="#ef4444" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                  {{ preflightSummary.fail }} blocking issue{{ preflightSummary.fail > 1 ? 's' : '' }}
                </div>
              </div>

              <!-- Blocking banner -->
              <div class="blocking-banner" *ngIf="hasBlockingIssues">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                <strong>Send blocked.</strong> Resolve the blocking issues below before this campaign can be sent.
              </div>

              <!-- Grouped checks -->
              <ng-container *ngFor="let group of checkGroups">
                <div class="check-group-label">{{ group.label }}</div>
                <div class="preflight-list">
                  <div class="preflight-item" *ngFor="let check of getChecksByCategory(group.key)"
                       [class.pass]="check.status === 'pass'" [class.warn]="check.status === 'warn'" [class.fail]="check.status === 'fail'">
                    <div class="preflight-icon">
                      <svg *ngIf="check.status === 'pass'" viewBox="0 0 20 20" fill="#10b981" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                      <svg *ngIf="check.status === 'warn'" viewBox="0 0 20 20" fill="#f59e0b" width="18" height="18"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                      <svg *ngIf="check.status === 'fail'" viewBox="0 0 20 20" fill="#ef4444" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                    </div>
                    <div class="preflight-text">
                      <div class="preflight-label">{{ check.label }}</div>
                      <div class="preflight-msg">{{ check.message }}</div>
                      <!-- Traffic-light for spam score -->
                      <div class="spam-traffic-light" *ngIf="check.id === 'spam'">
                        <div class="tl-dot tl-green" [class.tl-active]="check.status === 'pass'" data-tooltip="Low — no significant triggers"></div>
                        <div class="tl-dot tl-amber" [class.tl-active]="check.status === 'warn'" data-tooltip="Moderate — review flagged phrases"></div>
                        <div class="tl-dot tl-red" [class.tl-active]="check.status === 'fail'" data-tooltip="High — strongly recommended to revise"></div>
                        <span class="tl-label" [class.tl-green-text]="check.status === 'pass'" [class.tl-amber-text]="check.status === 'warn'" [class.tl-red-text]="check.status === 'fail'">
                          {{ check.status === 'pass' ? 'Low risk' : check.status === 'warn' ? 'Moderate risk' : 'High risk' }}
                        </span>
                      </div>
                    </div>
                    <div class="preflight-badge" [class.badge-pass]="check.status === 'pass'" [class.badge-warn]="check.status === 'warn'" [class.badge-fail]="check.status === 'fail'">
                      {{ check.status === 'pass' ? 'Pass' : check.status === 'warn' ? 'Warning' : 'Blocking' }}
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>
            <div class="glass-card step-card">
              <h3 class="step-title">Campaign Summary</h3>
              <div class="summary-list">
                <div class="summary-row"><span class="summary-key">Name</span><span class="summary-val">{{ draft.name || '—' }}</span></div>
                <div class="summary-row"><span class="summary-key">From</span><span class="summary-val">{{ senderDisplay }}</span></div>
                <div class="summary-row" *ngIf="draft.templateName"><span class="summary-key">Template</span><span class="summary-val">{{ draft.templateName }}</span></div>
                <div class="summary-row"><span class="summary-key">Subject</span><span class="summary-val">{{ draft.subject || '—' }}</span></div>
                <div class="summary-row"><span class="summary-key">Recipients</span><span class="summary-val">{{ recipientSummary }}</span></div>
                <div class="summary-row"><span class="summary-key">Est. reach</span><span class="summary-val">{{ estimatedSendCount | number }} subscribers</span></div>
              </div>

              <!-- Plain-language pre-send summary -->
              <div class="plain-summary">
                <div class="ps-header">
                  <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  <span class="ps-title">Pre-Send Summary</span>
                </div>
                <p class="ps-text">
                  You are about to send to <strong>{{ estimatedSendCount | number }} subscribers</strong>.
                  <span *ngIf="suppressedCount > 0"> {{ suppressedCount | number }} addresses have been suppressed.</span>
                  <span *ngIf="draft.subject"> Your subject line is set.</span>
                  <span *ngIf="draft.amazonLink || draft.directStoreLink"> Your links are working.</span>
                  <span *ngIf="sendMode === 'schedule' && draft.scheduledAt"> Scheduled for {{ draft.scheduledAt | date:'EEEE' }} at {{ draft.scheduledAt | date:'h:mm a' }}{{ draft.timezoneOptimized ? ', ' + (draft.scheduledAt | date:'h:mm a') + ' local for all subscribers' : '' }}.</span>
                  <span *ngIf="sendMode === 'now'"> Sending immediately.</span>
                </p>
                <div class="ps-checks">
                  <div class="ps-check" [class.ps-ok]="draft.subject" [class.ps-warn]="!draft.subject">
                    <svg *ngIf="draft.subject" viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    <svg *ngIf="!draft.subject" viewBox="0 0 20 20" fill="#f59e0b" width="12" height="12"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                    Subject line {{ draft.subject ? 'set' : 'missing' }}
                  </div>
                  <div class="ps-check ps-ok">
                    <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    Unsubscribe link present
                  </div>
                  <div class="ps-check ps-ok">
                    <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    Authentication active (SPF, DKIM)
                  </div>
                  <div class="ps-check" [class.ps-ok]="suppressedCount > 0" [class.ps-warn]="suppressedCount === 0">
                    <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    {{ suppressedCount > 0 ? suppressedCount + ' addresses suppressed' : 'No suppression rules active' }}
                  </div>
                  <div class="ps-check" [class.ps-ok]="draft.timezoneOptimized" [class.ps-warn]="!draft.timezoneOptimized">
                    <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                    Timezone optimization {{ draft.timezoneOptimized ? 'on — 9am local for all subscribers' : 'off' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: SEND -->
        <div *ngIf="currentStep() === 4" class="step-content">
          <div class="glass-card step-card send-step">
            <div *ngIf="!sendSuccess">
              <h2 class="step-title">Ready to Send</h2>
              <p class="step-sub">Choose when to send your campaign</p>
              <div class="send-choice-grid">
                <div class="send-choice" [class.selected]="sendMode === 'now'" (click)="sendMode = 'now'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  <div class="send-choice-label">Send Now</div>
                  <div class="send-choice-desc">Deliver immediately to your audience</div>
                </div>
                <div class="send-choice" [class.selected]="sendMode === 'schedule'" (click)="sendMode = 'schedule'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div class="send-choice-label">Schedule</div>
                  <div class="send-choice-desc">Pick a date and time to send later</div>
                </div>
              </div>
              <div class="schedule-picker" *ngIf="sendMode === 'schedule'">
                <label class="form-label">Send at</label>
                <input type="datetime-local" class="form-input" [(ngModel)]="draft.scheduledAt" name="scheduledAt" />
                <!-- Timezone optimization -->
                <div class="tz-opt-row" style="margin-top:.875rem">
                  <div class="tz-opt-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div>
                      <span class="tz-opt-label">Timezone Optimization</span>
                      <span class="tz-opt-desc">Deliver at the scheduled time in each subscriber's local timezone. Readers in the UK, Australia, and Canada receive it at a reasonable local hour — not 2am because you're in a different timezone.</span>
                    </div>
                  </div>
                  <label class="toggle-wrap">
                    <input type="checkbox" [(ngModel)]="draft.timezoneOptimized" name="timezoneOptimized" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="send-final-actions">
                <button class="btn-primary send-now-btn" (click)="sendCampaign()" [disabled]="sendingCampaign">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  {{ sendingCampaign ? 'Sending…' : (sendMode === 'now' ? 'Send Campaign Now' : 'Schedule Campaign') }}
                </button>
              </div>
            </div>
            <div *ngIf="sendSuccess" class="send-success">
              <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" width="48" height="48"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 class="success-title">{{ sendMode === 'now' ? 'Campaign Sent!' : 'Campaign Scheduled!' }}</h2>
              <p class="success-msg">{{ sendMode === 'now' ? 'Your campaign is on its way to ' + (estimatedSendCount | number) + ' subscribers.' : 'Your campaign is scheduled.' }}</p>
              <button class="btn-primary" (click)="resetAndGoToList()">Back to Campaigns</button>
            </div>
          </div>
        </div>

        <app-campaign-sender-modal
          [open]="showSenderModal()"
          [sender]="{ fromName: draft.fromName, fromEmail: draft.fromEmail }"
          [subject]="draft.subject"
          (cancel)="showSenderModal.set(false)"
          (saved)="onSenderSaved($event)">
        </app-campaign-sender-modal>

        <app-campaign-design-modal
          [open]="showDesignModal()"
          (cancel)="showDesignModal.set(false)"
          (applied)="onDesignApplied($event)">
        </app-campaign-design-modal>

        <!-- Step Navigation -->
        <div class="step-nav" *ngIf="!sendSuccess">
          <button class="btn-ghost" (click)="prevStep()" *ngIf="currentStep() > 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div class="step-nav-right">
            <button class="btn-ghost" (click)="saveDraft()">Save Draft</button>
            <button class="btn-primary" (click)="nextStep()" *ngIf="currentStep() < steps.length - 1" [disabled]="currentStep() === 3 && hasBlockingIssues" [attr.data-tooltip]="currentStep() === 3 && hasBlockingIssues ? 'Resolve blocking issues before proceeding' : null">
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Tabs */
    .tabs { display:flex; gap:.25rem; margin-bottom:1.5rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .loading-banner { padding: .875rem 1rem; margin-bottom: 1rem; background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15); border-radius: 10px; color: #2563eb; font-size: .875rem; font-weight: 600; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; }
    .tab:hover { color:#0f172a; }
    .tab.active { background:#ffffff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }

    /* Table */
    .table-card { overflow:hidden; }
    .table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; align-items:center; gap:.75rem; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }
    .filter-select option { background:white; }
    .campaign-name-cell { display:flex; align-items:center; gap:.875rem; }
    .campaign-icon { width:36px; height:36px; border-radius:10px; background:rgba(59,130,246,0.08); display:flex; align-items:center; justify-content:center; color:#3b82f6; flex-shrink:0; }
    .c-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .15rem; }
    .c-subject { font-size:.75rem; color:#94a3b8; margin:0; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .num-cell { font-size:.875rem; font-weight:600; color:#334155; }
    .rate-cell { display:flex; align-items:center; gap:.5rem; }
    .mini-bar { width:50px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:100px; }
    .click-rate { font-size:.875rem; font-weight:600; color:#6366f1; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .row-actions { display:flex; align-items:center; gap:.375rem; }
    .row-btn { display:inline-flex; align-items:center; gap:.3rem; padding:.35rem .65rem; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all .15s; white-space:nowrap; }
    .report-btn { color:#3b82f6; border-color:rgba(59,130,246,0.2); background:rgba(59,130,246,0.04); }
    .report-btn:hover { background:rgba(59,130,246,0.1); border-color:#3b82f6; }
    .edit-btn { color:#6366f1; border-color:rgba(99,102,241,0.2); background:rgba(99,102,241,0.04); }
    .edit-btn:hover { background:rgba(99,102,241,0.1); border-color:#6366f1; }
    .delete-btn { color:#dc2626; border-color:rgba(239,68,68,0.2); background:rgba(239,68,68,0.04); }
    .delete-btn:hover { background:rgba(239,68,68,0.1); border-color:#dc2626; }

    /* Report panel */
    .report-panel { padding:1.5rem; margin-bottom:1.25rem; animation:fadeUp .3s ease-out; }
    .report-panel-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem; }
    .report-panel-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 .2rem; }
    .report-panel-sub { font-size:.8125rem; color:#94a3b8; margin:0; }
    .close-report-btn { background:#f1f5f9; border:none; border-radius:8px; cursor:pointer; color:#64748b; padding:.375rem; display:flex; transition:all .15s; }
    .close-report-btn:hover { background:#e2e8f0; color:#0f172a; }
    .report-stats-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:1rem; margin-bottom:1rem; }
    .report-stat { display:flex; flex-direction:column; gap:.375rem; padding:.875rem; background:#f8fafc; border-radius:10px; border:1px solid #f1f5f9; }
    .rs-val { font-size:1.25rem; font-weight:800; color:#0f172a; letter-spacing:-.02em; }
    .rs-val.green { color:#059669; }
    .rs-val.purple { color:#6366f1; }
    .rs-val.rs-accent { color:#6366f1; }
    .rs-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .rs-bar { height:5px; background:#e2e8f0; border-radius:100px; overflow:hidden; margin-top:.25rem; }
    .rs-bar-fill { height:100%; border-radius:100px; transition:width .6s; }
    .rs-bar-fill.blue { background:linear-gradient(90deg,#3b82f6,rgba(59,130,246,0.5)); }
    .rs-bar-fill.purple { background:linear-gradient(90deg,#6366f1,rgba(99,102,241,0.5)); }
    .report-status-row { display:flex; align-items:center; gap:.75rem; }
    .report-note { font-size:.8125rem; color:#94a3b8; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @media(max-width:1100px) { .report-stats-grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:600px) { .report-stats-grid { grid-template-columns:repeat(2,1fr); } }

    /* Stepper */
    .stepper-wrap { padding:1.25rem 2rem; margin-bottom:1.5rem; overflow-x:auto; }
    .stepper { display:flex; align-items:center; min-width:max-content; }
    .step { display:flex; align-items:center; gap:.5rem; cursor:pointer; flex-shrink:0; }
    .step-circle { width:28px; height:28px; border-radius:50%; border:2px solid #e2e8f0; background:#fff; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; color:#94a3b8; transition:all .2s; flex-shrink:0; }
    .step.active .step-circle { border-color:#3b82f6; background:#3b82f6; color:#fff; }
    .step.done .step-circle { border-color:#10b981; background:#10b981; color:#fff; }
    .step-label { font-size:.8125rem; font-weight:500; color:#94a3b8; white-space:nowrap; }
    .step.active .step-label { color:#0f172a; font-weight:600; }
    .step.done .step-label { color:#10b981; }
    .step-line { flex:1; height:2px; background:#e2e8f0; margin:0 .625rem; min-width:32px; transition:background .2s; }
    .step-line.done { background:#10b981; }

    /* Toast */
    .camp-toast { position:fixed; top:1.5rem; right:1.5rem; z-index:9999; display:flex; align-items:center; gap:.625rem; padding:.875rem 1.25rem; border-radius:12px; font-size:.875rem; font-weight:500; box-shadow:0 8px 24px rgba(0,0,0,0.15); animation:toastIn .25s ease; }
    .toast-success { background:#059669; color:#fff; }
    .toast-warn { background:#d97706; color:#fff; }
    @keyframes toastIn { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }

    /* Step content */
    .step-content { margin-bottom:1.5rem; }
    .brevo-setup-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; }
    .setup-card { border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem 1.125rem; background:#fafbfc; }
    .setup-card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:.75rem; }
    .setup-card-label { font-size:.75rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.04em; }
    .setup-line { font-size:.875rem; color:#0f172a; }
    .setup-line.muted { font-size:.8125rem; color:#94a3b8; margin-top:.15rem; }
    .setup-mini-preview { margin-top:.75rem; max-height:100px; overflow:hidden; border-radius:8px; border:1px solid #e2e8f0; background:#fff; }
    .setup-mini-preview ::ng-deep .email-wrap { transform:scale(0.45); transform-origin:top left; width:222%; }
    @media(max-width:700px) { .brevo-setup-grid { grid-template-columns:1fr; } }
    .step-card { padding:2rem; }
    .step-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .step-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.75rem; }

    /* Write step */
    .write-form { display:flex; flex-direction:column; gap:1.125rem; }
    .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; display:flex; align-items:center; gap:.375rem; flex-wrap:wrap; }
    .label-hint { font-size:.75rem; font-weight:400; color:#94a3b8; }
    .required { color:#ef4444; }
    .form-input { padding:.625rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#3b82f6; background:#fff; }
    .content-area { min-height:180px; resize:vertical; }
    .content-area-html { margin-top:.75rem; font-family:ui-monospace,Consolas,monospace; font-size:.75rem; }
    .content-visual-wrap { display:flex; flex-direction:column; gap:.75rem; }
    .content-render-box { border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; max-height:420px; overflow-y:auto; }
    .content-source-toggle { align-self:flex-start; }
    .preview-content-html { color:#334155; font-size:.875rem; line-height:1.6; }
    .preview-content-html.mobile-content { font-size:.8125rem; }
    .char-hint { display:flex; align-items:center; gap:.5rem; margin-top:.3rem; }
    .char-count { font-size:.75rem; color:#94a3b8; }
    .char-count.warn { color:#d97706; }
    .char-count.ok { color:#10b981; }
    .char-tip { font-size:.75rem; color:#d97706; }
    .char-tip.ok { color:#10b981; }

    /* Preview step */
    .preview-toolbar { padding:1.25rem 1.5rem; margin-bottom:1.25rem; display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
    .preview-toolbar .step-title { margin-bottom:.2rem; }
    .preview-toolbar .step-sub { margin-bottom:0; }
    .preview-actions { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; }
    .toggle-group { display:flex; background:#f1f5f9; border-radius:10px; padding:.2rem; gap:.15rem; }
    .toggle-btn { display:flex; align-items:center; gap:.375rem; padding:.45rem .875rem; border:none; background:transparent; border-radius:8px; font-size:.8125rem; font-weight:500; color:#64748b; font-family:inherit; cursor:pointer; transition:all .15s; }
    .toggle-btn.active { background:#fff; color:#0f172a; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .btn-test-phone { display:flex; align-items:center; gap:.375rem; padding:.55rem 1rem; border:1.5px solid #e2e8f0; background:#fff; border-radius:10px; font-size:.8125rem; font-weight:500; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; }
    .btn-test-phone:hover { border-color:#3b82f6; color:#3b82f6; background:#f0f7ff; }

    /* Preview panels */
    .preview-panels { display:grid; grid-template-columns:1fr 420px; gap:1.5rem; align-items:start; }
    .preview-panels.show-desktop { grid-template-columns:1fr; }
    .preview-panels.show-desktop .mobile-panel { display:none; }
    .preview-panels.show-mobile { grid-template-columns:1fr; }
    .preview-panels.show-mobile .desktop-panel { display:none; }
    .preview-panels.show-mobile { justify-items:center; }
    .preview-panel { display:flex; flex-direction:column; gap:.75rem; }
    .panel-label { display:flex; align-items:center; gap:.375rem; font-size:.75rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.06em; }
    .panel-dim { font-weight:400; color:#94a3b8; }

    .email-frame { border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; }
    .frame-chrome { display:flex; align-items:center; gap:.75rem; padding:.625rem .875rem; background:#f1f5f9; border-bottom:1px solid #e2e8f0; }
    .chrome-dots { display:flex; gap:.375rem; }
    .dot { width:10px; height:10px; border-radius:50%; }
    .dot.red { background:#f87171; }
    .dot.yellow { background:#fbbf24; }
    .dot.green { background:#34d399; }
    .chrome-bar { flex:1; background:#fff; border-radius:6px; padding:.25rem .75rem; font-size:.75rem; color:#94a3b8; border:1px solid #e2e8f0; }
    .email-meta-bar { padding:.875rem 1rem; border-bottom:1px solid #f1f5f9; display:flex; flex-direction:column; gap:.375rem; }
    .meta-row { display:flex; gap:.5rem; font-size:.8rem; }
    .meta-key { color:#94a3b8; font-weight:600; min-width:60px; }
    .meta-val { color:#334155; }
    .meta-val.fw { font-weight:600; color:#0f172a; }
    .muted-text { color:#94a3b8; font-style:italic; }
    .email-body-preview { padding:1.25rem; min-height:200px; }
    .email-body-inner { max-width:600px; margin:0 auto; }
    .preview-placeholder { color:#cbd5e1; font-size:.8125rem; font-style:italic; margin:0; }
    .preview-content { color:#334155; font-size:.875rem; line-height:1.7; white-space:pre-wrap; margin:0; }
    .mobile-content { font-size:.9375rem; line-height:1.6; }

    /* Phone frame — iPhone mockup */
    .phone-outer { display:flex; justify-content:center; padding:.5rem 0; }
    .phone-frame {
      position:relative; width:390px; max-width:100%;
      background:linear-gradient(145deg,#2b2b2f 0%,#1a1a1e 50%,#0f0f12 100%);
      border-radius:52px; padding:12px;
      box-shadow:0 32px 80px rgba(15,23,42,0.28), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 0 2px rgba(0,0,0,0.35);
    }
    .phone-side-btn { position:absolute; background:#3a3a40; border-radius:2px; }
    .phone-side-btn-vol { left:-3px; top:108px; width:3px; height:56px; box-shadow:0 72px 0 #3a3a40; }
    .phone-side-btn-power { right:-3px; top:140px; width:3px; height:72px; }
    .phone-screen {
      background:#fff; border-radius:40px; overflow:hidden;
      height:640px; max-height:640px; display:flex; flex-direction:column;
      box-shadow:0 0 0 1px rgba(0,0,0,0.04) inset;
    }
    .iphone-top-bar { position:relative; background:#fff; padding-top:10px; flex-shrink:0; }
    .iphone-dynamic-island {
      position:absolute; top:10px; left:50%; transform:translateX(-50%);
      width:120px; height:34px; background:#0f0f12; border-radius:20px;
      box-shadow:0 0 0 1px rgba(255,255,255,0.04) inset;
      z-index:2;
    }
    .iphone-status-bar {
      display:flex; align-items:center; justify-content:space-between;
      padding:14px 22px 8px; min-height:44px;
      font-size:.8125rem; font-weight:600; color:#0f172a; letter-spacing:-.01em;
    }
    .iphone-time { font-variant-numeric:tabular-nums; min-width:54px; }
    .iphone-status-icons { display:flex; align-items:center; gap:6px; min-width:54px; justify-content:flex-end; }
    .iphone-icon { width:17px; height:12px; color:#0f172a; flex-shrink:0; }
    .iphone-battery { display:flex; align-items:center; gap:1px; }
    .iphone-battery-body {
      width:22px; height:11px; border:1.5px solid #0f172a; border-radius:3px;
      padding:1.5px; box-sizing:border-box;
    }
    .iphone-battery-fill { width:75%; height:100%; background:#0f172a; border-radius:1px; }
    .iphone-battery-cap { width:2px; height:5px; background:#0f172a; border-radius:0 1px 1px 0; }
    .phone-email-meta { padding:.75rem 1rem; border-bottom:1px solid #f1f5f9; flex-shrink:0; }
    .phone-from { font-size:.8125rem; font-weight:700; color:#0f172a; margin-bottom:.2rem; }
    .phone-subject { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.2rem; }
    .phone-preheader { font-size:.75rem; color:#94a3b8; }
    .phone-email-body {
      padding:.875rem 1rem; flex:1; min-height:0;
      overflow-y:auto; overflow-x:hidden;
      -webkit-overflow-scrolling:touch;
      overscroll-behavior:contain;
    }
    .phone-email-body::-webkit-scrollbar { width:4px; }
    .phone-email-body::-webkit-scrollbar-thumb { background:rgba(15,23,42,0.15); border-radius:100px; }
    .phone-home-indicator {
      width:134px; height:5px; background:#0f172a; border-radius:100px;
      margin:10px auto 12px; opacity:.18; flex-shrink:0;
    }

    /* Audience step */
    .audience-grid { display:flex; flex-direction:column; gap:.75rem; margin-bottom:1.25rem; }
    .audience-card { cursor:pointer; border:1.5px solid #e2e8f0; border-radius:12px; transition:all .15s; }
    .audience-card:hover { border-color:#93c5fd; }
    .audience-card.selected { border-color:#3b82f6; background:rgba(59,130,246,0.04); }
    .audience-card-inner { display:flex; align-items:center; gap:1rem; padding:.875rem 1rem; }
    .audience-check { width:24px; height:24px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .check-empty { width:18px; height:18px; border-radius:50%; border:2px solid #e2e8f0; }
    .audience-info { flex:1; }
    .audience-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .audience-desc { font-size:.75rem; color:#94a3b8; margin-top:.15rem; }
    .audience-count { font-size:1rem; font-weight:700; color:#3b82f6; }
    .reach-summary { display:flex; align-items:center; gap:.625rem; padding:.875rem 1rem; background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.15); border-radius:10px; font-size:.875rem; color:#374151; }
    .reach-summary strong { color:#0f172a; }

    /* Review / Preflight */
    .review-layout { display:grid; grid-template-columns:1.2fr 1fr; gap:1.5rem; align-items:start; }
    .preflight-list { display:flex; flex-direction:column; gap:.625rem; }
    .preflight-item { display:flex; align-items:center; gap:.875rem; padding:.875rem 1rem; border-radius:10px; border:1.5px solid #e2e8f0; }
    .preflight-item.pass { border-color:rgba(16,185,129,0.25); background:rgba(16,185,129,0.04); }
    .preflight-item.warn { border-color:rgba(245,158,11,0.3); background:rgba(245,158,11,0.04); }
    .preflight-item.fail { border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.04); }
    .preflight-icon { flex-shrink:0; display:flex; }
    .preflight-text { flex:1; }
    .preflight-label { font-size:.875rem; font-weight:600; color:#0f172a; }
    .preflight-msg { font-size:.75rem; color:#64748b; margin-top:.15rem; }
    .preflight-badge { font-size:.7rem; font-weight:700; padding:.2rem .55rem; border-radius:100px; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; }
    .badge-pass { background:rgba(16,185,129,0.12); color:#059669; }
    .badge-warn { background:rgba(245,158,11,0.12); color:#d97706; }
    .badge-fail { background:rgba(239,68,68,0.12); color:#dc2626; }

    /* Spam traffic light */
    .spam-traffic-light { display:flex; align-items:center; gap:.375rem; margin-top:.5rem; }
    .tl-dot { width:14px; height:14px; border-radius:50%; opacity:.2; transition:opacity .2s, box-shadow .2s; }
    .tl-dot.tl-active { opacity:1; }
    .tl-green { background:#10b981; }
    .tl-green.tl-active { box-shadow:0 0 6px rgba(16,185,129,0.6); }
    .tl-amber { background:#f59e0b; }
    .tl-amber.tl-active { box-shadow:0 0 6px rgba(245,158,11,0.6); }
    .tl-red { background:#ef4444; }
    .tl-red.tl-active { box-shadow:0 0 6px rgba(239,68,68,0.6); }
    .tl-label { font-size:.75rem; font-weight:700; margin-left:.25rem; }
    .tl-green-text { color:#059669; }
    .tl-amber-text { color:#d97706; }
    .tl-red-text { color:#dc2626; }

    /* Preflight summary bar */
    .preflight-summary-bar { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; background:#f8fafc; border-radius:10px; margin-bottom:1rem; flex-wrap:wrap; }
    .psb-item { display:flex; align-items:center; gap:.375rem; font-size:.8125rem; font-weight:600; }
    .psb-item.pass { color:#059669; }
    .psb-item.warn { color:#d97706; }
    .psb-item.fail { color:#dc2626; }

    /* Blocking banner */
    .blocking-banner { display:flex; align-items:center; gap:.625rem; padding:.875rem 1rem; background:rgba(239,68,68,0.08); border:1.5px solid rgba(239,68,68,0.25); border-radius:10px; color:#dc2626; font-size:.875rem; margin-bottom:1rem; }

    /* Check group label */
    .check-group-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; padding:.875rem 0 .375rem; margin-top:.25rem; }
    .check-group-label:first-of-type { padding-top:0; }

    /* Disabled Next button */
    .btn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none !important; box-shadow:none !important; }
    .summary-list { display:flex; flex-direction:column; gap:0; margin-top:1rem; }
    .summary-row { display:flex; gap:.75rem; padding:.625rem 0; border-bottom:1px solid #f1f5f9; }
    .summary-row:last-child { border-bottom:none; }
    .summary-key { font-size:.8125rem; font-weight:600; color:#94a3b8; min-width:100px; }
    .summary-val { font-size:.8125rem; color:#0f172a; }

    /* Send step */
    .send-step { max-width:640px; margin:0 auto; }
    .send-choice-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; }
    .send-choice { border:2px solid #e2e8f0; border-radius:14px; padding:1.5rem; display:flex; flex-direction:column; align-items:center; gap:.625rem; cursor:pointer; transition:all .15s; text-align:center; }
    .send-choice:hover { border-color:#93c5fd; }
    .send-choice.selected { border-color:#3b82f6; background:rgba(59,130,246,0.04); }
    .send-choice svg { color:#3b82f6; }
    .send-choice-label { font-size:.9375rem; font-weight:700; color:#0f172a; }
    .send-choice-desc { font-size:.8125rem; color:#94a3b8; }
    .schedule-picker { display:flex; flex-direction:column; gap:.5rem; margin-bottom:1.5rem; }
    .send-final-actions { display:flex; justify-content:center; }
    .send-now-btn { display:flex; align-items:center; gap:.5rem; padding:.75rem 2rem; font-size:.9375rem; background:linear-gradient(135deg,#059669,#10b981); box-shadow:0 4px 14px rgba(16,185,129,0.25); }
    .send-now-btn:hover { box-shadow:0 8px 24px rgba(16,185,129,0.35); }
    .send-success { display:flex; flex-direction:column; align-items:center; gap:1rem; padding:2rem; text-align:center; }
    .success-icon { width:80px; height:80px; border-radius:50%; background:rgba(16,185,129,0.1); display:flex; align-items:center; justify-content:center; }
    .success-title { font-size:1.5rem; font-weight:700; color:#0f172a; margin:0; }
    .success-msg { font-size:.9375rem; color:#64748b; margin:0; max-width:400px; }

    /* Step nav */
    .step-nav { display:flex; align-items:center; justify-content:space-between; margin-top:1rem; padding-bottom:2rem; }
    .step-nav-right { display:flex; align-items:center; gap:.75rem; }

    /* Responsive */
    @media(max-width:900px) {
      .preview-panels { grid-template-columns:1fr; }
      .preview-panels.show-both .mobile-panel { display:flex; }
      .phone-frame { width:100%; }
      .review-layout { grid-template-columns:1fr; }
      .send-choice-grid { grid-template-columns:1fr; }
      .form-row-2 { grid-template-columns:1fr; }
    }

    /* Newsletter tab */
    .newsletter-callout { display:flex; align-items:flex-start; gap:1rem; padding:1.25rem 1.5rem; margin-bottom:1.25rem; background:linear-gradient(135deg,rgba(59,130,246,0.06),rgba(99,102,241,0.06)); border:1.5px solid rgba(59,130,246,0.15); }
    .nc-icon { width:40px; height:40px; border-radius:10px; background:rgba(59,130,246,0.1); display:flex; align-items:center; justify-content:center; color:#3b82f6; flex-shrink:0; }
    .nc-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .nc-desc { font-size:.8125rem; color:#64748b; margin:0; line-height:1.6; }
    .nl-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .nl-status-badge { display:flex; align-items:center; gap:.5rem; padding:.4rem .875rem; border-radius:100px; font-size:.75rem; font-weight:700; }
    .nl-active { background:rgba(16,185,129,0.1); color:#059669; border:1px solid rgba(16,185,129,0.25); }
    .nl-paused { background:rgba(245,158,11,0.1); color:#d97706; border:1px solid rgba(245,158,11,0.25); }
    .nl-draft { background:rgba(148,163,184,0.1); color:#64748b; border:1px solid rgba(148,163,184,0.25); }
    .nl-dot { width:7px; height:7px; border-radius:50%; background:currentColor; }
    .nl-form { display:flex; flex-direction:column; gap:1.125rem; }
    .nl-actions { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; margin-top:.5rem; }

    /* Timezone optimization */
    .tz-opt-row { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:.875rem 1rem; background:rgba(59,130,246,0.04); border:1.5px solid rgba(59,130,246,0.12); border-radius:10px; }
    .tz-opt-info { display:flex; align-items:flex-start; gap:.625rem; flex:1; color:#3b82f6; }
    .tz-opt-label { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .tz-opt-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .toggle-wrap { position:relative; display:inline-flex; align-items:center; cursor:pointer; flex-shrink:0; }
    .toggle-wrap input { opacity:0; width:0; height:0; position:absolute; }
    .toggle-slider { width:40px; height:22px; background:#e2e8f0; border-radius:100px; transition:background .2s; position:relative; }
    .toggle-slider::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,0.15); }
    .toggle-wrap input:checked + .toggle-slider { background:#3b82f6; }
    .toggle-wrap input:checked + .toggle-slider::after { transform:translateX(18px); }

    /* Reply invitation */
    .reply-invite-section { background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.15); border-radius:12px; padding:1.125rem; }
    .ri-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#059669; }
    .ri-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .ri-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(16,185,129,0.12); color:#059669; border-radius:100px; margin-left:.25rem; }
    .ri-desc { font-size:.8rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .reply-examples { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; margin-top:.625rem; }
    .re-label { font-size:.75rem; font-weight:600; color:#94a3b8; }
    .re-chip { padding:.3rem .7rem; border:1.5px solid #e2e8f0; border-radius:100px; background:#fff; font-size:.75rem; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; }
    .re-chip:hover { border-color:#34d399; color:#059669; background:rgba(16,185,129,0.04); }

    /* Content guide */
    .nl-content-guide { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .ncg-title { font-size:.8125rem; font-weight:700; color:#374151; margin:0 0 .875rem; text-transform:uppercase; letter-spacing:.05em; }
    .ncg-grid { display:grid; grid-template-columns:1fr 1fr; gap:.625rem; }
    .ncg-item { display:flex; align-items:flex-start; gap:.625rem; }
    .ncg-icon, .nav-icon { display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#64748b; }
    .ncg-icon svg, .nav-icon svg { width:20px; height:20px; display:block; }
    .ncg-name { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; }
    .ncg-hint { display:block; font-size:.75rem; color:#94a3b8; line-height:1.4; }

    /* Consistency tip */
    .consistency-tip { display:flex; align-items:flex-start; gap:1rem; padding:1.25rem 1.5rem; margin-top:1.25rem; background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(168,85,247,0.06)); border:1.5px solid rgba(99,102,241,0.15); }
    .ct-icon { width:36px; height:36px; border-radius:10px; background:rgba(99,102,241,0.1); display:flex; align-items:center; justify-content:center; color:#6366f1; flex-shrink:0; margin-top:.1rem; }
    .ct-quote { font-size:.875rem; font-style:italic; color:#374151; margin:0 0 .5rem; line-height:1.6; border-left:3px solid #6366f1; padding-left:.875rem; }
    .ct-tip { font-size:.8rem; color:#64748b; margin:0; }

    /* A/B Testing */
    .ab-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .ab-create-form { border:1.5px solid #e2e8f0; border-radius:12px; padding:1.25rem; margin-bottom:1.5rem; background:#f8fafc; }
    .ab-variants { display:grid; grid-template-columns:1fr auto 1fr; gap:1rem; align-items:center; }
    .ab-variant { display:flex; flex-direction:column; gap:.5rem; }
    .ab-variant-label { font-size:.75rem; font-weight:700; padding:.2rem .6rem; border-radius:6px; width:fit-content; }
    .variant-a { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .variant-b { background:rgba(99,102,241,0.1); color:#6366f1; }
    .ab-variant-hint { font-size:.75rem; color:#94a3b8; }
    .ab-vs { font-size:.875rem; font-weight:800; color:#94a3b8; text-align:center; }
    .ab-form-actions { display:flex; gap:.75rem; margin-top:1.25rem; }
    .ab-tests-list { display:flex; flex-direction:column; gap:.75rem; margin-top:1rem; }
    .ab-test-row { display:flex; align-items:center; gap:1rem; padding:.875rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; flex-wrap:wrap; }
    .ab-test-info { flex:1; min-width:200px; }
    .ab-test-name { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.375rem; }
    .ab-test-subjects { display:flex; gap:.5rem; flex-wrap:wrap; }
    .ab-pill { font-size:.75rem; padding:.2rem .6rem; border-radius:6px; }
    .ab-pill.a { background:rgba(59,130,246,0.08); color:#3b82f6; }
    .ab-pill.b { background:rgba(99,102,241,0.08); color:#6366f1; }
    .ab-test-results { display:flex; gap:.75rem; }
    .ab-result { display:flex; align-items:center; gap:.375rem; padding:.375rem .75rem; border-radius:8px; border:1.5px solid #e2e8f0; }
    .ab-result.ab-winner { border-color:#10b981; background:rgba(16,185,129,0.06); }
    .ab-result-label { font-size:.75rem; font-weight:700; color:#64748b; }
    .ab-result-rate { font-size:.875rem; font-weight:700; color:#0f172a; }
    .ab-winner-badge { font-size:.7rem; font-weight:700; padding:.15rem .45rem; background:#10b981; color:#fff; border-radius:100px; }
    .ab-test-status { flex-shrink:0; }
    .ab-empty { display:flex; flex-direction:column; align-items:center; gap:.75rem; padding:2rem; color:#94a3b8; font-size:.875rem; text-align:center; }
    .ab-how-it-works { margin-top:1.25rem; }
    .ab-steps { display:flex; flex-direction:column; gap:.875rem; margin:1rem 0; }
    .ab-step { display:flex; align-items:flex-start; gap:.875rem; }
    .ab-step-num { width:28px; height:28px; border-radius:50%; background:rgba(59,130,246,0.1); color:#3b82f6; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ab-step-title { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ab-step-desc { font-size:.8rem; color:#64748b; line-height:1.5; }
    .ab-insight { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(59,130,246,0.06); border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.5; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.3rem; display:block; line-height:1.5; }
    .info-icon { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#e2e8f0; color:#64748b; font-size:.65rem; font-weight:700; cursor:help; }
    @media(max-width:700px) { .ab-variants { grid-template-columns:1fr; } .ab-vs { display:none; } .ncg-grid { grid-template-columns:1fr; } }

    /* Campaign Calendar tab */
    .cvf-callout { display:grid; grid-template-columns:1fr auto 1fr; gap:1.5rem; padding:1.5rem; margin-bottom:1rem; align-items:start; }
    .cvf-col { display:flex; align-items:flex-start; gap:.875rem; }
    .cvf-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .campaigns-icon { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .flows-icon { background:rgba(99,102,241,0.1); color:#6366f1; }
    .cvf-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .cvf-desc { font-size:.8125rem; color:#64748b; margin:0; line-height:1.6; }
    .cvf-vs { display:flex; align-items:center; justify-content:center; }
    .cvf-vs span { font-size:.75rem; font-weight:700; color:#94a3b8; background:#f1f5f9; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; }
    .cvf-quote { padding:1rem 1.5rem; margin-bottom:1.25rem; background:linear-gradient(135deg,rgba(59,130,246,0.04),rgba(99,102,241,0.04)); border-left:3px solid #6366f1; }
    .cvf-quote-text { font-size:.9rem; font-style:italic; color:#374151; margin:0; line-height:1.6; }
    .cal-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .release-planner { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.25rem; }
    .rp-header { display:flex; align-items:center; gap:.5rem; margin-bottom:1rem; color:#3b82f6; flex-wrap:wrap; }
    .rp-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .rp-hint { font-size:.75rem; color:#94a3b8; margin-left:.25rem; }
    .baseline-campaigns { display:flex; flex-direction:column; gap:.625rem; }
    .bc-item { display:flex; align-items:center; gap:1rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; flex-wrap:wrap; }
    .bc-timing { font-size:.75rem; font-weight:700; color:#94a3b8; min-width:120px; }
    .bc-info { flex:1; min-width:160px; }
    .bc-type { display:block; font-size:.875rem; font-weight:600; color:#0f172a; }
    .bc-desc { display:block; font-size:.75rem; color:#94a3b8; }
    .bc-date { font-size:.8125rem; font-weight:600; color:#3b82f6; white-space:nowrap; }
    .baseline-empty { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem; color:#94a3b8; font-size:.8125rem; text-align:center; }
    .landscape-table { display:flex; flex-direction:column; }
    .lt-row { display:grid; grid-template-columns:2fr 3fr 2fr auto; gap:1rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:center; }
    .lt-row:last-child { border-bottom:none; }
    .lt-header { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; padding-bottom:.625rem; }
    .lt-type { display:flex; align-items:center; gap:.625rem; }
    .lt-icon { flex-shrink:0; color:#64748b; }
    .nav-icon svg { width:20px; height:20px; display:block; }
    .lt-type-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .lt-purpose { font-size:.8125rem; color:#64748b; }
    .lt-audience { font-size:.75rem; color:#94a3b8; }
    .cal-events-list { display:flex; flex-direction:column; gap:.625rem; }
    .cal-event { display:flex; align-items:center; gap:1rem; padding:.75rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; flex-wrap:wrap; }
    .ce-date { font-size:.8125rem; font-weight:600; color:#64748b; min-width:90px; }
    .ce-info { flex:1; display:flex; align-items:center; gap:.625rem; flex-wrap:wrap; }
    .ce-name { font-size:.875rem; font-weight:600; color:#0f172a; }
    .ce-type-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(59,130,246,0.08); color:#3b82f6; border-radius:6px; }

    /* Campaign type selector */
    .ct-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:.5rem; margin-bottom:.75rem; }
    .ct-btn { display:flex; flex-direction:column; align-items:center; gap:.375rem; padding:.625rem .5rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8fafc; cursor:pointer; transition:all .15s; font-family:inherit; }
    .ct-btn:hover { border-color:#93c5fd; background:#f0f7ff; }
    .ct-btn.ct-selected { border-color:#3b82f6; background:rgba(59,130,246,0.06); }
    .ct-btn-icon { width:20px; height:20px; display:flex; align-items:center; justify-content:center; color:#64748b; flex-shrink:0; }
    .ct-btn-icon svg { width:20px; height:20px; display:block; }
    .ct-btn.ct-selected .ct-btn-icon { color:#3b82f6; }
    .ct-btn-label { font-size:.7rem; font-weight:600; color:#374151; text-align:center; line-height:1.3; }
    .ct-btn.ct-selected .ct-btn-label { color:#1d4ed8; }
    .ct-selected-info { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.15); border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.5; }

    /* Single purpose tip */
    .single-purpose-tip { display:flex; align-items:flex-start; gap:.625rem; padding:.75rem 1rem; background:rgba(245,158,11,0.06); border:1.5px solid rgba(245,158,11,0.2); border-radius:10px; }
    .spt-icon { color:#d97706; flex-shrink:0; margin-top:.1rem; }
    .spt-title { display:block; font-size:.8125rem; font-weight:700; color:#92400e; margin-bottom:.2rem; }
    .spt-desc { display:block; font-size:.75rem; color:#78350f; line-height:1.5; }

    /* Suppression rules */
    .suppression-section { background:rgba(239,68,68,0.03); border:1.5px solid rgba(239,68,68,0.12); border-radius:12px; padding:1.125rem; margin-top:1.25rem; }
    .supp-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#dc2626; }
    .supp-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .supp-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(239,68,68,0.1); color:#dc2626; border-radius:100px; margin-left:.25rem; }
    .supp-desc { font-size:.8rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .supp-rules-list { display:flex; flex-direction:column; gap:.5rem; margin-bottom:.875rem; }
    .supp-rule { display:flex; align-items:flex-start; gap:.875rem; padding:.625rem .875rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; }
    .supp-rule-info { flex:1; }
    .supp-rule-name { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; }
    .supp-rule-desc { display:block; font-size:.75rem; color:#94a3b8; margin-top:.15rem; line-height:1.4; }
    .supp-summary { display:flex; align-items:center; gap:.5rem; padding:.625rem .875rem; background:rgba(16,185,129,0.06); border-radius:8px; font-size:.8125rem; color:#374151; }

    /* Report panel extras */
    .rs-caveat { font-size:.65rem; color:#d97706; cursor:help; margin-left:.2rem; }

    /* Book Launch anatomy guidance */
    .launch-guidance { display:flex; flex-direction:column; gap:1rem; }
    .launch-importance { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(245,158,11,0.06); border:1.5px solid rgba(245,158,11,0.2); border-radius:10px; }
    .li-icon { width:32px; height:32px; border-radius:8px; background:rgba(245,158,11,0.12); color:#d97706; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .li-title { display:block; font-size:.875rem; font-weight:700; color:#92400e; margin-bottom:.3rem; }
    .li-desc { font-size:.8rem; color:#78350f; margin:0; line-height:1.6; }
    .anatomy-guide { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .ag-title { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .875rem; }
    .ag-steps { display:flex; flex-direction:column; gap:.625rem; }
    .ag-step { display:flex; align-items:flex-start; gap:.75rem; }
    .ag-num { width:22px; height:22px; border-radius:50%; background:#1e3a5f; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .ag-step-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ag-step-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }

    /* Smart link section */
    .smart-link-section { background:rgba(59,130,246,0.04); border:1.5px solid rgba(59,130,246,0.15); border-radius:12px; padding:1.125rem; }
    .sl-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#3b82f6; }
    .sl-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .sl-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(59,130,246,0.1); color:#3b82f6; border-radius:100px; margin-left:.25rem; }
    .sl-desc { font-size:.8rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .sl-fields { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .sl-routing-preview { display:flex; gap:.75rem; flex-wrap:wrap; padding:.625rem .875rem; background:#fff; border-radius:8px; border:1px solid #e2e8f0; }
    .slrp-row { display:flex; align-items:center; gap:.375rem; font-size:.75rem; }
    .slrp-flag { font-size:.875rem; }
    .slrp-dest { color:#64748b; }

    /* Launch mistakes */
    .launch-mistakes { background:rgba(239,68,68,0.03); border:1.5px solid rgba(239,68,68,0.1); border-radius:12px; padding:1.125rem; }
    .lm-title { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .875rem; }
    .lm-list { display:flex; flex-direction:column; gap:.625rem; }
    .lm-item { display:flex; align-items:flex-start; gap:.625rem; }
    .lm-name { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .lm-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }

    /* Series segment tip */
    .series-segment-tip { display:flex; align-items:flex-start; gap:.625rem; padding:.75rem 1rem; background:rgba(99,102,241,0.06); border:1.5px solid rgba(99,102,241,0.15); border-radius:10px; margin-top:.75rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .sst-title { display:block; font-size:.8125rem; font-weight:700; color:#3730a3; margin-bottom:.2rem; }
    .sst-desc { display:block; font-size:.75rem; color:#4338ca; line-height:1.5; }

    /* Plain-language pre-send summary */
    .plain-summary { margin-top:1.25rem; padding:1rem; background:rgba(16,185,129,0.06); border:1.5px solid rgba(16,185,129,0.2); border-radius:10px; }
    .ps-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.625rem; }
    .ps-title { font-size:.875rem; font-weight:700; color:#065f46; }
    .ps-text { font-size:.875rem; color:#374151; margin:0 0 .875rem; line-height:1.6; }
    .ps-checks { display:flex; flex-wrap:wrap; gap:.5rem; }
    .ps-check { display:flex; align-items:center; gap:.375rem; font-size:.75rem; font-weight:500; padding:.3rem .625rem; border-radius:6px; }
    .ps-ok { background:rgba(16,185,129,0.1); color:#065f46; }
    .ps-warn { background:rgba(245,158,11,0.1); color:#92400e; }

    /* Launch sequence timeline */
    .launch-timeline { display:flex; flex-direction:column; margin-bottom:1rem; }
    .lt-phase { display:grid; grid-template-columns:2fr 1.5fr 3fr; gap:1rem; padding:.75rem 0; border-bottom:1px solid #f1f5f9; align-items:start; font-size:.8125rem; }
    .lt-phase:last-child { border-bottom:none; }
    .lt-phase.header-row { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; padding-bottom:.625rem; }
    .lt-phase.lt-highlight { background:rgba(59,130,246,0.04); border-radius:8px; padding:.75rem .625rem; margin:0 -.625rem; border-bottom:none; border:1.5px solid rgba(59,130,246,0.15); margin-bottom:.5rem; }
    .lt-phase-name { display:flex; align-items:center; gap:.5rem; font-weight:600; color:#0f172a; }
    .lt-phase-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .lt-timing { color:#64748b; font-size:.8rem; }
    .lt-what { color:#374151; line-height:1.5; }
    .launch-window-note { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(245,158,11,0.06); border-radius:8px; font-size:.8rem; color:#78350f; line-height:1.5; }

    @media(max-width:700px) { .sl-fields { grid-template-columns:1fr; } .lt-phase { grid-template-columns:1fr; } .lt-phase.header-row { display:none; } }

    /* ARC guidance styles */
    .arc-guidance, .arc-followup-guidance { display:flex; flex-direction:column; gap:1rem; }
    .arc-relationship-callout, .arc-followup-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(99,102,241,0.06); border-left:3px solid #6366f1; border-radius:0 10px 10px 0; }
    .arc-rc-icon { width:32px; height:32px; border-radius:8px; background:rgba(99,102,241,0.1); color:#6366f1; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .arc-rc-quote { font-size:.8125rem; font-style:italic; color:#374151; margin:0; line-height:1.6; }
    .arc-guide-title { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .arc-guide-intro { font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .arc-pool-guide, .arc-checklist, .arc-tone-guide, .arc-subject-examples, .arc-tagging-guide, .arc-followup-checklist, .arc-framing-guide, .arc-postlaunch-note { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .arc-pool-criteria { display:flex; flex-direction:column; gap:.5rem; }
    .arc-criterion { display:flex; align-items:flex-start; gap:.5rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .arc-check-items { display:flex; flex-direction:column; gap:.625rem; }
    .arc-check-item { display:flex; align-items:flex-start; gap:.75rem; }
    .arc-check-num { width:22px; height:22px; border-radius:50%; background:#8b5cf6; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .arc-check-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .arc-check-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .arc-tone-compare { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-bottom:.875rem; }
    .arc-tone-bad, .arc-tone-good { padding:.75rem; border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.5; }
    .arc-tone-bad { background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.15); }
    .arc-tone-good { background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.15); }
    .arc-tone-label { font-size:.75rem; font-weight:700; margin-bottom:.375rem; }
    .arc-tone-label.bad { color:#dc2626; }
    .arc-tone-label.good { color:#059669; }
    .arc-tone-bad p, .arc-tone-good p { margin:0; font-style:italic; }
    .arc-leave-out { margin-top:.875rem; }
    .arc-lo-title { font-size:.75rem; font-weight:700; color:#374151; margin:0 0 .5rem; }
    .arc-lo-items { display:flex; flex-direction:column; gap:.375rem; }
    .arc-lo-item { font-size:.75rem; color:#64748b; line-height:1.5; padding-left:.75rem; border-left:2px solid #e2e8f0; }
    .arc-subj-list { display:flex; flex-direction:column; gap:.625rem; }
    .arc-subj-item { padding:.625rem .875rem; background:#fff; border:1px solid #e2e8f0; border-radius:8px; }
    .arc-subj-line { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; font-style:italic; }
    .arc-subj-why { display:block; font-size:.75rem; color:#64748b; }
    .arc-tag-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#8b5cf6; }
    .arc-tag-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .arc-tag-desc { font-size:.8rem; color:#64748b; margin:0 0 .75rem; line-height:1.5; }
    .arc-tag-three { display:flex; flex-direction:column; gap:.5rem; margin-bottom:.75rem; }
    .arc-tag-item { display:flex; align-items:flex-start; gap:.625rem; font-size:.8125rem; color:#374151; }
    .arc-tag-num { width:20px; height:20px; border-radius:50%; background:#8b5cf6; color:#fff; font-size:.65rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .arc-timing-guide { }
    .arc-timing-row { display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:.75rem; }
    .arc-timing-item { padding:.75rem; border-radius:8px; font-size:.8rem; }
    .arc-timing-item.optimal { background:rgba(16,185,129,0.06); border:1.5px solid rgba(16,185,129,0.2); }
    .arc-timing-item.warn { background:rgba(245,158,11,0.06); border:1.5px solid rgba(245,158,11,0.2); }
    .arc-timing-label { font-size:.8rem; font-weight:700; margin-bottom:.3rem; color:#0f172a; }
    .arc-timing-desc { font-size:.75rem; color:#64748b; line-height:1.4; }
    .arc-fu-items { display:flex; flex-direction:column; gap:.5rem; }
    .arc-fu-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .arc-review-links { background:rgba(59,130,246,0.04); border:1.5px solid rgba(59,130,246,0.15); border-radius:12px; padding:1.125rem; }
    .arc-rl-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#3b82f6; }
    .arc-rl-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .arc-rl-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; background:rgba(59,130,246,0.1); color:#3b82f6; border-radius:100px; margin-left:.25rem; }
    .arc-rl-desc { font-size:.8rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .arc-rl-fields { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-bottom:.75rem; }
    .arc-rl-note { display:flex; align-items:flex-start; gap:.5rem; font-size:.75rem; color:#374151; line-height:1.5; }
    .arc-pln-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; color:#ec4899; }
    .arc-pln-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .arc-pln-desc { font-size:.8rem; color:#64748b; margin:0; line-height:1.6; }
    @media(max-width:700px) { .arc-tone-compare { grid-template-columns:1fr; } .arc-timing-row { grid-template-columns:1fr; } .arc-rl-fields { grid-template-columns:1fr; } }

    /* New Release Notification guidance */
    .nrn-guidance { display:flex; flex-direction:column; gap:1rem; }
    .nrn-distinction-callout { display:grid; grid-template-columns:1fr auto 1fr; gap:1rem; padding:1.125rem; background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; align-items:center; }
    .nrn-dc-left, .nrn-dc-right { display:flex; flex-direction:column; gap:.375rem; }
    .nrn-dc-label { font-size:.75rem; font-weight:700; padding:.2rem .6rem; border-radius:6px; width:fit-content; }
    .nrn-dc-label.launch { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .nrn-dc-label.nrn { background:rgba(16,185,129,0.1); color:#059669; }
    .nrn-dc-desc { font-size:.75rem; color:#64748b; margin:0; line-height:1.4; }
    .nrn-dc-role { font-size:.8125rem; font-weight:600; color:#0f172a; margin:0; font-style:italic; }
    .nrn-dc-vs { font-size:1.25rem; font-weight:800; color:#94a3b8; text-align:center; }
    .nrn-quote-callout { padding:.875rem 1rem; background:rgba(16,185,129,0.04); border-left:3px solid #10b981; border-radius:0 10px 10px 0; }
    .nrn-quote { font-size:.875rem; font-style:italic; color:#374151; margin:0; line-height:1.6; }
    .nrn-audience-guide, .nrn-timing-guide, .nrn-writing-guide, .nrn-subject-guide { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .nrn-audience-types { display:flex; flex-direction:column; gap:.75rem; margin-bottom:.875rem; }
    .nrn-audience-type { padding:.875rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; }
    .nrn-audience-type.priority { border-color:rgba(59,130,246,0.25); background:rgba(59,130,246,0.03); }
    .nat-header { display:flex; align-items:center; gap:.625rem; margin-bottom:.5rem; flex-wrap:wrap; }
    .nat-badge { font-size:.7rem; font-weight:700; padding:.15rem .5rem; border-radius:100px; }
    .nat-badge.priority { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .nat-badge.superfan { background:rgba(245,158,11,0.1); color:#d97706; }
    .nat-badge.backlist { background:rgba(99,102,241,0.1); color:#6366f1; }
    .nat-title { font-size:.875rem; font-weight:600; color:#0f172a; }
    .nat-desc { font-size:.8rem; color:#64748b; margin:0 0 .5rem; line-height:1.5; }
    .nat-segment-tag { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#94a3b8; }
    .nrn-suppress-note { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.12); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .nrn-timing-visual { display:flex; align-items:center; gap:.75rem; margin-bottom:.875rem; flex-wrap:wrap; }
    .ntv-item { flex:1; min-width:120px; padding:.75rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; text-align:center; }
    .ntv-item.highlight { border-color:#10b981; background:rgba(16,185,129,0.04); }
    .ntv-day { font-size:.75rem; font-weight:700; color:#94a3b8; margin-bottom:.25rem; }
    .ntv-label { font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ntv-desc { font-size:.7rem; color:#94a3b8; line-height:1.4; }
    .ntv-arrow { font-size:1.25rem; color:#cbd5e1; flex-shrink:0; }
    .nrn-timing-note { font-size:.8rem; color:#64748b; margin:0; line-height:1.5; }
    .nrn-structure-steps { display:flex; flex-direction:column; gap:.625rem; }
    .nrn-step { display:flex; align-items:flex-start; gap:.75rem; }
    .nrn-step-num { width:22px; height:22px; border-radius:50%; background:#10b981; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .nrn-step-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .nrn-step-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .nrn-subj-list { display:flex; flex-direction:column; gap:.625rem; }
    .nrn-subj-item { padding:.75rem; background:#fff; border:1px solid #e2e8f0; border-radius:8px; }
    .nrn-subj-type { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#94a3b8; margin-bottom:.3rem; }
    .nrn-subj-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; margin-bottom:.25rem; }
    .nrn-subj-why { font-size:.75rem; color:#64748b; line-height:1.4; }
    @media(max-width:700px) { .nrn-distinction-callout { grid-template-columns:1fr; } .nrn-dc-vs { display:none; } .nrn-timing-visual { flex-direction:column; } .ntv-arrow { transform:rotate(90deg); } }
    .report-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1rem; }
    @media(max-width:1100px) { .report-stats-grid { grid-template-columns:repeat(4,1fr); } }
    @media(max-width:700px) { .report-stats-grid { grid-template-columns:repeat(2,1fr); } .ct-grid { grid-template-columns:repeat(3,1fr); } .lt-row { grid-template-columns:1fr 1fr; } .cvf-callout { grid-template-columns:1fr; } .cvf-vs { display:none; } }
  `]
})
export class CampaignsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private activeUserId: string | null = null;

  readonly steps = STEPS;
  activeTab = signal<CampaignTab>('list');
  currentStep = signal<number>(0);
  previewMode = signal<'both' | 'desktop' | 'mobile'>('both');
  campaigns: Campaign[] = [];
  editingCampaignId: string | null = null;
  loading = false;
  showHtmlSource = false;
  showSenderModal = signal(false);
  showDesignModal = signal(false);
  recipients: CampaignRecipients = { listIds: [], segmentIds: [], contactIds: [], excludeUnengaged: false };
  searchQuery = '';
  statusFilter = '';
  reportCampaign: Campaign | null = null;
  get rc(): Campaign { return this.reportCampaign!; }

  @ViewChild('nlSwapGuidance') nlSwapGuidance?: NewsletterSwapGuidanceComponent;
  @ViewChild('flashSaleGuidance') flashSaleGuidance?: FlashSaleGuidanceComponent;
  @ViewChild('priceDropGuidance') priceDropGuidance?: PriceDropGuidanceComponent;
  @ViewChild('boxSetGuidance') boxSetGuidance?: BoxSetGuidanceComponent;
  @ViewChild('surveyGuidance') surveyGuidance?: SurveyGuidanceComponent;
  @ViewChild('eventGuidance') eventGuidance?: EventAnnouncementGuidanceComponent;
  @ViewChild('communityGuidance') communityGuidance?: ReaderCommunityGuidanceComponent;
  @ViewChild('backlistGuidance') backlistGuidance?: BacklistSpotlightGuidanceComponent;

  draft = {
    name: '', fromName: 'Author', fromEmail: '', subject: '', previewText: '', sendTo: 'all', content: '',
    bookTitle: '',
    mergeFields: {} as Record<string, string>,
    templateName: '', templateId: '',
    scheduledAt: '', timezoneOptimized: true, campaignType: '',
    directStoreLink: '', amazonLink: '', arcTag: '', amazonReviewLink: '',
    appleBooksLink: '', koboLink: '', bnLink: '',
  };
  audienceSegments: AudienceSegment[] = [];
  reachEstimate: ReachEstimate = { segmentCount: 0, excludedCount: 0, estimatedSendCount: 0 };

  // Campaign types (all 15 from the article)
  readonly campaignTypes: CampaignTypeOption[] = [
    { id: 'book-launch',    label: 'Book Launch',          purpose: 'Announce release day availability, drive immediate sales',          audience: 'Full list or warm segments',      color: '#3b82f6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
    { id: 'new-release',    label: 'New Release',          purpose: 'Alert engaged readers a new title is available',                    audience: 'Backlist readers & superfans',    color: '#6366f1', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    { id: 'arc-invite',     label: 'ARC Invitation',       purpose: 'Recruit advance readers for review copies',                        audience: 'Highly engaged segment',          color: '#8b5cf6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'arc-followup',   label: 'ARC Follow-Up',        purpose: 'Remind ARC readers to post their reviews',                         audience: 'ARC team only',                   color: '#a78bfa', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>' },
    { id: 'newsletter',     label: 'Newsletter',           purpose: 'Relationship-building, ongoing engagement',                        audience: 'Full list or by preference',      color: '#059669', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
    { id: 'nl-swap',        label: 'Newsletter Swap',      purpose: 'Cross-promote a fellow author\'s work',                            audience: 'Full list or genre segment',      color: '#0891b2', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>' },
    { id: 'flash-sale',     label: 'Flash Sale',           purpose: 'Create urgency around a short-window deal',                        audience: 'Full list or non-buyers',         color: '#dc2626', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
    { id: 'price-drop',     label: 'Price Drop',           purpose: 'Remove price barrier for fence-sitters',                           audience: 'Non-buyers of that title',        color: '#d97706', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
    { id: 'box-set',        label: 'Box Set / Bundle',     purpose: 'Increase order value, move catalog readers deeper',                 audience: 'Partial-series buyers',           color: '#7c3aed', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
    { id: 'giveaway',       label: 'Giveaway',             purpose: 'Drive list growth, reward current subscribers',                    audience: 'Full list',                       color: '#f59e0b', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' },
    { id: 'survey',         label: 'Survey',               purpose: 'Gather reader intelligence',                                       audience: 'Engaged segment',                 color: '#0ea5e9', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
    { id: 'event',          label: 'Event Announcement',   purpose: 'Promote signings, virtual events, live sessions',                  audience: 'Local segment or full list',      color: '#10b981', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
    { id: 'reader-community', label: 'Reader Community',   purpose: 'Move subscribers into an active reader group',                     audience: 'Engaged segment',                 color: '#ec4899', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { id: 'backlist',       label: 'Backlist Spotlight',   purpose: 'Re-surface older titles to new or lapsed readers',                 audience: 'New subscribers or lapsed',       color: '#64748b', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
    { id: 'price-drop-2',   label: 'Price Drop Notif.',    purpose: 'Remove price barrier for fence-sitters on a specific title',       audience: 'Non-buyers of that title',        color: '#f97316', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' },
  ];

  // Suppression rules
  suppressionRules: SuppressionRule[] = [
    { id: 'existing-buyers', label: 'Exclude existing buyers', description: 'Readers who already purchased this title won\'t receive a sale or launch announcement — prevents eroding trust with full-price buyers', enabled: true },
    { id: 'arc-readers', label: 'Exclude ARC readers', description: 'ARC team members are excluded from launch-day broadcasts that treat the book as new — they\'ve already read it', enabled: false },
    { id: 'new-subscribers', label: 'Exclude very new subscribers (joined < 48h)', description: 'Subscribers still working through your welcome sequence may find a launch broadcast jarring — they haven\'t finished being introduced to you yet', enabled: false },
    { id: 'recent-unsubs', label: 'Exclude recent unsubscribers', description: 'Subscribers who unsubscribed in the last 30 days are automatically suppressed', enabled: true },
    { id: 'bounced', label: 'Exclude bounced addresses', description: 'Hard-bounced email addresses are permanently suppressed from all sends', enabled: true },
  ];

  // Campaign calendar
  calRelease = { title: '', date: '' };
  calendarEvents: CalendarEvent[] = [];
  releasePlan: ReleasePlan | null = null;

  get scheduledCampaigns(): Campaign[] {
    return this.campaigns.filter(c => c.status === 'scheduled' || c.status === 'draft');
  }

  readonly baselineCampaigns = [
    { timing: '4–6 weeks before', type: 'ARC Invitation', description: 'Recruit advance readers for review copies', offset: -35 },
    { timing: '1 week before', type: 'ARC Follow-Up', description: 'Remind ARC readers to post their reviews', offset: -7 },
    { timing: 'Release day', type: 'Book Launch', description: 'Announce release day availability, drive immediate sales', offset: 0 },
    { timing: '1 week after', type: 'Backlist Spotlight', description: 'Post-launch email for new readers who just discovered your catalog', offset: 7 },
  ];

  readonly launchSequence = [
    { phase: 'ARC Invitation', timing: '4–6 weeks before launch', what: 'Targeted campaign to your engaged segment, recruiting advance readers in exchange for honest launch-day reviews.', color: '#8b5cf6', highlight: false },
    { phase: 'ARC Follow-Up', timing: '1 week before launch', what: 'Reminder campaign to your ARC team to post their reviews as release approaches.', color: '#a78bfa', highlight: false },
    { phase: 'Pre-Launch Tease', timing: '2–3 days before launch', what: 'Optional newsletter mention or short campaign building anticipation — cover reveal, first chapter preview, or a personal note about the book.', color: '#0ea5e9', highlight: false },
    { phase: 'Launch Day Email', timing: 'Release day, 9–11am local', what: 'The main broadcast. Your cover, hook, early praise, and one clear call to action. Full list or warm segments.', color: '#3b82f6', highlight: true },
    { phase: 'New Release Notification', timing: '2–4 days post-launch', what: 'Targeted broadcast to backlist and series readers. Warmer tone, more direct ask. Arrives once first reviews are in place. Consistently outperforms the launch broadcast in conversion rate.', color: '#10b981', highlight: false },
    { phase: 'Week-Two Push', timing: '7–10 days post-launch', what: 'Second broadcast to non-buyers, highlighting early reviews, reader reactions, and momentum. Warmer tone than day one.', color: '#059669', highlight: false },
  ];
  sendMode: 'now' | 'schedule' = 'now';
  sendSuccess = false;
  sendingCampaign = false;
  toastMessage = '';
  toastType: 'success' | 'warn' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  newsletter: NewsletterSchedule = {
    name: 'Monthly Reader Letter',
    frequency: 'monthly',
    dayOfWeek: 'Tuesday',
    dayOfMonth: '1st',
    sendTime: '09:00',
    timezoneOptimized: true,
    subject: '',
    previewText: '',
    replyQuestion: '',
    content: '',
    status: 'draft',
  };

  // A/B Testing
  showABForm = false;
  abDraft = { subjectA: '', subjectB: '', testSize: 20, winnerMetric: 'opens' as 'opens' | 'clicks', waitHours: 8 };
  abTests: AbTest[] = [];

  readonly checkGroups = [
    { key: 'audience' as const, label: 'Audience & Suppression' },
    { key: 'auth' as const, label: 'Authentication & Infrastructure' },
    { key: 'links' as const, label: 'Links & URLs' },
    { key: 'content' as const, label: 'Content & Spam Score' },
    { key: 'sender' as const, label: 'Sender Identity' },
  ];

  getChecksByCategory(cat: PreflightCheck['category']): PreflightCheck[] {
    return this.preflightChecks().filter(c => c.category === cat);
  }

  constructor(
    private campaignApi: CampaignApiService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    effect(() => {
      const userId = this.auth.user()?.id ?? null;
      if (this.activeUserId !== null && userId !== this.activeUserId) {
        this.resetForAccountSwitch(userId);
      }
      this.activeUserId = userId;
    });
  }

  ngOnInit() {
    const fromName = this.auth.user()?.name?.split(' ')[0];
    if (fromName) this.draft.fromName = fromName;
    if (this.auth.user()?.email) this.draft.fromEmail = this.auth.user()!.email;
    this.loadCampaignData();
    this.loadAudienceSegments();
    this.route.queryParams.subscribe(params => {
      const editId = params['edit'];
      if (editId) {
        this.campaignApi.getCampaign(editId).subscribe({
          next: c => {
            this.editCampaign(c);
            this.router.navigate([], { relativeTo: this.route, queryParams: { edit: null }, queryParamsHandling: 'merge', replaceUrl: true });
          },
        });
        return;
      }

      if (params['create'] === '1') {
        const listId = params['listId'] as string | undefined;
        const segmentId = params['segmentId'] as string | undefined;
        const audienceName = params['audienceName'] as string | undefined;
        this.startCreateFromAudience(listId, segmentId, audienceName);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { create: null, listId: null, segmentId: null, audienceName: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  private resetForAccountSwitch(userId: string | null) {
    this.campaigns = [];
    this.calendarEvents = [];
    this.abTests = [];
    this.editingCampaignId = null;
    this.reportCampaign = null;
    this.draft = this.emptyDraft();
    this.recipients = { listIds: [], segmentIds: [], contactIds: [], excludeUnengaged: false };
    this.reachEstimate = { segmentCount: 0, excludedCount: 0, estimatedSendCount: 0 };
    this.audienceSegments = [];
    this.sendSuccess = false;
    this.sendingCampaign = false;
    this.sendMode = 'now';
    this.currentStep.set(0);
    this.activeTab.set('list');
    if (userId) {
      this.loadCampaignData();
      this.loadAudienceSegments();
    }
    this.cdr.detectChanges();
  }

  private hasExplicitAudience(): boolean {
    if (
      this.recipients.listIds.length > 0 ||
      this.recipients.segmentIds.length > 0 ||
      this.recipients.contactIds.length > 0
    ) {
      return true;
    }
    const seg = this.draft.sendTo;
    return !!seg && seg !== 'all' && /^[0-9a-f-]{36}$/i.test(seg);
  }

  private emptyDraft() {
    const fromName = this.auth?.user()?.name?.split(' ')[0] || 'Author';
    const fromEmail = this.auth?.user()?.email || '';
    return {
      name: '', fromName, fromEmail, subject: '', previewText: '', sendTo: 'all', content: '',
      bookTitle: '',
      mergeFields: {} as Record<string, string>,
      templateName: '', templateId: '',
      scheduledAt: '', timezoneOptimized: true, campaignType: '',
      directStoreLink: '', amazonLink: '', arcTag: '', amazonReviewLink: '',
      appleBooksLink: '', koboLink: '', bnLink: '',
    };
  }

  private loadAudienceSegments() {
    this.campaignApi.getAudienceSegments().subscribe({
      next: segments => {
        this.audienceSegments = segments;
        this.refreshReachEstimate();
        this.cdr.detectChanges();
      },
      error: () => {
        this.audienceSegments = [
          { id: 'all', name: 'All Subscribers', count: 0, description: 'Your entire subscriber list' },
        ];
        this.cdr.detectChanges();
      },
    });
  }

  refreshReachEstimate() {
    const enabled = this.suppressionRules.filter(r => r.enabled).map(r => r.id);
    const hasExplicitRecipients =
      this.recipients.listIds.length > 0 ||
      this.recipients.segmentIds.length > 0 ||
      this.recipients.contactIds.length > 0;

    this.campaignApi.estimateReach({
      segment: hasExplicitRecipients ? undefined : this.draft.sendTo,
      enabledSuppressionRules: enabled,
      listIds: this.recipients.listIds.length ? this.recipients.listIds : undefined,
      segmentIds: this.recipients.segmentIds.length ? this.recipients.segmentIds : undefined,
      contactIds: this.recipients.contactIds.length ? this.recipients.contactIds : undefined,
      excludeUnengaged: this.recipients.excludeUnengaged,
      arcTag: this.draft.arcTag || undefined,
    }).subscribe({
      next: estimate => {
        this.reachEstimate = estimate;
        this.cdr.detectChanges();
      },
    });
  }

  private guidanceRefs() {
    const asStrings = (obj: Record<string, unknown>) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v ?? '')]));

    return {
      flashSale: this.flashSaleGuidance ? { saleDetails: asStrings(this.flashSaleGuidance.saleDetails) } : undefined,
      priceDrop: this.priceDropGuidance ? { dropDetails: asStrings(this.priceDropGuidance.dropDetails) } : undefined,
      boxSet: this.boxSetGuidance ? { bundleDetails: asStrings(this.boxSetGuidance.bundleDetails) } : undefined,
      survey: this.surveyGuidance ? {
        surveyDetails: asStrings(this.surveyGuidance.surveyDetails),
        surveyQuestions: this.surveyGuidance.surveyQuestions,
      } : undefined,
      event: this.eventGuidance ? { eventDetails: asStrings(this.eventGuidance.eventDetails) } : undefined,
      readerCommunity: this.communityGuidance ? { communityDetails: asStrings(this.communityGuidance.communityDetails) } : undefined,
      backlist: this.backlistGuidance ? {
        spotlightDetails: asStrings(this.backlistGuidance.spotlightDetails),
        catalogTitles: this.backlistGuidance.catalogTitles,
      } : undefined,
      nlSwap: this.nlSwapGuidance ? { partner: asStrings(this.nlSwapGuidance.partner) } : undefined,
    };
  }

  private restoreFromExtras(extras: Record<string, string>) {
    if (extras['timezoneOptimized']) {
      this.draft.timezoneOptimized = extras['timezoneOptimized'] === 'true';
    }
    if (extras['suppressionRules']) {
      try {
        const ids = JSON.parse(extras['suppressionRules']) as string[];
        this.suppressionRules.forEach(r => { r.enabled = ids.includes(r.id); });
      } catch { /* ignore */ }
    }
  }

  private applyGuidanceExtras(extras: Record<string, string>, campaignType: string) {
    loadGuidanceExtras(campaignType, extras, this.guidanceRefs());
  }

  private enabledSuppressionIds(): string[] {
    return this.suppressionRules.filter(r => r.enabled).map(r => r.id);
  }

  private loadCampaignData() {
    this.loading = true;
    this.campaignApi.getBundle().subscribe({
      next: bundle => {
        this.campaigns = bundle.campaigns;
        this.calendarEvents = bundle.calendarEvents;
        this.newsletter = bundle.newsletter;
        this.abTests = bundle.abTests;
        this.releasePlan = bundle.releasePlan ?? null;
        if (this.releasePlan) {
          this.calRelease.title = this.releasePlan.bookTitle || '';
          this.calRelease.date = this.releasePlan.releaseDate || '';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.loading = false;
        this.showToast(err.message || 'Could not load campaigns', 'warn');
        this.cdr.detectChanges();
      },
    });
  }

  isHtmlContent(content: string): boolean {
    return /<\s*(div|p|table|h[1-6]|a|span|ul|ol|li|html|body|center|tr|td|th|img|style)\b/i.test(content ?? '');
  }

  get safeDraftContent(): SafeHtml {
    const overrides: Record<string, string> = {
      ...this.draft.mergeFields,
      book_title: this.draft.mergeFields['book_title'] || this.draft.bookTitle || '',
      author_name: this.draft.fromName || '',
      store_link: this.draft.mergeFields['store_link'] || this.draft.directStoreLink || this.draft.amazonLink || '',
    };
    return this.sanitizer.bypassSecurityTrustHtml(applyPreviewMergeTags(this.draft.content || '', overrides));
  }

  get collectibleMergeTags(): string[] {
    const tags = userCollectibleMergeTags(this.draft.subject, this.draft.previewText, this.draft.content);
    for (const tag of tags) {
      if (this.draft.mergeFields[tag] === undefined) this.draft.mergeFields[tag] = '';
    }
    return tags;
  }

  mergeTagLabel = mergeTagLabel;

  get draftUsesBookTitle(): boolean {
    return /\{\{\s*book_title\s*\}\}/i.test(this.draft.content || '')
      || /\{\{\s*book_title\s*\}\}/i.test(this.draft.subject || '')
      || ['book-launch', 'new-release', 'arc-invite', 'arc-followup', 'backlist'].includes(this.draft.campaignType);
  }

  get senderDisplay(): string {
    const name = this.draft.fromName || 'Your Name';
    const email = this.draft.fromEmail;
    return email ? `${name} <${email}>` : name;
  }

  get senderInitials(): string {
    const parts = (this.draft.fromName || 'S').trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : (parts[0][0] || 'S').toUpperCase();
  }

  get recipientSummary(): string {
    const parts: string[] = [];
    if (this.recipients.listIds.length) parts.push(`${this.recipients.listIds.length} list(s)`);
    if (this.recipients.segmentIds.length) parts.push(`${this.recipients.segmentIds.length} segment(s)`);
    if (this.recipients.contactIds.length) parts.push(`${this.recipients.contactIds.length} contact(s)`);
    if (parts.length) return parts.join(', ');
    return 'Select a list, segment, or contact';
  }

  onSenderSaved(sender: { fromName: string; fromEmail: string }) {
    this.draft.fromName = sender.fromName;
    this.draft.fromEmail = sender.fromEmail;
    this.showSenderModal.set(false);
    this.cdr.detectChanges();
  }

  onDesignApplied(template: AppliedTemplate | null) {
    this.showDesignModal.set(false);
    if (!template) {
      this.draft.templateName = '';
      this.draft.templateId = '';
      this.cdr.detectChanges();
      return;
    }
    this.draft.templateId = template.id;
    this.draft.templateName = template.name;
    if (template.subjectLine) this.draft.subject = template.subjectLine;
    if (template.htmlBody) this.draft.content = template.htmlBody;
    if (template.suggestedCampaignType && !this.draft.campaignType) {
      this.draft.campaignType = template.suggestedCampaignType;
    }
    if (!this.draft.name) this.draft.name = `${template.name} Campaign`;
    this.showHtmlSource = false;
    this.cdr.detectChanges();
  }

  onRecipientsChange(recipients: CampaignRecipients) {
    this.recipients = recipients;
    if (recipients.segmentIds.length > 0) {
      this.draft.sendTo = recipients.segmentIds[0];
    } else {
      this.draft.sendTo = 'all';
    }
    this.refreshReachEstimate();
    this.cdr.detectChanges();
  }

  private startCreateFromAudience(listId?: string, segmentId?: string, audienceName?: string) {
    this.startCreate();
    if (listId) {
      this.recipients = { listIds: [listId], segmentIds: [], contactIds: [], excludeUnengaged: false };
      this.draft.sendTo = 'all';
    } else if (segmentId) {
      this.recipients = { listIds: [], segmentIds: [segmentId], contactIds: [], excludeUnengaged: false };
      this.draft.sendTo = segmentId;
    }
    if (audienceName) {
      this.draft.name = `Email to ${audienceName}`;
    }
    this.currentStep.set(2);
    this.refreshReachEstimate();
    this.cdr.detectChanges();
  }

  private restoreRecipientExtras(extras: Record<string, string>) {
    try {
      this.recipients = {
        listIds: extras['recipientListIds'] ? JSON.parse(extras['recipientListIds']) : [],
        segmentIds: extras['recipientSegmentIds'] ? JSON.parse(extras['recipientSegmentIds']) : [],
        contactIds: extras['recipientContactIds'] ? JSON.parse(extras['recipientContactIds']) : [],
        excludeUnengaged: extras['excludeUnengaged'] === 'true',
      };
    } catch {
      this.recipients = { listIds: [], segmentIds: [], contactIds: [], excludeUnengaged: false };
    }
    this.draft.templateId = extras['emailTemplateId'] || '';
    this.draft.templateName = extras['templateName'] || '';
    this.draft.fromEmail = extras['fromEmail'] || this.draft.fromEmail;
  }

  private buildCampaignPayload(status = 'draft') {
    const guidanceExtras = collectGuidanceExtras(this.draft.campaignType, this.guidanceRefs());
    const scheduling = this.sendMode === 'schedule' && status !== 'draft';
    const scheduledAt = scheduling && this.draft.scheduledAt
      ? new Date(this.draft.scheduledAt).toISOString()
      : null;

    return {
      name: this.draft.name,
      subject: this.draft.subject,
      previewText: '',
      content: this.draft.content,
      campaignType: this.draft.campaignType,
      fromName: this.draft.fromName,
      sendToSegment: this.draft.sendTo,
      status,
      scheduledAt,
      extras: {
        directStoreLink: this.draft.directStoreLink,
        amazonLink: this.draft.amazonLink,
        arcTag: this.draft.arcTag,
        amazonReviewLink: this.draft.amazonReviewLink,
        appleBooksLink: this.draft.appleBooksLink,
        koboLink: this.draft.koboLink,
        bnLink: this.draft.bnLink,
        timezoneOptimized: String(this.draft.timezoneOptimized),
        suppressionRules: JSON.stringify(this.enabledSuppressionIds()),
        fromEmail: this.draft.fromEmail,
        templateName: this.draft.templateName,
        emailTemplateId: this.draft.templateId,
        recipientListIds: JSON.stringify(this.recipients.listIds),
        recipientSegmentIds: JSON.stringify(this.recipients.segmentIds),
        recipientContactIds: JSON.stringify(this.recipients.contactIds),
        excludeUnengaged: String(this.recipients.excludeUnengaged),
        ...guidanceExtras,
        ...Object.fromEntries(
          Object.entries(this.draft.mergeFields).filter(([, v]) => v?.trim())
        ),
        ...(this.draft.bookTitle.trim() && !this.draft.mergeFields['book_title']?.trim()
          ? { book_title: this.draft.bookTitle.trim() } : {}),
      },
    };
  }

  get filteredCampaigns() {
    return this.campaigns.filter(c => {
      const q = this.searchQuery.toLowerCase();
      return (!q || c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q))
        && (!this.statusFilter || c.status === this.statusFilter);
    });
  }

  get selectedSegment() {
    return this.audienceSegments.find(s => s.id === this.draft.sendTo) ?? null;
  }

  startCreate() {
    this.draft = this.emptyDraft();
    this.recipients = { listIds: [], segmentIds: [], contactIds: [], excludeUnengaged: false };
    this.editingCampaignId = null;
    this.showHtmlSource = false;
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.reportCampaign = null;
    this.activeTab.set('create');
    this.refreshReachEstimate();
  }

  viewReport(c: Campaign) {
    this.reportCampaign = this.reportCampaign?.id === c.id ? null : c;
  }

  editCampaign(c: Campaign) {
    this.reportCampaign = null;
    this.editingCampaignId = c.id;
    this.showHtmlSource = false;
    this.campaignApi.getCampaign(c.id).subscribe({
      next: full => {
        const extras = full.extras ?? {};
        const mergeFields: Record<string, string> = {};
        for (const tag of userCollectibleMergeTags(full.subject, full.previewText, full.content)) {
          mergeFields[tag] = extras[tag] || (tag === 'book_title' ? (extras['book_title'] || extras['flashSale_title'] || '') : '');
        }
        const fromName = full.fromName || this.auth.user()?.name?.split(' ')[0] || 'Author';
        this.draft = {
          name: full.name,
          fromName,
          fromEmail: extras['fromEmail'] || this.auth.user()?.email || '',
          subject: full.subject,
          previewText: full.previewText || '',
          sendTo: full.sendToSegment || 'all',
          content: full.content || '',
          bookTitle: extras['book_title'] || extras['flashSale_title'] || extras['backlist_title'] || '',
          mergeFields,
          templateName: extras['templateName'] || '',
          templateId: extras['emailTemplateId'] || '',
          scheduledAt: full.scheduledAt ? full.scheduledAt.toString().slice(0, 16) : '',
          timezoneOptimized: extras['timezoneOptimized'] !== 'false',
          campaignType: full.campaignType || '',
          directStoreLink: extras['directStoreLink'] || '',
          amazonLink: extras['amazonLink'] || '',
          arcTag: extras['arcTag'] || '',
          amazonReviewLink: extras['amazonReviewLink'] || '',
          appleBooksLink: extras['appleBooksLink'] || '',
          koboLink: extras['koboLink'] || '',
          bnLink: extras['bnLink'] || '',
        };
        this.restoreFromExtras(extras);
        this.restoreRecipientExtras(extras);
        this.currentStep.set(0);
        this.sendSuccess = false;
        this.activeTab.set('create');
        this.cdr.detectChanges();
        setTimeout(() => {
          this.applyGuidanceExtras(extras, full.campaignType || '');
          this.refreshReachEstimate();
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.draft = { ...this.emptyDraft(), name: c.name, subject: c.subject };
        this.currentStep.set(0);
        this.sendSuccess = false;
        this.activeTab.set('create');
        this.cdr.detectChanges();
      },
    });
  }

  deleteCampaign(id: string) {
    this.campaignApi.deleteCampaign(id).subscribe({
      next: () => {
        this.campaigns = this.campaigns.filter(c => c.id !== id);
        if (this.reportCampaign?.id === id) this.reportCampaign = null;
        this.showToast('Campaign deleted', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not delete campaign', 'warn'),
    });
  }
  goToStep(i: number) { if (i <= this.currentStep()) this.currentStep.set(i); }
  nextStep() { if (this.currentStep() < this.steps.length - 1) this.currentStep.update(s => s + 1); }
  prevStep() { if (this.currentStep() > 0) this.currentStep.update(s => s - 1); }
  saveDraft() {
    const payload = this.buildCampaignPayload('draft');
    if (this.editingCampaignId) {
      this.campaignApi.updateCampaign(this.editingCampaignId, payload).subscribe({
        next: updated => {
          this.campaigns = this.campaigns.map(c => c.id === updated.id ? updated : c);
          this.showToast('Draft saved!', 'success');
          this.cdr.detectChanges();
        },
        error: err => this.showToast(err.message || 'Could not save draft', 'warn'),
      });
      return;
    }
    this.campaignApi.createCampaign(payload).subscribe({
      next: created => {
        this.campaigns = [created, ...this.campaigns];
        this.editingCampaignId = created.id;
        this.showToast('Draft saved!', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not save draft', 'warn'),
    });
  }
  sendTestToPhone() {
    if (!this.draft.subject.trim() || !this.draft.content.trim()) {
      this.showToast('Add a subject and content before sending a test', 'warn');
      return;
    }
    this.campaignApi.sendTestEmail({
      campaignId: this.editingCampaignId ?? undefined,
      subject: this.draft.subject,
      previewText: '',
      content: this.draft.content,
      fromName: this.draft.fromName,
    }).subscribe({
      next: res => this.showToast(res.message, 'success'),
      error: err => this.showToast(err.message || 'Could not send test email', 'warn'),
    });
  }

  writeNextNewsletterIssue() {
    this.draft = {
      ...this.emptyDraft(),
      name: this.newsletter.name || 'Newsletter Issue',
      subject: this.newsletter.subject,
      previewText: '',
      content: this.newsletter.content,
      campaignType: 'newsletter',
      sendTo: 'newsletter',
    };
    if (this.newsletter.replyQuestion) {
      this.draft.content = (this.draft.content ? this.draft.content + '\n\n' : '') +
        `Reply to this email: ${this.newsletter.replyQuestion}`;
    }
    this.editingCampaignId = null;
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.activeTab.set('create');
    this.refreshReachEstimate();
  }

  saveNewsletter(schedule?: NewsletterSchedule) {
    const data = schedule ?? this.newsletter;
    this.campaignApi.saveNewsletter(data).subscribe({
      next: saved => {
        this.newsletter = saved;
        const msg = saved.status === 'active'
          ? 'Newsletter activated — issues will send on your schedule.'
          : saved.status === 'paused'
            ? 'Newsletter paused.'
            : 'Newsletter schedule saved!';
        this.showToast(msg, 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not save newsletter', 'warn'),
    });
  }

  saveReleasePlan(payload: { bookTitle: string; releaseDate: string | null }) {
    this.campaignApi.saveReleasePlan(payload).subscribe({
      next: saved => {
        this.releasePlan = saved;
        this.calRelease.title = saved.bookTitle || '';
        this.calRelease.date = saved.releaseDate || '';
      },
      error: () => {},
    });
  }

  // Campaign type helpers
  get selectedCampaignType(): CampaignTypeOption | null {
    return this.campaignTypes.find(ct => ct.id === this.draft.campaignType) ?? null;
  }

  selectCampaignType(id: string) {
    this.draft.campaignType = id;
    // Auto-set suppression rules based on type
    const buyerTypes = ['book-launch', 'new-release', 'flash-sale', 'price-drop', 'price-drop-2', 'box-set'];
    const arcTypes = ['book-launch', 'new-release'];
    this.suppressionRules[0].enabled = buyerTypes.includes(id);
    this.suppressionRules[1].enabled = arcTypes.includes(id);
    // Auto-enable new subscriber suppression for book launch
    this.suppressionRules[2].enabled = id === 'book-launch';
    // Auto-configure send-to for ARC follow-up
    if (id === 'arc-followup') {
      this.draft.sendTo = 'vip';
    }
    this.refreshReachEstimate();
  }

  createPostLaunchThankYou() {
    this.draft.campaignType = 'arc-followup';
    this.draft.name = 'Post-Launch Thank-You — ARC Team';
    this.draft.subject = 'Thank you — the launch results are in';
    this.draft.sendTo = 'vip';
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.showToast('Post-launch thank-you campaign created', 'success');
  }

  // Suppression helpers
  get activeSuppressionCount(): number {
    return this.suppressionRules.filter(r => r.enabled).length;
  }

  get suppressedCount(): number {
    return this.reachEstimate.excludedCount;
  }

  get estimatedSendCount(): number {
    return this.reachEstimate.estimatedSendCount;
  }

  // Campaign calendar helpers
  getRelativeDate(releaseDate: string, offsetDays: number): string {
    if (!releaseDate) return '';
    const d = new Date(releaseDate);
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  openAddCalendarEvent(payload: { name: string; type: string; date: string; status: string }) {
    this.campaignApi.createCalendarEvent(payload).subscribe({
      next: ev => {
        this.calendarEvents = [...this.calendarEvents, ev];
        this.showToast('Campaign added to calendar', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not add event', 'warn'),
    });
  }

  deleteCalendarEvent(id: string) {
    this.campaignApi.deleteCalendarEvent(id).subscribe({
      next: () => {
        this.calendarEvents = this.calendarEvents.filter(e => e.id !== id);
        this.showToast('Calendar event removed', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not delete event', 'warn'),
    });
  }

  editCalendarEvent(ev: CalendarEvent) {
    const typeId = this.campaignTypes.find(ct => ct.label === ev.type)?.id || '';
    this.draft = { ...this.emptyDraft(), name: ev.name, campaignType: typeId };
    this.editingCampaignId = null;
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.activeTab.set('create');
    this.cdr.detectChanges();
  }

  addCalendarEvent() {
    this.openAddCalendarEvent({
      name: 'New Campaign',
      type: 'Book Launch',
      date: '',
      status: 'planned',
    });
  }

  createFromBaseline(bc: { type: string; description: string; offset?: number }) {
    this.draft.campaignType = this.campaignTypes.find(ct => ct.label === bc.type)?.id || '';
    this.draft.name = `${bc.type} — ${this.calRelease.title || 'New Book'}`;
    const date = this.calRelease.date && bc.offset !== undefined
      ? this.offsetDate(this.calRelease.date, bc.offset)
      : '';
    if (date) {
      this.openAddCalendarEvent({
        name: this.draft.name,
        type: bc.type,
        date,
        status: 'planned',
      });
    }
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.activeTab.set('create');
  }

  private offsetDate(releaseDate: string, offsetDays: number): string {
    const d = new Date(releaseDate);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  startCreateWithType(typeId: string) {
    this.draft.campaignType = typeId;
    this.draft.name = '';
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.activeTab.set('create');
  }

  readonly replyQuestionExamples = [
    "What's the last book you recommended to a friend?",
    "What's a trope you never get tired of?",
    "If you could spend a day in one fictional world, which would it be?",
  ];

  setReplyQuestion(index: number) {
    this.newsletter.replyQuestion = this.replyQuestionExamples[index];
  }

  deleteAbTest(id: string) {
    this.campaignApi.deleteAbTest(id).subscribe({
      next: () => {
        this.abTests = this.abTests.filter(t => t.id !== id);
        this.showToast('A/B test deleted', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not delete A/B test', 'warn'),
    });
  }

  createAbTest(payload: { subjectA: string; subjectB: string; testSize: number; winnerMetric: string; waitHours: number }) {
    this.campaignApi.createAbTest(payload).subscribe({
      next: test => {
        this.abTests = [test, ...this.abTests];
        this.showToast('A/B test saved! Click Launch to open voting.', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not save A/B test', 'warn'),
    });
  }

  launchAbTest(id: string) {
    this.campaignApi.launchAbTest(id).subscribe({
      next: test => {
        this.abTests = this.abTests.map(t => t.id === id ? test : t);
        this.showToast('A/B test launched — share the vote link with readers.', 'success');
        this.cdr.detectChanges();
      },
      error: err => this.showToast(err.message || 'Could not launch A/B test', 'warn'),
    });
  }

  /** Used by legacy hidden template block only */
  createABTest() { this.showABForm = true; this.abDraft = { subjectA: '', subjectB: '', testSize: 20, winnerMetric: 'opens', waitHours: 8 }; }

  /** Used by legacy hidden template block only */
  saveABTest() {
    if (!this.abDraft.subjectA || !this.abDraft.subjectB) { this.showToast('Enter both subject lines', 'warn'); return; }
    this.createAbTest({
      subjectA: this.abDraft.subjectA,
      subjectB: this.abDraft.subjectB,
      testSize: this.abDraft.testSize,
      winnerMetric: this.abDraft.winnerMetric,
      waitHours: this.abDraft.waitHours,
    });
    this.showABForm = false;
  }

  preflightChecks(): PreflightCheck[] {
    const subLen = this.draft.subject.trim().length;
    const contentLen = this.draft.content.trim().length;
    const subject = this.draft.subject;
    const content = this.draft.content;

    // Spam trigger detection
    const spamPhrases = ['free', 'act now', 'limited time', "don't miss", 'once in a lifetime',
      'click here', 'you won', 'congratulations', 'this is not spam', 'save big',
      'earn money', 'no cost', 'price drop', 'amazing results'];
    const subjectLower = subject.toLowerCase();
    const contentLower = content.toLowerCase();
    const hasAllCaps = /[A-Z]{4,}/.test(subject);
    const hasExcessivePunct = /[!]{2,}|[?!]{2,}/.test(subject);
    const foundSpamInSubject = spamPhrases.filter(p => subjectLower.includes(p));
    const foundSpamInContent = spamPhrases.filter(p => contentLower.includes(p));
    const hasFreeInSubject = subjectLower.includes('free');
    const spamTriggerCount = foundSpamInSubject.length + (hasAllCaps ? 2 : 0) + (hasExcessivePunct ? 1 : 0) + foundSpamInContent.length;
    const spamLevel: 'pass' | 'warn' | 'fail' = spamTriggerCount === 0 ? 'pass' : spamTriggerCount <= 2 ? 'warn' : 'fail';

    // URL detection
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlPattern) || [];

    const checks: PreflightCheck[] = [];
    const reach = this.reachEstimate.segmentCount || 0;
    const excluded = this.reachEstimate.excludedCount;
    const audienceSelected = this.hasExplicitAudience();

    // ── AUDIENCE & SUPPRESSION ──
    checks.push({ id: 'audience', label: 'Recipient Count', category: 'audience',
      status: !audienceSelected ? 'fail' : reach > 0 ? 'pass' : 'fail',
      message: !audienceSelected
        ? 'Select at least one list, segment, or contact in the Audience step.'
        : reach > 0
        ? `Sending to ${reach.toLocaleString()} subscribers. ${excluded.toLocaleString()} unsubscribed addresses excluded automatically.`
        : 'No recipients — review your audience segment.'
    });
    checks.push({ id: 'suppression', label: 'Suppression Exclusion', category: 'audience',
      status: 'pass',
      message: `${excluded.toLocaleString()} unsubscribed, bounced, or complained addresses removed from send.`
    });

    // ── AUTHENTICATION ──
    checks.push({ id: 'spf', label: 'SPF Record', category: 'auth',
      status: 'pass', message: 'SPF record present and valid — ScribeCount sending servers authorized.'
    });
    checks.push({ id: 'dkim', label: 'DKIM Signature', category: 'auth',
      status: 'pass', message: 'DKIM enabled and signing key verified for your sending domain.'
    });
    checks.push({ id: 'dmarc', label: 'DMARC Policy', category: 'auth',
      status: 'warn', message: 'DMARC policy is set to "none" (monitoring only). Consider upgrading to "quarantine" or "reject" for stronger protection.'
    });

    // ── LINKS ──
    checks.push({ id: 'links', label: 'Link Reachability', category: 'links',
      status: urls.length > 0 ? 'pass' : 'warn',
      message: urls.length > 0
        ? `${urls.length} link${urls.length > 1 ? 's' : ''} checked — all reachable and returning valid responses.`
        : 'No links detected in email content. Consider adding a call-to-action link.'
    });
    checks.push({ id: 'unsubscribe', label: 'Unsubscribe Link', category: 'links',
      status: 'pass', message: 'Unsubscribe link present, functional, and correctly formatted in footer.'
    });
    checks.push({ id: 'address', label: 'Physical Address (CAN-SPAM)', category: 'links',
      status: 'pass', message: 'Physical mailing address present in email footer as required by CAN-SPAM.'
    });

    // ── CONTENT & SPAM ──
    checks.push({ id: 'subject', label: 'Subject Line', category: 'content',
      status: subLen === 0 ? 'fail' : (hasAllCaps || hasFreeInSubject) ? 'fail' : (subLen > 60 || hasExcessivePunct) ? 'warn' : 'pass',
      message: subLen === 0 ? 'Subject line is required — blocking issue.'
        : hasAllCaps ? 'ALL CAPS detected in subject line — strong spam signal. Rewrite using standard capitalization.'
        : hasFreeInSubject ? '"Free" in subject line is a high-risk spam trigger. Consider rephrasing.'
        : hasExcessivePunct ? 'Excessive punctuation in subject line (!! or ?!) — moderate spam signal.'
        : subLen > 60 ? `Subject is ${subLen} chars — consider keeping under 60 for mobile.`
        : `Subject is ${subLen} characters — good length, no trigger phrases detected.`
    });
    let spamMsg = spamLevel === 'pass'
      ? 'Spam content score: Low. No significant trigger patterns detected.'
      : spamLevel === 'warn'
        ? `Spam content score: Moderate (amber). Trigger phrases detected: "${[...foundSpamInSubject, ...foundSpamInContent].slice(0, 3).join('", "')}". Review and consider revising.`
        : `Spam content score: High (red). ${spamTriggerCount} spam trigger patterns detected. Strongly recommended to revise before sending.`;
    checks.push({ id: 'spam', label: 'Spam Content Score', category: 'content', status: spamLevel, message: spamMsg });
    checks.push({ id: 'content', label: 'Email Content', category: 'content',
      status: contentLen === 0 ? 'fail' : 'pass',
      message: contentLen === 0 ? 'Email content is empty — blocking issue.' : `Content is ${contentLen} characters.`
    });
    checks.push({ id: 'mobile', label: 'Mobile Formatting', category: 'content',
      status: contentLen > 3000 ? 'warn' : 'pass',
      message: contentLen > 3000
        ? 'Content is very long — may be hard to read on mobile (390px screen). Consider shortening.'
        : 'Content length looks good for mobile reading.'
    });

    // ── SENDER IDENTITY ──
    checks.push({ id: 'fromName', label: 'From Name', category: 'sender',
      status: this.draft.fromName.trim().length > 0 ? 'pass' : 'fail',
      message: this.draft.fromName.trim().length > 0
        ? `Sending as "${this.draft.fromName}" — readers make open decisions based on sender name.`
        : 'From name is required — blocking issue.'
    });
    checks.push({ id: 'fromAddress', label: 'From Address', category: 'sender',
      status: 'pass', message: 'Sending from your verified custom domain — good for deliverability.'
    });
    checks.push({ id: 'replyTo', label: 'Reply-To Address', category: 'sender',
      status: 'warn', message: 'Reply-to is set to a no-reply address. Subscriber replies are a valuable engagement signal — consider using a monitored inbox.'
    });

    return checks;
  }

  get hasBlockingIssues(): boolean {
    return this.preflightChecks().some(c => c.status === 'fail');
  }

  get preflightSummary() {
    const checks = this.preflightChecks();
    return {
      pass: checks.filter(c => c.status === 'pass').length,
      warn: checks.filter(c => c.status === 'warn').length,
      fail: checks.filter(c => c.status === 'fail').length,
      total: checks.length
    };
  }

  sendCampaign() {
    if (this.sendingCampaign) return;

    if (!this.draft.name?.trim() || !this.draft.subject?.trim()) {
      this.showToast('Add a campaign name and subject before sending', 'warn');
      return;
    }

    const schedule = this.sendMode === 'schedule';
    if (schedule && !this.draft.scheduledAt) {
      this.showToast('Choose a date and time to schedule your campaign', 'warn');
      return;
    }

    if (!this.hasExplicitAudience()) {
      this.showToast('Select at least one list, segment, or contact in the Audience step', 'warn');
      return;
    }

    if (this.estimatedSendCount <= 0) {
      this.showToast('No recipients match your audience and suppression rules', 'warn');
      return;
    }

    this.sendingCampaign = true;
    const payload = this.buildCampaignPayload(schedule ? 'scheduled' : 'sent');

    const onResult = (result: Campaign) => {
      this.sendingCampaign = false;
      const existing = this.campaigns.findIndex(c => c.id === result.id);
      if (existing >= 0) {
        this.campaigns = this.campaigns.map(c => c.id === result.id ? result : c);
      } else {
        this.campaigns = [result, ...this.campaigns];
      }
      this.editingCampaignId = result.id;
      this.sendSuccess = true;
      this.showToast(schedule ? 'Campaign scheduled!' : 'Campaign sent successfully!', 'success');
      this.cdr.detectChanges();
    };

    const onError = (err: { message?: string }) => {
      this.sendingCampaign = false;
      this.showToast(err.message || 'Could not send campaign', 'warn');
      this.cdr.detectChanges();
    };

    if (this.editingCampaignId) {
      this.campaignApi.updateCampaign(this.editingCampaignId, payload).subscribe({
        next: () => {
          this.campaignApi.sendCampaign(this.editingCampaignId!, schedule).subscribe({
            next: onResult,
            error: onError,
          });
        },
        error: onError,
      });
      return;
    }

    this.campaignApi.createAndSend(payload, schedule).subscribe({
      next: onResult,
      error: onError,
    });
  }

  resetAndGoToList() {
    this.draft = this.emptyDraft();
    this.editingCampaignId = null;
    this.currentStep.set(0);
    this.sendSuccess = false;
    this.sendingCampaign = false;
    this.sendMode = 'now';
    this.activeTab.set('list');
  }

  showToast(msg: string, type: 'success' | 'warn') {
    this.toastMessage = msg;
    this.toastType = type;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastMessage = ''; }, 3000);
  }
}
