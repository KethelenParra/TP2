import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../service/livro.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule,  CommonModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './livro-list.component.html',
  styleUrls: ['./livro-list.component.css'] // Corrigido para "styleUrls"
})
export class LivroListComponent implements OnInit {
  
  // Adicionado todos os campos necessários no displayedColumns
  displayedColumns: string[] = [
    'id', 
    'titulo', 
    'preco', 
    'quantidadeEstoque', 
    'isbn', 
    'datalancamento', 
    'descricao', 
    'classificacao', 
    'fornecedor', 
    'editora', 
    'autor', 
    'genero', 
    'acao'
  ];
  livros: Livro[] = [];

  constructor(private livroService: LivroService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Carregar a lista de livros
    this.livroService.findAll().subscribe(
      data => { this.livros = data; },
      error => { console.error('Erro ao carregar os livros', error); }
    );
  }

  excluir(livro: Livro): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        message: 'Deseja realmente excluir este Livro?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.livroService.delete(livro).subscribe({
          next: () => {
            // Atualizar a lista de livros removendo o livro excluído
            this.livros = this.livros.filter(l => l.id !== livro.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o livro', err);
          }
        });
      }
    });
  }
}
