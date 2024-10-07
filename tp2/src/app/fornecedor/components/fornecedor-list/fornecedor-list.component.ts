import { Component } from '@angular/core';
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

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent {
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'inscricaoestadual', 'email', 'quantlivrosfornecido', 'telefone', 'estado', 'cidade', 'acao'];
  fornecedores: Fornecedor[] = [];

  constructor(private fornecedorService: FornecedorService, private dialog: MatDialog){
  }

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(
      data => { this.fornecedores = data }
    );
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