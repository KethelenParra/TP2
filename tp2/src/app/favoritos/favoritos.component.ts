import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../service/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LivroService } from '../service/livro.service';
import { Router } from '@angular/router';

type Desejo = {
  id: number;
  titulo: string;
  descricao: string;
  autores: string;
  imageUrl: string;
};

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    NgIf,
  ],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
})
export class FavoritosComponent implements OnInit {
  desejos: Desejo[] = []; // Alterado para um array simples
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    public livroService: LivroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLivrosFavoritos();
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
      return;
    }
  }

  carregarLivrosFavoritos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clienteService.getLivrosListaDesejos().subscribe({
      next: (livros) => {
        this.desejos = livros.map((livro) => ({
          id: livro.id,
          titulo: livro.titulo,
          descricao: livro.descricao,
          autores: livro.autores.map((autor) => autor.nome).join(', ') || '',
          imageUrl: this.livroService.getUrlImage(livro.nomeImagem),
        }));
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar a lista de desejos.';
        this.snackBar.open(this.errorMessage, 'Fechar', { duration: 3000 });
        console.error(error);
      },
    });
  }

  removerDaLista(idLivro: number): void {
    this.clienteService.removerLivroDesejo(idLivro).subscribe({
      next: () => {
        this.desejos = this.desejos.filter(
          (desejo) => desejo.id !== idLivro
        );
        this.snackBar.open(
          'Livro removido da lista de desejos.',
          'Fechar',
          { duration: 3000 }
        );
      },
      error: (error) => {
        this.snackBar.open(
          'Erro ao remover o livro da lista de desejos.',
          'Fechar',
          { duration: 3000 }
        );
        console.error(error);
      },
    });
  }
}
