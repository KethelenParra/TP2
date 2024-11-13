import { Component, ViewChild  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListItem, MatNavList } from '@angular/material/list';
import { SidebarService } from '../../service/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatIcon, MatDrawer, MatDrawerContainer,MatDrawerContent, MatToolbar, MatNavList, MatListItem],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  
  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sideBarService: SidebarService) { }

  ngOnInit(): void {
    this.sideBarService.sideNavToggleSubject.subscribe(
      () => {
        this.drawer.toggle();
      }
    )
  }
  
}
