import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicCampaignService } from '../../core/services/public-campaign.service';

interface PrefEmailType {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PrefFrequency {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card" *ngIf="loading">Loading your preferences…</div>
      <div class="card error" *ngIf="!loading && error">{{ error }}</div>

      <div class="card" *ngIf="!loading && !error && center">
        <h1>Email preferences</h1>
        <p class="sub">Signed in as <strong>{{ center.email }}</strong></p>

        <h2>What would you like to receive?</h2>
        <div class="opt-list">
          <label class="opt" *ngFor="let t of center.emailTypes">
            <input type="checkbox" [(ngModel)]="selectedTypes[t.key]" />
            <span>
              <span class="opt-name">{{ t.name }}</span>
              <span class="opt-desc">{{ t.description }}</span>
            </span>
          </label>
        </div>

        <h2>How often?</h2>
        <div class="freq-list">
          <label class="freq" *ngFor="let f of center.frequencies">
            <input type="radio" name="freq" [value]="f.key" [(ngModel)]="selectedFrequency" />
            <span>
              <span class="opt-name">{{ f.name }}</span>
              <span class="opt-desc">{{ f.description }}</span>
            </span>
          </label>
        </div>

        <button type="button" class="btn" (click)="save()" [disabled]="saving">
          {{ saving ? 'Saving…' : 'Save preferences' }}
        </button>
        <p class="saved" *ngIf="savedMsg">{{ savedMsg }}</p>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f8fafc; display: flex; align-items: flex-start; justify-content: center; padding: 2rem 1rem; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; max-width: 560px; width: 100%; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
    .card.error { color: #dc2626; }
    h1 { margin: 0 0 .35rem; font-size: 1.5rem; color: #0f172a; }
    .sub { margin: 0 0 1.5rem; color: #64748b; font-size: .9rem; }
    h2 { font-size: .95rem; margin: 1.25rem 0 .75rem; color: #334155; }
    .opt-list, .freq-list { display: flex; flex-direction: column; gap: .625rem; }
    .opt, .freq { display: flex; gap: .75rem; align-items: flex-start; padding: .75rem; border: 1px solid #f1f5f9; border-radius: 10px; cursor: pointer; }
    .opt-name { display: block; font-weight: 600; color: #0f172a; font-size: .875rem; }
    .opt-desc { display: block; font-size: .8rem; color: #64748b; margin-top: .15rem; }
    .btn { margin-top: 1.25rem; padding: .65rem 1.25rem; background: #3b82f6; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
    .btn:disabled { opacity: .6; cursor: not-allowed; }
    .saved { margin-top: .75rem; color: #059669; font-size: .875rem; }
  `]
})
export class PreferencesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicApi = inject(PublicCampaignService);

  loading = true;
  error = '';
  saving = false;
  savedMsg = '';
  center: { email: string; name: string; brandDomain: string; emailTypes: PrefEmailType[]; frequencies: PrefFrequency[] } | null = null;
  selectedTypes: Record<string, boolean> = {};
  selectedFrequency = '';

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error = 'This preference link is invalid.';
      this.loading = false;
      return;
    }

    this.publicApi.getPreferences(token).subscribe({
      next: c => {
        this.center = c;
        for (const t of c.emailTypes) this.selectedTypes[t.key] = true;
        this.selectedFrequency = c.frequencies[0]?.key ?? '';
        this.loading = false;
      },
      error: () => {
        this.error = 'This preference link is invalid or has expired.';
        this.loading = false;
      },
    });
  }

  save() {
    this.savedMsg = 'Your preferences have been saved.';
  }
}
