import { Component,  OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Livro } from '../models/livro.model';
import { LivroService } from '../service/livro.service';
import { BoxService } from '../service/box.service';
import { AutorService } from '../service/autor.service';
import { EditoraService } from '../service/editora.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Box } from '../models/box.model';
import { Autor } from '../models/autor.model';
import { Editora } from '../models/editora.model';
import { Genero } from '../models/genero.model';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AutorBiografiaDialogComponent } from '../autor/components/autor-biografia-dialog/autor-biografia-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    FormsModule,
    CommonModule  
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  livros: Livro[] = [];
  boxes: Box[] = [];
  autores: Autor[] = [];
  editoras: Editora[] = [];
  generos: Genero[] = [];
  livrosRomance: Livro[] = [];
  loading = true;
  animationClass = ''; 

  livrosCarouselIndex = 0;
  boxCarouselIndex = 0;
  autoresCarouselIndex = 0;
  editorasCarouselIndex = 0;
  romanceCarouselIndex = 0;
  livrosPorPagina = 7;
  autoresPorPagina = 7;
  editorasPorPagina = 7;
  boxesPorPagina = 7;

  filtro: string = '';
  tipoFiltro: string = 'titulo';

  constructor(
    public livroService: LivroService,
    private boxService: BoxService,
    private autorService: AutorService,
    private editoraService: EditoraService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

   ngOnInit(): void {
    this.carregarDados();
  }

  carregarLivros(): void{
    this.livroService.findAll().subscribe(
      (livros: Livro[]) => {
        this.livros = livros;
        this.livrosRomance = livros.filter((livro) =>
          livro.generos?.some((genero) => genero.nome.toLowerCase() === 'romance')
        );
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar os livros', error);
        this.loading = false;
      }
    )
  }

  carregarBox(): void{
    this.boxService.findAll().subscribe(
      (box: Box[]) => {
        this.boxes = box;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar os Boxes', error);
        this.loading = false;
      }
    )
  }

  carregarAutores(): void{
    this.autorService.findAll().subscribe(
      (autor: Autor[]) => {
        this.autores = autor;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar os Autores', error);
        this.loading = false;
      }
    )
  }

  carregarEditoras(): void{
    this.editoraService.findAll().subscribe(
      (editora: Editora[]) => {
        this.editoras = editora;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar as Editoras', error);
        this.loading = false;
      }
    )
  }

  getAutorImageUrl(nomeImagem: string): string {
    return this.autorService.getUrlImage(nomeImagem);
  }

  getLivroImageUrl(nomeImagem: string): string {
    return this.livroService.getUrlImage(nomeImagem);
  }

  getBoxImageUrl(nomeImagem: string): string {
    return this.boxService.getUrlImage(nomeImagem);
  }

  filtrar(): void {
    if (!this.filtro.trim()) {
      this.snackBar.open('Digite um termo para buscar.', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.tipoFiltro === 'titulo') {
      this.livroService.findByTitulo(this.filtro).subscribe({
        next: (data) => {
          this.livros = data;
          this.snackBar.open('Resultados para o título encontrados.', 'Fechar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erro ao buscar por título. Tente novamente.', 'Fechar', { duration: 3000 });
        },
      });
    } else if (this.tipoFiltro === 'autor') {
      this.livroService.findByAutor(this.filtro).subscribe({
        next: (data) => {
          this.livros = data;
          this.snackBar.open('Resultados para o autor encontrados.', 'Fechar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erro ao buscar por autor. Tente novamente.', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Filtro inválido. Escolha título ou autor.', 'Fechar', { duration: 3000 });
    }
  }

  carregarDados(): void {
    this.livroService.findAll().subscribe((data) => (this.livros = data));
    this.boxService.findAll().subscribe((data) => (this.boxes = data));
    this.autorService.findAll().subscribe((data) => (this.autores = data));
    this.editoraService.findAll().subscribe((data) => (this.editoras = data));
    this.livroService.findAll().subscribe((romance) => (this.livrosRomance  = romance.filter((livro) => livro.generos?.some((genero) => genero.nome.toLowerCase() === 'romance')))); 
  }

  getGenerosNomes(livro: Livro): string {
    return livro.generos?.map((g) => g.nome).join(', ') || '';
  }

  moveCarouselLeft(carouselType: 'livros' | 'boxes' | 'autores' | 'editoras' | 'romance'): void {
    if (carouselType === 'livros' && this.livrosCarouselIndex > 0) {
      this.animationClass = 'slide-right'; // Animação de deslizar para a direita
      setTimeout(() => {
        this.livrosCarouselIndex--;
        this.animationClass = ''; // Remove a animação após a transição
      }, 500); // Tempo da animação
    } else if (carouselType === 'boxes' && this.boxCarouselIndex > 0) {
      this.animationClass = 'slide-right'; // Animação de deslizar para a direita
      setTimeout(() => {
        this.boxCarouselIndex--;
        this.animationClass = ''; // Remove
      },  500); // Tempo da animação
    } else if (carouselType === 'autores' && this.autoresCarouselIndex > 0) {
      this.animationClass = 'slide-right'; // Animação de deslizar para a direita
      setTimeout(() => {
        this.autoresCarouselIndex--;
        this.animationClass = ''; // Remove
      },  500); // Tempo da animação
    } else if (carouselType === 'editoras' && this.editorasCarouselIndex > 0) {
      this.animationClass = 'slide-right'; // Animação de deslizar para a direita
      setTimeout(() => {
        this.editorasCarouselIndex--;
        this.animationClass = ''; // Remove
      },  500); // Tempo da animação
    } else if (carouselType === 'romance' && this.romanceCarouselIndex > 0) {
      this.animationClass = 'slide-right'; // Animação de deslizar para a direita
      setTimeout(() => {
        this.romanceCarouselIndex--;
        this.animationClass = ''; // Remove
      },  500); // Tempo da animação
    }
  }
  
  moveCarouselRight(carouselType: 'livros' | 'boxes' | 'autores' | 'editoras' | 'romance'): void {
    if (carouselType === 'livros' && this.livrosCarouselIndex + this.livrosPorPagina < this.livros.length) {
      this.animationClass = 'slide-left'; // Animação de deslizar para a esquerda
      setTimeout(() => {
        this.livrosCarouselIndex++;
        this.animationClass = ''; // Remove a animação após a transição
      }, 20); // Tempo da animação
    } else if (carouselType === 'boxes' && this.boxCarouselIndex + this.boxesPorPagina < this.boxes.length) {
      this.animationClass = 'slide-left'; // Animação de deslizar para a esquerda
      setTimeout(() => {
        this.boxCarouselIndex++;
        this.animationClass = ''; // Remove
      },  20); // Tempo da animação
    } else if (carouselType === 'autores' && this.autoresCarouselIndex + this.autoresPorPagina < this.autores.length) {
      this.animationClass = 'slide-left'; // Animação de deslizar para a esquerda
      setTimeout(() => {
        this.autoresCarouselIndex++;
        this.animationClass = ''; // Remove
      }, 20); // Tempo da animação
    } else if (carouselType === 'editoras' && this.editorasCarouselIndex + this.editorasPorPagina < this.editoras.length) {
      this.animationClass = 'slide-left'; // Animação de deslizar para a esquerda
      setTimeout(() => {
        this.editorasCarouselIndex++;
        this.animationClass = ''; // Remove
      }, 20); // Tempo da animação
    } else if (carouselType === 'romance' && this.romanceCarouselIndex + this.livrosPorPagina < this.livrosRomance.length) {
      this.animationClass = 'slide-left'; // Animação de deslizar para a esquerda
      setTimeout(() => {
        this.romanceCarouselIndex++;
        this.animationClass = ''; // Remove
      }, 20); // Tempo da animação
    }
  }
  
  getCarouselLength(carouselType: string): number {
    switch (carouselType) {
      case 'livros':
        return this.livros.length;
      case 'boxes':
        return this.boxes.length;
      case 'autores':
        return this.autores.length;
      case 'editoras':
        return this.editoras.length;
        case 'romance':
          return this.livrosRomance.length;
      default:
        return 0;
    }
  }
  
  getCircularItems(array: any[], startIndex: number, count: number): any[] {
    const result = [];
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % array.length;
      result.push(array[index]);
    }
    return result;
  }

  verTodosLivros(): void{
    this.router.navigate(['/livrosCard']);
  }

  verTodosBoxes(): void{
    this.router.navigate(['/boxesCard']);
  }

  navigateToDetailLivro(titulo: string): void {
    this.router.navigate(['/titulo', titulo]);
  }

  navigateToDetailBox(nome: string): void {
    this.router.navigate(['/nome', nome]);
  }

  abrirBiografiaAutor(autor: Autor): void {
    this.dialog.open(AutorBiografiaDialogComponent, {
      width: '400px', // Ajuste conforme necessário
      data: {
        nome: autor.nome,
        biografia: autor.biografia,
        imagem: this.getAutorImageUrl(autor.nomeImagem), // Passando a URL da imagem
      },
    });
  }
}