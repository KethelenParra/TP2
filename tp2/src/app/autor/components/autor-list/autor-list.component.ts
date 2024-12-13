import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Autor } from '../../../models/autor.model';
import { AutorService } from '../../../service/autor.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const ELEMENT_DATA: Autor[] = [];

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports:[MatToolbarModule, FormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule , MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator],
  templateUrl: './autor-list.component.html',
  styleUrl: './autor-list.component.css'
})
export class AutorListComponent {
  displayedColumns: string[] = ['id', 'nome', 'biografia', 'acao'];
  autores = new MatTableDataSource(ELEMENT_DATA);
   //Variaveis de controle para a paginação
   totalRecords = 0;
   pageSize = 10;
   page = 0;
   filtro: string = "";

  constructor (
    private autorService: AutorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.autorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.autores.data = data}
    );

    this.autorService.count().subscribe(
      data => { this.totalRecords = data }
    );
    this.autores.filterPredicate = (data: Autor, filter: string) => {
      return data.nome.toLowerCase().includes(filter.toLowerCase());
    }; 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.autores.filter = filterValue.trim().toLowerCase();
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  excluir(autor: Autor): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Autor?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.autorService.delete(autor).subscribe({
          next: () => {
            this.autores.data = this.autores.data.filter(e => e.id !== autor.id);
            this.snackBar.open('Autor excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o autor', err);
            this.snackBar.open('Erro ao excluir autor.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
