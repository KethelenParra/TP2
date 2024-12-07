import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteService } from '../../service/cliente.service';
import { FuncionarioService } from '../../service/funcionario.service';
import { Cliente } from '../../models/cliente.model';
import { Funcionario } from '../../models/funcionario.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormatarCpfPipe } from '../../pipes/formatar-cpf.pipe';

@Component({
  selector: 'app-view-users-admin',
  standalone: true,
  imports: [MatFormFieldModule, MatTableModule, MatInputModule, MatPaginatorModule, MatIconModule, FormatarCpfPipe, CommonModule, MatTabsModule],
  templateUrl: './view-users-admin.component.html',
  styleUrls: ['./view-users-admin.component.css']
})
export class ViewUsersAdminComponent implements OnInit {
  displayedColumnsClientes: string[] = ['id', 'nome', 'username', 'email', 'cpf', 'cep', 'dataNascimento'];
  displayedColumnsFuncionarios: string[] = ['id', 'nome', 'username', 'salario', 'cargo'];
  cliente = new MatTableDataSource<Cliente>();
  funcionario = new MatTableDataSource<Funcionario>();
  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(private clienteService: ClienteService, private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.loadClientes();
    this.loadFuncionarios();

    this.cliente.filterPredicate = (data: Cliente, filter: string) => {
      return data.usuario.nome.toLowerCase().includes(filter);
    };

    this.funcionario.filterPredicate = (data: Funcionario, filter: string) => {
      return data.usuario.nome.toLowerCase().includes(filter);
    };
  }

  loadClientes(): void {
    this.clienteService.findAll(this.page, this.pageSize).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.cliente.data = data;
        }
      },
      (error) => {
        console.error('Erro ao buscar clientes', error);
      }
    );

    this.clienteService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  loadFuncionarios(): void {
    this.funcionarioService.findAll(this.page, this.pageSize).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.funcionario.data = data;
        }
      },
      (error) => {
        console.error('Erro ao buscar funcionários', error);
      }
    );

    this.funcionarioService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.cliente.filter = filterValue.trim().toLowerCase();
    this.funcionario.filter = filterValue.trim().toLowerCase();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }
}
