import { Component, effect, HostListener, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, CommonModule],
  template: `
    <div class="app-shell">
      <app-sidebar />

      <!-- Backdrop overlay — closes sidebar on mobile tap -->
      <div
        class="sidebar-backdrop"
        [class.visible]="layout.sidebarOpen() && layout.isMobile()"
        (click)="layout.close()"
        aria-hidden="true">
      </div>

      <div class="main-area" [class.sidebar-collapsed]="!layout.sidebarOpen() || layout.isMobile()">
        <app-topbar />
        <main class="main-content" (click)="layout.close()">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell { display:flex; min-height:100vh; min-height:100dvh; }

    .main-area {
      flex:1 1 0; margin-left:252px; display:flex; flex-direction:column;
      min-height:0; align-self:stretch; background:var(--bg);
      transition:margin-left .28s cubic-bezier(.4,0,.2,1);
    }
    .main-area.sidebar-collapsed {
      margin-left:0;
    }

    .main-content {
      flex:1; min-height:0; overflow-y:auto;
      padding-top:64px;
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      .main-area { margin-left:0 !important; }
    }
  `]
})
export class MainLayoutComponent implements OnDestroy {
  constructor(public layout: LayoutService) {
    effect(() => {
      const lockScroll = this.layout.isMobile() && this.layout.sidebarOpen();
      if (typeof document !== 'undefined') {
        document.body.style.overflow = lockScroll ? 'hidden' : '';
      }
    });
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.layout.onResize(window.innerWidth);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.layout.closeOnOutsideClick(event);
  }
}
