import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardModule, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Box } from '../../../models/box.model';
import { Autor } from '../../../models/autor.model';
import { Editora } from '../../../models/editora.model';
import { Genero } from '../../../models/genero.model';
import { BoxService } from '../../../service/box.service';
import { AutorService } from '../../../service/autor.service';
import { EditoraService } from '../../../service/editora.service';
import { GeneroService } from '../../../service/genero.service';

type Card = {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  autores: string;
  imageUrl: string;
};

@Component({
  selector: 'app-box-card-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, NgFor, CommonModule,
    MatCardActions, MatCardContent, MatCardTitle, MatCardSubtitle, MatIconModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule, MatToolbarModule, RouterModule,
    MatCheckboxModule, MatProgressSpinnerModule
  ],
  templateUrl: './box-card-list.component.html',
  styleUrl: './box-card-list.component.css'
})
export class BoxCardListComponent implements OnInit {
  boxes: Box[] = []; 
  autores: Autor[] = [];
  editoras: Editora[] = [];
  generos: Genero[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "titulo";

  selectedAutores: number[] = [];
  selectedEditoras: number[] = [];
  selectedGeneros: number[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private boxService: BoxService,
    private snackBar: MatSnackBar,
    private router: Router,
    private autorService: AutorService,
    private editoraService: EditoraService,
    private generoService: GeneroService
  ) {}

  ngOnInit(): void {
    this.carregarBoxesFiltro();
    this.carregarBoxesAll();
  }

  carregarBoxesFiltro(): void {
    this.loading = true;
    this.errorMessage = '';

    // Se nenhum filtro for aplicado, restaura todos os itens
    if (
      this.selectedAutores.length === 0 &&
      this.selectedEditoras.length === 0 &&
      this.selectedGeneros.length === 0
    ) {
      this.boxService.findAll(this.page, this.pageSize).subscribe({
        next: (boxes) => {
          this.boxes = boxes;
          this.totalRecords = boxes.length;

          // Recarrega todos os filtros disponíveis
          this.carregarFiltros();
          this.loading = false;
          this.carregarCards();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erro ao carregar todos os boxes.';
          this.snackBar.open(this.errorMessage, 'Fechar', { duration: 3000 });
          console.error(error);
        },
      });
    } else {
      // Chama o serviço com os filtros selecionados
      this.boxService
        .findByFilters(
          this.selectedAutores,
          this.selectedEditoras,
          this.selectedGeneros,
          this.page,
          this.pageSize
        )
        .subscribe({
          next: (data) => {
            // Atualiza os boxes e os filtros dinâmicos
            this.boxes = data.boxes;
            this.autores = this.autores.filter((autor) =>
              data.autores.includes(autor.id)
            ); // Atualiza os autores dinamicamente
            this.editoras = this.editoras.filter((editora) =>
              data.editoras.includes(editora.id)
            );
            this.generos = this.generos.filter((genero) =>
              data.generos.includes(genero.id)
            );
            this.totalRecords = data.boxes.length; // Atualiza o total de registros
            this.loading = false;

            // Exibe mensagem se nenhum livro foi encontrado
            if (this.boxes.length === 0) {
              this.snackBar.open(
                'Nenhum box encontrado para os filtros aplicados!',
                'Fechar',
                { duration: 3000 }
              );
            }

            this.carregarCards();
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(
              'Erro ao buscar boxes com filtros.',
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
    const cards: Card[] = [];
    this.boxes.forEach(box => {
      cards.push({
        id: box.id,
        nome: box.nome,
        preco: box.preco,
        descricao: box.descricaoBox,
        autores: box.autores.map(autor => autor.nome).join(', '),
        imageUrl: this.boxService.getUrlImage(box.nomeImagem)
      });
    });
    this.cards.set(cards);
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
      // Se não houver filtros, carrega todos os boxes paginados
      this.carregarBoxesAll();
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
      this.carregarBoxesAll(); // Chama o método para carregar todos os boxes
      return;
    }

    if (this.tipoFiltro === 'nome') {
      this.boxService.findByNome(this.filtro, this.page, this.pageSize).subscribe({
        next: (boxes) => {
          this.boxes = boxes;
          this.totalRecords = boxes.length;
          this.carregarCards();
        },
        error: (error) => {
          console.error('Erro ao buscar por nome do boxe:', error);
          this.snackBar.open('Erro ao buscar boxes por nome.', 'Fechar', { duration: 3000 });
        },
      });
    } else if (this.tipoFiltro === 'autor') {
      this.boxService.findByAutor(this.filtro, this.page, this.pageSize).subscribe({
        next: (boxes) => {
          this.boxes = boxes;
          this.totalRecords = boxes.length;
          this.carregarCards();
        },
        error: (error) => {
          console.error('Erro ao buscar por autor:', error);
          this.snackBar.open('Erro ao buscar boxes por autor.', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Selecione um tipo de filtro válido.', 'Fechar', { duration: 3000 });
    }
  }

  carregarBoxesAll(): void {
    this.loading = true;

    this.boxService.findAll(this.page, this.pageSize).subscribe({
      next: (boxes) => {
        this.boxes = boxes;
        this.totalRecords = 13;
        this.carregarCards();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar todos os boxes:', error);
        this.snackBar.open('Erro ao carregar todos os boxes.', 'Fechar', { duration: 3000 });
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

    this.carregarBoxesFiltro();
  }

  navigateToDetail(nome: string): void {
    this.router.navigate(['/nome', nome]);
  }

}
