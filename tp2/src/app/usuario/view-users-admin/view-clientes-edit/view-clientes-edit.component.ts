  import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ClienteService } from '../../../service/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../../service/navigation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../../../models/cliente.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-view-clientes-edit',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, CommonModule, MatInputModule, MatNativeDateModule, MatButtonModule, RouterModule],
  templateUrl: './view-clientes-edit.component.html',
  styleUrl: './view-clientes-edit.component.css'
})
export class ViewClientesEditComponent implements OnInit{
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private navService: NavigationService,
    private snackBar: MatSnackBar
  ){
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      username: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      email: ['', Validators.compose([Validators.required,Validators.email])],
      dataNascimento: ['', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: ['', Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(2)])],
        numero: ['', Validators.compose([Validators.required,Validators.minLength(8), Validators.maxLength(9)])]
      }),
      cpf: ['', Validators.compose([Validators.required,Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)])],
      sexo: ['', Validators.required],
      ativo: ['', Validators.required],
      cep: ['', Validators.compose([Validators.required,Validators.minLength(8), Validators.maxLength(9)])],
      logradouro: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      complemento: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      bairro: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      localidade: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      uf: ['', Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(2)])]
    });
  }

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];

    this.formGroup = this.formBuilder.group({
      id: [(cliente && cliente.usuario.id) ? cliente.usuario.id : null],
      nome: [(cliente && cliente.usuario.nome) ? cliente.usuario.nome : '', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      username: [(cliente && cliente.usuario.username) ? cliente.usuario.username : '', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      email: [(cliente && cliente.usuario.email) ? cliente.usuario.email : '', Validators.compose([Validators.required,Validators.email])],
      dataNascimento: [(cliente && cliente.usuario.dataNascimento) ? cliente.usuario.dataNascimento : '', Validators.required],
      telefone: this.formBuilder.group({
        codigoArea: [(cliente && cliente.usuario.telefone?.codigoArea) ? cliente.usuario.telefone.codigoArea : null, Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(2)])],
        numero: [(cliente && cliente.usuario.telefone?.numero) ? cliente.usuario.telefone.numero : null, Validators.compose([Validators.required,Validators.minLength(8), Validators.maxLength(9)])],
      }),
      cpf: [{ value: (cliente && cliente.usuario.cpf) ? cliente.usuario.cpf : '', disabled: true}, Validators.compose([Validators.required,Validators.minLength(11), Validators.maxLength(11)])],
      sexo: [(cliente && cliente.usuario.sexo) ? cliente.usuario.sexo : '', Validators.required],
      ativo: [(cliente && cliente.usuario.ativo) ? cliente.usuario.ativo : '', Validators.required],
      cep: [(cliente && cliente.cep) ? cliente.cep : '', Validators.compose([Validators.required,Validators.minLength(9), Validators.maxLength(9)])],
      logradouro: [{ value: (cliente && cliente.logradouro) ? cliente.logradouro : '', disabled: true}, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      complemento: [{value: (cliente && cliente.complemento) ? cliente.complemento : '', disabled: true}, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      bairro: [{value: (cliente && cliente.bairro) ? cliente.bairro : '', disabled: true}, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      localidade: [{ value: (cliente && cliente.localidade) ? cliente.localidade : '', disabled: true}, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      uf: [{ value: (cliente && cliente.uf) ? cliente.uf : '', disabled: true}, Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(2)])]
    });
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);

          if (formControl) {
            formControl.setErrors({ apiError: validationError.message })
          }

        });
      }
    } else if (errorResponse.status < 400) {
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }

  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.valid){
      const cliente = this.formGroup.value;

      // Selecionando a operação (create ou update)
      const operacao = cliente.usuario.id == null
        ? this.clienteService.create(cliente)
        : this.clienteService.update(cliente);
        
      // Executando a operação
      operacao.subscribe({
        next: () => {
          this.snackBar.open('Cliente salvo com sucesso!', 'Fechar',{
            duration: 3000
          });
          this.router.navigateByUrl('/admin/viewClients');
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar fornecedor.', 'Fechar',{
            duration: 3000
          });
        }
      });
    }
  }
  
    excluir() {
      if (this.formGroup.valid) {
        const cliente = this.formGroup.value;
        if (cliente.id != null) {
          const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              message: 'Deseja realmente excluir este Cliente?'
            }
          });
  
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.clienteService.delete(cliente).subscribe({
                next: () => {
                  this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', {
                    duration: 3000
                  });
                  this.router.navigateByUrl('/admin/clientees');
                },
                error: (err) => {
                  console.log('Erro ao Excluir' + JSON.stringify(err));
                  this.snackBar.open('Erro ao excluir cliente.', 'Fechar', {
                    duration: 3000
                  });
                }
              });
            }
          });
        }
      }
    }
  
    cancelar() {
      this.router.navigateByUrl('/admin/viewClients');
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

    errorMessage: { [controlName: string]: {[errorName: string] : string} } = {
      nome: {
        required: 'Campo obrigatório',
        minlength: 'Nome deve ter no mínimo 3 caracteres',
        maxlength: 'Nome deve ter no máximo 100 caracteres'
      },
      username: {
        required: 'Campo obrigatório',
        minlength: 'Username deve ter no mínimo 3 caracteres',
      },
      email: {
        required: 'Campo obrigatório',
        email: 'Email inválido'
      },
      dataNascimento: {
        required: 'Campo obrigatório'
      },
      telefone: {
        required: 'Campo obrigatório',
        minlength: 'Telefone deve ter no mínimo 8 caracteres',
        maxlength: 'Telefone deve ter no máximo 9 caracteres'
      },
      cpf: {
        required: 'Campo obrigatório',
        minlength: 'CPF deve ter 11 caracteres',
        maxlength: 'CPF deve ter 11 caracteres'
      },
      sexo: {
        required: 'Campo obrigatório'
      },
      ativo: {
        required: 'Campo obrigatório'
      },
      cep: {
        required: 'Campo obrigatório',
        minlength: 'CEP deve ter 8 caracteres',
        maxlength: 'CEP deve ter 8 caracteres'
      },
      logradouro: {
        required: 'Campo obrigatório',
        minlength: 'Logradouro deve ter no mínimo 3 caracteres',
        maxlength: 'Logradouro deve ter no máximo 100 caracteres'
      },
      complemento: {
        required: 'Campo obrigatório',
        minlength: 'Complemento deve ter no mínimo 3 caracteres',
        maxlength: 'Complemento deve ter no máximo 100 caracteres'
      },
      bairro: {
        required: 'Campo obrigatório',
        minlength: 'Bairro deve ter no mínimo 3 caracteres',
        maxlength: 'Bairro deve ter no máximo 100 caracteres'
      },
      localidade: {
        required: 'Campo obrigatório',
        minlength: 'Localidade deve ter no mínimo 3 caracteres',
        maxlength: 'Localidade deve ter no máximo 100 caracteres'
      },
      uf: {
        required: 'Campo obrigatório',
        minlength: 'UF deve ter 2 caracteres',
        maxlength: 'UF deve ter 2 caracteres'
      }
    };
}
