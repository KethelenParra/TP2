import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FuncionarioService } from '../../../service/funcionario.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../../service/navigation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Funcionario } from '../../../models/funcionario.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Sexo } from '../../../models/sexo.model';
import { forkJoin } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-view-funcionarios-edit',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, CommonModule, RouterModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatOptionModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './view-funcionarios-edit.component.html',
  styleUrl: './view-funcionarios-edit.component.css'
})
export class ViewFuncionariosEditComponent {
  formGroup: FormGroup;
  sexos: Sexo[]=[];
  
    constructor(
      private formBuilder: FormBuilder,
      private funcionarioService: FuncionarioService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private dialog: MatDialog,
      private snackBar: MatSnackBar
    ){
      this.formGroup = this.formBuilder.group({
        id: [null],
        nome: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
        username: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
        cargo: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        dataNascimento: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
        // senha: ['', Validators.required],
        telefone: this.formBuilder.group({
          codigoArea: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
        }),
        sexo: [null, Validators.required],
        salario: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      });
    }
  
    ngOnInit(): void {
      forkJoin({
        sexo: this.funcionarioService.findSexos()
      }).subscribe({
        next:({sexo}) => {
          this.sexos = sexo;
          this.initializeForm();
        }, 
        error: (err) => {
          console.error('Erro ao carregar sexos', err);
        }
      });
    }
  
    initializeForm(): void {
      const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];

      const sexo = this.sexos.find(s => s.id === funcionario?.usuario?.sexo?.id) || null;
  
      this.formGroup = this.formBuilder.group({
        id: [(funcionario && funcionario?.usuario?.id) ? funcionario?.usuario?.id : null],
        nome: [(funcionario && funcionario.usuario.nome) ? funcionario.usuario.nome : '', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
        username: [(funcionario && funcionario.usuario.username) ? funcionario.usuario.username : '', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [(funcionario && funcionario.cargo) ? funcionario.cargo : '', Validators.compose([Validators.required, Validators.minLength(2)])],
        dataNascimento: [(funcionario && funcionario.usuario.dataNascimento) ? funcionario.usuario.dataNascimento : '', Validators.compose([Validators.required])],
        email: [(funcionario && funcionario.usuario.email) ? funcionario.usuario.email : '', Validators.compose([Validators.required, Validators.email])],
        cpf: [(funcionario && funcionario.usuario.cpf) ? funcionario.usuario.cpf : '', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
        // senha: [(funcionario && funcionario?.usuario?.senha) ? funcionario?.usuario?.senha : null, Validators.required],
        telefone: this.formBuilder.group({
          codigoArea: [(funcionario && funcionario.usuario.telefone?.codigoArea) ? funcionario.usuario.telefone?.codigoArea : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [(funcionario && funcionario.usuario.telefone?.numero) ? funcionario.usuario.telefone?.numero : null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
        }),
        sexo: [sexo, Validators.required],
        salario: [(funcionario && funcionario.salario) ? funcionario.salario : '', Validators.compose([Validators.required, Validators.minLength(3)])],
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
      if (this.formGroup.valid) {
          const funcionario = this.formGroup.value;
  
          // Operação de inserção ou atualização
          const operacao = funcionario?.usuario?.id == null
              ? this.funcionarioService.update(funcionario)
              : this.funcionarioService.create(funcionario);
  
          operacao.subscribe({
              next: () => {
                  this.router.navigateByUrl('/admin/funcionarios');
                  this.snackBar.open('Funcionario salvo com sucesso!', 'Fechar', {
                    duration: 3000
                  });
              },
              error: (error) => {
                  console.error('Erro ao salvar o funcionario:', error);
                  this.tratarErros(error);
                  this.snackBar.open('Erro ao salvar funcionario.', 'Fechar', {
                      duration: 3000
                  });
              }
          });
      }
    }
    
      excluir() {
        if (this.formGroup.valid) {
          const funcionario = this.formGroup.value;
          if (funcionario.usuario.id != null) {
            const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
              data: {
                message: 'Deseja realmente excluir este Funcionario?'
              }
            });
    
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.funcionarioService.delete(funcionario).subscribe({
                  next: () => {
                    this.snackBar.open('Funcionario excluído com sucesso!', 'Fechar', {
                      duration: 3000
                    });
                    this.router.navigateByUrl('/admin/funcionarioes');
                  },
                  error: (err) => {
                    console.log('Erro ao Excluir' + JSON.stringify(err));
                    this.snackBar.open('Erro ao excluir funcionario.', 'Fechar', {
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
        this.router.navigateByUrl('/admin/viewFuncionarios');
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
