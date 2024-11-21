import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent {
  cliente: Cliente = {
    id: 0,
    usuario: {
      id: 0,
      nome: '',
      username: '',
      email: '',
      cpf: '',
      dataNascimento: '',
    },
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    listaDesejo: [],
  };

  constructor(private clienteService: ClienteService, private router: Router) {}

  cadastrar(): void {
    this.clienteService.create(this.cliente).subscribe(
      () => {
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
      }
    );
  }
}
