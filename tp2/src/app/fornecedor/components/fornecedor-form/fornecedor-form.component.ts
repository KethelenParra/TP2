import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, EmailValidator, FormControl } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FornecedorService } from '../../../service/fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { NavigationService } from '../../../service/navigation.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, FooterComponent],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css',})
export class FornecedorFormComponent implements OnInit{
  formGroup: FormGroup;
  searchTerm: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService,
    private snackBar: MatSnackBar 
  ) {
     
      this.formGroup = formBuilder.group({
        id: [null],
        nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
        cnpj: ['', Validators.compose([Validators.required,  Validators.minLength(14), Validators.maxLength(18)])],
        inscricaoEstadual: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        quantLivrosFornecido: ['', Validators.compose([Validators.required, Validators.min(1)])],
        telefone: this.formBuilder.group({
          codigoArea: [ null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [ null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
        }),
        estado: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
        cidade: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      });
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

      this.formGroup = this.formBuilder.group({
        id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
        nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
        cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : null,
                                Validators.compose([Validators.required,  Validators.minLength(14), Validators.maxLength(18)])],
        inscricaoEstadual: [(fornecedor && fornecedor.inscricaoEstadual) ? fornecedor.inscricaoEstadual : null,
                                Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
        email: [(fornecedor && fornecedor.email) ? fornecedor.email : null,
                                Validators.compose([Validators.required, Validators.email])],
        quantLivrosFornecido: [(fornecedor && fornecedor.quantLivrosFornecido) ? fornecedor.quantLivrosFornecido : null,
                                Validators.compose([Validators.required, Validators.min(1)])],
        telefone: this.formBuilder.group({
          codigoArea: [(fornecedor && fornecedor.telefone && fornecedor.telefone.codigoArea) ? fornecedor.telefone.codigoArea : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [(fornecedor && fornecedor.telefone && fornecedor.telefone.numero) ? fornecedor.telefone.numero : null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
        }),
        estado: [(fornecedor && fornecedor.estado) ? fornecedor.estado : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
        cidade: [(fornecedor && fornecedor.cidade) ? fornecedor.cidade : null,
                                Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      });
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

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
  
      // selecionando a operacao (insert ou update)
      const operacao = fornecedor.id == null
        ? this.fornecedorService.insert(fornecedor)
        : this.fornecedorService.update(fornecedor);
  
      // executando a operacao
      operacao.subscribe({
        next: () => {
          this.snackBar.open('Fornecedor salvo com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigateByUrl('/fornecedores');
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar fornecedor.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }
  
  excluir() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Fornecedor?'
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.fornecedorService.delete(fornecedor).subscribe({
              next: () => {
                this.snackBar.open('Fornecedor excluído com sucesso!', 'Fechar', {
                  duration: 3000
                });
                this.router.navigateByUrl('/fornecedores');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao excluir fornecedor.', 'Fechar', {
                  duration: 3000
                });
              }
            });
          }
        });
      }
    }
  }
  
  cancelar(){
    this.router.navigateByUrl('/fornecedores');
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
      required: 'O fornecedor deve ser informado',
      minlength: 'O fornecedor deve ter pelo menos 2 caracteres',
      maxlength: 'O fornecedor deve ter no maximo 30 caracteres',
      apiError: ' '
    },
    cnpj: {
      required: 'O cnpj deve ser informado', 
      minlength: 'O cnpj deve ter 14 caracteres',
      maxlength: 'O fornecedor deve ter no maximo 18 caracteres',
      apiError: ' '
    },
    inscricaoEstadual: {
      required: 'A inscrição estadual deve ser informada', 
      minlength: 'A inscrição estadual deve ter 9 caracteres',
      maxlength: 'A inscrição estadual deve ter no maximo 9 caracteres',
      apiError: ' '
    },
    email: {
      required: 'O E-mail deve ser informada', 
      EmailValidator: 'Email inválido',
      apiError: ' '
    },
    quantLivrosFornecido: {
      required: 'A quantidade de livros deve ser informada', 
      minlength: 'A quantidade de livros deve ser maior que 0',
      apiError: ' '
    },
    'telefone.codigoArea': {
      required: 'O código de área deve ser informado',
      minlength: 'O código de área deve ter pelo menos 2 caracteres',
      maxlength: 'O código de área deve ter no maximo 3 caracteres',
      apiError: ' '
    },
    'telefone.numero': {
      required: 'O número de telefone deve ser informado',
      minlength: 'O número de telefone deve ter no máximo 9 caracteres',
      maxlength: 'O número  de telefone deve ter no maximo 9 caracteres',
      apiError: ' '
    },
    cidade: {
      required: 'A cidade da editora deve ser informado',
      minlength: 'A cidade da editora deve ter pelo menos 3 caracteres',
      maxlength: 'A cidade editora deve ter no maximo 30 caracteres',
      apiError: ' '
    },
    estado: {
      required: 'O estado da editora deve ser informada', 
      minlength: 'O estado da editora deve ter pelo menos 2 caracteres',
      maxlength: 'O estado da editora deve ter no maximo 30 caracteres',
      apiError: ' '
    },
  };
}
