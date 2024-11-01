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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { FooterComponent } from '../../../footer/footer.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [MatToolbarModule, MatSnackBarModule, FormsModule, MatFormFieldModule, MatInputModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator, NavigationComponent, SidebarComponent, FooterComponent],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'nome', 'descricaoBox', 'quantidadeEstoque', 'preco', 'classificacao', 'fornecedor', 'editora', 'genero', 'autor', 'acao'];
  boxes: Box[] = [];
    totalRecords = 0;
  pageSize = 2;
  page = 0;
  filtro: string = "";
  
  constructor(
    private boxService: BoxService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.boxService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.boxes = data }
    );

    this.boxService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  carregarBoxes(){
    if(this.filtro){
      this.boxService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.boxes = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.boxService.findAll(this.page, this.pageSize).subscribe(data => {
        this.boxes = data;
        console.log(JSON.stringify(data));
      })
    };
  }

  carregarTodosRegistros() {
    if(this.filtro){
      this.boxService.countByNome(this.filtro).subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.boxService.count().subscribe(data => {
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
    this.carregarBoxes();
    this.carregarTodosRegistros();
    this.snackBar.open('Filtro aplicado com sucesso!', 'Fechar', { duration: 3000 });
  }

  excluir(box: Box): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Box?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.boxService.delete(box).subscribe({
          next: () => {
            this.boxes = this.boxes.filter(e => e.id !== box.id);
            this.snackBar.open('Box excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o box', err);
            this.snackBar.open('Erro ao excluir box.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}