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
import { Editora } from '../../../models/editora.model';
import { Genero } from '../../../models/genero.model';
import { Autor } from '../../../models/autor.model';
import { AutorService } from '../../../service/autor.service';

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
  editoras: Editora[] = [];
  generos: Genero[] = [];
  autores: Autor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private boxService: BoxService,
    private fornecedoresService: FornecedorService,
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
        descricaoBox:['', Validators.required],
        quantidadeEstoque: ['', Validators.required],
        fornecedor: [],
        preco: ['', Validators.required],
        editora: [],
        genero: [],
        classificacao: [],
        autor: [],
      });
    }

    ngOnInit(): void {
      this.fornecedoresService.findAll().subscribe(data=> {
        this.fornecedores = data;
        this.initializeForm();
      });

      this.editoraService.findAll().subscribe(data=> {
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

      if (this.formGroup.valid) {
        console.log(this.formGroup.value);
      }
    }

    initializeForm(): void {
      const box: Box = this.activatedRoute.snapshot.data['box'];

      const fornecedorId = box?.fornecedores?.id;
      const editoraId = box?.editoras?.id;
     
      this.formGroup = this.formBuilder.group({
        id: [(box && box.id) ? box.id : null],
        nome: [(box && box.nome) ? box.nome : null, 
                Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(40)])],
        descricaoBox: [(box && box.descricaoBox) ? box.descricaoBox : null,
                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])],   
        quantidadeEstoque: [(box && box.quantidadeEstoque) ? box.quantidadeEstoque : null,
                Validators.compose([Validators.required, Validators.minLength(1)])],            
        fornecedor: [fornecedorId, Validators.required],
        editora: [editoraId, Validators.required],
        genero: [box?.generos?.map(g => g.id) || [], Validators.required],
        autor: [box?.autores?.map(a => a.id) || [], Validators.required],
        preco: [box?.preco || 0, Validators.required],
        classificacao: [(box && box.classificacao) ? box.classificacao : null, Validators.required]
      })
    }

    salvar() {
      if(this.formGroup.valid){
        const box: Box = this.formGroup.value;

        if (box.id == null) {
          this.boxService.insert(box).subscribe({
            next: (response) => {
              console.log('Box cadastrado com sucesso', response)
              this.router.navigateByUrl('/boxes')
            },
            error: (error) => {
              console.error('Erro ao cadastrar box', error)
            }
          });
        } else {
          this.boxService.update(box).subscribe({
            next: (response) => {
              console.log('Box atualizado com sucesso', response);
              this.router.navigateByUrl('/boxes')
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
      },
      descricaoBox: {
        required: 'A descricao deve ser informada', 
        minlength: 'A descricao deve ter pelo menos 10 caracteres',
        maxlength: 'A descricao deve ter no maximo 500 caracteres'
      }
    };
}
