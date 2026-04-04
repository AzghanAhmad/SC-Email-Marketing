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
    .app-shell { display:flex; min-height:100vh; }
    .main-area { flex:1; margin-left:240px; display:flex; flex-direction:column; min-height:100vh; transition:margin-left .3s; background:var(--bg); }
    .main-content { flex:1; overflow-y:auto; }
  `]
})
export class MainLayoutComponent {}
