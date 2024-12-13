import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { BoxService } from '../../../service/box.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Box } from '../../../models/box.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

const ELEMENT_DATA: Box[] = [];

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [MatToolbarModule, MatSnackBarModule, FormsModule, MatFormFieldModule, MatInputModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatPaginator ],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'nome', 'descricaoBox', 'quantidadeEstoque', 'preco', 'classificacao', 'fornecedor', 'editora', 'genero', 'autor', 'acao'];
  totalRecords = 0;
  pageSize = 8;
  page = 0;
  filtro: string = "";
  isExpanded = true;
  textoTotal: string = '';
  textoReduzido: string = '';
  boxes = new MatTableDataSource(ELEMENT_DATA);
  
  constructor(
    private boxService: BoxService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.boxService.findAll(this.page, this.pageSize).subscribe( data => {
      this.boxes.data = data.map(box => ({ ...box, isExpanded: false }));
    });

    this.boxService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.http.get<string>('localhost:8080/admin/boxes').subscribe((data: string) => {
      this.textoTotal = data;
      this.textoReduzido = data.length > 100 ? data.substring(0, 100) + '...' : data;
    });

    this.boxes.filterPredicate = (data: Box, filter: string) => {
      return data.nome?.toLowerCase().includes(filter) ?? null;
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.boxes.filter = filterValue.trim().toLowerCase();
  }

  toggleExpand(box: any){
    box.isExpanded = !box.isExpanded;
  }

  getTruncatedText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
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
            this.boxes.data = this.boxes.data.filter(e => e.id !== box.id);
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