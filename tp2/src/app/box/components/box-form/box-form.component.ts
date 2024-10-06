import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BoxService } from '../../../service/box.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Box } from '../../../models/box.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';

//Olhar o github do professor na parte de muncípio

@Component({
  selector: 'app-box-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule],
  templateUrl: './box-form.component.html',
  styleUrl: './box-form.component.css'
})
export class BoxFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private boxService: BoxService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {

      const box: Box = this.activatedRoute.snapshot.data['boxes'];

      this.formGroup = formBuilder.group({
        id: [(box && box.id) ? box.id : null],
        nome: [(box && box.nome) ? box.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        descricaoBox: [(box && box.descricaoBox) ? box.descricaoBox : null,
                                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])],
        quantidadeEstoque: [(box && box.quantidadeEstoque) ? box.quantidadeEstoque : null],
        fornecedor: [(box && box.fornecedor) ? box.fornecedor : null]
      });
    }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const box = this.formGroup.value;
      if (box.id == null){
        this.boxService.insert(box).subscribe({
        next: (boxCadastrodo) => {
          this.router.navigate(['/boxes']);
        },
        error: (errorResponse) => {
          console.log('Erro ao salvar', + JSON.stringify(errorResponse));
        } 
      });
      } else {
        this.boxService.update(box).subscribe({
          next: (boxAlterando) => {
            this.router.navigate(['/boxes']);
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
      const box = this.formGroup.value;
      if (box.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Box?'
          }
        });

        dialogRef.afterClosed().subscribe( result => {
          if (result) {
            this.boxService.delete(box).subscribe({
              next: () => {
                this.router.navigateByUrl('/boxes');
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
    this.router.navigateByUrl('/boxes');
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
      required: 'O box deve ser informado',
      minlength: 'O box deve ter pelo menos 2 caracteres',
    },
    descricaoBox: {
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

  editora(){
    this.router.navigateByUrl('/editoras/new');
  }

  livro(){
    this.router.navigateByUrl('/livros/new');
  }

}
