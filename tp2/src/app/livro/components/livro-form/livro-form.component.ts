import { Location, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Editora } from '../../../models/editora.model';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../service/livro.service';
import { FornecedorService } from '../../../service/fornecedor.service';
import { EditoraService } from '../../../service/editora.service';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../../service/navigation.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Autor } from '../../../models/autor.model';
import { Genero } from '../../../models/genero.model';
import { AutorService } from '../../../service/autor.service';
import { GeneroService } from '../../../service/genero.service';
import { FooterComponent } from '../../../template/footer/footer.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Classificacao } from '../../../models/classificacao.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatDatepickerModule, MatCardModule, MatSnackBarModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSelectModule, RouterModule, FooterComponent],
  templateUrl: './livro-form.component.html',
  styleUrls: ['./livro-form.component.css']
})

export class LivroFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  editoras: Editora[] = [];
  autores: Autor[] = [];
  generos: Genero[] = [];
  classificacoes: Classificacao[] = [];

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private livroService: LivroService,
    private fornecedorService: FornecedorService,
    private editoraService: EditoraService,
    private autorService: AutorService,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService,
    private snackBar: MatSnackBar,
    private locate: Location
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      titulo: ['', Validators.required],
      quantidadeEstoque: [null, Validators.required],
      preco: [null, Validators.required],
      isbn: ['', Validators.required],
      descricao: ['', Validators.required],
      datalancamento: ['', Validators.required],
      classificacao: [null, Validators.required],
      fornecedor: [null, Validators.required],
      editora: [null, Validators.required],
      generos: [[], Validators.required],
      autores: [[], Validators.required]

    });
  }

  ngOnInit(): void {
    // Combina todas as chamadas assíncronas
    forkJoin({
      classificacoes: this.livroService.findClassificacoes(),
      fornecedores: this.fornecedorService.findAll(),
      editoras: this.editoraService.findAll(),
      autores: this.autorService.findAll(),
      generos: this.generoService.findAll()
    }).subscribe({
      next: ({ classificacoes, fornecedores, editoras, autores, generos }) => {
        this.classificacoes = classificacoes;
        this.fornecedores = fornecedores;
        this.editoras = editoras;
        this.autores = autores;
        this.generos = generos;
  
        // Inicializa o formulário somente após carregar tudo
        this.initializeForm();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }
    });
  }

  initializeForm(): void {
    const livro: Livro = this.activatedRoute.snapshot.data['livro'];

     // Garantindo que o fornecedor, editora e classificação sejam selecionados corretamente
      const fornecedor = this.fornecedores.find(f => f.id === livro?.fornecedor?.id) || null;
      const editora = this.editoras.find(e => e.id === livro?.editora?.id) || null;
      const classificacao = this.classificacoes.find(c => c.id === livro?.classificacao?.id) || null;

      // Garantindo que os gêneros sejam mapeados corretamente
      const generos = livro?.generos?.length
        ? livro.generos.map((genero) => this.generos.find((g) => g.id === genero.id)?.id).filter((id) => id !== undefined)
        : [];

      // Garantindo que os autores sejam mapeados corretamente
      const autores = livro?.autores?.length
        ? livro.autores.map((autor) => this.autores.find((a) => a.id === autor.id)?.id).filter((id) => id !== undefined)
        : [];

      // Convertendo a data de lançamento para o formato esperado
      const dataLancamento = livro?.datalancamento ? new Date(livro.datalancamento) : null;

    // carregando a imagem do preview
    if (livro && livro.nomeImagem) {
      this.imagePreview = this.livroService.getUrlImage(livro.nomeImagem);
      this.fileName = livro.nomeImagem;
    }

    this.formGroup = this.formBuilder.group({
      id: [(livro && livro.id) ? livro.id : null],
      titulo: [(livro && livro.titulo) ? livro.titulo : null,
      Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      quantidadeEstoque: [(livro && livro.quantidadeEstoque) ? livro.quantidadeEstoque : null,
      Validators.compose([Validators.required, Validators.minLength(1)])],
      preco: [(livro && livro.preco) ? livro.preco : null,
      Validators.compose([Validators.required])],
      descricao: [(livro && livro.descricao) ? livro.descricao : null,
      Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20000)])],
      isbn: [(livro && livro.isbn) ? livro.isbn : null,
      Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13)])],
      datalancamento: [dataLancamento, [Validators.required]], 
      classificacao: [classificacao, Validators.required],
      editora: [editora, Validators.required],
      fornecedor: [fornecedor, Validators.required],
      generos: [generos, Validators.required], // IDs dos Gêneros
      autores: [autores, Validators.required]  
    });
    console.log('Formulário inicializado:', this.formGroup.value);
  }

  tratarErros(errorResponse: HttpErrorResponse) {

    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);

          if (formControl) {
            formControl.setErrors({ apiError: validationError.message })
          }

        });
      }
    } else if (errorResponse.status < 400) {
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
      this.livroService.uploadImage(livroId, this.selectedFile.name, this.selectedFile)
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

  // 
  
  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const livro = this.formGroup.value;

        // Operação de inserção ou atualização
        const operacao = livro.id == null
            ? this.livroService.insert(livro)
            : this.livroService.update(livro);

        operacao.subscribe({
            next: (livroCadastrado) => {
                // Certifique-se de que o ID foi retornado
                if (livro && livro.id) {
                  this.uploadImage(livro.id); // Agora enviará a imagem
                } else {
                  this.uploadImage(livroCadastrado.id); // Agora enviará a imagem
                }
                this.router.navigateByUrl('/admin/livros');
                this.snackBar.open('Livro salvo com sucesso!', 'Fechar', {
                  duration: 3000
                });
            },
            error: (error) => {
                console.error('Erro ao salvar o livro:', error);
                this.tratarErros(error);
                this.snackBar.open('Erro ao salvar livro.', 'Fechar', {
                    duration: 3000
                });
            }
        });
    }
}

  excluir() {
    if (this.formGroup.valid) {
      const livro = this.formGroup.value;
      if (livro.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este Livro?'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.livroService.delete(livro).subscribe({
              next: () => {
                this.snackBar.open('Livro excluído com sucesso!', 'Fechar', {
                  duration: 3000
                });
                this.router.navigateByUrl('/admin/livros');
              },
              error: (err) => {
                console.log('Erro ao Excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao excluir livro.', 'Fechar', {
                  duration: 3000
                });
              }
            });
          }
        });
      }
    }
  }

  cancelar() {
    this.router.navigateByUrl('/admin/livros');
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
    titulo: {
      required: 'O título deve ser informado',
      minlength: 'O título deve ter pelo menos 2 caracteres',
      maxlength: 'O título deve ter no máximo 60 caracteres',
      apiError: ' '
    },
    quantidadeEstoque: {
      required: 'A quantidade em estoque deve ser informada',
      minlength: 'A quantidade em estoque deve ser um valor válido',
      apiError: ' '
    },
    preco: {
      required: 'O preço deve ser informado',
      apiError: ' '
    },
    isbn: {
      required: 'O ISBN deve ser informado',
      minlength: 'O ISBN deve conter 13 caracteres',
      maxlength: 'O ISBN deve conter 13 caracteres',
      apiError: ' '
    },
    descricao: {
      required: 'A descrição deve ser informada',
      minlength: 'A descrição deve ter pelo menos 10 caracteres',
      maxlength: 'A descrição deve ter no máximo 20000 caracteres',
      apiError: ' '
    },
    datalancamento: {
      required: 'A data de lançamento deve ser informada',
      apiError: ' '
    },
    classificacao: {
      required: 'A classificação deve ser selecionada',
      apiError: ' '
    },
    fornecedor: {
      required: 'O fornecedor deve ser selecionado',
      apiError: ' '
    },
    editora: {
      required: 'A editora deve ser selecionada',
      apiError: ' '
    },
    autores: {
      required: 'O autor deve ser selecionado',
      apiError: ' '
    },
    generos: {
      required: 'O gênero deve ser selecionado',
      apiError: ' '
    }
  };
}
