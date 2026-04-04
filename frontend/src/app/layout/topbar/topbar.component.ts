import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-input" type="text" placeholder="Search campaigns, subscribers..." [(ngModel)]="searchQuery" />
        </div>
      </div>
      <div class="topbar-right">
        <!-- Notifications -->
        <button class="icon-btn" (click)="showNotifs.set(!showNotifs())" data-tooltip="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notif-dot"></span>
        </button>

        <!-- Notifications Dropdown -->
        <div class="dropdown notif-dropdown" *ngIf="showNotifs()">
          <div class="dropdown-header">
            <span>Notifications</span>
            <button class="mark-read" (click)="showNotifs.set(false)">Mark all read</button>
          </div>
          <div class="notif-item" *ngFor="let n of notifications">
            <span class="notif-icon">{{ n.icon }}</span>
            <div class="notif-body">
              <p class="notif-msg">{{ n.message }}</p>
              <span class="notif-time">{{ n.time }}</span>
            </div>
          </div>
        </div>

        <!-- Help -->
        <button class="icon-btn" data-tooltip="Help & Documentation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <!-- User Menu -->
        <div class="user-menu-wrap">
          <button class="user-btn" (click)="showUserMenu.set(!showUserMenu())">
            <div class="user-avatar">{{ initials() }}</div>
            <span class="user-name-top">{{ firstName() }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="dropdown user-dropdown" *ngIf="showUserMenu()">
            <div class="dropdown-user-info">
              <div class="user-avatar lg">{{ initials() }}</div>
              <div>
                <p class="dui-name">{{ auth.user()?.name }}</p>
                <p class="dui-email">{{ auth.user()?.email }}</p>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <a routerLink="/settings" class="dropdown-item" (click)="showUserMenu.set(false)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item danger" (click)="logout()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height:64px; display:flex; align-items:center; justify-content:space-between;
      padding:0 2rem;
      background:#ffffff;
      border-bottom:1px solid #e2e8f0;
      position:sticky; top:0; z-index:40;
      box-shadow:0 1px 3px rgba(0,0,0,0.05);
    }
    .topbar-left { display:flex; align-items:center; gap:1rem; }
    .topbar-right { display:flex; align-items:center; gap:.5rem; position:relative; }

    .icon-btn {
      width:38px; height:38px; display:flex; align-items:center; justify-content:center;
      background:#f8fafc; border:1.5px solid #e2e8f0;
      border-radius:10px; cursor:pointer; color:#64748b;
      transition:all .2s; position:relative;
    }
    .icon-btn:hover { background:#f1f5f9; color:#0f172a; border-color:#cbd5e1; }
    .icon-btn svg { width:17px; height:17px; }
    .notif-dot {
      position:absolute; top:8px; right:8px; width:7px; height:7px;
      background:#3b82f6; border-radius:50%; border:1.5px solid white;
    }

    .user-btn {
      display:flex; align-items:center; gap:.5rem;
      padding:.4rem .75rem .4rem .4rem;
      background:#f8fafc; border:1.5px solid #e2e8f0;
      border-radius:10px; cursor:pointer; transition:all .2s;
    }
    .user-btn:hover { background:#f1f5f9; border-color:#cbd5e1; }
    .user-avatar {
      width:28px; height:28px; border-radius:8px;
      background:linear-gradient(135deg,#3b82f6,#8b5cf6);
      display:flex; align-items:center; justify-content:center;
      font-size:.7rem; font-weight:700; color:white;
    }
    .user-avatar.lg { width:38px; height:38px; border-radius:10px; font-size:.875rem; flex-shrink:0; }
    .user-name-top { font-size:.8125rem; font-weight:600; color:#0f172a; }

    .dropdown {
      position:absolute; top:calc(100% + .5rem); right:0;
      background:#ffffff;
      border:1.5px solid #e2e8f0; border-radius:14px;
      box-shadow:0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
      z-index:100; min-width:280px;
      animation:fadeUp .2s ease-out;
    }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

    .dropdown-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:.875rem 1rem; border-bottom:1px solid #f1f5f9;
      font-size:.875rem; font-weight:600; color:#0f172a;
    }
    .mark-read { background:none; border:none; cursor:pointer; font-size:.75rem; color:#3b82f6; font-family:inherit; }

    .notif-item {
      display:flex; align-items:flex-start; gap:.75rem;
      padding:.875rem 1rem; border-bottom:1px solid #f8fafc;
      transition:background .15s;
    }
    .notif-item:hover { background:#f8fafc; }
    .notif-item:last-child { border-bottom:none; }
    .notif-icon { font-size:1.25rem; flex-shrink:0; }
    .notif-body { display:flex; flex-direction:column; gap:.2rem; }
    .notif-msg { font-size:.8125rem; color:#334155; line-height:1.4; }
    .notif-time { font-size:.7rem; color:#94a3b8; }

    .dropdown-user-info { display:flex; align-items:center; gap:.75rem; padding:1rem; }
    .dui-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .15rem; }
    .dui-email { font-size:.75rem; color:#94a3b8; margin:0; }
    .dropdown-divider { height:1px; background:#f1f5f9; margin:.25rem 0; }
    .dropdown-item {
      display:flex; align-items:center; gap:.75rem;
      padding:.75rem 1rem; font-size:.875rem; color:#334155;
      text-decoration:none; transition:all .15s; cursor:pointer;
      background:none; border:none; width:100%; font-family:inherit; text-align:left;
    }
    .dropdown-item:hover { background:#f8fafc; color:#0f172a; }
    .dropdown-item.danger:hover { background:#fef2f2; color:#dc2626; }
    .dropdown-item svg { width:16px; height:16px; flex-shrink:0; }

    .user-menu-wrap { position:relative; }
    .notif-dropdown { min-width:320px; }
  `]
})
export class TopbarComponent {
  searchQuery = '';
  showNotifs = signal(false);
  showUserMenu = signal(false);

  notifications = [
    { icon:'📧', message:'Campaign "March Newsletter" sent successfully', time:'2 hours ago' },
    { icon:'👤', message:'12 new subscribers joined today', time:'4 hours ago' },
    { icon:'⚡', message:'Welcome Flow triggered 8 times', time:'6 hours ago' },
    { icon:'📊', message:'Weekly report is ready to view', time:'1 day ago' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  firstName(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ')[0];
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
