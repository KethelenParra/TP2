import { Component, ViewChild } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { SidebarService } from "../../service/sidebar.service";
import { NavigationService } from "../../service/navigation.service";
import { Usuario } from "../../models/usuario.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../service/auth.service";
import { CommonModule } from "@angular/common";

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
    MatListItem,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrigido para 'styleUrls'
})
export class SidebarComponent {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sideBarService: SidebarService, public navService: NavigationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.sideBarService.sideNavToggleSubject.subscribe(() => {
      if (this.drawer) {
        this.drawer.toggle();
      } else {
        console.log('null');
      }
    });

    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      (usuario) => this.usuarioLogado = usuario
    ));
  }
}
