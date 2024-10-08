import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BoxService } from '../../../service/box.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { NavigationService } from '../../../service/navigation.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MatSelectModule } from '@angular/material/select';
import { FornecedorService } from '../../../service/fornecedor.service';
import { EditoraService } from '../../../service/editora.service';
import { GeneroService } from '../../../service/genero.service';
import { Classificacao } from '../../../models/classificacao.model';
import { Editora } from '../../../models/editora.model';
import { Genero } from '../../../models/genero.model';

@Component({
  selector: 'app-box-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSelectModule, RouterModule],
  templateUrl: './box-form.component.html',
  styleUrl: './box-form.component.css'
})
export class BoxFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  classificacaoEnum: {key: string; value: string}[] = [];
  selectedClassificacao!: string;
  editoras: Editora[] = [];
  generos: Genero[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private boxService: BoxService,
    private fornecedoresService: FornecedorService,
    private editoraService: EditoraService,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public navService: NavigationService) {

      const box: Box = this.activatedRoute.snapshot.data['boxes'];

      this.classificacaoEnum = Object.keys(Classificacao).map(key => ({
        key,
        value: Classificacao[key as keyof typeof Classificacao]
      }));

      this.formGroup = this.formBuilder.group({
        id: [(box && box.id) ? box.id : null],
        nome: [(box && box.nome) ? box.nome : null,
                                Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        descricaoBox: [(box && box.descricaoBox) ? box.descricaoBox : null,
                                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])],
        quantidadeEstoque: [(box && box.quantidadeEstoque) ? box.quantidadeEstoque : null],
        fornecedor: [(box && box.fornecedor) ? box.fornecedor : null],
        preco: [(box && box.preco) ? box.preco : null,
                                Validators.compose([Validators.required])],
        editora: [(box && box.editora) ? box.editora : null,
                                Validators.compose([Validators.required])],
        genero: [(box && box.genero) ? box.genero : null,
                                Validators.compose([Validators.required])],
        classificacao: [(box && box.classificacao) ? box.classificacao : null,
                                Validators.compose([Validators.required])]
      });
    }

    ngOnInit(): void {
      this.fornecedoresService.findAll().subscribe(data=> {
        this.fornecedores = data;
        this.initializeForm();
      })

      this.editoraService.findAll().subscribe(data=> {
        this.editoras = data;
        this.initializeForm();
      })

      this.generoService.findAll().subscribe(data=> {
        this.generos = data;
        this.initializeForm();
      })

      if (this.formGroup.valid) {
        console.log(this.formGroup.value);
      }
    }

    initializeForm(): void {
      const box: Box = this.activatedRoute.snapshot.data['box'];
      
      const fornecedor = this.fornecedores.find(fornecedor => fornecedor.id === (box?.fornecedor?.id || null));
      const editora = this.editoras.find(editora => editora.id === (box?.editora?.id || null));
      const genero = this.generos.find(genero => genero.id === (box?.genero?.id || null));
      
      this.formGroup = this.formBuilder.group({
        id: [(box && box.id) ? box.id : null],
        nome: [(box && box.nome) ? box.nome : null, 
                Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(40)])],
        descricaoBox: [(box && box.descricaoBox) ? box.descricaoBox : null,
                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])],   
        quantidadeEstoque: [(box && box.quantidadeEstoque) ? box.quantidadeEstoque : null,
          Validators.compose([Validators.required, Validators.minLength(1)])],            
        fornecedor: [fornecedor],
        editora: [editora],
        genero: [genero],
        preco: [(box && box.preco) ? box.preco : null, Validators.required],
        classificacao: [(box && box.classificacao) ? box.classificacao : null, Validators.required]
      })
    }

    salvar() {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.valid) {
        const box = this.formGroup.value;
        console.log('Dados enviados:', box);
        if (box.id == null){
          this.boxService.insert(box).subscribe({
          next: (boxCadastrodo) => {
            this.router.navigateByUrl('/boxes');
          },
          error: (errorResponse) => {
            console.log('Erro ao salvar', + JSON.stringify(errorResponse));
          } 
        });
        } else {
          this.boxService.update(box).subscribe({
            next: (boxAlterando) => {
              this.router.navigateByUrl('/boxes');
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
}
