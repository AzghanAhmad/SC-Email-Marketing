import { Component, HostListener, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavbarSearchResult, NavbarSearchService } from '../../core/services/navbar-search.service';
import { LayoutService } from '../../core/services/layout.service';

interface AppNotification {
  id: string;
  type: 'campaign' | 'subscriber' | 'flow' | 'report';
  message: string;
  time: string;
  read: boolean;
  route: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="topbar"
            [class.drawer-open]="layout.sidebarOpen() && layout.isMobile()"
            [class.sidebar-compact]="layout.sidebarCompact() && !layout.isMobile()"
            (click)="onTopbarClick($event)">

      <!-- Hamburger (mobile only) -->
      <button
        class="hamburger-btn"
        (click)="toggleSidebar($event)"
        [attr.aria-label]="layout.sidebarOpen() ? 'Close menu' : 'Open menu'"
        [attr.aria-expanded]="layout.sidebarOpen()">
        <svg *ngIf="!layout.sidebarOpen() || !layout.isMobile()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <svg *ngIf="layout.sidebarOpen() && layout.isMobile()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="topbar-left">
        <button
          type="button"
          class="search-toggle-btn"
          *ngIf="layout.isMobile() && !searchExpanded()"
          (click)="openMobileSearch($event)"
          aria-label="Open search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <div class="search-wrap topbar-panel" #searchPanel [class.search-expanded]="searchExpanded() || !layout.isMobile()">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            class="search-input"
            type="text"
            placeholder="Search campaigns, flows, settings..."
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            (focus)="showSearch.set(true)"
            (keydown.enter)="selectFirstSearchResult()"
            (keydown.escape)="closeMobileSearch()"
          />
          <button
            type="button"
            class="search-close-btn"
            *ngIf="layout.isMobile() && searchExpanded()"
            (click)="closeMobileSearch($event)"
            aria-label="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="dropdown search-dropdown" *ngIf="showSearch() && searchQuery().trim()">
            <div class="dropdown-header">
              <span>Search results</span>
            </div>
            <button
              type="button"
              class="search-result"
              *ngFor="let r of searchResults()"
              (click)="goToSearchResult(r)">
              <div>
                <p class="sr-title">{{ r.title }}</p>
                <p class="sr-desc">{{ r.description }}</p>
              </div>
              <span class="sr-cat">{{ r.category }}</span>
            </button>
            <div class="search-empty" *ngIf="searchResults().length === 0">
              No results for "{{ searchQuery() }}"
            </div>
          </div>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Notifications -->
        <div class="topbar-panel" #notifPanel>
          <button class="icon-btn" (click)="toggleNotifs($event)" data-tooltip="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notif-dot" *ngIf="unreadNotifCount() > 0"></span>
          </button>

          <div class="dropdown notif-dropdown" *ngIf="showNotifs()">
            <div class="dropdown-header">
              <span>Notifications</span>
              <button type="button" class="mark-read" (click)="markAllNotifsRead()">Mark all read</button>
            </div>
            <button
              type="button"
              class="notif-item"
              *ngFor="let n of notifications"
              [class.unread]="!n.read"
              (click)="openNotification(n)">
              <div class="notif-icon-wrap" [class]="'ni-' + n.type">
                <svg *ngIf="n.type==='campaign'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <svg *ngIf="n.type==='subscriber'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                <svg *ngIf="n.type==='flow'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <svg *ngIf="n.type==='report'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div class="notif-body">
                <p class="notif-msg">{{ n.message }}</p>
                <span class="notif-time">{{ n.time }}</span>
              </div>
            </button>
            <div class="notif-empty" *ngIf="notifications.length === 0">You're all caught up.</div>
          </div>
        </div>

        <!-- Hey ScribeCount? AI Assistant -->
        <div class="topbar-panel" #assistantPanel>
          <button class="icon-btn hey-btn" (click)="toggleAssistant($event)" data-tooltip="Hey ScribeCount? — Ask anything about your business">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <circle cx="12" cy="17" r=".5" fill="currentColor"/>
            </svg>
            <span class="hey-label">Hey ScribeCount?</span>
          </button>

          <div class="assistant-panel" *ngIf="showAssistant()">
            <div class="ap-header">
              <div class="ap-title-row">
                <div class="ap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>
                </div>
                <span class="ap-title">Hey ScribeCount?</span>
              </div>
              <button type="button" class="ap-close" (click)="showAssistant.set(false)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="ap-messages">
              <div class="ap-msg assistant" *ngFor="let msg of assistantMessages">
                <div class="ap-msg-bubble" [class.user-bubble]="msg.role === 'user'">{{ msg.text }}</div>
              </div>
              <div class="ap-typing" *ngIf="assistantTyping()">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div class="ap-suggestions" *ngIf="assistantMessages.length === 1">
              <button type="button" class="ap-suggestion" *ngFor="let s of suggestions" (click)="askAssistant(s)">{{ s }}</button>
            </div>
            <div class="ap-input-row">
              <input class="ap-input" type="text" placeholder="Ask anything about your business..." [(ngModel)]="assistantQuery" (keydown.enter)="askAssistant(assistantQuery)" />
              <button type="button" class="ap-send" (click)="askAssistant(assistantQuery)" [disabled]="!assistantQuery.trim()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- About / Help -->
        <button class="icon-btn" routerLink="/about" (click)="navigateAndClose()" data-tooltip="About ScribeCount Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <!-- User Menu -->
        <div class="user-menu-wrap topbar-panel" #userPanel>
          <button type="button" class="user-btn" (click)="toggleUserMenu($event)">
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
            <a routerLink="/settings" class="dropdown-item" (click)="navigateAndClose()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </a>
            <a routerLink="/about" class="dropdown-item" (click)="navigateAndClose()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              About
            </a>
            <div class="dropdown-divider"></div>
            <button type="button" class="dropdown-item danger" (click)="logout()">
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
      padding:0 1.5rem;
      background:linear-gradient(180deg, rgba(22,38,62,0.98) 0%, rgba(14,24,40,0.98) 100%);
      backdrop-filter:blur(20px);
      border-bottom:1px solid rgba(255,255,255,0.07);
      position:fixed; top:0; left:252px; right:0; z-index:40;
      box-shadow:0 1px 0 rgba(0,0,0,0.15);
      gap:.75rem;
      transition:left .28s cubic-bezier(.4,0,.2,1);
    }
    .topbar.sidebar-compact { left:72px; }
    .topbar-left { display:flex; align-items:center; gap:1rem; flex:1; max-width:420px; min-width:0; }
    .topbar-right { display:flex; align-items:center; gap:.5rem; position:relative; flex-shrink:0; }
    .topbar-panel { position:relative; }

    /* Hamburger — hidden on desktop */
    .hamburger-btn {
      display:none; width:38px; height:38px; flex-shrink:0;
      align-items:center; justify-content:center;
      background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; cursor:pointer; color:rgba(255,255,255,0.75);
      transition:all .2s;
    }
    .hamburger-btn:hover { background:rgba(255,255,255,0.12); color:white; }

    .search-wrap { width:100%; min-width:0; display:flex; align-items:center; gap:.5rem; position:relative; }
    .search-wrap svg.search-icon { color:rgba(255,255,255,0.45); flex-shrink:0; width:17px; height:17px; }
    .search-toggle-btn {
      display:none; width:38px; height:38px; flex-shrink:0;
      align-items:center; justify-content:center;
      background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; cursor:pointer; color:rgba(255,255,255,0.75);
    }
    .search-toggle-btn svg { width:17px; height:17px; }
    .search-close-btn {
      display:none; width:30px; height:30px; flex-shrink:0;
      align-items:center; justify-content:center;
      background:rgba(255,255,255,0.08); border:none; border-radius:8px;
      cursor:pointer; color:rgba(255,255,255,0.65);
    }
    .search-input {
      width:100%;
      background:rgba(255,255,255,0.08);
      border:1.5px solid rgba(255,255,255,0.1);
      color:rgba(255,255,255,0.95);
      min-width:0;
    }
    .search-input::placeholder { color:rgba(255,255,255,0.4); }
    .search-input:focus {
      border-color:rgba(96,165,250,0.55);
      box-shadow:0 0 0 3px rgba(96,165,250,0.18);
      background:rgba(255,255,255,0.1);
    }

    .search-dropdown { left:0; right:auto; min-width:100%; max-width:380px; }
    .search-result {
      display:flex; align-items:center; justify-content:space-between; gap:.75rem;
      width:100%; padding:.75rem 1rem; border:none; border-bottom:1px solid #f8fafc;
      background:none; cursor:pointer; text-align:left; font-family:inherit;
      transition:background .15s;
    }
    .search-result:hover { background:#f8fafc; }
    .search-result:last-child { border-bottom:none; }
    .sr-title { font-size:.8125rem; font-weight:600; color:#0f172a; margin:0 0 .15rem; }
    .sr-desc { font-size:.75rem; color:#94a3b8; margin:0; }
    .sr-cat { font-size:.7rem; font-weight:600; color:#3b82f6; background:#eff6ff; padding:.2rem .5rem; border-radius:100px; white-space:nowrap; }
    .search-empty, .notif-empty { padding:1rem; font-size:.8125rem; color:#94a3b8; text-align:center; }

    .icon-btn {
      width:38px; height:38px; display:flex; align-items:center; justify-content:center;
      background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; cursor:pointer; color:rgba(255,255,255,0.55);
      transition:all .2s; position:relative; text-decoration:none; flex-shrink:0;
    }
    .icon-btn:hover { background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.95); border-color:rgba(255,255,255,0.14); }
    .icon-btn svg { width:17px; height:17px; }
    .notif-dot {
      position:absolute; top:8px; right:8px; width:7px; height:7px;
      background:#60a5fa; border-radius:50%; border:1.5px solid rgba(22,38,62,0.98);
    }

    .user-btn {
      display:flex; align-items:center; gap:.5rem;
      padding:.4rem .75rem .4rem .4rem;
      background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; cursor:pointer; transition:all .2s;
    }
    .user-btn:hover { background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.14); }
    .user-avatar {
      width:28px; height:28px; border-radius:8px;
      background:linear-gradient(135deg,#60a5fa,#a78bfa);
      display:flex; align-items:center; justify-content:center;
      font-size:.7rem; font-weight:700; color:white; flex-shrink:0;
    }
    .user-avatar.lg { width:38px; height:38px; border-radius:10px; font-size:.875rem; flex-shrink:0; }
    .user-name-top { font-size:.8125rem; font-weight:600; color:rgba(255,255,255,0.92); white-space:nowrap; }
    .user-btn > svg { color:rgba(255,255,255,0.45); flex-shrink:0; }
    .user-btn:hover > svg { color:rgba(255,255,255,0.75); }

    .dropdown {
      position:absolute; top:calc(100% + .5rem); right:0;
      background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px;
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
      transition:background .15s; width:100%; border-left:none; border-right:none; border-top:none;
      background:none; cursor:pointer; text-align:left; font-family:inherit;
    }
    .notif-item:hover { background:#f8fafc; }
    .notif-item.unread { background:#f0f7ff; }
    .notif-item.unread:hover { background:#e8f2ff; }
    .notif-item:last-child { border-bottom:none; }
    .notif-icon-wrap { width:30px; height:30px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
    .ni-campaign { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .ni-subscriber { background:rgba(16,185,129,0.1); color:#059669; }
    .ni-flow { background:rgba(139,92,246,0.1); color:#8b5cf6; }
    .ni-report { background:rgba(245,158,11,0.1); color:#d97706; }
    .notif-body { display:flex; flex-direction:column; gap:.2rem; }
    .notif-msg { font-size:.8125rem; color:#334155; line-height:1.4; margin:0; }
    .notif-time { font-size:.7rem; color:#94a3b8; }

    .dropdown-user-info { display:flex; align-items:center; gap:.75rem; padding:1rem; }
    .dui-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .15rem; }
    .dui-email { font-size:.75rem; color:#94a3b8; margin:0; word-break:break-all; }
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

    .hey-btn { width:auto !important; padding:.4rem .875rem !important; gap:.5rem; border-radius:10px !important; }
    .hey-label { font-size:.8125rem; font-weight:600; color:rgba(255,255,255,0.85); white-space:nowrap; }
    .hey-btn:hover .hey-label { color:white; }

    .assistant-panel {
      position:absolute; top:calc(100% + .5rem); right:0;
      width:380px; max-width:calc(100vw - 2rem);
      background:#ffffff; border:1.5px solid #e2e8f0; border-radius:16px;
      box-shadow:0 16px 48px rgba(0,0,0,0.14); z-index:200;
      display:flex; flex-direction:column; overflow:hidden;
      animation:fadeUp .2s ease-out;
    }
    .ap-header { display:flex; align-items:center; justify-content:space-between; padding:.875rem 1rem; border-bottom:1px solid #f1f5f9; background:#f8fafc; }
    .ap-title-row { display:flex; align-items:center; gap:.5rem; }
    .ap-icon { width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg,#3b82f6,#8b5cf6); display:flex; align-items:center; justify-content:center; color:white; }
    .ap-title { font-size:.875rem; font-weight:700; color:#0f172a; }
    .ap-close { background:none; border:none; cursor:pointer; color:#64748b; padding:.25rem; border-radius:6px; display:flex; transition:all .15s; }
    .ap-close:hover { background:#e2e8f0; color:#0f172a; }

    .ap-messages { flex:1; padding:.875rem 1rem; display:flex; flex-direction:column; gap:.625rem; max-height:280px; overflow-y:auto; }
    .ap-msg-bubble { padding:.625rem .875rem; border-radius:12px; font-size:.8125rem; line-height:1.5; max-width:90%; }
    .ap-msg-bubble:not(.user-bubble) { background:#f1f5f9; color:#0f172a; align-self:flex-start; border-radius:4px 12px 12px 12px; }
    .ap-msg-bubble.user-bubble { background:linear-gradient(135deg,#3b82f6,#6366f1); color:white; align-self:flex-end; border-radius:12px 4px 12px 12px; margin-left:auto; }
    .ap-msg { display:flex; }

    .ap-typing { display:flex; align-items:center; gap:.3rem; padding:.5rem .875rem; }
    .ap-typing span { width:7px; height:7px; border-radius:50%; background:#94a3b8; animation:typingDot 1.2s infinite; }
    .ap-typing span:nth-child(2) { animation-delay:.2s; }
    .ap-typing span:nth-child(3) { animation-delay:.4s; }
    @keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-4px);opacity:1} }

    .ap-suggestions { padding:.5rem 1rem; display:flex; flex-direction:column; gap:.375rem; border-top:1px solid #f1f5f9; }
    .ap-suggestion { text-align:left; padding:.5rem .75rem; background:#f8fafc; border:1px solid #f1f5f9; border-radius:8px; font-size:.78rem; color:#374151; font-family:inherit; cursor:pointer; transition:all .15s; }
    .ap-suggestion:hover { background:#eff6ff; border-color:#bfdbfe; color:#3b82f6; }

    .ap-input-row { display:flex; gap:.5rem; padding:.875rem 1rem; border-top:1px solid #f1f5f9; }
    .ap-input { flex:1; padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.8125rem; font-family:inherit; color:#0f172a; outline:none; transition:border-color .15s; min-width:0; }
    .ap-input:focus { border-color:#3b82f6; background:#fff; }
    .ap-send { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,#3b82f6,#6366f1); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:white; transition:all .15s; flex-shrink:0; }
    .ap-send:hover { opacity:.9; }
    .ap-send:disabled { opacity:.4; cursor:not-allowed; }

    /* ── Mobile responsive ── */
    @media (max-width: 768px) {
      .topbar {
        left: 0;
        padding: 0 1rem;
        gap: .5rem;
        z-index: 55;
      }
      .hamburger-btn { display:flex; }
      .hey-label { display:none; }
      .user-name-top { display:none; }
      .user-btn { padding:.4rem; }
      .topbar-left { max-width:none; flex:1; min-width:0; }
      .search-wrap { display:none; }
      .search-wrap.search-expanded {
        display:flex;
        position:absolute;
        left:3.25rem;
        right:1rem;
        top:50%;
        transform:translateY(-50%);
        z-index:60;
      }
      .search-toggle-btn { display:flex; }
      .search-close-btn { display:flex; }
      .notif-dropdown { min-width:280px; right:-1rem; }
      .user-dropdown { right:-1rem; }
      .assistant-panel { right:-1rem; width:calc(100vw - 2rem); }
    }

    @media (max-width: 480px) {
      .topbar { padding: 0 .75rem; gap: .375rem; }
      .search-input { font-size:.82rem; }
      .icon-btn { width:34px; height:34px; }
      .hamburger-btn { width:34px; height:34px; }
      .search-toggle-btn { width:34px; height:34px; }
      /* Hide "About" icon button on very small screens */
      .icon-btn[routerLink="/about"] { display:none; }
      .notif-dropdown { min-width:calc(100vw - 2rem); right:auto; left:-4rem; }
    }
  `]
})
export class TopbarComponent {
  searchQuery = signal('');
  searchExpanded = signal(false);
  showSearch = signal(false);
  showNotifs = signal(false);
  showUserMenu = signal(false);
  showAssistant = signal(false);
  assistantQuery = '';
  assistantTyping = signal(false);
  assistantMessages: { role: 'user' | 'assistant'; text: string }[] = [
    { role: 'assistant', text: 'Hi! I\'m your ScribeCount assistant. Ask me anything about your email performance, subscriber growth, campaigns, or business data.' }
  ];

  searchResults = computed(() => this.navbarSearch.search(this.searchQuery()));
  unreadNotifCount = computed(() => this.notifications.filter(n => !n.read).length);

  suggestions = [
    'Is my email list growing or shrinking this month?',
    'Which campaign drove the most revenue?',
    'What\'s my revenue per email this month?',
    'Which flow is performing best?',
  ];

  private readonly mockAnswers: Record<string, string> = {
    'growing': 'Your list has grown by 521 subscribers this month (+6.2% vs last month). Your top acquisition source is BookFunnel reader magnets at 38% of new subscribers.',
    'shrinking': 'Your list has grown by 521 subscribers this month (+6.2% vs last month). Your top acquisition source is BookFunnel reader magnets at 38% of new subscribers.',
    'campaign': 'Your best-performing campaign this month is "Book Launch: The Ember Crown" with a 71.4% open rate, 28.3% click rate, and $1,840 in attributed revenue.',
    'subscriber': 'Your list has grown by 521 subscribers this month (+6.2% vs last month). Your top acquisition source is BookFunnel reader magnets.',
    'revenue': 'Your revenue per email this month is $0.17, up 12.4% from last month. Your launch campaigns are driving the strongest attribution at $1,840.',
    'flow': 'Your Welcome Flow is your top performer with a 68% open rate and 74% completion rate across 1,842 triggers this month.',
    'open rate': 'Your average open rate is 54.2%, up 3.2% from last period — above the industry benchmark of 25–40% for author lists.',
    'retailer': 'Your direct store drove the most revenue from your last launch at $2,120 (confirmed attribution). Amazon was second at $1,480 (directional).',
    'series': 'Your best-performing series last quarter was The Ashford Inheritance with $2,870 in attributed email revenue and a 71.4% average open rate on launch emails.',
    'default': 'Based on your current data: your email list has 8,421 subscribers (+6.2% this month), your campaigns average a 54.2% open rate, and your revenue per email is $0.17. What would you like to dig into?'
  };

  notifications: AppNotification[] = [
    { id: '1', type: 'campaign', message: 'Campaign "March Newsletter" sent successfully', time: '2 hours ago', read: false, route: '/campaigns' },
    { id: '2', type: 'subscriber', message: '12 new subscribers joined today', time: '4 hours ago', read: false, route: '/audience' },
    { id: '3', type: 'flow', message: 'Welcome Flow triggered 8 times', time: '6 hours ago', read: false, route: '/flows' },
    { id: '4', type: 'report', message: 'Weekly report is ready to view', time: '1 day ago', read: true, route: '/analytics/dashboards' },
  ];

  constructor(
    public auth: AuthService,
    private router: Router,
    private navbarSearch: NavbarSearchService,
    public layout: LayoutService
  ) {}

  @HostListener('document:click')
  onDocumentClick() { this.closeAllPanels(); }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeAllPanels(); }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const w = (event.target as Window).innerWidth;
    this.layout.onResize(w);
    if (w > 768) {
      this.searchExpanded.set(false);
    }
  }

  onTopbarClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.layout.isMobile() && this.layout.sidebarOpen()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.hamburger-btn')) {
        this.layout.close();
      }
    }
  }

  toggleSidebar(event: MouseEvent) {
    event.stopPropagation();
    this.layout.toggle();
  }

  openMobileSearch(event: MouseEvent) {
    event.stopPropagation();
    this.searchExpanded.set(true);
    this.closeAllPanels();
  }

  closeMobileSearch(event?: MouseEvent) {
    event?.stopPropagation();
    this.searchExpanded.set(false);
    this.showSearch.set(false);
    this.searchQuery.set('');
  }

  navigateAndClose() {
    this.closeAllPanels();
    this.layout.close();
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    this.showSearch.set(!!value.trim());
    this.showNotifs.set(false);
    this.showUserMenu.set(false);
    this.showAssistant.set(false);
  }

  selectFirstSearchResult() {
    const results = this.searchResults();
    if (results.length) this.goToSearchResult(results[0]);
  }

  goToSearchResult(result: NavbarSearchResult) {
    this.closeMobileSearch();
    this.closeAllPanels();
    this.layout.close();
    this.searchQuery.set('');
    this.router.navigateByUrl(result.route);
  }

  toggleNotifs(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.showNotifs();
    this.closeAllPanels();
    this.showNotifs.set(next);
  }

  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.showUserMenu();
    this.closeAllPanels();
    this.showUserMenu.set(next);
  }

  toggleAssistant(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.showAssistant();
    this.closeAllPanels();
    this.showAssistant.set(next);
  }

  closeAllPanels() {
    this.showSearch.set(false);
    this.showNotifs.set(false);
    this.showUserMenu.set(false);
    this.showAssistant.set(false);
  }

  markAllNotifsRead() { this.notifications.forEach(n => n.read = true); }

  openNotification(n: AppNotification) {
    n.read = true;
    this.closeAllPanels();
    this.layout.close();
    this.router.navigateByUrl(n.route);
  }

  askAssistant(query: string) {
    if (!query.trim()) return;
    this.assistantMessages.push({ role: 'user', text: query });
    this.assistantQuery = '';
    this.assistantTyping.set(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      let answer = this.mockAnswers['default'];
      for (const [key, val] of Object.entries(this.mockAnswers)) {
        if (q.includes(key)) { answer = val; break; }
      }
      this.assistantMessages.push({ role: 'assistant', text: answer });
      this.assistantTyping.set(false);
    }, 900);
  }

  firstName(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ')[0];
  }

  initials(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.closeAllPanels();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
