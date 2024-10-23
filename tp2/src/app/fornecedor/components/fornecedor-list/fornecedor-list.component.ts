import { Component, Input, input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../service/fornecedor.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormField } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatFormField, MatPaginator],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'inscricaoestadual', 'email', 'quantlivrosfornecido', 'telefone', 'estado', 'cidade', 'acao'];
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 4;
  page = 0;

  constructor(private fornecedorService: FornecedorService, private dialog: MatDialog){
  }

  ngOnInit(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.fornecedores = data }
    );
    this.fornecedorService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;  
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  excluir(fornecedor: Fornecedor): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        message: 'Deseja realmente excluir este Fornecedor?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result === true ){
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            this.fornecedores = this.fornecedores.filter(e => e.id !== fornecedor.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o fornecedor', err);
          }
        });
      }
    });
  }
}