import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../service/carrinho.service';
import { ClienteService } from '../../service/cliente.service';
import { ItemPedido } from '../../models/item-pedido.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartaoCreditoDTO } from '../../models/cartao.model';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-finalizar-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, MatStepperModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './finalizar-pedido.component.html',
  styleUrl: './finalizar-pedido.component.css'
})

export class FinalizarPedidoComponent implements OnInit {
  itensCarrinho: ItemPedido[] = [];
  endereco: any;
  metodoPagamento: string = '';
  codigoCupom: string = '';
  valorDesconto: number = 0;
  descontoAplicado: boolean = false;
  cartaoCredito: CartaoCreditoDTO = {
    nomeImpressaoTitular: '',
    numeroCartao: '',
    cvc: '',
    cpfTitular: '',
    validade: '',
    bandeiraCartao: 0
  };
  totalCompra: number = 0;
  freteMensagem: string | null = null;
  valorFrete: number | null = null; // Adicione esta variável

  constructor(
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carrinhoService.obterCarrinho().subscribe({
      next: (itens) => (this.itensCarrinho = itens, this.totalCompra = this.calcularTotal()),
      error: (err) => console.error('Erro ao carregar o carrinho:', err),
    });

    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (usuarioLogado) {
      const cliente = JSON.parse(usuarioLogado);
      this.clienteService.meuPerfil(cliente.id).subscribe({
        next: (dadosCliente) => {
          this.endereco = {
            logradouro: dadosCliente.logradouro,
            complemento: dadosCliente.complemento,
            bairro: dadosCliente.bairro,
            localidade: dadosCliente.localidade,
            uf: dadosCliente.uf,
            cep: dadosCliente.cep,
          };
          // Calcular frete automaticamente com o CEP carregado
        if (this.endereco?.cep) {
          this.calcularFrete(this.endereco.cep);
        }
        },
        error: (err) => console.error('Erro ao carregar o endereço:', err),
      });
    }
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.quantidade * (item.preco ?? 0), 0);
  }

  aplicarCupom(): void {
    const cupom = this.codigoCupom.trim().toUpperCase();
    let desconto = 0;

    switch (cupom) {
      case 'PRIMEIRACOMPRA':
        desconto = 0.10; // 10% de desconto 
        break;
      case 'CUPOM30':
        desconto = 0.30; // 30% de desconto 
        break;
      case 'CUPOMDODIA':
        desconto = 0.20; // 20% de desconto 
        break;
      case 'CUPOMQUARTA': 
        desconto = 0.15; // 15% de desconto 
        break;
      case 'CUPOMSEXTA': 
        desconto = 0.25; // 25% de desconto 
        break;
      default: this.valorDesconto = 0;
        this.snackBar.open('Cupom inválido ou não aplicável.', 'Fechar', {
          duration: 3000, // Exibe por 3 segundos
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return;
    }

    // Recalcule o valor total e o desconto
    const totalCarrinho = this.calcularTotal();
    this.valorDesconto = totalCarrinho * desconto;
    this.totalCompra = totalCarrinho - this.valorDesconto;
    this.descontoAplicado = true;
  }

  finalizarPedido(): void {
    if (this.metodoPagamento === 'cartao') {
      this.carrinhoService.finalizarPedidoCartao(this.cartaoCredito).subscribe({
        next: () => {
          this.snackBar.open('Pagamento realizado com sucesso!', 'Fechar', {
            duration: 3000, // Exibe por 3 segundos
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          setTimeout(() => window.location.reload(), 2000);
          this.router.navigateByUrl('/home');
        },
        error: (err) => console.error('Erro ao finalizar o pedido:', err),
      });
    } else if (this.metodoPagamento === 'pix') {
      this.carrinhoService.finalizarPedidoPix().subscribe({
        next: () => {
          this.snackBar.open('Pagamento via PIX realizado com sucesso!', 'Fechar', {
            duration: 3000, // Exibe por 3 segundos
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          setTimeout(() => window.location.reload(), 2000);
          this.router.navigateByUrl('/home');
        },
        error: (err) => console.error('Erro ao finalizar o pedido:', err),
      });
    } else if (this.metodoPagamento === 'boleto') {
      this.carrinhoService.finalizarPedidoBoleto().subscribe({
        next: () => {
          this.snackBar.open('Pagamento via boleto realizado com sucesso!', 'Fechar', {
            duration: 3000, // Exibe por 3 segundos
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }, error: (err) => console.error('Erro ao finalizar o pedido:', err),
      });
      setTimeout(() => window.location.reload(), 2000);
      this.router.navigateByUrl('/home');
    } else {
      this.snackBar.open('Selecione um método de pagamento.', 'Fechar', {
        duration: 3000, // Exibe por 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  calcularFrete(cep: string): void {
    if (!cep || cep.trim().length !== 9) {
      this.snackBar.open('CEP inválido. Não foi possível calcular o frete.', 'Fechar', { duration: 3000 });
      this.freteMensagem = null;
      this.valorFrete = null; // Limpa o valor do frete
      return;
    }
  
    // Simula valores de frete ou frete grátis
    const freteGratis = Math.random() > 0.0; 
    let valorFreteCalc: number;
  
    if (freteGratis) {
      valorFreteCalc = 0;
    } else {
      valorFreteCalc = Math.floor(Math.random() * 30) + 10; // Valor aleatório entre 10 e 40
    }
  
    this.valorFrete = valorFreteCalc;
  
    if (valorFreteCalc === 0) {
      this.freteMensagem = 'Frete grátis disponível para este endereço!';
    } else {
      this.freteMensagem = `O frete para o CEP ${cep} é de R$ ${valorFreteCalc.toFixed(2)}`;
    }
  }

}