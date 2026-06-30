import { Injectable, signal } from '@angular/core';

const MOBILE_BREAKPOINT = 768;

@Injectable({ providedIn: 'root' })
export class LayoutService {
  /** True when the sidebar drawer is open (always true on desktop ≥ 769px) */
  sidebarOpen = signal(this.isDesktop());
  /** Viewport is at or below the mobile breakpoint */
  isMobile = signal(this.checkMobile());

  constructor() {
    if (typeof window !== 'undefined') {
      this.onResize(window.innerWidth);
    }
  }

  private checkMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
  }

  private isDesktop(): boolean {
    return !this.checkMobile();
  }

  toggle(): void {
    this.sidebarOpen.update(v => !v);
  }

  open(): void {
    this.sidebarOpen.set(true);
  }

  close(): void {
    if (this.isMobile()) {
      this.sidebarOpen.set(false);
    }
  }

  /** Call on window resize to sync mobile state and auto-open on desktop */
  onResize(width: number): void {
    const mobile = width <= MOBILE_BREAKPOINT;
    this.isMobile.set(mobile);
    if (!mobile) {
      this.sidebarOpen.set(true);
    }
  }

  /** Close the mobile drawer when the user taps outside the sidebar */
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.isMobile() || !this.sidebarOpen()) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('.sidebar') || target.closest('.hamburger-btn')) return;
    this.close();
  }
}
