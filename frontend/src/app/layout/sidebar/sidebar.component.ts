import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

interface NavGroup {
  label: string;
  icon: string;
  expanded: boolean;
  children: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-mark">
          <svg viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="slg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#60a5fa"/>
                <stop offset="50%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
            <rect width="36" height="36" rx="10" fill="url(#slg)" opacity="0.2"/>
            <path d="M10 12h16M10 17h10M10 22h13" stroke="url(#slg)" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="logo-text">ScribeCount</span>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <!-- Top-level items -->
        <a *ngFor="let item of topItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </a>

        <!-- Expandable Groups -->
        <div class="nav-group" *ngFor="let group of navGroups">
          <button class="nav-group-header" (click)="group.expanded = !group.expanded"
                  [class.expanded]="group.expanded">
            <span class="nav-icon" [innerHTML]="group.icon"></span>
            <span class="nav-label">{{ group.label }}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 [class.rotated]="group.expanded">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <div class="nav-group-children" [class.open]="group.expanded">
            <a *ngFor="let child of group.children"
               [routerLink]="child.route"
               routerLinkActive="active"
               class="nav-child-item">
              <span class="child-label">{{ child.label }}</span>
            </a>
          </div>
        </div>

        <!-- Divider -->
        <div class="nav-divider"></div>
        <div class="nav-section-label">Advanced</div>

        <a *ngFor="let item of advancedItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </a>

        <div class="nav-divider"></div>

        <a *ngFor="let item of bottomItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>

      <!-- User -->
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ initials() }}</div>
          <div class="user-details">
            <span class="user-name">{{ auth.user()?.name }}</span>
            <span class="user-email">{{ auth.user()?.email }}</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width:240px; height:100vh; position:fixed; left:0; top:0; z-index:50;
      background:linear-gradient(180deg, rgba(22,38,62,0.98) 0%, rgba(14,24,40,0.98) 100%);
      backdrop-filter:blur(20px);
      border-right:1px solid rgba(255,255,255,0.07);
      display:flex; flex-direction:column;
      overflow:hidden;
    }

    .sidebar-logo {
      display:flex; align-items:center; gap:.75rem;
      padding:1.25rem 1rem; border-bottom:1px solid rgba(255,255,255,0.06);
      min-height:68px; position:relative;
    }
    .logo-mark { width:36px; height:36px; flex-shrink:0; }
    .logo-mark svg { width:100%; height:100%; }
    .logo-text { font-size:1.05rem; font-weight:800; color:white; letter-spacing:-.02em; white-space:nowrap; flex:1; }

    .sidebar-nav { flex:1; padding:.75rem .625rem; display:flex; flex-direction:column; gap:.125rem; overflow-y:auto; }

    .nav-item {
      display:flex; align-items:center; gap:.75rem;
      padding:.6rem .875rem; border-radius:10px;
      color:rgba(255,255,255,0.55); text-decoration:none;
      font-size:.8125rem; font-weight:500;
      transition:all .2s; white-space:nowrap;
    }
    .nav-item:hover { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.9); }
    .nav-item.active {
      background:linear-gradient(135deg, rgba(96,165,250,0.2), rgba(129,140,248,0.15));
      color:white; font-weight:600;
      border:1px solid rgba(96,165,250,0.2);
    }
    .nav-icon { width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .nav-icon :global(svg) { width:16px; height:16px; }
    .nav-label { white-space:nowrap; }

    /* Nav Groups */
    .nav-group { display:flex; flex-direction:column; }
    .nav-group-header {
      display:flex; align-items:center; gap:.75rem;
      padding:.6rem .875rem; border-radius:10px;
      color:rgba(255,255,255,0.55); text-decoration:none;
      font-size:.8125rem; font-weight:500;
      transition:all .2s; white-space:nowrap;
      background:transparent; border:none; cursor:pointer;
      font-family:inherit; width:100%; text-align:left;
    }
    .nav-group-header:hover { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.9); }
    .nav-group-header.expanded { color:rgba(255,255,255,0.85); }
    .chevron {
      width:14px; height:14px; margin-left:auto; flex-shrink:0;
      transition:transform .25s cubic-bezier(.4,0,.2,1);
      opacity:.4;
    }
    .chevron.rotated { transform:rotate(90deg); opacity:.7; }

    .nav-group-children {
      max-height:0; overflow:hidden;
      transition:max-height .3s cubic-bezier(.4,0,.2,1);
    }
    .nav-group-children.open { max-height:300px; }

    .nav-child-item {
      display:flex; align-items:center;
      padding:.45rem .875rem .45rem 2.75rem;
      border-radius:8px;
      color:rgba(255,255,255,0.45); text-decoration:none;
      font-size:.78rem; font-weight:500;
      transition:all .2s; white-space:nowrap;
    }
    .nav-child-item:hover { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.85); }
    .nav-child-item.active {
      color:#60a5fa; font-weight:600;
      background:rgba(96,165,250,0.1);
    }
    .child-label { white-space:nowrap; }

    /* Divider & Section Label */
    .nav-divider {
      height:1px; background:rgba(255,255,255,0.06);
      margin:.5rem .875rem;
    }
    .nav-section-label {
      font-size:.65rem; font-weight:700; text-transform:uppercase;
      letter-spacing:.08em; color:rgba(255,255,255,0.25);
      padding:.25rem .875rem .4rem;
    }

    .sidebar-footer {
      padding:.875rem .625rem; border-top:1px solid rgba(255,255,255,0.06);
      display:flex; flex-direction:column; gap:.5rem;
    }
    .user-info { display:flex; align-items:center; gap:.75rem; padding:.5rem .25rem; }
    .user-avatar {
      width:34px; height:34px; border-radius:10px; flex-shrink:0;
      background:linear-gradient(135deg,#60a5fa,#a78bfa);
      display:flex; align-items:center; justify-content:center;
      font-size:.75rem; font-weight:700; color:white;
    }
    .user-details { display:flex; flex-direction:column; overflow:hidden; }
    .user-name { font-size:.8125rem; font-weight:600; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .user-email { font-size:.7rem; color:rgba(255,255,255,0.4); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .logout-btn {
      display:flex; align-items:center; gap:.75rem;
      padding:.6rem .875rem; border-radius:10px;
      background:transparent; border:none; cursor:pointer;
      color:rgba(255,255,255,0.4); font-size:.8125rem; font-weight:500; font-family:inherit;
      transition:all .2s; white-space:nowrap;
    }
    .logout-btn:hover { background:rgba(239,68,68,0.1); color:#f87171; }
    .logout-btn svg { width:16px; height:16px; flex-shrink:0; }
  `]
})
export class SidebarComponent {
  topItems: NavItem[] = [
    { label:'Home', route:'/dashboard', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { label:'Campaigns', route:'/campaigns', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { label:'Flows', route:'/flows', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  ];

  navGroups: NavGroup[] = [
    {
      label: 'Website', expanded: false,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      children: [
        { label: 'Sign-up Forms', route: '/website/sign-up-forms', icon: '' },
        { label: 'Landing Pages', route: '/website/landing-pages', icon: '' },
      ]
    },
    {
      label: 'Audience', expanded: false,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      children: [
        { label: 'Growth Tools', route: '/audience/growth-tools', icon: '' },
        { label: 'Lists & Segments', route: '/audience/lists-segments', icon: '' },
        { label: 'Profiles', route: '/audience/profiles', icon: '' },
      ]
    },
    {
      label: 'Content', expanded: false,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
      children: [
        { label: 'Templates', route: '/content/templates', icon: '' },
        { label: 'Universal Content', route: '/content/universal-content', icon: '' },
        { label: 'Media & Brand', route: '/content/media-brand', icon: '' },
      ]
    },
    {
      label: 'Analytics', expanded: false,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      children: [
        { label: 'Dashboards', route: '/analytics/dashboards', icon: '' },
        { label: 'Metrics', route: '/analytics/metrics', icon: '' },
        { label: 'Benchmarks', route: '/analytics/benchmarks', icon: '' },
        { label: 'Deliverability', route: '/analytics/deliverability', icon: '' },
        { label: 'Custom Reports', route: '/analytics/custom-reports', icon: '' },
      ]
    },
  ];

  advancedItems: NavItem[] = [
    { label:'Marketing Analytics', route:'/marketing-analytics', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
  ];

  bottomItems: NavItem[] = [
    { label:'Integrations', route:'/integrations', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
    { label:'Settings', route:'/settings', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  initials(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
