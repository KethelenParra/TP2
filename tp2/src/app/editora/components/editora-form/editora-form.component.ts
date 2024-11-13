import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EditoraService } from '../../../service/editora.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Editora } from '../../../models/editora.model';
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
import { FooterComponent } from '../../../template/footer/footer.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, FooterComponent],
  templateUrl: './editora-form.component.html',
  styleUrl: './editora-form.component.css'
})
export class EditoraFormComponent implements OnInit{
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService,
    private snackBar: MatSnackBar ) {

      const editora: Editora = this.activatedRoute.snapshot.data['editora'];

      this.formGroup = formBuilder.group({
        id: [null],
        nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        cidade: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
        estado: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
        telefone: this.formBuilder.group({
          codigoArea: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
        }),                                
      });
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const editora: Editora = this.activatedRoute.snapshot.data['editora'];

    this.formGroup = this.formBuilder.group({
      id: [(editora && editora.id) ? editora.id : null],
      nome: [(editora && editora.nome) ? editora.nome : null,
                              Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      email: [(editora && editora.email) ? editora.email : null,
                          Validators.compose([Validators.required, Validators.email])],
      cidade: [(editora && editora.cidade) ? editora.cidade : null,
                              Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      estado: [(editora && editora.estado) ? editora.estado : null,
                                Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      telefone: this.formBuilder.group({
        codigoArea: [(editora && editora.telefone && editora.telefone.codigoArea) ? editora.telefone.codigoArea : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
        numero: [(editora && editora.telefone && editora.telefone.numero) ? editora.telefone.numero : null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
      }),                                
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
      const editora = this.formGroup.value;
  
      // selecionando a operacao (insert ou update)
      const operacao = editora.id == null
        ? this.editoraService.insert(editora)
        : this.editoraService.update(editora);
  
      // executando a operacao
      operacao.subscribe({
        next: () => {
          this.snackBar.open('Editora salvo com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigateByUrl('/editoras');
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar editora.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }
  
  excluir() {
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir esta Editora?'
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.editoraService.delete(editora).subscribe({
              next: () => {
                this.snackBar.open('Editora excluído com sucesso!', 'Fechar', {
                  duration: 3000
                });
                this.router.navigateByUrl('/editoras');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao excluir editora.', 'Fechar', {
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
    this.router.navigateByUrl('/editoras');
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
      required: 'O nome da editora deve ser informado',
      minlength: 'O nome da editora deve ter pelo menos 2 caracteres',
      maxlength: 'O editora deve ter no maximo 20 caracteres',
      apiError: ' '
    },
    email: {
      required: 'O email da editora deve ser informada', 
      minlength: 'O email da editora deve ter pelo menos 10 caracteres',
      maxlength: 'O email da editora deve ter no maximo 30 caracteres',
      apiError: ' '
    },
    cidade: {
      required: 'A cidade da editora deve ser informado',
      minlength: 'A cidade da editora deve ter pelo menos 3 caracteres',
      maxlength: 'A cidade editora deve ter no maximo 20 caracteres',
      apiError: ' '
    },
    estado: {
      required: 'O estado da editora deve ser informada', 
      minlength: 'O estado da editora deve ter pelo menos 3 caracteres',
      maxlength: 'O estado da editora deve ter no maximo 20 caracteres',
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
      apiError: ' '
    }
  };
}
