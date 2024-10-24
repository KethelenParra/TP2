import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { BoxService } from '../../../service/box.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Box } from '../../../models/box.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationComponent } from '../../../navigation/navigation.component';
// import { LivroService } from '../../../service/livro.service';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'nome', 'descricaoBox', 'quantidadeEstoque', 'preco', 'classificacao', 'fornecedor', 'editora', 'genero', 'autor', 'acao'];
  boxes: Box[] = [];
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 2;
  page = 0;
  
  constructor(
    private boxService: BoxService, 
    private dialog: MatDialog, 
  ){}

  ngOnInit(): void {
    this.boxService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.boxes = data }
    );

    this.boxService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  excluir(box: Box): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Deseja realmente excluir este Box?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result === true ){
        this.boxService.delete(box).subscribe({
          next: () => {
            this.boxes = this.boxes.filter(e => e.id !== box.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o Box', err);
          }
        });
      }
    });
  }
}