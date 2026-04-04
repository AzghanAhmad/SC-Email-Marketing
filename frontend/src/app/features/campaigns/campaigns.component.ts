import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Campaign } from '../../core/services/mock-data.service';

type CampaignTab = 'list' | 'create';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Campaigns</h1>
          <p class="page-subtitle">Create and manage your email campaigns</p>
        </div>
        <button class="btn-primary" (click)="activeTab.set('create')" data-tooltip="Create a new email campaign">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Campaign
        </button>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'list'" (click)="activeTab.set('list')">
          All Campaigns <span class="tab-count">{{ campaigns.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'create'" (click)="activeTab.set('create')">
          Create Campaign
        </button>
      </div>

      <!-- Campaign List -->
      <div *ngIf="activeTab() === 'list'">
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
                <th>Campaign</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Open Rate</th>
                <th>Click Rate</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filteredCampaigns">
                <td>
                  <div class="campaign-name-cell">
                    <div class="campaign-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                      <p class="c-name">{{ c.name }}</p>
                      <p class="c-subject">{{ c.subject }}</p>
                    </div>
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
                <td>
                  <span *ngIf="c.clickRate > 0" class="click-rate">{{ c.clickRate }}%</span>
                  <span class="muted" *ngIf="c.clickRate === 0">—</span>
                </td>
                <td class="muted">{{ c.date }}</td>
                <td>
                  <div class="row-actions">
                    <button class="btn-ghost btn-sm" data-tooltip="View campaign report" *ngIf="c.status === 'sent'">Report</button>
                    <button class="btn-ghost btn-sm" data-tooltip="Edit this campaign" *ngIf="c.status === 'draft'">Edit</button>
                    <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Campaign -->
      <div *ngIf="activeTab() === 'create'">
        <div class="create-layout">
          <div class="glass-card create-form-card">
            <h2 class="form-section-title">New Campaign</h2>
            <p class="form-section-sub">Fill in the details to create your email campaign</p>

            <div class="success-banner" *ngIf="createSuccess">
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              Campaign saved as draft!
            </div>

            <form class="create-form" (ngSubmit)="saveCampaign()">
              <div class="form-group">
                <label class="form-label">Campaign Name <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="newCampaign.name" name="name" placeholder="e.g. April Newsletter" />
              </div>
              <div class="form-group">
                <label class="form-label">
                  Subject Line <span class="required">*</span>
                  <span class="info-icon" data-tooltip="The subject line readers see in their inbox. Keep it under 60 characters for best results.">?</span>
                </label>
                <input type="text" class="form-input" [(ngModel)]="newCampaign.subject" name="subject" placeholder="What's your email about?" />
                <span class="char-count" [class.warn]="newCampaign.subject.length > 60">{{ newCampaign.subject.length }}/60</span>
              </div>
              <div class="form-group">
                <label class="form-label">From Name</label>
                <input type="text" class="form-input" [(ngModel)]="newCampaign.fromName" name="fromName" placeholder="Jane Austen" />
              </div>
              <div class="form-group">
                <label class="form-label">Send To <span class="info-icon" data-tooltip="Choose which segment or list to send this campaign to">?</span></label>
                <select class="form-input" [(ngModel)]="newCampaign.sendTo" name="sendTo">
                  <option value="">All Subscribers</option>
                  <option value="vip">VIP Readers</option>
                  <option value="launch">Launch List</option>
                  <option value="newsletter">Newsletter Only</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Email Content <span class="required">*</span></label>
                <textarea class="form-input content-area" [(ngModel)]="newCampaign.content" name="content" placeholder="Write your email content here...&#10;&#10;Hi [first_name],&#10;&#10;..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Schedule <span class="info-icon" data-tooltip="Leave empty to save as draft. Set a date/time to schedule.">?</span></label>
                <input type="datetime-local" class="form-input" [(ngModel)]="newCampaign.scheduledAt" name="scheduledAt" />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary" data-tooltip="Save this campaign as a draft">
                  Save Draft
                </button>
                <button type="button" class="btn-primary send-btn" (click)="sendNow()" data-tooltip="Send this campaign immediately to your list">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send Now
                </button>
              </div>
            </form>
          </div>

          <!-- Preview Panel -->
          <div class="glass-card preview-card">
            <h3 class="preview-title">Email Preview</h3>
            <div class="email-preview">
              <div class="preview-header-bar">
                <div class="preview-dot red"></div>
                <div class="preview-dot yellow"></div>
                <div class="preview-dot green"></div>
              </div>
              <div class="preview-meta">
                <div class="meta-row"><span class="meta-key">From:</span><span class="meta-val">{{ newCampaign.fromName || 'Your Name' }}</span></div>
                <div class="meta-row"><span class="meta-key">Subject:</span><span class="meta-val">{{ newCampaign.subject || 'Your subject line...' }}</span></div>
              </div>
              <div class="preview-body">
                <p *ngIf="!newCampaign.content" class="preview-placeholder">Your email content will appear here as you type...</p>
                <p *ngIf="newCampaign.content" class="preview-content">{{ newCampaign.content }}</p>
              </div>
            </div>
            <div class="preview-tips">
              <h4 class="tips-title">Tips for better open rates</h4>
              <ul class="tips-list">
                <li data-tooltip="Personalization increases open rates by up to 26%">Use [first_name] to personalize</li>
                <li data-tooltip="Shorter subject lines perform better on mobile">Keep subject under 60 chars</li>
                <li data-tooltip="Tuesday–Thursday mornings have highest open rates">Send Tue–Thu, 9–11am</li>
                <li data-tooltip="A/B test different subject lines to find what works">Test different subject lines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs { display:flex; gap:.25rem; margin-bottom:1.5rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; }
    .tab:hover { color:#0f172a; }
    .tab.active { background:#ffffff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }

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
    .row-actions { display:flex; align-items:center; gap:.25rem; }

    .create-layout { display:grid; grid-template-columns:1.2fr 1fr; gap:1.5rem; align-items:start; }
    .create-form-card { padding:2rem; }
    .form-section-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .form-section-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.75rem; }
    .create-form { display:flex; flex-direction:column; gap:1.125rem; }
    .form-group { display:flex; flex-direction:column; }
    .required { color:#ef4444; }
    .char-count { font-size:.75rem; color:#94a3b8; margin-top:.3rem; text-align:right; }
    .char-count.warn { color:#d97706; }
    .content-area { min-height:160px; }
    .form-actions { display:flex; gap:.75rem; margin-top:.5rem; }
    .send-btn { background:linear-gradient(135deg,#059669,#10b981); box-shadow:0 4px 14px rgba(16,185,129,0.2); }
    .send-btn:hover { box-shadow:0 8px 24px rgba(16,185,129,0.3); }

    .preview-card { padding:1.5rem; position:sticky; top:80px; }
    .preview-title { font-size:.8rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin:0 0 1rem; }
    .email-preview { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; margin-bottom:1.25rem; }
    .preview-header-bar { display:flex; gap:.375rem; padding:.625rem .875rem; background:#f1f5f9; border-bottom:1px solid #e2e8f0; }
    .preview-dot { width:10px; height:10px; border-radius:50%; }
    .preview-dot.red { background:#f87171; }
    .preview-dot.yellow { background:#fbbf24; }
    .preview-dot.green { background:#34d399; }
    .preview-meta { padding:.875rem; border-bottom:1px solid #f1f5f9; display:flex; flex-direction:column; gap:.375rem; }
    .meta-row { display:flex; gap:.5rem; font-size:.8rem; }
    .meta-key { color:#94a3b8; font-weight:600; min-width:55px; }
    .meta-val { color:#334155; }
    .preview-body { padding:.875rem; min-height:100px; }
    .preview-placeholder { color:#cbd5e1; font-size:.8125rem; font-style:italic; }
    .preview-content { color:#334155; font-size:.8125rem; line-height:1.6; white-space:pre-wrap; }

    .preview-tips { }
    .tips-title { font-size:.8rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin:0 0 .75rem; }
    .tips-list { list-style:none; padding:0; display:flex; flex-direction:column; gap:.5rem; }
    .tips-list li { font-size:.8125rem; color:#64748b; padding:.5rem .75rem; background:#f8fafc; border-radius:8px; cursor:help; transition:background .15s; border:1px solid #f1f5f9; }
    .tips-list li:hover { background:#f0f7ff; color:#0f172a; border-color:#bfdbfe; }
    .tips-list li::before { content:'💡 '; }

    .success-banner { display:flex; align-items:center; gap:.625rem; padding:.875rem 1rem; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:10px; color:#059669; font-size:.875rem; font-weight:500; margin-bottom:1.5rem; }

    @media(max-width:1100px) { .create-layout { grid-template-columns:1fr; } .preview-card { position:static; } }
  `]
})
export class CampaignsComponent implements OnInit {
  activeTab = signal<CampaignTab>('list');
  campaigns: Campaign[] = [];
  searchQuery = '';
  statusFilter = '';
  createSuccess = false;
  newCampaign = { name: '', subject: '', fromName: 'Jane Austen', sendTo: '', content: '', scheduledAt: '' };

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.campaigns = this.mockData.getCampaigns();
  }

  get filteredCampaigns() {
    return this.campaigns.filter(c => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q);
      const matchS = !this.statusFilter || c.status === this.statusFilter;
      return matchQ && matchS;
    });
  }

  saveCampaign() {
    this.createSuccess = true;
    setTimeout(() => { this.createSuccess = false; }, 2500);
  }

  sendNow() {
    this.createSuccess = true;
    setTimeout(() => { this.createSuccess = false; }, 2500);
  }
}
