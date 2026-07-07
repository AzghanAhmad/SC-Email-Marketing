import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import {
  AudienceApiService,
  AudienceList,
  ImportContactRow,
  ImportSubscribersResult,
} from '../../../core/services/audience-api.service';

type WizardStep = 'upload' | 'map' | 'destination' | 'review' | 'done';

interface ParsedTable {
  headers: string[];
  rows: string[][];
}

interface ColumnMapping {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  tags: string;
  status: string;
}

@Component({
  selector: 'app-import-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <button class="back-link" type="button" routerLink="/audience/profiles">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Audience
          </button>
          <h1 class="page-title">Import Subscribers</h1>
          <p class="page-subtitle">Bring your lists from CSV, Excel, Google Sheets, or any spreadsheet export</p>
        </div>
      </div>

      <div class="wizard-steps">
        <div class="wizard-step" *ngFor="let s of stepLabels; let i = index" [class.active]="stepIndex >= i" [class.current]="step === s.key">
          <span class="step-dot">{{ i + 1 }}</span>
          <span class="step-label">{{ s.label }}</span>
        </div>
      </div>

      <!-- Step 1: Upload -->
      <div class="glass-card wizard-card" *ngIf="step === 'upload'">
        <h2 class="card-title">Choose your file or paste data</h2>
        <p class="card-sub">Supported: .csv, .xlsx, .xls, .tsv — or paste copied rows from Google Sheets / Excel</p>

        <div class="upload-zone" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
          <input #fileInput type="file" accept=".csv,.xlsx,.xls,.tsv,.txt" hidden (change)="onFileSelected($event)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p class="upload-title">Drop your file here</p>
          <p class="upload-hint">or</p>
          <button type="button" class="btn-secondary" (click)="fileInput.click()">Browse files</button>
        </div>

        <div class="divider"><span>or paste from Google Sheets / Excel</span></div>

        <label class="form-label">Paste tabular data (include header row)</label>
        <textarea class="paste-area" rows="8" [(ngModel)]="pasteText" placeholder="email,first_name,last_name,tags&#10;jane@example.com,Jane,Austen,vip"></textarea>
        <p class="error-text" *ngIf="parseError">{{ parseError }}</p>

        <div class="card-actions">
          <button type="button" class="btn-primary" (click)="parseUpload()" [disabled]="!canParseUpload()">Continue</button>
        </div>
      </div>

      <!-- Step 2: Map columns -->
      <div class="glass-card wizard-card" *ngIf="step === 'map'">
        <h2 class="card-title">Map your columns</h2>
        <p class="card-sub">Match spreadsheet columns to subscriber fields. Email is required.</p>

        <div class="mapping-grid">
          <div class="mapping-row" *ngFor="let field of mappingFields">
            <label class="mapping-label">{{ field.label }}<span class="req" *ngIf="field.required">*</span></label>
            <select class="form-select" [(ngModel)]="mapping[field.key]">
              <option value="">— Skip —</option>
              <option *ngFor="let h of table?.headers" [value]="h">{{ h }}</option>
            </select>
          </div>
        </div>

        <div class="preview-table-wrap" *ngIf="table">
          <p class="preview-label">Preview (first {{ previewRows.length }} rows)</p>
          <table class="preview-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Tags</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of previewRows">
                <td>{{ row.email || '—' }}</td>
                <td>{{ row.name || row.firstName || '—' }}</td>
                <td>{{ (row.tags || []).join(', ') || '—' }}</td>
                <td>{{ row.status || 'active' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="error-text" *ngIf="mapError">{{ mapError }}</p>

        <div class="card-actions">
          <button type="button" class="btn-secondary" (click)="goTo('upload')">Back</button>
          <button type="button" class="btn-primary" (click)="confirmMapping()">Continue</button>
        </div>
      </div>

      <!-- Step 3: Destination -->
      <div class="glass-card wizard-card" *ngIf="step === 'destination'">
        <h2 class="card-title">Where should these subscribers go?</h2>
        <p class="card-sub">Add imported contacts to an existing list or create a new one</p>

        <div class="dest-options">
          <label class="radio-card" [class.selected]="destMode === 'existing'">
            <input type="radio" name="dest" value="existing" [(ngModel)]="destMode">
            <div>
              <strong>Add to existing list</strong>
              <select class="form-select" [(ngModel)]="selectedListId" [disabled]="destMode !== 'existing'">
                <option value="">Select a list…</option>
                <option *ngFor="let list of lists" [value]="list.id">{{ list.name }} ({{ list.count | number }} contacts)</option>
              </select>
            </div>
          </label>

          <label class="radio-card" [class.selected]="destMode === 'new'">
            <input type="radio" name="dest" value="new" [(ngModel)]="destMode">
            <div>
              <strong>Create a new list</strong>
              <input type="text" class="form-input" [(ngModel)]="newListName" [disabled]="destMode !== 'new'" placeholder="e.g. Mailchimp Newsletter Import">
            </div>
          </label>

          <label class="radio-card" [class.selected]="destMode === 'none'">
            <input type="radio" name="dest" value="none" [(ngModel)]="destMode">
            <div>
              <strong>Import only</strong>
              <span class="radio-hint">Contacts are added to your audience without assigning a list</span>
            </div>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Tags to apply to all imported contacts</label>
          <input type="text" class="form-input" [(ngModel)]="globalTagsText" placeholder="imported, newsletter (comma-separated)">
        </div>

        <div class="form-group">
          <label class="form-label">If email already exists</label>
          <select class="form-select" [(ngModel)]="duplicateMode">
            <option value="skip">Skip duplicate</option>
            <option value="update">Update existing contact (merge tags & add to list)</option>
          </select>
        </div>

        <p class="error-text" *ngIf="destError">{{ destError }}</p>

        <div class="card-actions">
          <button type="button" class="btn-secondary" (click)="goTo('map')">Back</button>
          <button type="button" class="btn-primary" (click)="goToReview()">Review import</button>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div class="glass-card wizard-card" *ngIf="step === 'review'">
        <h2 class="card-title">Review & import</h2>

        <div class="summary-grid">
          <div class="summary-item"><span class="summary-val">{{ mappedContacts.length | number }}</span><span class="summary-label">Rows to import</span></div>
          <div class="summary-item"><span class="summary-val">{{ destinationLabel }}</span><span class="summary-label">Destination</span></div>
          <div class="summary-item"><span class="summary-val">{{ duplicateMode === 'skip' ? 'Skip' : 'Update' }}</span><span class="summary-label">Duplicates</span></div>
        </div>

        <div class="card-actions">
          <button type="button" class="btn-secondary" (click)="goTo('destination')" [disabled]="importing">Back</button>
          <button type="button" class="btn-primary" (click)="runImport()" [disabled]="importing">
            {{ importing ? 'Importing…' : 'Start import' }}
          </button>
        </div>
      </div>

      <!-- Step 5: Done -->
      <div class="glass-card wizard-card done-card" *ngIf="step === 'done' && result">
        <div class="done-icon">✓</div>
        <h2 class="card-title">Import complete</h2>
        <div class="result-grid">
          <div class="result-item success"><span class="result-val">{{ result.imported }}</span><span>Imported</span></div>
          <div class="result-item"><span class="result-val">{{ result.updated }}</span><span>Updated</span></div>
          <div class="result-item"><span class="result-val">{{ result.skipped }}</span><span>Skipped</span></div>
          <div class="result-item warn"><span class="result-val">{{ result.invalid }}</span><span>Invalid</span></div>
        </div>
        <p class="card-sub" *ngIf="result.listName">Added to list: <strong>{{ result.listName }}</strong></p>
        <p class="error-text" *ngFor="let err of result.errors">{{ err }}</p>
        <div class="card-actions">
          <button type="button" class="btn-secondary" routerLink="/audience/lists-segments">View lists</button>
          <button type="button" class="btn-primary" routerLink="/audience/profiles">View subscribers</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display:inline-flex; align-items:center; gap:.4rem; border:none; background:none; color:#64748b; font-size:.8125rem; font-weight:600; cursor:pointer; padding:0; margin-bottom:.5rem; font-family:inherit; }
    .back-link:hover { color:#3b82f6; }
    .wizard-steps { display:flex; gap:.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .wizard-step { display:flex; align-items:center; gap:.5rem; padding:.5rem .875rem; border-radius:999px; background:#f1f5f9; color:#94a3b8; font-size:.75rem; font-weight:600; }
    .wizard-step.active { background:#eff6ff; color:#3b82f6; }
    .wizard-step.current { box-shadow:0 0 0 2px #93c5fd; }
    .step-dot { width:20px; height:20px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center; font-size:.65rem; }
    .wizard-step.active .step-dot { background:#3b82f6; color:#fff; }
    .wizard-card { max-width:820px; padding:1.75rem; }
    .card-title { margin:0 0 .35rem; font-size:1.125rem; font-weight:700; color:#0f172a; }
    .card-sub { margin:0 0 1.25rem; color:#64748b; font-size:.875rem; }
    .upload-zone { border:2px dashed #cbd5e1; border-radius:16px; padding:2rem; text-align:center; color:#64748b; margin-bottom:1rem; }
    .upload-zone:hover { border-color:#93c5fd; background:#f8fafc; }
    .upload-title { font-weight:600; color:#334155; margin:.75rem 0 .25rem; }
    .upload-hint { margin:0 0 .75rem; font-size:.8125rem; }
    .divider { display:flex; align-items:center; gap:1rem; margin:1.25rem 0; color:#94a3b8; font-size:.75rem; }
    .divider::before, .divider::after { content:''; flex:1; height:1px; background:#e2e8f0; }
    .paste-area { width:100%; box-sizing:border-box; border:1.5px solid #e2e8f0; border-radius:10px; padding:.75rem; font-family:ui-monospace,monospace; font-size:.8125rem; resize:vertical; }
    .form-label { display:block; font-size:.75rem; font-weight:700; color:#475569; margin-bottom:.375rem; text-transform:uppercase; letter-spacing:.04em; }
    .form-input, .form-select { width:100%; box-sizing:border-box; padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.875rem; font-family:inherit; }
    .form-group { margin-bottom:1rem; }
    .field-help { font-size:.75rem; color:#94a3b8; }
    .error-text { color:#dc2626; font-size:.8125rem; margin-top:.5rem; }
    .card-actions { display:flex; gap:.75rem; justify-content:flex-end; margin-top:1.5rem; }
    .mapping-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
    .mapping-label { display:block; font-size:.8125rem; font-weight:600; color:#334155; margin-bottom:.35rem; }
    .req { color:#ef4444; }
    .preview-table-wrap { overflow:auto; border:1px solid #e2e8f0; border-radius:10px; }
    .preview-label { font-size:.75rem; font-weight:600; color:#64748b; padding:.75rem .75rem 0; margin:0; }
    .preview-table { width:100%; border-collapse:collapse; font-size:.8125rem; }
    .preview-table th, .preview-table td { padding:.5rem .75rem; border-bottom:1px solid #f1f5f9; text-align:left; }
    .dest-options { display:flex; flex-direction:column; gap:.75rem; margin-bottom:1.25rem; }
    .radio-card { display:flex; gap:.75rem; padding:1rem; border:1.5px solid #e2e8f0; border-radius:12px; cursor:pointer; }
    .radio-card.selected { border-color:#3b82f6; background:#f0f7ff; }
    .radio-card input { margin-top:.25rem; }
    .radio-card strong { display:block; margin-bottom:.5rem; color:#0f172a; }
    .radio-hint { font-size:.8125rem; color:#64748b; }
    .summary-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:1rem; }
    .summary-item { background:#f8fafc; border-radius:12px; padding:1rem; text-align:center; }
    .summary-val { display:block; font-size:1.125rem; font-weight:800; color:#0f172a; }
    .summary-label { font-size:.7rem; color:#94a3b8; text-transform:uppercase; font-weight:700; }
    .done-card { text-align:center; }
    .done-icon { width:56px; height:56px; border-radius:50%; background:#dcfce7; color:#16a34a; font-size:1.5rem; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; }
    .result-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.75rem; margin:1.25rem 0; }
    .result-item { background:#f8fafc; border-radius:10px; padding:.875rem; }
    .result-item.success { background:#f0fdf4; color:#166534; }
    .result-item.warn { background:#fef2f2; color:#991b1b; }
    .result-val { display:block; font-size:1.25rem; font-weight:800; }
    @media(max-width:700px) { .mapping-grid, .summary-grid, .result-grid { grid-template-columns:1fr; } }
  `]
})
export class ImportWizardComponent implements OnInit {
  private audienceApi = inject(AudienceApiService);
  private router = inject(Router);

  step: WizardStep = 'upload';
  pasteText = '';
  parseError = '';
  mapError = '';
  destError = '';
  table: ParsedTable | null = null;
  mappedContacts: ImportContactRow[] = [];
  previewRows: ImportContactRow[] = [];
  lists: AudienceList[] = [];
  destMode: 'existing' | 'new' | 'none' = 'new';
  selectedListId = '';
  newListName = '';
  globalTagsText = 'imported';
  duplicateMode: 'skip' | 'update' = 'skip';
  importing = false;
  result: ImportSubscribersResult | null = null;

  mapping: ColumnMapping = {
    email: '', name: '', firstName: '', lastName: '', tags: '', status: '',
  };

  readonly stepLabels = [
    { key: 'upload' as WizardStep, label: 'Upload' },
    { key: 'map' as WizardStep, label: 'Map columns' },
    { key: 'destination' as WizardStep, label: 'List' },
    { key: 'review' as WizardStep, label: 'Review' },
    { key: 'done' as WizardStep, label: 'Done' },
  ];

  readonly mappingFields: { key: keyof ColumnMapping; label: string; required?: boolean }[] = [
    { key: 'email', label: 'Email', required: true },
    { key: 'name', label: 'Full name' },
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'tags', label: 'Tags' },
    { key: 'status', label: 'Status' },
  ];

  get stepIndex(): number {
    return this.stepLabels.findIndex(s => s.key === this.step);
  }

  get destinationLabel(): string {
    if (this.destMode === 'existing') {
      const list = this.lists.find(l => l.id === this.selectedListId);
      return list?.name ?? 'Existing list';
    }
    if (this.destMode === 'new') return this.newListName || 'New list';
    return 'No list';
  }

  ngOnInit() {
    this.audienceApi.getListsSegments().subscribe(bundle => {
      this.lists = bundle.lists;
    });
  }

  canParseUpload(): boolean {
    return !!this.pasteText.trim();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.readFile(file);
  }

  readFile(file: File) {
    this.parseError = '';
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
          const text = String(reader.result ?? '');
          this.table = this.parseDelimited(text, ext === 'tsv' ? '\t' : this.detectDelimiter(text));
        } else {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' }) as string[][];
          this.table = this.tableFromRows(rows);
        }
        this.autoMapColumns();
        this.goTo('map');
      } catch {
        this.parseError = 'Could not read that file. Try CSV or Excel format.';
      }
    };
    if (ext === 'csv' || ext === 'tsv' || ext === 'txt') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  }

  parseUpload() {
    this.parseError = '';
    if (!this.pasteText.trim()) {
      this.parseError = 'Upload a file or paste spreadsheet data.';
      return;
    }
    try {
      const delimiter = this.detectDelimiter(this.pasteText);
      this.table = this.parseDelimited(this.pasteText, delimiter);
      this.autoMapColumns();
      this.goTo('map');
    } catch {
      this.parseError = 'Could not parse pasted data. Include a header row and at least one contact.';
    }
  }

  confirmMapping() {
    this.mapError = '';
    if (!this.mapping.email) {
      this.mapError = 'Email column is required.';
      return;
    }
    this.mappedContacts = this.buildContacts();
    if (this.mappedContacts.length === 0) {
      this.mapError = 'No valid rows found. Check your column mapping.';
      return;
    }
    this.previewRows = this.mappedContacts.slice(0, 5);
    this.goTo('destination');
  }

  goToReview() {
    this.destError = '';
    if (this.destMode === 'existing' && !this.selectedListId) {
      this.destError = 'Select a list or choose another destination.';
      return;
    }
    if (this.destMode === 'new' && !this.newListName.trim()) {
      this.destError = 'Enter a name for the new list.';
      return;
    }
    this.goTo('review');
  }

  runImport() {
    this.importing = true;
    const globalTags = this.globalTagsText.split(',').map(t => t.trim()).filter(Boolean);
    const body = {
      contacts: this.mappedContacts,
      duplicateMode: this.duplicateMode,
      tags: globalTags,
      listId: this.destMode === 'existing' ? this.selectedListId : undefined,
      newListName: this.destMode === 'new' ? this.newListName.trim() : undefined,
    };
    this.audienceApi.importSubscribers(body).subscribe({
      next: res => {
        this.result = res;
        this.importing = false;
        this.goTo('done');
      },
      error: err => {
        this.importing = false;
        this.destError = err?.message ?? 'Import failed. Please try again.';
        this.goTo('destination');
      },
    });
  }

  goTo(step: WizardStep) {
    this.step = step;
  }

  private autoMapColumns() {
    if (!this.table) return;
    const headers = this.table.headers.map(h => h.toLowerCase());
    const find = (...candidates: string[]) => {
      for (const c of candidates) {
        const idx = headers.findIndex(h => h === c || h.includes(c));
        if (idx >= 0) return this.table!.headers[idx];
      }
      return '';
    };
    this.mapping = {
      email: find('email', 'e-mail', 'email address'),
      name: find('name', 'full name', 'fullname'),
      firstName: find('first name', 'firstname', 'first_name', 'given name'),
      lastName: find('last name', 'lastname', 'last_name', 'surname', 'family name'),
      tags: find('tags', 'tag', 'labels', 'groups', 'segments'),
      status: find('status', 'subscription', 'subscribed'),
    };
  }

  private buildContacts(): ImportContactRow[] {
    if (!this.table) return [];
    const idx = (col: string) => (col ? this.table!.headers.indexOf(col) : -1);
    const emailIdx = idx(this.mapping.email);
    if (emailIdx < 0) return [];

    const contacts: ImportContactRow[] = [];
    for (const row of this.table.rows) {
      const email = (row[emailIdx] ?? '').trim();
      if (!email) continue;
      const val = (col: string) => {
        const i = idx(col);
        return i >= 0 ? (row[i] ?? '').trim() : '';
      };
      const tagsRaw = val(this.mapping.tags);
      contacts.push({
        email,
        name: val(this.mapping.name) || undefined,
        firstName: val(this.mapping.firstName) || undefined,
        lastName: val(this.mapping.lastName) || undefined,
        tags: tagsRaw ? tagsRaw.split(/[,;|]/).map(t => t.trim()).filter(Boolean) : undefined,
        status: val(this.mapping.status) || undefined,
      });
    }
    return contacts;
  }

  private parseDelimited(text: string, delimiter: string): ParsedTable {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
    if (lines.length < 2) throw new Error('not enough rows');
    const rows = lines.map(line => this.splitLine(line, delimiter));
    return this.tableFromRows(rows);
  }

  private tableFromRows(rows: string[][]): ParsedTable {
    const cleaned = rows.map(r => r.map(c => String(c ?? '').trim()));
    const headers = cleaned[0].map((h, i) => h || `Column ${i + 1}`);
    const dataRows = cleaned.slice(1).filter(r => r.some(c => c.length > 0));
    return { headers, rows: dataRows };
  }

  private splitLine(line: string, delimiter: string): string[] {
    if (delimiter !== ',') return line.split(delimiter);
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        result.push(current); current = '';
      } else current += ch;
    }
    result.push(current);
    return result;
  }

  private detectDelimiter(text: string): string {
    const first = text.split('\n')[0] ?? '';
    const tabs = (first.match(/\t/g) ?? []).length;
    const commas = (first.match(/,/g) ?? []).length;
    const semis = (first.match(/;/g) ?? []).length;
    if (tabs >= commas && tabs >= semis && tabs > 0) return '\t';
    if (semis > commas) return ';';
    return ',';
  }
}
