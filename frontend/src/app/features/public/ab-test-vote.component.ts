import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicAbTest, PublicCampaignService } from '../../core/services/public-campaign.service';

@Component({
  selector: 'app-ab-test-vote',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="card">
        <div class="brand">ScribeCount</div>

        <div *ngIf="loading" class="state">Loading…</div>
        <div *ngIf="error" class="state error">{{ error }}</div>

        <ng-container *ngIf="!loading && !error && test">
          <h1>{{ test.name }}</h1>
          <p class="lead">Which subject line would make you more likely to open this email?</p>

          <div class="variants">
            <button class="variant variant-a" [disabled]="voted || !test.votingOpen || voting" (click)="vote('A')">
              <span class="variant-label">Version A</span>
              <span class="variant-text">{{ test.subjectA }}</span>
              <span class="variant-votes">{{ test.votesA }} votes</span>
            </button>
            <button class="variant variant-b" [disabled]="voted || !test.votingOpen || voting" (click)="vote('B')">
              <span class="variant-label">Version B</span>
              <span class="variant-text">{{ test.subjectB }}</span>
              <span class="variant-votes">{{ test.votesB }} votes</span>
            </button>
          </div>

          <p class="status" *ngIf="test.votingOpen && !voted">Tap your preferred subject line to vote.</p>
          <p class="status success" *ngIf="voted">{{ voteMessage || 'Thanks — your vote was recorded.' }}</p>
          <p class="status" *ngIf="!test.votingOpen">
            Voting is closed<span *ngIf="test.winner"> — winner: Version {{ test.winner }}</span>.
          </p>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; background:linear-gradient(160deg,#f8fafc 0%,#eef2ff 100%); }
    .card { width:100%; max-width:720px; background:#fff; border-radius:20px; padding:2rem; box-shadow:0 20px 50px rgba(15,23,42,0.08); border:1px solid #e2e8f0; }
    .brand { font-size:.75rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#6366f1; margin-bottom:1rem; }
    h1 { margin:0 0 .5rem; font-size:1.5rem; color:#0f172a; }
    .lead { margin:0 0 1.5rem; color:#64748b; line-height:1.6; }
    .variants { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
    .variant { text-align:left; padding:1.25rem; border-radius:14px; border:2px solid #e2e8f0; background:#f8fafc; cursor:pointer; transition:all .15s; }
    .variant:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(59,130,246,0.12); }
    .variant:disabled { cursor:default; opacity:.85; }
    .variant-a:hover:not(:disabled), .variant-a.selected { border-color:#3b82f6; background:rgba(59,130,246,0.05); }
    .variant-b:hover:not(:disabled), .variant-b.selected { border-color:#6366f1; background:rgba(99,102,241,0.05); }
    .variant-label { display:block; font-size:.75rem; font-weight:800; margin-bottom:.5rem; }
    .variant-a .variant-label { color:#3b82f6; }
    .variant-b .variant-label { color:#6366f1; }
    .variant-text { display:block; font-size:1rem; font-weight:600; color:#0f172a; line-height:1.5; margin-bottom:.75rem; }
    .variant-votes { font-size:.8125rem; color:#64748b; font-weight:600; }
    .status { font-size:.875rem; color:#64748b; margin:0; }
    .status.success { color:#059669; font-weight:600; }
    .state { color:#64748b; }
    .state.error { color:#dc2626; }
    @media(max-width:700px) { .variants { grid-template-columns:1fr; } }
  `]
})
export class AbTestVoteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicCampaign = inject(PublicCampaignService);

  test: PublicAbTest | null = null;
  loading = true;
  error = '';
  voted = false;
  voting = false;
  voteMessage = '';
  private voterToken = '';

  ngOnInit() {
    this.voterToken = localStorage.getItem('ab_voter_token') || crypto.randomUUID();
    localStorage.setItem('ab_voter_token', this.voterToken);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid vote link.';
      this.loading = false;
      return;
    }

    this.publicCampaign.getAbTest(id).subscribe({
      next: test => {
        this.test = test;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'This A/B test was not found.';
        this.loading = false;
      },
    });
  }

  vote(variant: 'A' | 'B') {
    if (!this.test || this.voted || !this.test.votingOpen) return;
    this.voting = true;
    this.publicCampaign.voteAbTest(this.test.id, variant, this.voterToken).subscribe({
      next: res => {
        this.voted = true;
        this.voting = false;
        this.voteMessage = res.message;
        if (this.test) {
          this.test = { ...this.test, votesA: res.votesA, votesB: res.votesB, winner: res.winner, votingOpen: res.status === 'running' };
        }
      },
      error: err => {
        this.voting = false;
        this.error = err.message || 'Could not record your vote.';
      },
    });
  }
}
