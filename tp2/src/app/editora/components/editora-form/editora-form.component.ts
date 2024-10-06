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
export class EditoraFormComponent {
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
                                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])],
        telefone: [(editora && editora.telefone) ? editora.telefone : null,
                                Validators.compose([Validators.required, Validators.maxLength(11)])],
      });
    }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id == null){
        this.editoraService.insert(editora).subscribe({
        next: (editoraCadastrodo) => {
          this.router.navigate(['/editoras']);
        },
        error: (errorResponse) => {
          console.log('Erro ao salvar', + JSON.stringify(errorResponse));
        } 
      });
      } else {
        this.editoraService.update(editora).subscribe({
          next: (editoraAlterando) => {
            this.router.navigate(['/editoras']);
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
      required: 'O editora deve ser informado',
      minlength: 'O editora deve ter pelo menos 2 caracteres',
      maxlength: 'O editora deve ter no maximo 20 caracteres'
    },
    descricao: {
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

  box(){
    this.router.navigateByUrl('/boxes/new');
  }

  genero(){
    this.router.navigateByUrl('generos/new')
  }

  livro(){
    this.router.navigateByUrl('/livros/new');
  }

}
