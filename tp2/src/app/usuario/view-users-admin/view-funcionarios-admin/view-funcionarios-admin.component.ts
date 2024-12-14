import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../../../service/funcionario.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormatarTelefonePipe } from '../../../pipes/formatar-telefone.pipe';
import { FormatarCpfPipe } from '../../../pipes/formatar-cpf.pipe';
import { FormatarMoedaPipe } from '../../../pipes/formatar-moeda.pipe';

const ELEMENT_DATA: Funcionario[] = [];

@Component({
  selector: 'app-view-funcionarios-admin',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    RouterModule,
    MatNativeDateModule,
    FormatarTelefonePipe,
    FormatarCpfPipe,
    FormatarMoedaPipe,
  ],
  templateUrl: './view-funcionarios-admin.component.html',
  styleUrls: ['./view-funcionarios-admin.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class ViewFuncionariosAdminComponent implements OnInit {
  displayedColumnsFuncionarios: string[] = ['id', 'nome', 'username', 'cargo', 'dataNascimento', 'email', 'cpf', 'telefone', 'sexo', 'salario'];
  funcionarios = new MatTableDataSource(ELEMENT_DATA);
  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(
    private funcionarioService: FuncionarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.funcionarioService.findAll(this.page, this.pageSize).subscribe(
      data => {
        this.funcionarios.data = data;
        this.totalRecords = data.length; // Ajuste conforme necessário para obter o total de registros
      }
    );

    this.funcionarioService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.funcionarios.filterPredicate = (data: Funcionario, filter: string) => {
      return data.usuario && data.usuario.nome ? data.usuario.nome.toLowerCase().includes(filter) : false;
    };
  }

  excluir(funcionario: Funcionario): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Funcionário?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.funcionarioService.delete(funcionario).subscribe({
          next: () => {
            this.funcionarios.data = this.funcionarios.data.filter(e => e.id !== funcionario.id);
            this.snackBar.open('Funcionário excluído com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.loadFuncionarios();
          },
          error: (err) => {
            this.snackBar.open('Erro ao excluir funcionário.', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.funcionarios.filter = filterValue.trim().toLowerCase();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFuncionarios();
  }
}
