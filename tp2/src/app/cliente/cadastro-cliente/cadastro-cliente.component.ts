import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../service/cliente.service';
import {MatInputModule} from '@angular/material/input';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EnderecoService, EnderecoResponseDTO } from '../../service/endereco.service';
import { FormatarCpfPipe } from '../../pipes/formatar-cpf.pipe';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, CommonModule, MatInputModule, FormatarCpfPipe],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent implements OnInit{
  cadastroForm!: FormGroup;
  endereco: EnderecoResponseDTO | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private enderecoService: EnderecoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'] || '';
      this.cadastroForm = this.fb.group({
        nome: ['', Validators.required],
        username: ['', Validators.required],
        email: [{ value: email, disabled: true }, [Validators.required, Validators.email]],
        senha: ['', Validators.required],
        cpf: ['', Validators.required],
        cep: ['', Validators.required],
        logradouro: [{ value: '', disabled: true }, Validators.required],
        complemento: [],
        bairro: [{ value: '', disabled: true }, Validators.required],
        localidade: [{ value: '', disabled: true }, Validators.required],
        uf: [{ value: '', disabled: true }, Validators.required]
      });
    });
  }

  buscarEndereco(): void {
    const cep = this.cadastroForm.get('cep')?.value;
    this.enderecoService.getEndereco(cep).subscribe(
      (data) => {
        this.endereco = data;
        this.error = null;
        this.cadastroForm.patchValue({
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf
        });
      },
      (error) => {
        this.error = 'Erro ao buscar o endereço';
        this.endereco = null;
      }
    );
  }

  onCepBlur(): void {
    if (this.cadastroForm.get('cep')?.valid) {
      this.buscarEndereco();
    }
  }

  cadastrar(): void {
    if (this.cadastroForm.valid) {
      const cliente: Cliente = this.cadastroForm.value;
      this.clienteService.create(cliente).subscribe(
        () => {
          console.log('Cliente cadastrado com sucesso');
        },
        (error) => {
          console.error('Erro ao cadastrar cliente', error);
        }
      );
    }
  }
}
