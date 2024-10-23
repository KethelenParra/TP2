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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationComponent } from '../../../navigation/navigation.component';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule,  CommonModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent],
  templateUrl: './livro-list.component.html',
  styleUrls: ['./livro-list.component.css'] // Corrigido para "styleUrls"
})
export class LivroListComponent implements OnInit {
  
  displayedColumns: string[] = [
    'id', 
    'titulo', 
    'quantidadeEstoque', 
    'preco', 
    'isbn', 
    'descricao', 
    'datalancamento',
    'classificacao', 
    'editora', 
    'fornecedor',
    'genero',
    'autor', 
    'acao'
  ];
  livros: Livro[] = [];
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 2;
  page = 0;

  constructor(private livroService: LivroService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.livroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.livros = data }
    );
    this.livroService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  excluir(livro: Livro): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Deseja realmente excluir este Livro?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.livroService.delete(livro).subscribe({
          next: () => {
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
