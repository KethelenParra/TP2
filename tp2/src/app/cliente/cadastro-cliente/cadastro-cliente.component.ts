import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../service/cliente.service';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { EnderecoService, EnderecoResponseDTO } from '../../service/endereco.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CadastroBasicoService } from '../../service/cadastroBasico.service';
import { CadastroBasicoDTO } from '../../models/cadastroBasicoDTO.model';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, CommonModule, MatInputModule, MatSnackBarModule, MatDividerModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent implements OnInit {
  cadastroForm!: FormGroup;
  endereco: EnderecoResponseDTO | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroBasicoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private enderecoService: EnderecoService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void{
    this.initializeForm();
  }

  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];

    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      idSexo: ['', Validators.required],
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength]],
      }),
      cep: [(cliente && cliente.cep) ? cliente.cep : null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])],
      logradouro: [{ value: '', disabled: true }, Validators.required],
      complemento: [(cliente && cliente.complemento) ? cliente.complemento : null],
      bairro: [{ value: '', disabled: true }, Validators.required],
      localidade: [{ value: '', disabled: true }, Validators.required],
      uf: [{ value: '', disabled: true }, Validators.required]
    });
  }

  cadastrar(): void {
    if (this.cadastroForm.valid) {
      const cadastro: CadastroBasicoDTO = this.cadastroForm.value;

      this.cadastroService.create(cadastro).subscribe({
        next: () => {
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no cadastro', err);
          this.snackBar.open('Erro ao realizar o cadastro!', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
    }
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

  formatarCep(): void {
    const cepControl = this.cadastroForm.get('cep');
    if (cepControl) {
      let cep = cepControl.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      cep = cep.slice(0, 8); // Limita o CEP a 8 dígitos
      cep = cep.replace(/(\d{5})(\d)/, '$1-$2'); // Aplica a máscara XXXXX-XXX
      cepControl.setValue(cep, { emitEvent: false }); // Atualiza o valor formatado
    }
  }
  
}