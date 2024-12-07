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

  constructor(private route: ActivatedRoute, private boxService: BoxService,  private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => {
        this.box = data.box;
        if (this.box?.autores) {
          this.autoresFormatados = this.box.autores.map(autor => autor.nome).join(', ');
        }
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

  adicionarAoCarrinho(): void {
    if (this.box) {
      const item: ItemPedido = {
        idBox: this.box.id,
        titulo: this.box.nome,
        preco: this.box.preco,
        quantidade: this.count,
        subTotal: this.box.preco * this.count,
      };
      this.carrinhoService.adicionarAoCarrinho(item);
      alert(`${this.box.nome} foi adicionado ao carrinho!`);
    }
  }
}
