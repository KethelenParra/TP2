import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Box } from '../../../models/box.model';
import { BoxService } from '../../../service/box.service';
import { ActivatedRoute } from '@angular/router';
import { ItemPedido } from '../../../models/item-pedido.model';
import { CarrinhoService } from '../../../service/carrinho.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-box-view',
  standalone: true,
  imports: [MatCardModule, NgIf, CurrencyPipe, MatButtonModule, MatInputModule, MatIconModule, MatDividerModule],
  templateUrl: './box-view.component.html',
  styleUrl: './box-view.component.css'
})
export class BoxViewComponent implements OnInit {
  box: Box | undefined;
  autoresFormatados: string = '';
  titulo: string = '';
  count: number = 1;
  valorFreteMensagem: string | null = null;

  idClienteLogado: number | null = null;

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private clienteService: AuthService,private boxService: BoxService,  private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => {
        this.box = data.box;
        if (this.box?.autores) {
          this.autoresFormatados = this.box.autores.map(autor => autor.nome).join(', ');
        }
        this.carregarClienteLogado();
      },
      (err) => {
        console.error('Erro ao carregar os dados do box', err);
      }
    );
    this.route.paramMap.subscribe((params) => {
      this.titulo = decodeURIComponent(params.get('nome') || '');
    });
  }

  getImageUrl(nomeImagem: string): string {
    return this.boxService.getUrlImage(nomeImagem);
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  carregarClienteLogado(): void {
    this.clienteService.getUsuarioLogado().subscribe({
      next: (cliente) => {
        if (cliente) {
          this.idClienteLogado = cliente.id;
        } else {
          this.idClienteLogado = null; // Cliente não logado
        }
      },
      error: (err) => {
        console.error('Erro ao carregar o cliente logado:', err);
        this.idClienteLogado = null; // Cliente não carregado ou erro na autenticação
      },
    });
  }

  adicionarAoCarrinho(): void {

    const tipoUsuario = localStorage.getItem('usuario_tipo'); // Verifica o tipo do usuário logado

    if (tipoUsuario === 'Funcionario') {
      this.snackBar.open('Funcionários não podem adicionar itens ao carrinho.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return; // Impede a execução do restante do método
    }

    if (!this.idClienteLogado) {
      this.snackBar.open('Você precisa estar logado para adicionar ao carrinho.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    if (this.box) {
      const item: ItemPedido = {
        idBox: this.box.id,
        titulo: this.box.nome,
        preco: this.box.preco,
        quantidade: this.count,
        subTotal: this.box.preco * this.count,
      };
      this.carrinhoService.adicionarAoCarrinho(item);
      this.snackBar.open(`${this.box.nome} `+', foi adicionado ao carrinho!', 'Fechar', { duration: 3000 });

    }
  }

  calcularFrete(cep: string): void {
    if (!cep || cep.trim().length !== 8) {
      this.snackBar.open('Por favor, insira um CEP válido.', 'Fechar', { duration: 3000 });
      this.valorFreteMensagem = null;
      return;
    }
  
    // Simula valores de frete ou frete grátis
    const freteGratis = Math.random() > 0.0; 
    let valorFrete: number;
  
    if (freteGratis) {
      valorFrete = 0;
    } else {
      valorFrete = Math.floor(Math.random() * 10) + 10; 
    }
  
    if (valorFrete === 0) {
      this.valorFreteMensagem = 'Frete grátis disponível para este endereço!';
    } else {
      this.valorFreteMensagem = `O frete para o CEP ${cep} é de R$ ${valorFrete.toFixed(2)}`;
    }
  }
  
}
