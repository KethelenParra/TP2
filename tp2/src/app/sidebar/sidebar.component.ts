import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav'
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatButtonModule, MatSidenavModule, RouterModule, MatIcon, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  collapsed = signal(false);

  sideNavWidth = computed(() => this.collapsed() ? '8vh' : '19vh');
  
}
