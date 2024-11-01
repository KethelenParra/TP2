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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { FooterComponent } from '../../../footer/footer.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatSnackBarModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent, SidebarComponent, FooterComponent],
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
  filtro: string = "";

  constructor(private livroService: LivroService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.livroService.findAll(this.page, this.pageSize).subscribe(
      data => { this.livros = data }
    );
    this.livroService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  carregarLivros(){
    if(this.filtro){
      this.livroService.findByTitulo(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.livros = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.livroService.findAll(this.page, this.pageSize).subscribe(data => {
        this.livros = data;
        console.log(JSON.stringify(data));
      })
    };
  }

  carregarTodosRegistros() {
    if(this.filtro){
      this.livroService.countByNome(this.filtro).subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.livroService.count().subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      });
    }
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  aplicarFiltro(){
    this.carregarLivros();
    this.carregarTodosRegistros();
    this.snackBar.open('Filtro aplicado com sucesso!', 'Fechar', { duration: 3000 });
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
            this.livros = this.livros.filter(e => e.id !== livro.id);
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
}
