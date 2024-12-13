import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule, MatCardActions, MatCardContent, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Importação necessária
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importação necessária
import { CommonModule, NgFor } from '@angular/common';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../service/livro.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { Autor } from '../../../models/autor.model';
import { Editora } from '../../../models/editora.model';
import { Genero } from '../../../models/genero.model';
import { AutorService } from '../../../service/autor.service';
import { EditoraService } from '../../../service/editora.service';
import { GeneroService } from '../../../service/genero.service';
import { ClienteService } from '../../../service/cliente.service';

type Card = {
  id: number;
  titulo: string;
  preco: number;
  descricao: string;
  autores: string;
  imageUrl: string;
  listaDesejo: boolean;
};

@Component({
  selector: 'app-livro-card-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, NgFor, CommonModule,
    MatCardActions, MatCardContent, MatCardTitle, MatCardSubtitle, MatIconModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule, MatToolbarModule, RouterModule,
    MatCheckboxModule, MatProgressSpinnerModule
  ],
  templateUrl: './livro-card-list.component.html',
  styleUrls: ['./livro-card-list.component.css']
})

export class LivroCardListComponent implements OnInit {
  livros: Livro[] = [];
  autores: Autor[] = [];
  editoras: Editora[] = [];
  generos: Genero[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0;
  pageSize = 25;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "titulo";

  selectedAutores: number[] = [];
  selectedEditoras: number[] = [];
  selectedGeneros: number[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private livroService: LivroService,
    private snackBar: MatSnackBar,
    private router: Router,
    private autorService: AutorService,
    private editoraService: EditoraService,
    private generoService: GeneroService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.carregarLivrosFiltro();
    this.carregarLivrosAll();
  }

  carregarLivrosFiltro(): void {
    this.loading = true;
    this.errorMessage = '';

    // Se nenhum filtro for aplicado, restaura todos os itens
    if (
      this.selectedAutores.length === 0 &&
      this.selectedEditoras.length === 0 &&
      this.selectedGeneros.length === 0
    ) {
      this.livroService.findAll(this.page, this.pageSize).subscribe({
        next: (livros) => {
          this.livros = livros;
          this.totalRecords = livros.length;

          // Recarrega todos os filtros disponíveis
          this.carregarFiltros();
          this.loading = false;
          this.carregarCards();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erro ao carregar todos os livros.';
          this.snackBar.open(this.errorMessage, 'Fechar', { duration: 3000 });
          console.error(error);
        },
      });
    } else {
      // Chama o serviço com os filtros selecionados
      this.livroService
        .findByFilters(
          this.selectedAutores,
          this.selectedEditoras,
          this.selectedGeneros,
          this.page,
          this.pageSize
        )
        .subscribe({
          next: (data) => {
            // Atualiza os livros e os filtros dinâmicos
            this.livros = data.livros;
            this.autores = this.autores.filter((autor) =>
              data.autores.includes(autor.id)
            ); // Atualiza os autores dinamicamente
            this.editoras = this.editoras.filter((editora) =>
              data.editoras.includes(editora.id)
            );
            this.generos = this.generos.filter((genero) =>
              data.generos.includes(genero.id)
            );
            this.totalRecords = data.livros.length; // Atualiza o total de registros
            this.loading = false;

            // Exibe mensagem se nenhum livro foi encontrado
            if (this.livros.length === 0) {
              this.snackBar.open(
                'Nenhum livro encontrado para os filtros aplicados!',
                'Fechar',
                { duration: 3000 }
              );
            }

            this.carregarCards();
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(
              'Erro ao buscar livros com filtros.',
              'Fechar',
              { duration: 3000 }
            );
            console.error(error);
          },
        });
    }
  }

  carregarFiltros(): void {
    this.autorService.findAll().subscribe((data) => this.autores = data);
    this.editoraService.findAll().subscribe((data) => this.editoras = data);
    this.generoService.findAll().subscribe((data) => this.generos = data);
  }

  carregarCards(): void {
    const tipoUsuario = localStorage.getItem('usuario_tipo'); // Assume que o tipo foi salvo no localStorage pelo AuthService
    if (tipoUsuario === 'Funcionario') {
      console.log('Funcionário logado - ignorando carregamento de lista de desejos.');
      // Carrega os livros sem marcar a lista de desejos
      const cards: Card[] = this.livros.map((livro) => ({
        id: livro.id,
        titulo: livro.titulo,
        preco: livro.preco,
        descricao: livro.descricao,
        autores: livro.autores.map((autor) => autor.nome).join(', '),
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
        listaDesejo: false, // Funcionários não têm lista de desejos
      }));
  
      this.cards.set(cards);
      return;
    }  

    // Verifica se o usuário está logado antes de tentar carregar a lista de desejos
    if (!this.isLoggedIn) {
      // Usuário não logado, carrega os livros sem marcar a lista de desejos
      const cards: Card[] = this.livros.map((livro) => ({
        id: livro.id,
        titulo: livro.titulo,
        preco: livro.preco,
        descricao: livro.descricao,
        autores: livro.autores.map((autor) => autor.nome).join(', '),
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
        listaDesejo: false, // Sem login, nenhum livro está na lista de desejos
      }));
  
      this.cards.set(cards);
      return;
    }
  
    // Caso o usuário esteja logado, tenta carregar a lista de desejos
    this.clienteService.getListaDesejos().subscribe({
      next: (livrosDesejados) => {
        const idsDesejados = livrosDesejados.map((livro) => livro.id);
  
        const cards: Card[] = this.livros.map((livro) => ({
          id: livro.id,
          titulo: livro.titulo,
          preco: livro.preco,
          descricao: livro.descricao,
          autores: livro.autores.map((autor) => autor.nome).join(', '),
          imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
          listaDesejo: idsDesejados.includes(livro.id),
        }));
  
        this.cards.set(cards);
      },
      error: (error) => {
        console.error('Erro ao carregar lista de desejos:', error);
        this.snackBar.open(
          'Erro ao carregar a lista de desejos. Exibindo apenas livros disponíveis.',
          'Fechar',
          { duration: 3000 }
        );
  
        // Carrega os livros sem marcar a lista de desejos
        const cards: Card[] = this.livros.map((livro) => ({
          id: livro.id,
          titulo: livro.titulo,
          preco: livro.preco,
          descricao: livro.descricao,
          autores: livro.autores.map((autor) => autor.nome).join(', '),
          imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
          listaDesejo: false, // Em caso de erro, nenhum livro está na lista de desejos
        }));
  
        this.cards.set(cards);
      },
    });
  }
  
  adicionarEFavoritar(card: Card): void {
    if (!this.isLoggedIn) {
      this.snackBar.open(
        'Você precisa estar logado para adicionar à lista de desejos.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }
  
    if (!card.listaDesejo) {
      this.clienteService.adicionarLivroDesejo(card.id).subscribe({
        next: () => {
          this.snackBar.open('Livro adicionado à lista de desejos.', 'Fechar', { duration: 3000 });
          card.listaDesejo = true;
        },
        error: () => {
          this.snackBar.open('Erro ao adicionar livro à lista de desejos.', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Este livro já está na sua lista de desejos.', 'Fechar', { duration: 3000 });
    }
  }
  
  
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    // Verifica se não há filtros aplicados
    const hasNoFilters =
      this.selectedAutores.length === 0 &&
      this.selectedEditoras.length === 0 &&
      this.selectedGeneros.length === 0 &&
      this.filtro.trim() === '';

    if (hasNoFilters) {
      // Se não houver filtros, carrega todos os livros paginados
      this.carregarLivrosAll();
    } else {
      // Se houver filtros, impede a paginação e redefine a página para 0
      this.page = 0;
      this.snackBar.open('A paginação só está disponível sem filtros aplicados.', 'Fechar', { duration: 3000 });
    }
  }

  filtrar(): void {
    this.page = 0; // Reseta para a primeira página ao aplicar o filtro

    // Verifica se o campo de filtro está vazio
    if (this.filtro.trim() === '') {
      this.carregarLivrosAll(); // Chama o método para carregar todos os livros
      return;
    }

    if (this.tipoFiltro === 'titulo') {
      this.livroService.findByTitulo(this.filtro, this.page, this.pageSize).subscribe({
        next: (livros) => {
          this.livros = livros;
          this.totalRecords = livros.length;
          this.carregarCards();
        },
        error: (error) => {
          console.error('Erro ao buscar por título:', error);
          this.snackBar.open('Erro ao buscar livros por título.', 'Fechar', { duration: 3000 });
        },
      });
    } else if (this.tipoFiltro === 'autor') {
      this.livroService.findByAutor(this.filtro, this.page, this.pageSize).subscribe({
        next: (livros) => {
          this.livros = livros;
          this.totalRecords = livros.length;
          this.carregarCards();
        },
        error: (error) => {
          console.error('Erro ao buscar por autor:', error);
          this.snackBar.open('Erro ao buscar livros por autor.', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Selecione um tipo de filtro válido.', 'Fechar', { duration: 3000 });
    }
  }

  carregarLivrosAll(): void {
    this.loading = true;

    this.livroService.findAll(this.page, this.pageSize).subscribe({
      next: (livros) => {
        this.livros = livros;
        this.totalRecords = 65;
        this.carregarCards();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar todos os livros:', error);
        this.snackBar.open('Erro ao carregar todos os livros.', 'Fechar', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  onAutorSelect(autorId: number): void {
    this.toggleSelection(this.selectedAutores, autorId);
  }

  onEditoraSelect(editoraId: number): void {
    this.toggleSelection(this.selectedEditoras, editoraId);
  }

  onGeneroSelect(generoId: number): void {
    this.toggleSelection(this.selectedGeneros, generoId);
  }

  toggleSelection(array: number[], id: number): void {
    const index = array.indexOf(id);
    if (index === -1) {
      array.push(id);
    } else {
      array.splice(index, 1);
    }

    // Verifica se todos os filtros estão desmarcados
    const isAllDeselected = this.selectedAutores.length === 0 && this.selectedEditoras.length === 0 && this.selectedGeneros.length === 0;
    if (isAllDeselected) {
      this.carregarFiltros(); // Recarrega todos os filtros disponíveis
    }

    this.carregarLivrosFiltro();
  }


  navigateToDetail(titulo: string): void {
    this.router.navigate(['/titulo', titulo]);
  }

}
