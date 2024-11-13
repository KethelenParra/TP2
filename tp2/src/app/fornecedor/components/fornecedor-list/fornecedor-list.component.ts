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
import { NavigationComponent } from '../../../components/navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from '../../../template/sidebar/sidebar.component';
import { FooterComponent } from '../../../template/footer/footer.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [MatToolbarModule, FormsModule, MatFormFieldModule, MatInputModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatFormField, MatPaginator, NavigationComponent, SidebarComponent, FooterComponent],
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
  filtro: string = "";

  constructor(private fornecedorService: FornecedorService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.fornecedores = data }
    );
    this.fornecedorService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  carregarfornecedores() {
    if (this.filtro) {
      this.fornecedorService.findByNome(this.filtro, this.page, this.pageSize).subscribe(data => {
        this.fornecedores = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.fornecedorService.findAll(this.page, this.pageSize).subscribe(data => {
        this.fornecedores = data;
        console.log(JSON.stringify(data));
      })
    };
  }

  carregarTodosRegistros() {
    if (this.filtro) {
      this.fornecedorService.countByNome(this.filtro).subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      })
    } else {
      this.fornecedorService.count().subscribe(data => {
        this.totalRecords = data;
        console.log(JSON.stringify(data));
      });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  aplicarFiltro() {
    this.carregarfornecedores();
    this.carregarTodosRegistros();
    this.snackBar.open('Filtro aplicado com sucesso!', 'Fechar', { duration: 3000 });
  }

  excluir(fornecedor: Fornecedor): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Fornecedor?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            this.fornecedores = this.fornecedores.filter(e => e.id !== fornecedor.id);
            this.snackBar.open('Fornecedor excluído com sucesso!', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o fornecedor', err);
            this.snackBar.open('Erro ao excluir fornecedor.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

}