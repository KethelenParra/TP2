import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../service/genero.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationComponent } from '../../../components/navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatSnackBarModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent, FormsModule, MatFormFieldModule, MatInputModule, SidebarComponent, FooterComponent],
  templateUrl: './genero-list.component.html',
  styleUrl: './genero-list.component.css'
})
export class GeneroListComponent {
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acao'];
  generos: Genero[] = [];
   //Variaveis de controle para a paginação
   totalRecords = 0;
   pageSize = 4;
   page = 0;
   filtro: string = "";

  constructor(private generoService: GeneroService, private dialog: MatDialog, private snackBar: MatSnackBar){
  }

  ngOnInit(): void {
    this.generoService.findAll(this.page, this.pageSize).subscribe(
      data => { this.generos = data }
    );
    this.generoService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  carregarGeneros(){
    if(this.filtro){
      this.generoService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.generos = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.generoService.findAll(this.page, this.pageSize).subscribe(data => {
        this.generos = data;
        console.log(JSON.stringify(data));
      })
    };
  }

  carregarTodosRegistros() {
    if(this.filtro){
      this.generoService.countByNome(this.filtro).subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.generoService.count().subscribe(data => {
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
    this.carregarGeneros();
    this.carregarTodosRegistros();
    this.snackBar.open('Filtro aplicado com sucesso!', 'Fechar', { duration: 3000 });
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
            this.generos = this.generos.filter(e => e.id !== genero.id);
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