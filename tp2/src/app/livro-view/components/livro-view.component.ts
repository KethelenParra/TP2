import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivroService } from '../../service/livro.service';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Livro } from '../../models/livro.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AutorPopUpComponent } from '../autor-pop-up/autor-pop-up.component';

type Card = {
  titulo: string;
  preco: number;
  descricao: string;
  autores: string;
  imageUrl: string;
}

@Component({
  selector: 'app-livro-view',
  standalone: true,
  imports: [MatCardModule, NgIf, CurrencyPipe, MatButtonModule, MatInputModule, MatIconModule, MatDividerModule, AutorPopUpComponent],
  templateUrl: './livro-view.component.html',
  styleUrl: './livro-view.component.css'
})
export class LivroViewComponent implements OnInit {
  livro: Livro | undefined;
  autoresFormatados: string = '';
  titulo: string = '';
  
  constructor(private route: ActivatedRoute, private livroService: LivroService) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => {
        this.livro = data.livro;
        if (this.livro?.autores) {
          this.autoresFormatados = this.livro.autores.map(autor => autor.nome).join(', ');
        }
      },
      (err) => {
        console.error('Erro ao carregar os dados do livro', err);
      }
    );
    this.route.paramMap.subscribe((params) => {
      this.titulo = decodeURIComponent(params.get('titulo') || '');
    });
  }

  getImageUrl(nomeImagem: string): string {
    return this.livroService.getUrlImage(nomeImagem);
  }

  count: number = 1;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }
}