import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Location, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { AutorService } from '../../../service/autor.service';
import { Autor } from '../../../models/autor.model';
import { NavigationService } from '../../../service/navigation.service';
import { FooterComponent } from '../../../template/footer/footer.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSnackBarModule],
  templateUrl: './autor-form.component.html',
  styleUrl: './autor-form.component.css'
})

export class AutorFormComponent implements OnInit{
  formGroup: FormGroup;
  searchTerm: string = '';

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    public navService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private locate: Location 
  ) {
      
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['',  Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      biografia: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10000)])]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const autor: Autor = this.activatedRoute.snapshot.data['autor'];
    console.log(autor);

    if (autor && autor.nomeImagem) {
      this.imagePreview = this.autorService.getUrlImage(autor.nomeImagem);
      this.fileName = autor.nomeImagem;
    }
    
    this.formGroup = this.formBuilder.group({
      id: [(autor && autor.id) ? autor.id : null],
      nome: [(autor && autor.nome) ? autor.nome : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      biografia: [(autor && autor.biografia) ? autor.biografia : '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10000)])]
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

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }

  }

  private uploadImage(livroId: number) {
    if (this.selectedFile) {
      this.autorService.uploadImage(livroId, this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => {
          this.voltarPagina();
        },
        error: err => {
          console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        }
      })
    } else {
      this.voltarPagina();
    }
  }

  voltarPagina() {
    this.locate.back();
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;
  
      // selecionando a operacao (insert ou update)
      const operacao = autor.id == null
        ? this.autorService.insert(autor)
        : this.autorService.update(autor);
  
        this.router.navigateByUrl('/admin/autores');
      // executando a operacao
      operacao.subscribe({
        next: (autorCadastrado) => {
           // Certifique-se de que o ID foi retornado
           if (autor && autor.id) {
            this.uploadImage(autor.id); // Agora enviará a imagem
          } else {
            this.uploadImage(autorCadastrado.id); // Agora enviará a imagem
          }
          this.snackBar.open('Autor salvo com sucesso!', 'Fechar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar autor.', 'Fechar', {
            duration: 3000
          });
        }
      });
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
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.autorService.delete(autor).subscribe({
              next: () => {
                this.snackBar.open('Autor excluído com sucesso!', 'Fechar', {
                  duration: 3000
                });
                this.router.navigateByUrl('/admin/autores');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao excluir autor.', 'Fechar', {
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
    this.router.navigateByUrl('/admin/autores');
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
      required: 'O autor deve ser informado',
      minlength: 'O tamanho deve ter pelo menos 2 caracteres',
      maxlength: 'O temanho deve ter no maximo 20 caracteres',
      apiError: ' '
    },
    biografia: {
      required: 'A descricao deve ser informada', 
      minlength: 'A descricao deve ter pelo menos 10 caracteres',
      maxlength: 'A descricao deve ter no maximo 10000 caracteres',
      apiError: ' '
    }
  };  
}
