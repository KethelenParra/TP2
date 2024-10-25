import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BoxService } from '../../../service/box.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Box } from '../../../models/box.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { NavigationService } from '../../../service/navigation.service';
import { MatSelectModule } from '@angular/material/select';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../service/fornecedor.service';
import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../service/editora.service';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../service/genero.service';
import { Autor } from '../../../models/autor.model';
import { AutorService } from '../../../service/autor.service';

@Component({
  selector: 'app-box-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSelectModule, RouterModule],
  templateUrl: './box-form.component.html',
  styleUrls: ['./box-form.component.css']
})
export class BoxFormComponent implements OnInit{
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  editoras: Editora[] = [];
  generos: Genero[] = [];
  autores: Autor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private boxService: BoxService,
    private fornecedorService: FornecedorService,
    private editoraService: EditoraService,
    private generoService: GeneroService,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService) {

      this.formGroup = this.formBuilder.group({
        id: [],
        nome: ['', Validators.required],
        descricaoBox: ['', Validators.required],  
        quantidadeEstoque: [null, Validators.required],      
        fornecedor: [null, Validators.required],
        editora: [null, Validators.required],
        preco: ['', Validators.required],
        classificacao: ['', Validators.required],
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

      this.generoService.findAll().subscribe(data=> { 
        this.generos = data;
        this.initializeForm();
      });
  
      this.autorService.findAll().subscribe(data => {
        this.autores = data;
        this.initializeForm();
      });
    }

    initializeForm(): void {
      const box: Box = this.activatedRoute.snapshot.data['box'];

      const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (box?.fornecedor?.id || null));
      const editora = this.editoras.find(editora => editora.id === (box?.editora?.id || null));
     
      this.formGroup = this.formBuilder.group({
        id: [(box && box.id) ? box.id : null],
        nome: [(box && box.nome) ? box.nome : null, 
                Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(40)])],
        descricaoBox: [(box && box.descricaoBox) ? box.descricaoBox : null,
                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(20000)])],   
        quantidadeEstoque: [(box && box.quantidadeEstoque) ? box.quantidadeEstoque : null,
          Validators.compose([Validators.required, Validators.minLength(1)])],            
        fornecedor: [fornecedor, Validators.required],
        editora: [editora, Validators.required],
        preco: [(box && box.preco) ? box.preco : '', Validators.required],
        classificacao: [(box && box.classificacao) ? box.classificacao : null, Validators.required],
        generos: [(box && box.generos) ? box.generos.map((genero) => genero.id) : [], Validators.required],
        autores: [(box && box.autores)? box.autores.map((autor) => autor.id) : [], Validators.required]
      })
    }

    salvar() {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.valid) {
        const box = this.formGroup.value;
        if (box.id == null){
          this.boxService.insert(box).subscribe({
          next: (boxesCadastrado) => {
            this.router.navigateByUrl('/boxes');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar', + JSON.stringify(errorResponse));
          } 
        });
        } else {
          this.boxService.update(box).subscribe({
            next: (boxesAlterado) => {
              this.router.navigateByUrl('/boxes');
            },
            error: (error) => {
              console.error('Erro ao atualizar box', error)
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
        maxLength: 'O box deve ter no maximo 40 caracteres'
      },
      descricaoBox: {
        required: 'A descricao deve ser informada', 
        minlength: 'A descricao deve ter pelo menos 10 caracteres',
        maxlength: 'A descricao deve ter no maximo 20000 caracteres'
      },
      quantidadeEstoque: {
        required: 'A quantidade deve ser informada',
        minLength: 'O estoque deve ter pelo menos 1 box'
      },
      fornecedor: {
        required: 'O fornecedor deve ser informada'
      },
      editora: {
        required: 'A editora deve ser informada'
      },
      preco: {
        required: 'O preco deve ser informado'
      },
      classificacao: {
        required: 'A classificação deve ser selecionada'
      },
      genero: {
        required: 'O genero deve ser selecionado'
      },
      autore: {
        required: 'O autor deve ser selecionado'
      }
    };
}
