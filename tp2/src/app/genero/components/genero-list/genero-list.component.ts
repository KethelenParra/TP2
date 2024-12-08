import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../service/genero.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const ELEMENT_DATA: Genero[] = [];


@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [MatIconModule, MatSnackBarModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, MatInputModule, FormsModule],
  templateUrl: './genero-list.component.html',
  styleUrl: './genero-list.component.css'
})
export class GeneroListComponent {
  generos = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acao'];
   //Variaveis de controle para a paginação
   totalRecords = 0;
   pageSize = 10;
   page = 0;
   filtro: string = "";

  constructor(private generoService: GeneroService, private dialog: MatDialog, private snackBar: MatSnackBar){
  }

  ngOnInit(): void {
    this.generoService.findAll(this.page, this.pageSize).subscribe(
      data => { this.generos.data = data }
    );
    this.generoService.count().subscribe(
      data => { this.totalRecords = data }
    );
    this.generos.filterPredicate = (data: Genero, filter: string) => {
      return data.nome.toLowerCase().includes(filter.toLowerCase());
    };
  }
  
  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.generos.filter = filterValue.trim().toLowerCase();
  }

  excluir(genero: Genero): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Genero?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.generoService.delete(genero).subscribe({
          next: () => {
            this.generos.data = this.generos.data.filter(e => e.id !== genero.id);
            this.snackBar.open('Genero excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o genero', err);
            this.snackBar.open('Erro ao excluir genero.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
   
}