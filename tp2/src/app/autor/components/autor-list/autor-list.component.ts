import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Autor } from '../../../models/autor.model';
import { AutorService } from '../../../service/autor.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationComponent } from '../../../navigation/navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports:[MatToolbarModule, FormsModule, MatFormFieldModule, MatInputModule ,NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent],
  templateUrl: './autor-list.component.html',
  styleUrl: './autor-list.component.css'
})
export class AutorListComponent {
  displayedColumns: string[] = ['id', 'nome', 'biografia', 'acao'];
  autores: Autor[] = [];
   //Variaveis de controle para a paginação
   totalRecords = 0;
   pageSize = 4;
   page = 0;
   filtro: string = "";

  constructor (
    private autorService: AutorService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.autorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.autores = data}
    );

    this.autorService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  carregarAutores(){
    if(this.filtro){
      this.autorService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.autores = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.autorService.findAll(this.page, this.pageSize).subscribe(data => {
        this.autores = data;
        console.log(JSON.stringify(data));
      })
    };
  }

  carregarTodosRegistros() {
    if(this.filtro){
      this.autorService.countByNome(this.filtro).subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.autorService.count().subscribe(data => {
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
    this.carregarAutores();
    this.carregarTodosRegistros();
  }

  excluir(autor: Autor): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir este Autor?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result === true ){
        this.autorService.delete(autor).subscribe({
          next: () => {
            this.autores = this.autores.filter(e => e.id !== autor.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o autor', err);
          }
        });
      }
    });
  }
}
