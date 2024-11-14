import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule, MatCardActions, MatCardContent, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
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
import { RouterModule } from '@angular/router';

type Card = {
  titulo: string;
  preco: number;
  descricao: string;
  autores: string;
  imageUrl: string;
}

@Component({
  selector: 'app-livro-card-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, NgFor, CommonModule,
    MatCardActions, MatCardContent, MatCardTitle, MatCardSubtitle, MatIconModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatPaginatorModule, MatSelectModule, MatToolbarModule, RouterModule
  ],
  templateUrl: './livro-card-list.component.html',
  styleUrls: ['./livro-card-list.component.css']
})

export class LivroCardListComponent implements OnInit {
  livros: Livro[] = [];
  cards = signal<Card[]>([]);
  totalRecords = 0; 
  pageSize = 10;
  page = 0;
  filtro: string = "";
  tipoFiltro: string = "titulo";

  constructor(private livroService: LivroService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.carregarLivros();
    this.buscar();  
  }

  formatarTitulo(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }

  carregarLivros() {
    if(this.filtro) {
      if(this.tipoFiltro === 'autor') {
        this.livroService.findByAutor(this.filtro, this.page, this.pageSize).subscribe(data => {
          this.livros = data;
          this.carregarCards();
        });
      } else {
        this.livroService.findByTitulo(this.filtro, this.page, this.pageSize).subscribe(data => {
          this.livros = data;
          this.carregarCards();
        });
      }
    } else {
      this.livroService.findAll(this.page, this.pageSize).subscribe(data => {
        this.livros = data;
        this.carregarCards();
      });
    }
  }

  carregarCards() {
    const cards: Card[] = [];
    this.livros.forEach(livro => {
      cards.push({
        titulo: livro.titulo,
        preco: livro.preco,
        descricao: livro.descricao,
        autores: livro.autores.map(autor => autor.nome).join(', '),
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem)
      });
    });
    this.cards.set(cards);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarLivros();
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
    this.carregarLivros();
    this.buscar();
    this.snackBar.open('Livros filtrados com sucesso!', 'Fechar', { duration: 3000 });
  }
}
