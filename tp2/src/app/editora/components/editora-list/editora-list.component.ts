import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../service/editora.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationComponent } from '../../../components/navigation/navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from '../../../template/sidebar/sidebar.component';
import { FooterComponent } from '../../../template/footer/footer.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../../template/header/header.component';

@Component({
  selector: 'app-editora-list',
  standalone: true,
  imports: [MatToolbarModule, FormsModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './editora-list.component.html',
  styleUrl: './editora-list.component.css'
})
export class EditoraListComponent implements OnInit {
  editoras: Editora[] = [];
  displayedColumns: string[] = ['id', 'nome', 'email','telefone', 'cidade', 'estado', 'acao'];
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 4;
  page = 0;
  filtro: string = "";

  constructor(private editoraService: EditoraService, private dialog: MatDialog, private snackBar: MatSnackBar){
  }

  ngOnInit(): void {
    this.editoraService.findAll(this.page, this.pageSize).subscribe(
      data => { this.editoras = data }
    );
    this.editoraService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  carregarEditoras(){
    if(this.filtro){
      this.editoraService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.editoras = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.editoraService.findAll(this.page, this.pageSize).subscribe(data => {
        this.editoras = data;
        console.log(JSON.stringify(data));
      })
    };
  }

  carregarTodosRegistros() {
    if(this.filtro){
      this.editoraService.countByNome(this.filtro).subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.editoraService.count().subscribe(data => {
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
    this.carregarEditoras();
    this.carregarTodosRegistros();
    this.snackBar.open('Filtro aplicado com sucesso!', 'Fechar', { duration: 3000 });
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
            this.editoras = this.editoras.filter(e => e.id !== editora.id);
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