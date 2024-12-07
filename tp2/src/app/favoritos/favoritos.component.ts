import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../service/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LivroService } from '../service/livro.service';
import { Router } from '@angular/router';
import { BoxService } from '../service/box.service';
import { Autor } from '../models/autor.model';

type Desejo = {
  id: number;
  titulo: string;
  autores: string;
  imageUrl: string;
};

type BoxDesejo = {
  id: number;
  nome: string;
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
  desejos: Desejo[] = [];
  desejosBox: BoxDesejo[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    public livroService: LivroService,
    public boxService: BoxService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.verificarAutenticacao()) return;
    this.carregarFavoritos();
  }

  verificarAutenticacao(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  carregarFavoritos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clienteService.getListaDesejos().subscribe({
        next: (itens) => {
            this.desejos = itens
                .filter(item => item.tipo === 'Livro') // Verifica se é um livro
                .map(livro => ({
                    id: livro.id,
                    titulo: livro.nome,
                    autores: livro.autores?.map((autor) => autor.nome).join(', ') || 'Autor desconhecido', // Verifica se autores existe
                    imageUrl: this.livroService.getUrlImage(livro.imagemUrl || 'default-livro.jpg'), // URL da imagem com fallback
                }));

            this.desejosBox = itens
                .filter(item => item.tipo === 'Box') // Verifica se é um box
                .map(box => ({
                    id: box.id,
                    nome: box.nome,
                    autores: box.autores?.map((autor) => autor.nome).join(', ') || 'Autor desconhecido', // Verifica se autores existe
                    imageUrl: this.boxService.getUrlImage(box.imagemUrl || 'default-box.jpg'), // URL da imagem com fallback
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

  removerDaLista(id: number, tipo: 'livro' | 'box'): void {
    if (!this.verificarAutenticacao()) return;

    const remover$ =
      tipo === 'livro'
        ? this.clienteService.removerLivroDesejo(id)
        : this.clienteService.removerBoxDesejo(id);

    remover$.subscribe({
      next: () => {
        if (tipo === 'livro') {
          this.desejos = this.desejos.filter((desejo) => desejo.id !== id);
        } else {
          this.desejosBox = this.desejosBox.filter(
            (desejoBox) => desejoBox.id !== id
          );
        }
        this.snackBar.open('Removido da lista de desejos.', 'Fechar', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open(
          'Erro ao remover da lista de desejos.',
          'Fechar',
          { duration: 3000 }
        );
        console.error(error);
      },
    });
  }

  navigateToDetailBox(nome: string): void {
    this.router.navigate(['/nome', nome]);
  }

  navigateToDetailLivro(titulo: string): void {
    this.router.navigate(['/titulo', titulo]);
  }
}
