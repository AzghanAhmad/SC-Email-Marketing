import {
  Component, EventEmitter, Input, Output, OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campaign-email-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="open" (click)="cancel.emit()">
      <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
        <h2 class="modal-title">Edit email preview</h2>
        <p class="modal-sub">Click any text, headline, or button label in the preview to edit it. Your changes are saved as HTML.</p>

        <div class="editor-shell">
          <div
            #editor
            class="editor-surface"
            contenteditable="true"
            role="textbox"
            aria-multiline="true"
            (input)="dirty = true">
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="cancel.emit()">Cancel</button>
          <button type="button" class="btn-primary" (click)="save()">Save changes</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); backdrop-filter:blur(4px); z-index:310; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
    .modal-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:16px; padding:1.75rem; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.12); }
    .modal-wide { max-width:860px; }
    .modal-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .modal-sub { font-size:.875rem; color:#64748b; margin:0 0 1rem; line-height:1.5; }
    .editor-shell { border:1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; padding:1rem; margin-bottom:1.25rem; max-height:60vh; overflow:auto; }
    .editor-surface { min-height:280px; background:#fff; border-radius:8px; padding:1rem; outline:none; }
    .editor-surface:focus { box-shadow:0 0 0 3px rgba(59,130,246,0.15); }
    .modal-actions { display:flex; justify-content:flex-end; gap:.75rem; }
  `],
})
export class CampaignEmailEditorComponent implements OnChanges, AfterViewChecked {
  @Input() open = false;
  @Input() html = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() saved = new EventEmitter<string>();

  @ViewChild('editor') editorRef?: ElementRef<HTMLDivElement>;

  private seeded = false;
  dirty = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']?.currentValue === true) {
      this.seeded = false;
      this.dirty = false;
    }
  }

  ngAfterViewChecked() {
    if (!this.open || this.seeded || !this.editorRef) return;
    this.editorRef.nativeElement.innerHTML = this.html || '<p>Start typing your email…</p>';
    this.seeded = true;
  }

  save() {
    const html = this.editorRef?.nativeElement.innerHTML?.trim() || '';
    this.saved.emit(html);
  }
}
