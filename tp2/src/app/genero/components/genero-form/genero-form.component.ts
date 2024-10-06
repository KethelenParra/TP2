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

@Component({
  selector: 'app-genero-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule],
  templateUrl: './genero-form.component.html',
  styleUrl: './genero-form.component.css'
})
export class GeneroFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {

      const genero: Genero = this.activatedRoute.snapshot.data['genero'];

      this.formGroup = formBuilder.group({
        id: [(genero && genero.id) ? genero.id : null],
        nome: [(genero && genero.nome) ? genero.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        descricao: [(genero && genero.descricao) ? genero.descricao : null,
                                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])],
      });
    }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const genero = this.formGroup.value;
      if (genero.id == null){
        this.generoService.insert(genero).subscribe({
        next: (generoCadastrodo) => {
          this.router.navigate(['/generos']);
        },
        error: (errorResponse) => {
          console.log('Erro ao salvar', + JSON.stringify(errorResponse));
        } 
      });
      } else {
        this.generoService.update(genero).subscribe({
          next: (generoAlterando) => {
            this.router.navigate(['/generos']);
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
      const genero = this.formGroup.value;
      if (genero.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Genero?'
          }
        });

        dialogRef.afterClosed().subscribe( result => {
          if (result) {
            this.generoService.delete(genero).subscribe({
              next: () => {
                this.router.navigateByUrl('/generos');
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
      maxlength: 'O genero deve ter no maximo 20 caracteres'
    },
    descricao: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ter pelo menos 10 caracteres',
      maxlength: 'A descricao deve ter no maximo 500 caracteres'
    }
  };
  
  autores(){
    this.router.navigateByUrl('/autores/new');
  }

}
