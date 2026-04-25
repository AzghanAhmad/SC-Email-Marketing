import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface NavItem {
  label: string;
  route: string;
  icon: SafeHtml;
}

interface NavGroup {
  label: string;
  icon: SafeHtml;
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
              <span class="child-icon" [innerHTML]="child.icon"></span>
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
      width:252px; height:100vh; position:fixed; left:0; top:0; z-index:50;
      background:#0f1c2e;
      border-right:1px solid rgba(255,255,255,0.06);
      display:flex; flex-direction:column;
      overflow:hidden;
    }

    /* ── Logo ── */
    .sidebar-logo {
      display:flex; align-items:center; gap:.75rem;
      padding:1.25rem 1.125rem 1.125rem;
      border-bottom:1px solid rgba(255,255,255,0.06);
      min-height:68px;
    }
    .logo-mark { width:34px; height:34px; flex-shrink:0; }
    .logo-mark svg { width:100%; height:100%; }
    .logo-text { font-size:1rem; font-weight:800; color:white; letter-spacing:-.02em; white-space:nowrap; }

    /* ── Nav scroll area ── */
    .sidebar-nav {
      flex:1; padding:.625rem .75rem;
      display:flex; flex-direction:column; gap:.0625rem;
      overflow-y:auto; overflow-x:hidden;
    }
    .sidebar-nav::-webkit-scrollbar { width:3px; }
    .sidebar-nav::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:100px; }

    /* ── Base nav item ── */
    .nav-item {
      display:flex; align-items:center; gap:.875rem;
      padding:.7rem 1rem;
      border-radius:10px;
      color:rgba(255,255,255,0.55);
      text-decoration:none;
      font-size:.875rem; font-weight:500;
      transition:background .15s, color .15s;
      white-space:nowrap;
      position:relative;
    }
    .nav-item:hover {
      background:rgba(255,255,255,0.07);
      color:rgba(255,255,255,0.88);
    }

    /* Active state — matches screenshot: darker bg + left teal accent */
    .nav-item.active {
      background:rgba(255,255,255,0.1);
      color:#ffffff;
      font-weight:600;
    }
    .nav-item.active::before {
      content:'';
      position:absolute; left:0; top:20%; bottom:20%;
      width:3px; border-radius:0 3px 3px 0;
      background:linear-gradient(180deg, #2dd4bf, #06b6d4);
    }

    /* ── Icon wrapper ── */
    .nav-icon {
      width:22px; height:22px;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0;
      opacity:.75;
    }
    .nav-item.active .nav-icon { opacity:1; }
    .nav-item:hover .nav-icon { opacity:.9; }

    /* Force SVG size inside nav-icon */
    .nav-icon svg { width:20px !important; height:20px !important; stroke-width:1.75 !important; }

    .nav-label { white-space:nowrap; line-height:1; }

    /* ── Expandable group header ── */
    .nav-group { display:flex; flex-direction:column; }
    .nav-group-header {
      display:flex; align-items:center; gap:.875rem;
      padding:.7rem 1rem;
      border-radius:10px;
      color:rgba(255,255,255,0.55);
      font-size:.875rem; font-weight:500;
      transition:background .15s, color .15s;
      background:transparent; border:none; cursor:pointer;
      font-family:inherit; width:100%; text-align:left;
      white-space:nowrap; position:relative;
    }
    .nav-group-header:hover {
      background:rgba(255,255,255,0.07);
      color:rgba(255,255,255,0.88);
    }
    .nav-group-header.expanded { color:rgba(255,255,255,0.88); }
    .nav-group-header .nav-icon { opacity:.75; }
    .nav-group-header:hover .nav-icon,
    .nav-group-header.expanded .nav-icon { opacity:1; }

    .chevron {
      width:15px; height:15px; margin-left:auto; flex-shrink:0;
      transition:transform .25s cubic-bezier(.4,0,.2,1);
      opacity:.35; stroke-width:2.5;
    }
    .chevron.rotated { transform:rotate(90deg); opacity:.6; }

    /* ── Children ── */
    .nav-group-children {
      max-height:0; overflow:hidden;
      transition:max-height .3s cubic-bezier(.4,0,.2,1);
    }
    .nav-group-children.open { max-height:400px; }

    .nav-child-item {
      display:flex; align-items:center; gap:.625rem;
      padding:.55rem 1rem .55rem 2.75rem;
      border-radius:8px;
      color:rgba(255,255,255,0.42);
      text-decoration:none;
      font-size:.8125rem; font-weight:500;
      transition:background .15s, color .15s;
      white-space:nowrap; position:relative;
    }
    .nav-child-item:hover {
      background:rgba(255,255,255,0.06);
      color:rgba(255,255,255,0.82);
    }
    .nav-child-item.active {
      color:#2dd4bf;
      font-weight:600;
      background:rgba(45,212,191,0.08);
    }
    .nav-child-item.active::before {
      content:'';
      position:absolute; left:0; top:20%; bottom:20%;
      width:3px; border-radius:0 3px 3px 0;
      background:linear-gradient(180deg, #2dd4bf, #06b6d4);
    }
    .child-icon {
      width:16px; height:16px;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; opacity:.7;
    }
    .nav-child-item.active .child-icon { opacity:1; }
    .child-icon svg { width:14px !important; height:14px !important; stroke-width:1.75 !important; }
    .child-label { white-space:nowrap; }

    /* ── Divider & section label ── */
    .nav-divider {
      height:1px; background:rgba(255,255,255,0.06);
      margin:.5rem .25rem;
    }
    .nav-section-label {
      font-size:.625rem; font-weight:700; text-transform:uppercase;
      letter-spacing:.1em; color:rgba(255,255,255,0.22);
      padding:.375rem 1rem .3rem;
    }

    /* ── Footer ── */
    .sidebar-footer {
      padding:.75rem; border-top:1px solid rgba(255,255,255,0.06);
      display:flex; flex-direction:column; gap:.375rem;
    }
    .user-info {
      display:flex; align-items:center; gap:.75rem;
      padding:.5rem .375rem; border-radius:10px;
      transition:background .15s; cursor:default;
    }
    .user-info:hover { background:rgba(255,255,255,0.05); }
    .user-avatar {
      width:32px; height:32px; border-radius:9px; flex-shrink:0;
      background:linear-gradient(135deg,#2dd4bf,#818cf8);
      display:flex; align-items:center; justify-content:center;
      font-size:.72rem; font-weight:700; color:white;
    }
    .user-details { display:flex; flex-direction:column; overflow:hidden; flex:1; }
    .user-name { font-size:.8rem; font-weight:600; color:rgba(255,255,255,0.88); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .user-email { font-size:.68rem; color:rgba(255,255,255,0.35); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .logout-btn {
      display:flex; align-items:center; gap:.875rem;
      padding:.65rem 1rem; border-radius:10px;
      background:transparent; border:none; cursor:pointer;
      color:rgba(255,255,255,0.38); font-size:.875rem; font-weight:500; font-family:inherit;
      transition:background .15s, color .15s; white-space:nowrap;
    }
    .logout-btn:hover { background:rgba(239,68,68,0.1); color:#f87171; }
    .logout-btn svg { width:18px; height:18px; flex-shrink:0; opacity:.7; stroke-width:1.75; }
    .logout-btn:hover svg { opacity:1; }
  `]
})
export class SidebarComponent {
  topItems: NavItem[] = [];
  navGroups: NavGroup[] = [];
  advancedItems: NavItem[] = [];
  bottomItems: NavItem[] = [];

      { label: 'Email', route: '/email/inbox', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>') },
    ];

    this.navGroups = [
      {
        label: 'Website', expanded: false,
        icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'),
        children: [
          { label: 'Sign-up Forms', route: '/website/sign-up-forms', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="14" y2="13"/></svg>') },
          { label: 'Landing Pages', route: '/website/landing-pages', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="14" x2="16" y2="14"/></svg>') },
        ]
      },
      {
        label: 'Audience', expanded: false,
        icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'),
        children: [
          { label: 'Growth Tools', route: '/audience/growth-tools', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><polyline points="4 14 9 9 13 13 20 6"/><polyline points="20 12 20 6 14 6"/></svg>') },
          { label: 'Lists & Segments', route: '/audience/lists-segments', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>') },
          { label: 'Profiles', route: '/audience/profiles', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>') },
        ]
      },
      {
        label: 'Content', expanded: false,
        icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'),
        children: [
          { label: 'Templates', route: '/content/templates', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/></svg>') },
          { label: 'Universal Content', route: '/content/universal-content', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></svg>') },
          { label: 'Media & Brand', route: '/content/media-brand', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 15l-5-5-7 7"/></svg>') },
        ]
      },
      {
        label: 'Analytics', expanded: false,
        icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'),
        children: [
          { label: 'Dashboards', route: '/analytics/dashboards', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>') },
          { label: 'Metrics', route: '/analytics/metrics', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><line x1="4" y1="20" x2="20" y2="20"/><line x1="8" y1="16" x2="8" y2="9"/><line x1="12" y1="16" x2="12" y2="5"/><line x1="16" y1="16" x2="16" y2="12"/></svg>') },
          { label: 'Benchmarks', route: '/analytics/benchmarks', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M22 12h-4l-3 8-6-16-3 8H2"/></svg>') },
          { label: 'Deliverability', route: '/analytics/deliverability', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>') },
          { label: 'Custom Reports', route: '/analytics/custom-reports', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>') },
        ]
      },
    ];

    this.advancedItems = [
      { label: 'Marketing Analytics', route: '/marketing-analytics', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>') },
    ];

    this.bottomItems = [
      { label: 'Integrations', route: '/integrations', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>') },
      { label: 'Settings', route: '/settings', icon: s('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="20" height="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>') },
    ];
  }

  initials(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
