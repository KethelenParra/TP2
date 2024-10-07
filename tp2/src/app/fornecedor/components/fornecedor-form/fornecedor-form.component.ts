import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, EmailValidator } from '@angular/forms';
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

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css',})
export class FornecedorFormComponent{
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService
  ) {
      const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

      this.formGroup = formBuilder.group({
        id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
        nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
        cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : null,
                                Validators.compose([Validators.required, Validators.maxLength(18), Validators.minLength(18)])],
        inscricaoEstadual: [(fornecedor && fornecedor.inscricaoEstadual) ? fornecedor.inscricaoEstadual : null,
                                Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12)])],
        email: [(fornecedor && fornecedor.email) ? fornecedor.email : null,
                                Validators.compose([Validators.required, Validators.email])],
        quantLivroFornecido: [(fornecedor && fornecedor.quantLivrosFornecido) ? fornecedor.quantLivrosFornecido : null,
                                Validators.compose([Validators.required, Validators.min(1)])],
        telefone: [(fornecedor && fornecedor.telefone) ? fornecedor.telefone : null,
                                Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
        estado: [(fornecedor && fornecedor.estado) ? fornecedor.estado : null,
                                Validators.compose([Validators.required, Validators.minLength(2)])],
        cidade: [(fornecedor && fornecedor.cidade) ? fornecedor.cidade : null,
                                Validators.compose([Validators.required, Validators.minLength(3)])],
      });
    }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id == null){
        this.fornecedorService.insert(fornecedor).subscribe({
        next: (fornecedorCadastrodo) => {
          this.router.navigate(['/fornecedors']);
        },
        error: (errorResponse) => {
          console.log('Erro ao salvar', + JSON.stringify(errorResponse));
        } 
      });
      } else {
        this.fornecedorService.update(fornecedor).subscribe({
          next: (fornecedorAlterando) => {
            this.router.navigate(['/fornecedors']);
          },
          error: (err) => {
            console.log('Erro ao salvar', + JSON.stringify(err));
          } 
        });
      }
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

        dialogRef.afterClosed().subscribe( result => {
          if (result) {
            this.fornecedorService.delete(fornecedor).subscribe({
              next: () => {
                this.router.navigateByUrl('/fornecedors');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
              }
            });
          }
        });
      }
    }
  }
  

  cancelar(){
    this.router.navigateByUrl('/fornecedors');
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
      maxlength: 'O fornecedor deve ter no maximo 30 caracteres'
    },
    cnpj: {
      required: 'O cnpj deve ser informado', 
      minlength: 'O cnpj deve ter 18 caracteres',
    },
    inscricaoEstadual: {
      required: 'A inscrição estadual deve ser informada', 
      minlength: 'A inscrição estadual deve ter 12 caracteres',
    },
    email: {
      required: 'A descricao deve ser informada', 
      EmailValidator: 'Email inválido'
    },
    quantidadeLivros: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ser maior que 0'
    },
    telefone: {
      required: 'A descricao deve ser informada', 
      maxLength: 'O telefone deve ter 11 caracteres'
    },
    estado: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ter pelo menos 2 caracteres',
    },
    cidade: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ter pelo menos 3 caracteres',
    }
  };
}
