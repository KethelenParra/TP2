import { Component } from '@angular/core';
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

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule],
  templateUrl: './editora-form.component.html',
  styleUrl: './editora-form.component.css'
})
export class EditoraFormComponent{
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {

      const editora: Editora = this.activatedRoute.snapshot.data['editora'];

      this.formGroup = formBuilder.group({
        id: [(editora && editora.id) ? editora.id : null],
        nome: [(editora && editora.nome) ? editora.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        email: [(editora && editora.email) ? editora.email : null,
                                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(30)])],
        cidade: [(editora && editora.cidade) ? editora.cidade : null,
                                Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
        estado: [(editora && editora.estado) ? editora.estado : null,
                                  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
        telefone: this.formBuilder.group({
          codigoArea: [(editora && editora.telefone && editora.telefone.codigoArea) ? editora.telefone.codigoArea : null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [(editora && editora.telefone && editora.telefone.numero) ? editora.telefone.numero : null, Validators.compose([Validators.required, Validators.minLength(9)])],
        }),                                
      });
    }

    salvar() {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.valid) {
        const editora = this.formGroup.value;
        if (editora.id == null){
          this.editoraService.insert(editora).subscribe({
          next: (editoraCadastrar) => {
            this.router.navigateByUrl('/editoras');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar', + JSON.stringify(errorResponse));
          } 
        });
        } else {
          this.editoraService.update(editora).subscribe({
            next: (editoraAuterado) => {
              this.router.navigateByUrl('/editoras');
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
      const editora = this.formGroup.value;
      if (editora.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Editora?'
          }
        });

        dialogRef.afterClosed().subscribe( result => {
          if (result) {
            this.editoraService.delete(editora).subscribe({
              next: () => {
                this.router.navigateByUrl('/editoras');
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
      maxlength: 'O editora deve ter no maximo 20 caracteres'
    },
    email: {
      required: 'O email da editora deve ser informada', 
      minlength: 'O email da editora deve ter pelo menos 10 caracteres',
      maxlength: 'O email da editora deve ter no maximo 30 caracteres'
    },
    cidade: {
      required: 'A cidade da editora deve ser informado',
      minlength: 'A cidade da editora deve ter pelo menos 3 caracteres',
      maxlength: 'A cidade editora deve ter no maximo 20 caracteres'
    },
    estado: {
      required: 'O estado da editora deve ser informada', 
      minlength: 'O estado da editora deve ter pelo menos 3 caracteres',
      maxlength: 'O estado da editora deve ter no maximo 20 caracteres'
    },
    'telefone.codigoArea': {
      required: 'O código de área deve ser informado',
      minlength: 'O código de área deve ter pelo menos 2 caracteres',
      maxlength: 'O código de área deve ter no maximo 3 caracteres'
    },
    'telefone.numero': {
      required: 'O número de telefone deve ser informado',
      minlength: 'O número de telefone deve ter no máximo 9 caracteres'
    }
  };
  
  autor(){
    this.router.navigateByUrl('/autores/new');
  }

<<<<<<< HEAD
  generos(){
    this.router.navigateByUrl('/generos/new');
=======
  fornecedor(){
    this.router.navigateByUrl('fornecedores/new')
  }

  box(){
    this.router.navigateByUrl('/boxes/new');
  }

  genero(){
    this.router.navigateByUrl('generos/new')
  }

  livro(){
    this.router.navigateByUrl('/livros/new');
>>>>>>> fd4bd641632b54030e78f920328d8396b6c49168
  }

}
