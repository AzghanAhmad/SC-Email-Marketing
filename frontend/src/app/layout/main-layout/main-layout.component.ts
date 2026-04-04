import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <div class="main-area">
        <app-topbar />
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell { display:flex; min-height:100vh; min-height:100dvh; }
    .main-area {
      flex:1 1 0; margin-left:240px; display:flex; flex-direction:column;
      min-height:0; align-self:stretch; background:var(--bg);
    }
    .main-content {
      flex:1; min-height:0; overflow-y:auto;
      padding-top:64px;
    }
  `]
})
export class MainLayoutComponent {}
