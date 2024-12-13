import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationComponent } from '../../../components/navigation/navigation.component';
import { SidebarComponent } from '../../../template/sidebar/sidebar.component';
import { FooterComponent } from '../../../template/footer/footer.component';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../service/fornecedor.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';

const ELEMENT_DATA: Fornecedor[] = [];

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [MatToolbarModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, MatFormField, MatPaginator],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent implements OnInit {
  fornecedores = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'inscricaoestadual', 'email', 'quantlivrosfornecido', 'telefone', 'estado', 'cidade', 'acao'];
  //Variaveis de controle para a paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = "";

  constructor(private fornecedorService: FornecedorService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe(
      data => { this.fornecedores.data = data }
    );

    this.fornecedorService.count().subscribe(
      data => { this.totalRecords = data }
    );
    this.fornecedores.filterPredicate = (data: Fornecedor, filter: string) => {
      return data.nome.toLowerCase().includes(filter.toLowerCase());
    }; 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.fornecedores.filter = filterValue.trim().toLowerCase();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
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
            this.fornecedores.data = this.fornecedores.data.filter(e => e.id !== fornecedor.id);
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