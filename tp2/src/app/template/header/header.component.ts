import { Component, Input} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import {MatIconButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../service/sidebar.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() headerText: string = '';

  constructor(private sidebarService: SidebarService) {

  }

  clickMenu() {
    this.sidebarService.toggle();
  }

}
