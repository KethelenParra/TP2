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

  constructor(private route: ActivatedRoute, private boxService: BoxService) {}

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
