import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteApiService, SignUpFormItem, SignUpFormStats } from '../../../core/services/website-api.service';
import { ContentApiService } from '../../../core/services/content-api.service';
import { AudienceList } from '../../../core/services/audience-api.service';
import { NAV_ICONS } from '../../../core/constants/nav-icons';

interface FormView extends SignUpFormItem {
  safeIcon: SafeHtml;
}

@Component({
  selector: 'app-sign-up-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Sign-up Forms</h1>
          <p class="page-subtitle">Collect subscribers with customizable web experiences</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a new sign-up form" (click)="openCreateFormModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Form
        </button>
      </div>

      <div class="mini-stats">
        <div class="glass-card mini-stat" *ngFor="let s of stats()">
          <span class="ms-val">{{ s.value }}</span>
          <span class="ms-label">{{ s.label }}</span>
          <span class="ms-change up" *ngIf="s.change > 0">+{{ s.change }}%</span>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-toolbar">
          <div class="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" placeholder="Search forms..." [(ngModel)]="searchQuery" />
          </div>
          <div class="filter-row">
            <select class="filter-select" [(ngModel)]="statusFilter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Submissions</th>
              <th>Conversion Rate</th>
              <th>Last Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filteredForms.length === 0">
              <td colspan="7" class="empty-row">No sign-up forms yet. Create your first form to start collecting subscribers.</td>
            </tr>
            <tr *ngFor="let form of filteredForms">
              <td>
                <div class="form-name-cell">
                  <span class="nav-icon form-icon" [innerHTML]="form.safeIcon"></span>
                  <div>
                    <p class="fn-name">{{ form.name }}</p>
                    <p class="fn-target">{{ form.targetList || 'No list assigned' }}</p>
                  </div>
                </div>
              </td>
              <td><span class="type-badge">{{ form.type }}</span></td>
              <td><span class="badge" [ngClass]="'badge-' + form.status">{{ form.status }}</span></td>
              <td class="num-cell">{{ form.submissions | number }}</td>
              <td>
                <div class="rate-cell">
                  <div class="mini-bar"><div class="mini-bar-fill" [style.width]="form.conversionRate + '%'" style="background:#34d399"></div></div>
                  <span>{{ form.conversionRate }}%</span>
                </div>
              </td>
              <td class="muted">{{ form.lastModified }}</td>
              <td>
                <div class="menu-wrap">
                  <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options" (click)="toggleMenu(form.id, $event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  <div class="action-menu" *ngIf="openMenuId === form.id" (click)="$event.stopPropagation()">
                    <button type="button" class="action-menu-item" (click)="useInCampaign(form)">Use in campaign</button>
                    <button type="button" class="action-menu-item" (click)="openEditFormModal(form)">Edit</button>
                    <button type="button" class="action-menu-item" (click)="previewForm(form)">Preview</button>
                    <button type="button" class="action-menu-item danger" (click)="deleteForm(form)">Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-backdrop" *ngIf="showCreateFormModal" (click)="closeCreateFormModal()">
        <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create New Sign-up Form</h3>
            <button class="close-btn" (click)="closeCreateFormModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="api-error-banner" *ngIf="createApiError">{{ createApiError }}</div>
            <div class="setup-field">
              <label>Form Name <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newForm.name" placeholder="e.g. Science Fiction VIPs Popup" class="text-input" [class.input-error]="createErrors.name">
              <span class="field-error" *ngIf="createErrors.name">Form name is required.</span>
            </div>
            <div class="setup-field">
              <label>Form Type <span class="req">*</span></label>
              <select [(ngModel)]="newForm.type" class="select-input">
                <option value="Popup">Popup Modal</option>
                <option value="Embedded">Embedded Section</option>
                <option value="Flyout">Flyout Banner</option>
                <option value="Full Page">Full Page Signup</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Target List <span class="req">*</span></label>
              <select [(ngModel)]="newForm.targetListId" class="select-input" [class.input-error]="createErrors.targetListId">
                <option value="">Select a list...</option>
                <option *ngFor="let list of lists()" [value]="list.id">{{ list.name }}</option>
              </select>
              <span class="field-error" *ngIf="createErrors.targetListId">Choose which list new subscribers join.</span>
            </div>
            <div class="setup-field">
              <label>Initial Status</label>
              <select [(ngModel)]="newForm.status" class="select-input">
                <option value="draft">Draft (Not active)</option>
                <option value="active">Active (Live immediately)</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Headline <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newForm.headline" placeholder="Join my reader list" class="text-input" [class.input-error]="createErrors.headline">
              <span class="field-error" *ngIf="createErrors.headline">Headline is required.</span>
            </div>
            <div class="setup-field">
              <label>Description <span class="req">*</span></label>
              <textarea [(ngModel)]="newForm.description" rows="3" placeholder="Tell readers what they'll get..." class="text-input" [class.input-error]="createErrors.description"></textarea>
              <span class="field-error" *ngIf="createErrors.description">Description is required.</span>
            </div>
            <div class="setup-field">
              <label>Button Text <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newForm.buttonText" placeholder="Subscribe" class="text-input" [class.input-error]="createErrors.buttonText">
              <span class="field-error" *ngIf="createErrors.buttonText">Button text is required.</span>
            </div>
            <div class="setup-field">
              <label>Thank-you Message <span class="req">*</span></label>
              <input type="text" [(ngModel)]="newForm.thankYouMessage" placeholder="Thanks — you're on the list!" class="text-input" [class.input-error]="createErrors.thankYouMessage">
              <span class="field-error" *ngIf="createErrors.thankYouMessage">Thank-you message is required.</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeCreateFormModal()">Cancel</button>
            <button class="btn-primary" (click)="createForm()" [disabled]="!canCreateForm">Create Form</button>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showEditFormModal" (click)="closeEditFormModal()">
        <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Edit Sign-up Form</h3>
            <button class="close-btn" (click)="closeEditFormModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Form Name</label>
              <input type="text" [(ngModel)]="editForm.name" class="text-input">
            </div>
            <div class="setup-field">
              <label>Form Type</label>
              <select [(ngModel)]="editForm.type" class="select-input">
                <option value="Popup">Popup Modal</option>
                <option value="Embedded">Embedded Section</option>
                <option value="Flyout">Flyout Banner</option>
                <option value="Full Page">Full Page Signup</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Target List</label>
              <select [(ngModel)]="editForm.targetListId" class="select-input">
                <option value="">Select a list...</option>
                <option *ngFor="let list of lists()" [value]="list.id">{{ list.name }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Status</label>
              <select [(ngModel)]="editForm.status" class="select-input">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Headline</label>
              <input type="text" [(ngModel)]="editForm.headline" class="text-input">
            </div>
            <div class="setup-field">
              <label>Description</label>
              <textarea [(ngModel)]="editForm.description" rows="3" class="text-input"></textarea>
            </div>
            <div class="setup-field">
              <label>Button Text</label>
              <input type="text" [(ngModel)]="editForm.buttonText" class="text-input">
            </div>
            <div class="setup-field">
              <label>Thank-you Message</label>
              <input type="text" [(ngModel)]="editForm.thankYouMessage" class="text-input">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeEditFormModal()">Cancel</button>
            <button class="btn-primary" (click)="saveEditForm()" [disabled]="!editForm.name">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mini-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .mini-stat { padding:1.125rem 1.25rem; display:flex; flex-direction:column; gap:.2rem; position:relative; }
    .ms-val { font-size:1.5rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .ms-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
    .ms-change { position:absolute; top:.875rem; right:.875rem; font-size:.7rem; font-weight:700; padding:.15rem .4rem; border-radius:5px; }
    .ms-change.up { color:#059669; background:rgba(16,185,129,0.1); }
    .table-card { overflow:visible; }
    .table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; align-items:center; gap:.75rem; }
    .filter-select { /* sizing from global styles.css */ color:#334155; font-size:.8125rem; cursor:pointer; }
    .form-name-cell { display:flex; align-items:center; gap:.875rem; }
    .form-icon { width:36px; height:36px; border-radius:10px; background:#f8fafc; border:1.5px solid #f1f5f9; }
    .nav-icon { display:flex; align-items:center; justify-content:center; color:#64748b; }
    .fn-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .1rem; }
    .fn-target { font-size:.72rem; color:#94a3b8; margin:0; }
    .type-badge { padding:.2rem .55rem; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#6366f1; text-transform:capitalize; }
    .num-cell { font-size:.875rem; font-weight:600; color:#334155; }
    .rate-cell { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:600; color:#334155; }
    .mini-bar { width:50px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:100px; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .empty-row { text-align:center; color:#94a3b8; padding:2rem !important; }
    .menu-wrap { position:relative; display:flex; justify-content:flex-end; }
    .action-menu {
      position:absolute; top:calc(100% + 4px); right:0; z-index:20; min-width:140px;
      background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:.35rem;
      box-shadow:0 10px 25px rgba(15,23,42,0.12);
    }
    .action-menu-item {
      display:block; width:100%; text-align:left; padding:.5rem .75rem; border:none; background:transparent;
      font-size:.8125rem; font-weight:500; color:#334155; border-radius:7px; cursor:pointer; font-family:inherit;
    }
    .action-menu-item:hover { background:#f8fafc; color:#0f172a; }
    .action-menu-item.danger { color:#dc2626; }
    .action-menu-item.danger:hover { background:rgba(239,68,68,0.08); }
    .badge-active { background:rgba(16,185,129,0.1); color:#059669; }
    .badge-draft { background:#f1f5f9; color:#64748b; }
    .badge-paused { background:rgba(245,158,11,0.1); color:#d97706; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { background:#fff; border:1px solid rgba(226,232,240,0.8); border-radius:20px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); width:100%; max-width:480px; display:flex; flex-direction:column; overflow:hidden; max-height:90vh; }
    .modal-wide { max-width:520px; }
    .modal-header { padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; }
    .modal-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .close-btn { background:transparent; border:none; color:#94a3b8; cursor:pointer; padding:4px; border-radius:6px; display:flex; }
    .close-btn:hover { background:#f1f5f9; color:#475569; }
    .modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem; overflow-y:auto; }
    .modal-footer { padding:1rem 1.5rem; border-top:1px solid #f1f5f9; display:flex; justify-content:flex-end; gap:.75rem; background:#f8fafc; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .text-input, .select-input { /* sizing from global styles.css */ }
    .text-input:focus, .select-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.12); }
    .req { color:#dc2626; }
    .field-error { font-size:.72rem; color:#dc2626; margin-top:2px; }
    .api-error-banner {
      padding:.75rem 1rem; margin-bottom:1rem; border-radius:10px;
      background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25);
      color:#b91c1c; font-size:.8125rem; line-height:1.45;
    }
    .input-error { border-color:#fca5a5 !important; }
    @media(max-width:1000px) { .mini-stats { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .mini-stats { grid-template-columns:1fr; } }
  `]
})
export class SignUpFormsComponent implements OnInit {
  private websiteApi = inject(WebsiteApiService);
  private contentApi = inject(ContentApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  searchQuery = '';
  statusFilter = '';
  stats = signal<SignUpFormStats[]>([]);
  forms = signal<FormView[]>([]);
  lists = signal<AudienceList[]>([]);
  showCreateFormModal = false;
  showEditFormModal = false;
  editingFormId = '';
  newForm = {
    name: '', type: 'Popup', targetListId: '', status: 'draft' as string,
    headline: '', description: '', buttonText: '', thankYouMessage: '',
  };
  createErrors = {
    name: false, targetListId: false, headline: false, description: false,
    buttonText: false, thankYouMessage: false,
  };
  createApiError = '';
  showCreateAttempt = false;
  editForm = {
    name: '', type: 'Popup', targetListId: '', status: 'draft' as string,
    headline: '', description: '', buttonText: '', thankYouMessage: '',
  };
  openMenuId: string | null = null;

  @HostListener('document:click')
  closeMenu() {
    this.openMenuId = null;
  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  ngOnInit() {
    this.load();
    this.route.queryParams.subscribe(params => {
      const templateId = params['template'];
      if (templateId) {
        this.contentApi.getWebsiteTemplate(templateId).subscribe(t => {
          if (t.templateKind !== 'signup-form') return;
          this.applyTemplate(t);
          this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
        });
      }
    });
  }

  get canCreateForm() {
    return !!(
      this.newForm.name.trim() &&
      this.newForm.targetListId &&
      this.newForm.headline.trim() &&
      this.newForm.description.trim() &&
      this.newForm.buttonText.trim() &&
      this.newForm.thankYouMessage.trim()
    );
  }

  private applyTemplate(t: { suggestedName: string; formType?: string; defaultStatus: string; headline: string; bodyDescription: string; buttonText: string; thankYouMessage: string }) {
    this.newForm = {
      name: t.suggestedName,
      type: t.formType || 'Popup',
      targetListId: this.newForm.targetListId,
      status: t.defaultStatus || 'draft',
      headline: t.headline,
      description: t.bodyDescription,
      buttonText: t.buttonText,
      thankYouMessage: t.thankYouMessage,
    };
    this.showCreateAttempt = false;
    this.showCreateFormModal = true;
  }

  private validateCreateForm() {
    this.createErrors = {
      name: !this.newForm.name.trim(),
      targetListId: !this.newForm.targetListId,
      headline: !this.newForm.headline.trim(),
      description: !this.newForm.description.trim(),
      buttonText: !this.newForm.buttonText.trim(),
      thankYouMessage: !this.newForm.thankYouMessage.trim(),
    };
    return this.canCreateForm;
  }

  load() {
    this.websiteApi.getWebsite().subscribe(bundle => {
      this.stats.set(bundle.stats);
      this.lists.set(bundle.lists);
      this.forms.set(bundle.forms.map(f => this.toFormView(f)));
    });
  }

  private toFormView(f: SignUpFormItem): FormView {
    return {
      ...f,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(NAV_ICONS[f.iconKey] ?? NAV_ICONS['form']),
    };
  }

  get filteredForms() {
    return this.forms().filter(f => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || f.name.toLowerCase().includes(q);
      const matchS = !this.statusFilter || f.status === this.statusFilter;
      return matchQ && matchS;
    });
  }

  openCreateFormModal() {
    this.newForm = {
      name: '', type: 'Popup', targetListId: '', status: 'draft',
      headline: '', description: '', buttonText: '', thankYouMessage: '',
    };
    this.showCreateAttempt = false;
    this.createErrors = { name: false, targetListId: false, headline: false, description: false, buttonText: false, thankYouMessage: false };
    this.createApiError = '';
    this.showCreateFormModal = true;
  }

  closeCreateFormModal() {
    this.showCreateFormModal = false;
  }

  openEditFormModal(form: FormView) {
    this.closeMenu();
    this.editingFormId = form.id;
    this.editForm = {
      name: form.name,
      type: form.type,
      targetListId: form.targetListId ?? '',
      status: form.status,
      headline: form.headline ?? '',
      description: form.description ?? '',
      buttonText: form.buttonText ?? '',
      thankYouMessage: form.thankYouMessage ?? '',
    };
    this.showEditFormModal = true;
  }

  closeEditFormModal() {
    this.showEditFormModal = false;
    this.editingFormId = '';
  }

  previewForm(form: FormView) {
    this.closeMenu();
    window.open(`/website/forms/preview/${form.id}`, '_blank');
  }

  useInCampaign(form: FormView) {
    this.closeMenu();
    void this.router.navigate(['/campaigns'], { queryParams: { useForm: form.id } });
  }

  deleteForm(form: FormView) {
    this.closeMenu();
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    this.websiteApi.deleteForm(form.id).subscribe(() => this.load());
  }

  createForm() {
    this.showCreateAttempt = true;
    this.createApiError = '';
    if (!this.validateCreateForm()) return;
    const list = this.lists().find(l => l.id === this.newForm.targetListId);
    this.websiteApi.createForm({
      name: this.newForm.name.trim(),
      formType: this.newForm.type,
      status: this.newForm.status,
      targetListId: this.newForm.targetListId || undefined,
      targetListName: list?.name,
      headline: this.newForm.headline.trim(),
      description: this.newForm.description.trim(),
      buttonText: this.newForm.buttonText.trim(),
      thankYouMessage: this.newForm.thankYouMessage.trim(),
    }).subscribe({
      next: () => {
        this.load();
        this.closeCreateFormModal();
      },
      error: (err) => {
        this.createApiError = err?.error?.message ?? err?.error?.title ?? err?.message ?? 'Could not create sign-up form. Please try again.';
      },
    });
  }

  saveEditForm() {
    if (!this.editForm.name || !this.editingFormId) return;
    const list = this.lists().find(l => l.id === this.editForm.targetListId);
    this.websiteApi.updateForm(this.editingFormId, {
      name: this.editForm.name,
      formType: this.editForm.type,
      status: this.editForm.status,
      targetListId: this.editForm.targetListId || undefined,
      targetListName: list?.name,
      headline: this.editForm.headline,
      description: this.editForm.description,
      buttonText: this.editForm.buttonText,
      thankYouMessage: this.editForm.thankYouMessage,
    }).subscribe(() => {
      this.load();
      this.closeEditFormModal();
    });
  }
}
