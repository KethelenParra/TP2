import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import {MatIconButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../service/sidebar.service';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, RouterModule, CommonModule, MatMenuModule, MatDivider],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  @Input() headerText: string = '';

  constructor(
    private sidebarService: SidebarService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      (usuario) => this.usuarioLogado = usuario
    ));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sair(): void {
    this.deslogar(); // Limpa o token e estado do usuário
    this.router.navigate(['/admin/loginAdm']); // Redireciona para a página de login
  }

  deslogar(){
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.usuarioLogado = null;
  }

  clickMenu() {
    this.sidebarService.toggle();
  }
  

}
