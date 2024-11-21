import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../service/sidebar.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LivroService } from '../../service/livro.service';
import { Livro } from '../../models/livro.model';
import {MatMenuModule} from '@angular/material/menu';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';	
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, FormsModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterModule, MatMenuModule, MatDivider],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  filtro: string = "";
  tipoFiltro: string = "titulo";
  livros: Livro[] = [];
  totalRecords = 0; 

  constructor(
    private sidebarService: SidebarService, 
    private livroService: LivroService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscar();  

    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuario) => {
        this.usuarioLogado = usuario; // Atualiza o estado do usuário logado
      })
    );
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  sair(): void {
    this.deslogar(); // Limpa o token e estado do usuário
    this.router.navigate(['/livrosCard']); // Redireciona para a página de livros
  }

  deslogar(){
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.usuarioLogado = null;
  }

  buscar() {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.livroService.countByAutor(this.filtro).subscribe(data => {
          {this.totalRecords = data; }
        });
      } else {
        this.livroService.countByNome(this.filtro).subscribe(data => {
          {this.totalRecords = data; }
        });
      }
    } else {
      this.livroService.count().subscribe(
        data => {this.totalRecords = data; }
      );
    }
  }

  filtrar(): void {
    this.buscar();
  }
}
