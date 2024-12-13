import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivroService } from '../../service/livro.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Livro } from '../../models/livro.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CarrinhoService } from '../../service/carrinho.service';
import { ItemPedido } from '../../models/item-pedido.model';
import { Avaliacao } from '../../models/avaliacao.model';
import { AvaliacaoService } from '../../service/avaliacao.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-livro-view',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatSnackBarModule, NgIf, NgFor, CommonModule, CurrencyPipe, MatButtonModule, MatInputModule, MatIconModule, MatDividerModule],
  templateUrl: './livro-view.component.html',
  styleUrl: './livro-view.component.css'
})

export class LivroViewComponent implements OnInit {
  livro: Livro | undefined;
  autoresFormatados: string = '';
  titulo: string = '';
  count: number = 1;

  avaliacoes: Avaliacao[] = [];
  mediaEstrelas: number = 0;

  // Variáveis para o formulário de avaliação
  novoComentario: string = '';
  novaEstrela: number = 0;

  // Edição de Avaliação
  editandoAvaliacaoId: number | null = null;
  editandoComentario: string = '';
  editandoEstrela: number = 0;

  idClienteLogado: number | null = null;

  valorFreteMensagem: string | null = null;

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private clienteService: AuthService, private livroService: LivroService, private avaliacaoService: AvaliacaoService, private carrinhoService: CarrinhoService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => {
        this.livro = data.livro;
        if (this.livro?.autores) {
          this.autoresFormatados = this.livro.autores.map(autor => autor.nome).join(', ');
        }
        // Carregar avaliações e média de estrelas do livro
        if (this.livro?.id) {
          this.carregarAvaliacoes(this.livro.id);
        }
        this.carregarClienteLogado();
      },
      (err) => {
        console.error('Erro ao carregar os dados do livro', err);
      }
    );
    this.route.paramMap.subscribe((params) => {
      this.titulo = decodeURIComponent(params.get('titulo') || '');
    });
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

  carregarAvaliacoes(idLivro: number): void {
    // Buscar avaliações
    this.avaliacaoService.getAvaliacoesPorLivro(idLivro).subscribe(
      (data) => {
        this.avaliacoes = data;
        this.calcularMediaEstrelas();
      },
      (err) => {
        console.error('Erro ao carregar as avaliações', err);
      }
    );
  }

  // Calcular média de estrelas
  calcularMediaEstrelas(): void {
    if (this.avaliacoes.length > 0) {
      const totalEstrelas = this.avaliacoes.reduce((sum, avaliacao) => sum + (avaliacao.estrela?.id || 0), 0);
      this.mediaEstrelas = totalEstrelas / this.avaliacoes.length;
    } else {
      this.mediaEstrelas = 0; // Valor padrão para evitar problemas
    }
  }
  
  getImageUrl(nomeImagem: string): string {
    return this.livroService.getUrlImage(nomeImagem);
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
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
  
    if (this.livro) {
      const item: ItemPedido = {
        idLivro: this.livro.id,
        titulo: this.livro.titulo,
        preco: this.livro.preco,
        quantidade: this.count,
        subTotal: this.livro.preco * this.count,
      };
      this.carrinhoService.adicionarAoCarrinho(item);
      this.snackBar.open(`${this.livro.titulo} foi adicionado ao carrinho!`, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  selecionarEstrela(estrela: number): void {
    this.novaEstrela = estrela;
  }

  enviarAvaliacao(): void {
    if (!this.idClienteLogado) {
      this.snackBar.open('Você precisa estar logado para enviar uma avaliação.', 'Fechar', {
        duration: 3000,
      });
      return;
    }
  
    if (this.novoComentario.trim() && this.novaEstrela > 0 && this.livro) {
      const novaAvaliacao = {
        comentario: this.novoComentario,
        estrela: this.novaEstrela,
        idLivro: this.livro.id,
        idCliente: this.idClienteLogado,
      };
  
      this.avaliacaoService.adicionarAvaliacao(novaAvaliacao).subscribe({
        next: (avaliacao) => {
          this.avaliacoes.push(avaliacao);
          this.calcularMediaEstrelas();
          this.novoComentario = '';
          this.novaEstrela = 0;
        },
        error: (error) => {
          console.error('Erro ao enviar a avaliação:', error);
        },
      });
    } else {
      console.error('Erro: Campos obrigatórios estão faltando.');
    }
  }

  cancelarEdicao(): void {
    this.editandoAvaliacaoId = null;
    this.editandoComentario = '';
    this.editandoEstrela = 0;
  }

  deletarAvaliacao(idAvaliacao: number): void {
    this.avaliacaoService.deletarAvaliacao(idAvaliacao).subscribe(() => {
      this.avaliacoes = this.avaliacoes.filter((a) => a.id !== idAvaliacao);
      this.calcularMediaEstrelas();
    });
  }

  isUsuarioLogadoAutorizado(avaliacao: Avaliacao): boolean {
    return (
      this.idClienteLogado === avaliacao.cliente.id || 
      this.clienteService.getUsuarioTipo() === 'Funcionario'
    );
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