import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { AutorService } from '../../../service/autor.service';
import { Autor } from '../../../models/autor.model';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule],
  templateUrl: './autor-form.component.html',
  styleUrl: './autor-form.component.css'
})
export class AutorFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ){

    const autor: Autor = this.activatedRoute.snapshot.data['autor'];
    
    this.formGroup = this.formBuilder.group({
      id: [(autor && autor.id) ? autor.id : null],
      nome: [(autor && autor.nome) ? autor.nome : null,
                      Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      biografia: [(autor && autor.biografia) ? autor.biografia : null,
                      Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(500)])],
    });
  }
  
  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;
      if (autor.id == null){
        this.autorService.insert(autor).subscribe({
        next: (autorCadastrar) => {
          this.router.navigate(['/autores']);
        },
        error: (errorResponse) => {
          console.log('Erro ao salvar', + JSON.stringify(errorResponse));
        } 
      });
      } else {
        this.autorService.update(autor).subscribe({
          next: (autorAuterado) => {
            this.router.navigate(['/autores']);
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
      const autor = this.formGroup.value;
      if (autor.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Autor?'
          }
        });

        dialogRef.afterClosed().subscribe( result => {
          if (result) {
            this.autorService.delete(autor).subscribe({
              next: () => {
                this.router.navigateByUrl('/autores');
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
    this.router.navigateByUrl('/autores');
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
    biografia: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ter pelo menos 10 caracteres',
      maxlength: 'A descricao deve ter no maximo 500 caracteres'
    }
  };

  autor(){
    this.router.navigateByUrl('/autores/new');
  }

  fornecedor(){
    this.router.navigateByUrl('fornecedores/new')
  }

  genero(){
    this.router.navigateByUrl('/generos/new');
  }

<<<<<<< HEAD
  editoras(){
    this.router.navigateByUrl('/editoras/new');
  }
=======
  editora(){
    this.router.navigateByUrl('/editoras/new');
  }

  livro(){
    this.router.navigateByUrl('/livros/new');
  }

  box(){
    this.router.navigateByUrl('/boxes/new');
  }
>>>>>>> fd4bd641632b54030e78f920328d8396b6c49168
  
}
