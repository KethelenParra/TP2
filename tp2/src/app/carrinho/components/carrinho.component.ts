import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemPedido } from '../../models/item-pedido.model';
import { CarrinhoService } from '../../service/carrinho.service';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css'],
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: ItemPedido[] = [];
  carrinhoId: number | undefined;

  constructor(
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private router: Router
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
          alert('Pedido fechado com sucesso!');
        },
        error: (err) => console.error('Erro ao fechar o pedido:', err),
      });
    }
  }

  finalizarPedido(): void {
    this.carrinhoService.finalizarPedido().subscribe({
      next: () => alert('Pedido finalizado com sucesso!'),
      error: (err) => console.error('Erro ao finalizar o pedido:', err),
    });
  }

  removerItem(index: number): void {
    this.itensCarrinho.splice(index, 1);
    this.carrinhoService.atualizarCarrinho(this.itensCarrinho);
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
    this.itensCarrinho = [];
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.quantidade * (item.preco ?? 0), 0);
  }
}
