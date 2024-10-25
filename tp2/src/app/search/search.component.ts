import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BoxService } from '../service/box.service';
import { AutorService } from '../service/autor.service';
import { EditoraService } from '../service/editora.service';
import { FornecedorService } from '../service/fornecedor.service';
import { GeneroService } from '../service/genero.service';
import { LivroService } from '../service/livro.service';
import { Box } from '../models/box.model';
import { Autor } from '../models/autor.model';
import { Editora } from '../models/editora.model';
import { Fornecedor } from '../models/fornecedor.model';
import { Genero } from '../models/genero.model';
import { Livro } from '../models/livro.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
  
  `,
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  boxes: Box[] = [];
  autores: Autor[] = [];
  editoras: Editora[] = [];
  fornecedores: Fornecedor[] = [];
  generos: Genero[] = [];
  livros: Livro[] = [];
  totalRecords = 0;
  pageSize = 2;
  page = 0;

  constructor (
    private boxService: BoxService, 
    private autorService: AutorService,
    private editoraService: EditoraService,
    private fornecedorService: FornecedorService,
    private generoService: GeneroService,
    private livroService: LivroService,
  ){}
  ngOnInit(): void {
    this.boxService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.boxes = data }
    );

    this.boxService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.autorService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.autores = data }
    );

    this.autorService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.editoraService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.editoras = data }
    );

    this.editoraService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.fornecedorService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.fornecedores = data }
    );

    this.fornecedorService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.generoService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.generos = data }
    );

    this.generoService.count().subscribe(
      data => { this.totalRecords = data }
    );

    this.livroService.findAll(this.page, this.pageSize).subscribe( data => 
      { this.livros = data }
    );

    this.livroService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  filtro: string = '';

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  aplicarFiltro(): void {
    this.search.emit(this.filtro);
  }
}
