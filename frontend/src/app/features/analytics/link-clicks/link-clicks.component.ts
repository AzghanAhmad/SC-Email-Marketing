import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-link-clicks', standalone: true, imports: [CommonModule],
  template: `<div class="page-wrapper"><div class="page-header"><div><h1 class="page-title">Link Clicks</h1><p class="page-subtitle">Track click-through rates and link attribution across your campaigns</p></div></div><div class="glass-card coming-card"><div class="coming-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div><h3>Coming Soon</h3><p>Link click tracking is under development.</p></div></div>`,
  styles: [`.coming-card{padding:3rem;display:flex;flex-direction:column;align-items:center;gap:1rem;text-align:center}.coming-icon{width:56px;height:56px;border-radius:14px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#64748b}h3{font-size:1.125rem;font-weight:600;color:#0f172a;margin:0}p{font-size:.875rem;color:#94a3b8;margin:0}`]
}) export class LinkClicksComponent {}
