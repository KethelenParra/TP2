import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule, MatCardActions, MatCardContent, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Importação necessária
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importação necessária
import { CommonModule, NgFor } from '@angular/common';
import { Livro } from '../../models/livro.model';
import { LivroService } from '../../service/livro.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'; 
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input'; 
import { Router, RouterModule } from '@angular/router';
import { Autor } from '../../models/autor.model';
import { Editora } from '../../models/editora.model';
import { Genero } from '../../models/genero.model';
import { AutorService } from '../../service/autor.service';
import { EditoraService } from '../../service/editora.service';
import { GeneroService } from '../../service/genero.service';

type Card = {
  titulo: string;
  preco: number;
  descricao: string;
  autores: string;
  imageUrl: string;
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
  errorMessage: string = ''; // Mensagem de erro

  constructor(
    private livroService: LivroService, 
    private snackBar: MatSnackBar, 
    private router: Router, 
    private autorService: AutorService,
    private editoraService: EditoraService,
    private generoService: GeneroService
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
    this.carregarFiltros();
  }

  carregarLivros(): void {
    this.loading = true;
    this.errorMessage = '';
  
    if (this.selectedAutores.length > 0 || this.selectedEditoras.length > 0 || this.selectedGeneros.length > 0) {
      this.livroService.findByFilters(this.selectedAutores, this.selectedEditoras, this.selectedGeneros)
        .subscribe({
          next: (data) => {
            this.livros = data; // Retorno direto como um array
            this.totalRecords = data.length; // Total de registros com base no tamanho do array
            this.loading = false;
  
            if (this.livros.length === 0) {
              this.snackBar.open('Nenhum livro encontrado para os filtros aplicados!', 'Fechar', { duration: 3000 });
            }
  
            this.carregarCards();
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Erro ao buscar livros com filtros.';
            this.snackBar.open(this.errorMessage, 'Fechar', { duration: 3000 });
            console.error(error);
          }
        });
    } else if (this.filtro) {
      const busca = this.tipoFiltro === 'autor'
        ? this.livroService.findByAutor(this.filtro, this.page, this.pageSize)
        : this.livroService.findByTitulo(this.filtro, this.page, this.pageSize);
  
      busca.subscribe({
        next: (data) => {
          this.livros = data; // Retorno direto como um array
          this.totalRecords = data.length; // Total de registros com base no tamanho do array
          this.loading = false;
  
          if (this.livros.length === 0) {
            this.snackBar.open(`Nenhum livro encontrado para ${this.tipoFiltro}!`, 'Fechar', { duration: 3000 });
          }
  
          this.carregarCards();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = `Erro ao buscar livros por ${this.tipoFiltro}.`;
          this.snackBar.open(this.errorMessage, 'Fechar', { duration: 3000 });
          console.error(error);
        }
      });
    } else {
      this.livroService.findAll(this.page, this.pageSize)
        .subscribe({
          next: (data) => {
            this.livros = data; // Retorno direto como um array
            this.totalRecords = data.length; // Total de registros com base no tamanho do array
            this.loading = false;
            this.carregarCards();
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Erro ao carregar todos os livros.';
            this.snackBar.open(this.errorMessage, 'Fechar', { duration: 3000 });
            console.error(error);
          }
        });
    }
  }
  

  carregarFiltros(): void {
    this.autorService.findAll().subscribe((data) => this.autores = data);
    this.editoraService.findAll().subscribe((data) => this.editoras = data);
    this.generoService.findAll().subscribe((data) => this.generos = data);
  }

  carregarCards(): void {
    this.cards.set(this.livros.map((livro) => ({
      titulo: livro.titulo,
      preco: livro.preco,
      descricao: livro.descricao,
      autores: livro.autores.map((autor) => autor.nome).join(', '),
      imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
    })));
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarLivros(); // Atualiza a página de acordo com o evento de paginação
  }

  filtrar(): void {
    this.page = 0; // Reseta para a primeira página ao aplicar o filtro
    this.carregarLivros();
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
    this.carregarLivros();
  }

  navigateToDetail(titulo: string): void {
    this.router.navigate(['/titulo', titulo]);
  }
}
