import { NgFor, NgIf } from '@angular/common';
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

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSelectModule, RouterModule],
  templateUrl: './livro-form.component.html',
  styleUrls: ['./livro-form.component.css']
})


export class LivroFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  editoras: Editora[] = [];
  autores: Autor[] = [];
  generos: Genero[] = [];

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
    public navService: NavigationService
  ){

    this.formGroup = this.formBuilder.group({
      id: [null],
      titulo: ['', Validators.required],
      quantidadeEstoque: [null, Validators.required],
      preco: [null, Validators.required],
      isbn: ['', Validators.required],
      descricao: ['', Validators.required],
      datalancamento: ['', Validators.required],
      classificacao: ['', Validators.required],
      fornecedor: [null, Validators.required],
      editora: [null, Validators.required],
      generos: [[], Validators.required],
      autores: [[], Validators.required]

    });
  }

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
      this.initializeForm();
    });

    this.editoraService.findAll().subscribe(data => {
      this.editoras = data;
      this.initializeForm();
    });

    this.autorService.findAll().subscribe(data => {
      this.autores = data;
      this.initializeForm();
    });

    this.generoService.findAll().subscribe(data => {
      this.generos = data;
      this.initializeForm();
    });
  }

  initializeForm(): void {
    const livro: Livro = this.activatedRoute.snapshot.data['livro'];

    const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (livro?.fornecedor?.id || null));
    const editora = this.editoras.find(editora => editora.id === (livro?.editora?.id || null));

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
      datalancamento: [(livro && livro.datalancamento) ? livro.datalancamento : null,
            Validators.compose([Validators.required])],
      classificacao: [(livro && livro.classificacao)? livro.classificacao : null, Validators.required],
      editora: [editora, Validators.required],
      fornecedor: [fornecedor, Validators.required],
      generos: [(livro && livro.generos) ? livro.generos.map((genero) => genero.id) : [], Validators.required],
      autores: [(livro && livro.autores)? livro.autores.map((autor) => autor.id) : [], Validators.required]
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const livro = this.formGroup.value;
      if (livro.id == null) {
        this.livroService.insert(livro).subscribe({
          next: (livroCadastrado) => {
            this.router.navigateByUrl('/livros');
          },
          error: (err) => {
            console.log('Erro ao salvar', + JSON.stringify(err));
          }
        });
      } else {
        this.livroService.update(livro).subscribe({
          next: (livroAlterado) => {
            this.router.navigateByUrl('/livros');
          },
          error: (err) => {
            console.log('Erro ao alterar', + JSON.stringify(err));
          }
        });
      } 
    } else {
      console.log('Formulário inválido');
    }
  }
  
  excluir() {
    if (this.formGroup.valid) {
      const livro = this.formGroup.value;
      if (livro.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este livro?'
          }
        });

        dialogRef.afterClosed().subscribe( result => {
          if (result) {
            this.livroService.delete(livro).subscribe({
              next: () => {
                this.router.navigateByUrl('/livros');
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
    this.router.navigateByUrl('/livros');
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
      maxlength: 'O título deve ter no máximo 60 caracteres'
    },
    quantidadeEstoque: {
      required: 'A quantidade em estoque deve ser informada',
      minlength: 'A quantidade em estoque deve ser um valor válido'
    },
    preco: {
      required: 'O preço deve ser informado'
    },
    isbn: {
      required: 'O ISBN deve ser informado',
      minlength: 'O ISBN deve conter 13 caracteres',
      maxlength: 'O ISBN deve conter 13 caracteres'
    },
    descricao: {
      required: 'A descrição deve ser informada',
      minlength: 'A descrição deve ter pelo menos 10 caracteres',
      maxlength: 'A descrição deve ter no máximo 20000 caracteres'
    },
    datalancamento: {
      required: 'A data de lançamento deve ser informada'
    },
    classificacao: {
      required: 'A classificação deve ser selecionada'
    },
    fornecedor: {
      required: 'O fornecedor deve ser selecionado'
    },
    editora: {
      required: 'A editora deve ser selecionada'
    },
    autor: {
      required: 'O autor deve ser selecionado'
    },
    genero: {
      required: 'O gênero deve ser selecionado'
    }
  };
}
