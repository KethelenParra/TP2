import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { CarrinhoService } from '../../service/carrinho.service';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';


@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [MatToolbarModule, NgIf, NgFor, MatBadgeModule, CommonModule, MatIconModule, FormsModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterModule, MatMenuModule, MatDivider],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();
  notificacoesCount: number = 0;
  novosDadosDisponiveis: boolean = false; // Para rastrear novos dados

  favoritosRecentes: any[] = [];
  pedidosRecentes: any[] = [];
  cupomDisponivel: string | null = 'CUPOMDODIA';
  isLoading: boolean = false;

  constructor(
    private livroService: LivroService,
    private authService: AuthService,
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuario) => {
        this.usuarioLogado = usuario; // Atualiza o estado do usuário logado
        if (usuario) {
          this.carregarDadosNotificacoes();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  carregarDadosNotificacoes(): void {
    this.isLoading = true;

    const tipoUsuario = this.authService.getUsuarioTipo();
    if (tipoUsuario === 'Funcionario') {
      console.log('Funcionário logado - notificações de favoritos e pedidos não serão carregadas.');
      this.isLoading = false;
      return; // Evita tentar carregar favoritos e pedidos para funcionário
    }

    // Carrega Favoritos Recentes
    this.clienteService.getListaDesejos().subscribe({
      next: (favoritos) => {
        const novosFavoritos = favoritos.slice(0, 2).map((item) => ({
          titulo: item.nome,
          autores: item.autores?.map((autor) => autor.nome).join(', ') || 'Autor desconhecido',
        }));
        if (JSON.stringify(this.favoritosRecentes) !== JSON.stringify(novosFavoritos)) {
          this.favoritosRecentes = novosFavoritos;
          this.novosDadosDisponiveis = true; // Sinaliza que há novos dados
        }

        // Carrega Pedidos Recentes
        this.carrinhoService.pedidosRealizados(this.usuarioLogado?.id || 0).subscribe({
          next: (pedidos) => {
            const novosPedidos = pedidos.slice(0, 2).map((pedido: any) => ({
              data: pedido.dataPedido,
              valorTotal: parseFloat(pedido.valorTotal.replace('R$', '').replace(',', '.')),
              quantidadeItens: pedido.itens?.length || 0,
            }));
            if (JSON.stringify(this.pedidosRecentes) !== JSON.stringify(novosPedidos)) {
              this.pedidosRecentes = novosPedidos;
              this.novosDadosDisponiveis = true; // Sinaliza que há novos dados
            }

            this.atualizarContador();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar pedidos recentes:', err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Erro ao carregar favoritos no header:', err);
        this.isLoading = false;
      },
    });
  }

  atualizarContador(): void {
    this.notificacoesCount = this.novosDadosDisponiveis
      ? this.favoritosRecentes.length + this.pedidosRecentes.length
      : 0;
  }

  abrirNotificacoes(): void {
    // Ao abrir o menu de notificações, o contador é zerado
    this.novosDadosDisponiveis = false;
    this.atualizarContador();
  }

  copiarCupom(): void {
    if (this.cupomDisponivel) {
      navigator.clipboard.writeText(this.cupomDisponivel).then(() => {
        alert('Cupom copiado para a área de transferência!');
      });
    }
  }
  sair(): void {
    this.deslogar(); // Limpa o token e estado do usuário
    this.router.navigateByUrl('/livrosCard'); // Redireciona para a página de livros
  }
  
  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.usuarioLogado = null;
  }
}