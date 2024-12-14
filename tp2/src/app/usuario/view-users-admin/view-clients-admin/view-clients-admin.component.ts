import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../service/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormatarCpfPipe } from '../../../pipes/formatar-cpf.pipe';
import { RouterModule } from "@angular/router";
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const ELEMENT_DATA: Cliente[] = [];

@Component({
  selector: 'app-view-clients-admin',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormatarCpfPipe,
    RouterModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './view-clients-admin.component.html',
  styleUrls: ['./view-clients-admin.component.css']
})
export class ViewClientsAdminComponent implements OnInit {
  clientes = new MatTableDataSource(ELEMENT_DATA);
  displayedColumnsClientes: string[] = ['id', 'nome', 'username', 'email', 'cpf', 'cep', 'dataNascimento'];
  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.findAll(this.page, this.pageSize).subscribe(
      data => { this.clientes.data = data }
    );

    this.clienteService.count().subscribe(
      data => { this.totalRecords = data; }
    );

    this.clientes.filterPredicate = (data: Cliente, filter: string) => {
      return data?.usuario?.nome?.toLowerCase().includes(filter.toLowerCase()) ?? false;
    };
  }

  carregandoCliente(): void {
    this.clienteService.findAll().subscribe({
      next: (clientes) => {
        this.clientes.data = clientes;
      },
      error: (err) => {
        console.error('Erro ao carregar os clientes:', err);
      },
    });
    this.clienteService.count().subscribe(
      data => { this.totalRecords = data; }
    );
  }
  
  alertFormValues(formGroup: FormGroup) {
    alert(JSON.stringify(formGroup.value, null, 2));
  }

  excluir(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja realmente excluir este Cliente?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.clienteService.delete(cliente).subscribe({
          next: () => {
            this.clientes.data = this.clientes.data.filter(e => e.id !== cliente.id);
            this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.loadClientes();
          },
          error: (err) => {
            this.snackBar.open('Erro ao excluir cliente.', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  alterarStatusUsuario(cliente: Cliente, ativo: boolean): void {
    cliente.usuario.ativo = ativo; // Atualiza o estado local
    this.clienteService.atualizarStatus(cliente.id, ativo).subscribe({
      next: () => {
        this.snackBar.open(`Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso!`, 'Fechar', {
          duration: 3000,
        });
        console.log('Status atual do usuario' + cliente.usuario.ativo);
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar o status do usuário.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clientes.filter = filterValue.trim().toLowerCase();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregandoCliente();
  }
}
