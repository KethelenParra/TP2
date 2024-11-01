import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GeneroService } from '../../../service/genero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Genero } from '../../../models/genero.model';
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
import { FooterComponent } from '../../../footer/footer.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genero-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, FooterComponent],
  templateUrl: './genero-form.component.html',
  styleUrl: './genero-form.component.css'
})
export class GeneroFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService,
    private snackBar: MatSnackBar) {

      const genero: Genero = this.activatedRoute.snapshot.data['genero'];

      this.formGroup = formBuilder.group({
        id: [null],
        nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        descricao: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10000)])],
      });
    }

    
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const genero: Genero = this.activatedRoute.snapshot.data['genero'];

      this.formGroup = this.formBuilder.group({
        id: [(genero && genero.id) ? genero.id : null],
        nome: [(genero && genero.nome) ? genero.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        descricao: [(genero && genero.descricao) ? genero.descricao : null,
                                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10000)])],
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
      const genero = this.formGroup.value;
  
      // selecionando a operacao (insert ou update)
      const operacao = genero.id == null
        ? this.generoService.insert(genero)
        : this.generoService.update(genero);
  
      // executando a operacao
      operacao.subscribe({
        next: () => {
          this.snackBar.open('Genero salvo com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigateByUrl('/generos');
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar genero.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }
  
  excluir() {
    if (this.formGroup.valid) {
      const genero = this.formGroup.value;
      if (genero.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Genero?'
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.generoService.delete(genero).subscribe({
              next: () => {
                this.snackBar.open('Genero excluído com sucesso!', 'Fechar', {
                  duration: 3000
                });
                this.router.navigateByUrl('/generos');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao excluir genero.', 'Fechar', {
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
    this.router.navigateByUrl('/generos');
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
      required: 'O genero deve ser informado',
      minlength: 'O genero deve ter pelo menos 2 caracteres',
      maxlength: 'O genero deve ter no maximo 20 caracteres',
      apiError: ' '
    },
    descricao: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ter pelo menos 10 caracteres',
      maxlength: 'A descricao deve ter no maximo 10000 caracteres',
      apiError: ' '
    }
  };

}
