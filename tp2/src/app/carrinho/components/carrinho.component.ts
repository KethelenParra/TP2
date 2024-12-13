import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemPedido } from '../../models/item-pedido.model';
import { CarrinhoService } from '../../service/carrinho.service';
import { ClienteService } from '../../service/cliente.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css'],
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: ItemPedido[] = [];
  carrinhoId: number | undefined;

  constructor(
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (!usuarioLogado) {
      this.router.navigateByUrl('/login');
      return;
    }

    const cliente = JSON.parse(usuarioLogado);
    if (cliente?.id) {
      this.carrinhoService.configurarCliente(cliente.id);
      this.carrinhoService.obterCarrinho().subscribe({
        next: (itens) => (this.itensCarrinho = itens),
        error: (err) => console.error('Erro ao carregar o carrinho:', err),
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  fecharPedido(): void {
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (!usuarioLogado) {
      this.router.navigateByUrl('/login');
      return;
    }

    const cliente = JSON.parse(usuarioLogado);
    if (cliente?.id) {
      this.carrinhoService.salvarPedido(cliente.id, this.itensCarrinho).subscribe({
        next: (carrinho) => {
          this.carrinhoId = carrinho.id;
          this.snackBar.open('Pedido fechado com sucesso!', 'Fechar', {
            duration: 3000, // Exibe por 3 segundos
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.router.navigateByUrl('/finalizarPedido');
        },
        error: (err) => console.error('Erro ao fechar o pedido:', err),
      });
    }
    this.router.navigateByUrl('/finalizarPedido');
  }

  removerItem(index: number): void {
    this.itensCarrinho.splice(index, 1);
    this.carrinhoService.atualizarCarrinho(this.itensCarrinho);
  }

  limparCarrinho(): void {
    this.carrinhoService.cancelarPedido();
    this.itensCarrinho = [];
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.quantidade * (item.preco ?? 0), 0);
  }

  aumentarQuantidade(index: number): void {
    this.itensCarrinho[index].quantidade++;
    const preco = this.itensCarrinho[index].preco ?? 0;
    this.itensCarrinho[index].subTotal = this.itensCarrinho[index].quantidade * preco;
  }
  
  diminuirQuantidade(index: number): void {
    if (this.itensCarrinho[index].quantidade > 1) {
      this.itensCarrinho[index].quantidade--;
      const preco = this.itensCarrinho[index].preco ?? 0;
      this.itensCarrinho[index].subTotal = this.itensCarrinho[index].quantidade * preco;
    }
  }
  
}
