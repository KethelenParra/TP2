import { Component, ViewChild } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { SidebarService } from "../../service/sidebar.service";
import { NavigationService } from "../../service/navigation.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    MatMenuModule,
    MatIcon,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatToolbar,
    MatNavList,
    MatListItem
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrigido para 'styleUrls'
})
export class SidebarComponent {
  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sideBarService: SidebarService, public navService: NavigationService) {}

  ngOnInit(): void {
    this.sideBarService.sideNavToggleSubject.subscribe(() => {
      if (this.drawer) {
        this.drawer.toggle();
      } else {
        console.error('Drawer is undefined!');
      }
    });
  }
}
