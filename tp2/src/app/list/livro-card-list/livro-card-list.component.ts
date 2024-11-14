import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor } from '@angular/common';
import { Livro } from '../../models/livro.model';
import { LivroService } from '../../service/livro.service';
import { RouterModule } from '@angular/router';


type Card = {
  titulo: string;
  preco: number;
  descricao: string;
  autores: string[];
  imageUrl: string;
}
@Component({
  selector: 'app-livro-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgFor, CommonModule, RouterModule],
  templateUrl: './livro-card-list.component.html',
  styleUrl: './livro-card-list.component.css'
})

export class LivroCardListComponent {
  livros: Livro[] = [];
  cards = signal<Card[]>([]);

  constructor(private livroService: LivroService) { }

  ngOnInit(): void {
    this.carregarLivros();
  }

  formatarTitulo(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }

  carregarLivros() {
    // buscando os livros
    this.livroService.findAll().subscribe(data => {
      this.livros = data;
      this.carregarCards();
    });
  }

  carregarCards() {
    const cards: Card[] = [];
    this.livros.forEach(livro => {
      cards.push({
        titulo: livro.titulo,
        preco: livro.preco,
        descricao: livro.descricao,
        autores: livro.autores.map(autor => autor.nome),
        imageUrl: this.livroService.getUrlImage(livro.nomeImagem)
      });
    });
    this.cards.set(cards);
  }
}
