import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../service/livro.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const ELEMENT_DATA: Livro[] = [];

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTableModule, RouterModule, MatPaginator, MatInputModule, FormsModule],
  templateUrl: './livro-list.component.html',
  styleUrls: ['./livro-list.component.css']
})
export class LivroListComponent implements OnInit {

  livros = new MatTableDataSource(ELEMENT_DATA);

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
  livro = new MatTableDataSource<Livro>();
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 12;
  page = 0;
  filtro: string = "";
  isExpanded = true;

  constructor(private livroService: LivroService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.livroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.livros.data = data }
    );
    this.livroService.count().subscribe(
      data => { this.totalRecords = data }
    );
    this.livros.filterPredicate = (data: Livro, filter: string) => {
      return data.titulo.toLowerCase().includes(filter.toLowerCase());
    };
    this.livro.filterPredicate = (data: Livro, filter: string) => {
      return data.titulo?.toLowerCase().includes(filter) ?? null;
    };
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.livro.filter = filterValue.trim().toLowerCase();
  }

  excluir(livro: Livro): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Livro?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.livroService.delete(livro).subscribe({
          next: () => {
            this.livros.data = this.livros.data.filter(e => e.id !== livro.id);
            this.livro.data = this.livro.data.filter(e => e.id !== livro.id);
            this.snackBar.open('Livro excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o livro', err);
            this.snackBar.open('Erro ao excluir livro.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  toggleExpand(livro: any){
    livro.isExpanded = !livro.isExpanded;
  }

  getTruncatedText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
}
