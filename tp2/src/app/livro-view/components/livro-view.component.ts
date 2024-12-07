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
import { CarrinhoService } from '../../service/carrinho.service';
import { ItemPedido } from '../../models/item-pedido.model';


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
  imports: [MatCardModule, NgIf, CurrencyPipe, MatButtonModule, MatInputModule, MatIconModule, MatDividerModule],
  templateUrl: './livro-view.component.html',
  styleUrl: './livro-view.component.css'
})
export class LivroViewComponent implements OnInit {
  livro: Livro | undefined;
  autoresFormatados: string = '';
  titulo: string = '';
  count: number = 1;
  
  constructor(private route: ActivatedRoute, private livroService: LivroService, private carrinhoService: CarrinhoService) {}

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

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  adicionarAoCarrinho(): void {
    if (this.livro) {
      const item: ItemPedido = {
        idLivro: this.livro.id,
        titulo: this.livro.titulo,
        preco: this.livro.preco,
        quantidade: this.count,
        subTotal: this.livro.preco * this.count,
      };
      this.carrinhoService.adicionarAoCarrinho(item);
      alert(`${this.livro.titulo} foi adicionado ao carrinho!`);
    }
  }
}