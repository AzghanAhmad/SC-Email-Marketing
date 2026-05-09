import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  id: string;
  title: string;
  series: string;
  seriesNumber: number | null;
  formats: string[];
  status: 'published' | 'draft' | 'preorder';
  publishDate: string;
  retailers: string[];
  asin: string;
}

@Component({
  selector: 'app-author-vault',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">AuthorVault</h1>
          <p class="page-subtitle">Your book catalog — metadata, formats, and retailer links in one place</p>
        </div>
        <button class="btn-primary" (click)="showAddBook.set(true)" data-tooltip="Add a new book to your catalog">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Book
        </button>
      </div>

      <!-- Stats row -->
      <div class="vault-stats">
        <div class="glass-card vs-card">
          <span class="vs-val">{{ books.length }}</span>
          <span class="vs-label">Total Titles</span>
        </div>
        <div class="glass-card vs-card">
          <span class="vs-val">{{ publishedCount }}</span>
          <span class="vs-label">Published</span>
        </div>
        <div class="glass-card vs-card">
          <span class="vs-val">{{ seriesCount }}</span>
          <span class="vs-label">Series</span>
        </div>
        <div class="glass-card vs-card">
          <span class="vs-val">{{ formatCount }}</span>
          <span class="vs-label">Total Formats</span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="vault-toolbar">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" placeholder="Search titles..." [(ngModel)]="searchQuery" />
        </div>
        <div class="filter-row">
          <select class="filter-select" [(ngModel)]="statusFilter">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="preorder">Pre-order</option>
          </select>
          <select class="filter-select" [(ngModel)]="seriesFilter">
            <option value="">All Series</option>
            <option *ngFor="let s of allSeries">{{ s }}</option>
          </select>
        </div>
      </div>

      <!-- Book grid -->
      <div class="books-grid">
        <div class="glass-card book-card" *ngFor="let book of filteredBooks" (click)="selectedBook.set(book)">
          <div class="book-cover-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="book-info">
            <div class="book-title-row">
              <h3 class="book-title">{{ book.title }}</h3>
              <span class="book-status-badge" [class]="'status-' + book.status">{{ book.status }}</span>
            </div>
            <p class="book-series" *ngIf="book.series">{{ book.series }}{{ book.seriesNumber ? ' #' + book.seriesNumber : '' }}</p>
            <div class="book-formats">
              <span class="format-tag" *ngFor="let f of book.formats">{{ f }}</span>
            </div>
            <div class="book-retailers">
              <span class="retailer-dot" *ngFor="let r of book.retailers" [attr.data-tooltip]="r"></span>
            </div>
          </div>
          <div class="book-actions">
            <button class="btn-ghost btn-sm" data-tooltip="Edit book metadata" (click)="$event.stopPropagation()">Edit</button>
            <button class="btn-ghost btn-sm" data-tooltip="View sales for this title" (click)="$event.stopPropagation()">Sales</button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredBooks.length === 0">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="48" height="48"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <h3>No books found</h3>
        <p>Try adjusting your search or add your first book to the vault</p>
      </div>

      <!-- Book detail panel -->
      <div class="book-detail-overlay" *ngIf="selectedBook()" (click)="selectedBook.set(null)">
        <div class="book-detail-panel" (click)="$event.stopPropagation()">
          <div class="bdp-header">
            <h2 class="bdp-title">{{ selectedBook()!.title }}</h2>
            <button class="bdp-close" (click)="selectedBook.set(null)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="bdp-body">
            <div class="bdp-row"><span class="bdp-key">Series</span><span class="bdp-val">{{ selectedBook()!.series || '—' }}{{ selectedBook()!.seriesNumber ? ' #' + selectedBook()!.seriesNumber : '' }}</span></div>
            <div class="bdp-row"><span class="bdp-key">Status</span><span class="bdp-val"><span class="book-status-badge" [class]="'status-' + selectedBook()!.status">{{ selectedBook()!.status }}</span></span></div>
            <div class="bdp-row"><span class="bdp-key">Publish Date</span><span class="bdp-val">{{ selectedBook()!.publishDate }}</span></div>
            <div class="bdp-row"><span class="bdp-key">ASIN</span><span class="bdp-val mono">{{ selectedBook()!.asin || '—' }}</span></div>
            <div class="bdp-row"><span class="bdp-key">Formats</span><span class="bdp-val"><span class="format-tag" *ngFor="let f of selectedBook()!.formats">{{ f }}</span></span></div>
            <div class="bdp-row"><span class="bdp-key">Retailers</span><span class="bdp-val">{{ selectedBook()!.retailers.join(', ') }}</span></div>
          </div>
          <div class="bdp-actions">
            <button class="btn-primary btn-sm">Edit Metadata</button>
            <button class="btn-secondary btn-sm">View Sales</button>
            <button class="btn-secondary btn-sm">Use in Campaign</button>
          </div>
        </div>
      </div>

      <!-- Add Book Modal -->
      <div class="book-detail-overlay" *ngIf="showAddBook()" (click)="showAddBook.set(false)">
        <div class="book-detail-panel" (click)="$event.stopPropagation()">
          <div class="bdp-header">
            <h2 class="bdp-title">Add New Book</h2>
            <button class="bdp-close" (click)="showAddBook.set(false)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="bdp-body add-form">
            <div class="form-group">
              <label class="form-label">Title <span style="color:#ef4444">*</span></label>
              <input type="text" class="form-input" [(ngModel)]="newBook.title" placeholder="Book title" />
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Series</label>
                <input type="text" class="form-input" [(ngModel)]="newBook.series" placeholder="Series name" />
              </div>
              <div class="form-group">
                <label class="form-label">Series #</label>
                <input type="number" class="form-input" [(ngModel)]="newBook.seriesNumber" placeholder="1" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-input" [(ngModel)]="newBook.status">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="preorder">Pre-order</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Publish Date</label>
              <input type="date" class="form-input" [(ngModel)]="newBook.publishDate" />
            </div>
            <div class="form-group">
              <label class="form-label">ASIN</label>
              <input type="text" class="form-input" [(ngModel)]="newBook.asin" placeholder="B0XXXXXXXXX" />
            </div>
          </div>
          <div class="bdp-actions">
            <button class="btn-primary" (click)="addBook()">Add to Vault</button>
            <button class="btn-secondary" (click)="showAddBook.set(false)">Cancel</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .vault-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .vs-card { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:.25rem; }
    .vs-val { font-size:1.75rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .vs-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }

    .vault-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; gap:.75rem; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .books-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .book-card { padding:1.25rem; cursor:pointer; display:flex; flex-direction:column; gap:.875rem; }
    .book-card:hover { border-color:#bfdbfe; }
    .book-cover-placeholder { width:100%; height:120px; background:linear-gradient(135deg,#f1f5f9,#e2e8f0); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#94a3b8; }
    .book-info { flex:1; display:flex; flex-direction:column; gap:.375rem; }
    .book-title-row { display:flex; align-items:flex-start; justify-content:space-between; gap:.5rem; }
    .book-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0; line-height:1.3; }
    .book-status-badge { font-size:.65rem; font-weight:700; padding:.2rem .5rem; border-radius:100px; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; flex-shrink:0; }
    .status-published { background:rgba(5,150,105,0.1); color:#059669; }
    .status-draft { background:#f1f5f9; color:#64748b; }
    .status-preorder { background:rgba(245,158,11,0.1); color:#d97706; }
    .book-series { font-size:.78rem; color:#64748b; margin:0; }
    .book-formats { display:flex; gap:.3rem; flex-wrap:wrap; }
    .format-tag { padding:.15rem .5rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15); border-radius:5px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .book-retailers { display:flex; gap:.3rem; }
    .retailer-dot { width:8px; height:8px; border-radius:50%; background:#e2e8f0; cursor:help; }
    .book-actions { display:flex; gap:.5rem; }

    /* Detail panel */
    .book-detail-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.4); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem; animation:fadeIn .2s; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .book-detail-panel { background:#fff; border-radius:20px; padding:2rem; max-width:520px; width:100%; box-shadow:0 24px 64px rgba(0,0,0,0.15); animation:slideUp .25s ease-out; }
    @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    .bdp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
    .bdp-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0; }
    .bdp-close { background:#f1f5f9; border:none; border-radius:8px; cursor:pointer; color:#64748b; padding:.375rem; display:flex; transition:all .15s; }
    .bdp-close:hover { background:#e2e8f0; color:#0f172a; }
    .bdp-body { display:flex; flex-direction:column; gap:0; margin-bottom:1.5rem; }
    .bdp-row { display:flex; gap:1rem; padding:.625rem 0; border-bottom:1px solid #f1f5f9; align-items:center; }
    .bdp-row:last-child { border-bottom:none; }
    .bdp-key { font-size:.8125rem; font-weight:600; color:#94a3b8; min-width:100px; }
    .bdp-val { font-size:.8125rem; color:#0f172a; display:flex; gap:.3rem; flex-wrap:wrap; align-items:center; }
    .mono { font-family:monospace; }
    .bdp-actions { display:flex; gap:.75rem; flex-wrap:wrap; }
    .add-form { display:flex; flex-direction:column; gap:1rem; }
    .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; gap:.375rem; }

    @media(max-width:1100px) { .books-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:700px) { .books-grid { grid-template-columns:1fr; } .vault-stats { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class AuthorVaultComponent {
  searchQuery = '';
  statusFilter = '';
  seriesFilter = '';
  selectedBook = signal<Book | null>(null);
  showAddBook = signal(false);

  newBook = { title: '', series: '', seriesNumber: null as number | null, status: 'published' as Book['status'], publishDate: '', asin: '' };

  books: Book[] = [
    { id: '1', title: 'The Ashford Inheritance', series: 'Ashford Chronicles', seriesNumber: 1, formats: ['Ebook', 'Paperback', 'Audiobook'], status: 'published', publishDate: 'Jan 15, 2026', retailers: ['Amazon', 'Kobo', 'Apple Books', 'B&N'], asin: 'B0C1234567' },
    { id: '2', title: 'The Ember Crown', series: 'Ashford Chronicles', seriesNumber: 2, formats: ['Ebook', 'Paperback'], status: 'published', publishDate: 'Mar 1, 2026', retailers: ['Amazon', 'Kobo', 'Apple Books'], asin: 'B0C7654321' },
    { id: '3', title: 'Shadows of Thornfield', series: 'Ashford Chronicles', seriesNumber: 3, formats: ['Ebook'], status: 'preorder', publishDate: 'Jun 1, 2026', retailers: ['Amazon'], asin: '' },
    { id: '4', title: 'The Midnight Garden', series: '', seriesNumber: null, formats: ['Ebook', 'Paperback'], status: 'published', publishDate: 'Nov 20, 2025', retailers: ['Amazon', 'Kobo'], asin: 'B0A9876543' },
    { id: '5', title: 'Untitled Project', series: '', seriesNumber: null, formats: ['Ebook'], status: 'draft', publishDate: '', retailers: [], asin: '' },
  ];

  get filteredBooks() {
    return this.books.filter(b => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.series.toLowerCase().includes(q);
      const matchS = !this.statusFilter || b.status === this.statusFilter;
      const matchSeries = !this.seriesFilter || b.series === this.seriesFilter;
      return matchQ && matchS && matchSeries;
    });
  }

  get publishedCount() { return this.books.filter(b => b.status === 'published').length; }
  get seriesCount() { return new Set(this.books.filter(b => b.series).map(b => b.series)).size; }
  get formatCount() { return this.books.reduce((acc, b) => acc + b.formats.length, 0); }
  get allSeries() { return [...new Set(this.books.filter(b => b.series).map(b => b.series))]; }

  addBook() {
    if (!this.newBook.title.trim()) return;
    this.books.push({
      id: Date.now().toString(),
      title: this.newBook.title,
      series: this.newBook.series,
      seriesNumber: this.newBook.seriesNumber,
      formats: ['Ebook'],
      status: this.newBook.status,
      publishDate: this.newBook.publishDate,
      retailers: [],
      asin: this.newBook.asin,
    });
    this.newBook = { title: '', series: '', seriesNumber: null, status: 'published', publishDate: '', asin: '' };
    this.showAddBook.set(false);
  }
}
