import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../service/editora.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-editora-list',
  standalone: true,
  imports: [MatToolbarModule, FormsModule, MatSnackBarModule, MatInputModule, MatFormFieldModule,MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator],
  templateUrl: './editora-list.component.html',
  styleUrl: './editora-list.component.css'
})
export class EditoraListComponent implements OnInit {
  editora = new MatTableDataSource<Editora>();
  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'cidade', 'estado', 'acao'];
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(private editoraService: EditoraService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.editoraService.findAll(this.page, this.pageSize).subscribe(
      data => { this.editora.data = data }
    );
    this.editoraService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.editora.filter = filterValue.trim().toLowerCase();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  excluir(editora: Editora): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Autor?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.editoraService.delete(editora).subscribe({
          next: () => {
            this.editora.data = this.editora.data.filter(e => e.id !== editora.id);
            this.snackBar.open('Editora excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o editora', err);
            this.snackBar.open('Erro ao excluir editora.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}