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
import { NavigationComponent } from '../../../navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from '../../../sidebar/sidebar.component';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent, FormsModule, MatFormFieldModule, MatInputModule, SidebarComponent],
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

  constructor(private generoService: GeneroService, private dialog: MatDialog){
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
  }

  excluir(genero: Genero): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir este Genero?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result === true ){
        this.generoService.delete(genero).subscribe({
          next: () => {
            this.generos = this.generos.filter(e => e.id !== genero.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o genero', err);
          }
        });
      }
    });
  }
}