import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { LivroService } from '../../service/livro.service';
// import { MatCardModule } from '@angular/material/card';
// import { NgIf } from '@angular/common';
// import { CurrencyPipe } from '@angular/common';
// import { Livro } from '../../models/livro.model';

@Component({
  selector: 'app-livro-view',
  standalone: true,
  // imports: [MatCardModule, NgIf, CurrencyPipe],
  templateUrl: './livro-view.component.html',
  styleUrl: './livro-view.component.css'
})
export class LivroViewComponent  {
  // livro: Livro | undefined
  // autoresFormatados: string = '';

  // constructor(private route: ActivatedRoute, private livroService: LivroService) {}

  // ngOnInit(): void {
  //   this.route.data.subscribe({
  //     next: (data: { livro: Livro }) => {
  //       this.livro = data.livro;
  //       if (this.livro?.autores) {
  //         this.autoresFormatados = this.livro.autores.map(autor => autor.nome).join(', ');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar os dados do livro', err);
  //     }
  //   });
  // }

  // getImageUrl(nomeImagem: string): string {
  //   return this.livroService.getUrlImage(nomeImagem);
  // }
}