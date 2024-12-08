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

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, CommonModule, MatInputModule, MatSnackBarModule, MatDividerModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent implements OnInit {
  cadastroForm!: FormGroup;
  endereco: EnderecoResponseDTO | null = null;
  error: string | null = null;

  constructor(
    private formGroup: FormGroup,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private enderecoService: EnderecoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
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

  cadastrarUsuario() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = cliente.id == null
        ? this.clienteService.insertUsuario(cliente)
        : this.clienteService.updateUsuario(cliente);

      // executando a operacao
      operacao.subscribe({
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar box.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  tratarErros(errorResponse: HttpErrorResponse) {

    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);

          if (formControl) {
            formControl.setErrors({apiError: validationError.message})
          }

        });
      }
    } else if (errorResponse.status < 400){
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }

  }

  formatarTelefone(): void {
    const telefoneControl = this.cadastroForm.get('telefone');
    if (telefoneControl) {
      let telefone = telefoneControl.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (telefone.length <= 10) {
        // Formato para telefones fixos (10 dígitos)
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        // Formato para celulares (11 dígitos)
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      telefoneControl.setValue(telefone, { emitEvent: false }); // Atualiza o valor sem disparar eventos adicionais
    }
  }

  formatarCpf(): void {
    const cpfControl = this.cadastroForm.get('cpf');
    if (cpfControl) {
      let cpf = cpfControl.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      cpfControl.setValue(cpf, { emitEvent: false }); // Atualiza o valor sem disparar eventos adicionais
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

  cancelar(): void {
    this.router.navigateByUrl('/home');
  }

  excluir(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Tem certeza que deseja excluir este cliente?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = this.cadastroForm.get('id')?.value;
        this.clienteService.deleteUsuario(id).subscribe(
          () => {
            this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigateByUrl('/home');
          },
          (error) => {
            console.error('Erro ao excluir cliente', error);
            this.snackBar.open('Erro ao excluir cliente.', 'Fechar', {
              duration: 3000
            });
          }
        );
      }
    });
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessage[controlName] && this.errorMessage[controlName][errorName]) {
        return this.errorMessage[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      minlength: 'O nome deve ter pelo menos 2 caracteres',
      maxlength: 'O nome deve ter no máximo 20 caracteres',
      apiError: ' '
    },
    email: {
      required: 'O email deve ser informado',
      minlength: 'O email deve ter pelo menos 10 caracteres',
      maxlength: 'O email deve ter no máximo 30 caracteres',
      apiError: ' '
    },
    cpf: {
      required: 'O CPF deve ser informado',
      minlength: 'O CPF deve ter 11 caracteres',
      maxlength: 'O CPF deve ter no máximo 14 caracteres',
      apiError: ' '
    },
    telefone: {
      required: 'O telefone deve ser informado',
      minlength: 'O telefone deve ter 10 caracteres',
      maxlength: 'O telefone deve ter no máximo 15 caracteres',
      apiError: ' '
    },
    cep: {
      required: 'O CEP deve ser informado',
      minlength: 'O CEP deve ter 8 caracteres',
      maxlength: 'O CEP deve ter no máximo 9 caracteres',
      apiError: ' '
    },
    logradouro: {
      required: 'O logradouro deve ser informado',
      apiError: ' '
    },
    bairro: {
      required: 'O bairro deve ser informado',
      apiError: ' '
    },
    localidade: {
      required: 'A localidade deve ser informada',
      apiError: ' '
    },
    uf: {
      required: 'A UF deve ser informada',
      apiError: ' '
    }
  };
}