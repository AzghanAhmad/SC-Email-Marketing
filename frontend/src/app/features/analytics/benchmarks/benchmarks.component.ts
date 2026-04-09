import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benchmarks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Benchmarks</h1>
          <p class="page-subtitle">Compare your performance against industry averages for independent authors</p>
        </div>
      </div>

      <div class="benchmark-grid">
        <div class="glass-card bench-card" *ngFor="let b of benchmarks">
          <h3 class="bench-metric">{{ b.metric }}</h3>
          <div class="bench-compare">
            <div class="bench-yours">
              <span class="bench-val" [style.color]="b.yourColor">{{ b.yours }}</span>
              <span class="bench-label">Your rate</span>
            </div>
            <div class="bench-vs">vs</div>
            <div class="bench-industry">
              <span class="bench-val">{{ b.industry }}</span>
              <span class="bench-label">Industry avg</span>
            </div>
          </div>
          <div class="bench-bar-wrap">
            <div class="bench-bar-track">
              <div class="bench-bar-fill yours" [style.width]="b.yoursNum + '%'" [style.background]="b.yourColor"></div>
            </div>
            <div class="bench-bar-track industry">
              <div class="bench-bar-fill industry" [style.width]="b.industryNum + '%'" style="background:#cbd5e1"></div>
            </div>
          </div>
          <span class="bench-verdict" [class.above]="b.yoursNum >= b.industryNum" [class.below]="b.yoursNum < b.industryNum">
            {{ b.yoursNum >= b.industryNum ? '✓ Above average' : '↓ Below average' }}
          </span>
        </div>
      </div>

      <div class="glass-card tips-card">
        <h3 class="tips-title">💡 Tips to Improve</h3>
        <div class="tips-list">
          <div class="tip-item" *ngFor="let t of tips">
            <span class="tip-bullet">{{ t.bullet }}</span>
            <div class="tip-body">
              <h4 class="tip-name">{{ t.title }}</h4>
              <p class="tip-desc">{{ t.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .benchmark-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:1.75rem; }
    .bench-card { padding:1.5rem; }
    .bench-metric { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .bench-compare { display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; }
    .bench-yours, .bench-industry { display:flex; flex-direction:column; align-items:center; flex:1; }
    .bench-val { font-size:1.5rem; font-weight:800; letter-spacing:-.03em; }
    .bench-label { font-size:.65rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; margin-top:.15rem; }
    .bench-vs { font-size:.75rem; font-weight:600; color:#94a3b8; }
    .bench-bar-wrap { display:flex; flex-direction:column; gap:.375rem; margin-bottom:.875rem; }
    .bench-bar-track { height:6px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .bench-bar-fill { height:100%; border-radius:100px; transition:width .8s; }
    .bench-verdict { font-size:.78rem; font-weight:600; }
    .bench-verdict.above { color:#059669; }
    .bench-verdict.below { color:#dc2626; }

    .tips-card { padding:1.5rem; }
    .tips-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0 0 1.25rem; }
    .tips-list { display:flex; flex-direction:column; gap:.875rem; }
    .tip-item { display:flex; gap:.875rem; padding:1rem; background:#f8fafc; border-radius:12px; border:1px solid #f1f5f9; }
    .tip-bullet { font-size:1.25rem; flex-shrink:0; }
    .tip-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .25rem; }
    .tip-desc { font-size:.8rem; color:#94a3b8; margin:0; line-height:1.5; }

    @media(max-width:900px) { .benchmark-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .benchmark-grid { grid-template-columns:1fr; } }
  `]
})
export class BenchmarksComponent {
  benchmarks = [
    { metric: 'Open Rate', yours: '54.2%', yoursNum: 54.2, industry: '33.0%', industryNum: 33, yourColor: '#10b981' },
    { metric: 'Click Rate', yours: '12.8%', yoursNum: 12.8, industry: '4.5%', industryNum: 4.5, yourColor: '#10b981' },
    { metric: 'Bounce Rate', yours: '2.5%', yoursNum: 2.5, industry: '1.0%', industryNum: 1, yourColor: '#ef4444' },
    { metric: 'Unsubscribe Rate', yours: '0.4%', yoursNum: 0.4, industry: '0.3%', industryNum: 0.3, yourColor: '#f59e0b' },
    { metric: 'Spam Complaint Rate', yours: '0.09%', yoursNum: 0.09, industry: '0.01%', industryNum: 0.01, yourColor: '#ef4444' },
    { metric: 'Revenue per Email', yours: '$0.17', yoursNum: 17, industry: '$0.08', industryNum: 8, yourColor: '#10b981' },
  ];

  tips = [
    { bullet: '🧹', title: 'Clean your list regularly', description: 'Remove inactive subscribers to improve deliverability and engagement rates.' },
    { bullet: '📝', title: 'Write compelling subject lines', description: 'A/B test subject lines and keep them under 60 characters for better mobile performance.' },
    { bullet: '⏰', title: 'Optimize send times', description: 'Send emails Tuesday–Thursday between 9–11am for highest open rates.' },
    { bullet: '🎯', title: 'Segment your audience', description: 'Use targeted segments to send relevant content that drives higher engagement.' },
  ];
}
