import { Component, OnInit, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Livro } from '../models/livro.model';
import { LivroService } from '../service/livro.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FooterComponent } from '../components/footer/footer.component';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, NgIf, NgFor,RouterModule, MatTableModule, SidebarComponent, MatButtonModule, MatSelectModule, MatSidenavModule, MatListModule, FooterComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  constructor(private livroService: LivroService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.livroService.findAll().subscribe(
      data => { this.livros = data }
    );
  }

  displayedColumns: string[] = [
    'id', 
    'titulo', 
    'quantidadeEstoque', 
    'preco', 
    'isbn', 
    'descricao', 
    'datalancamento',
    'classificacao', 
    'editora', 
    'fornecedor',
    'genero',
    'autor', 
    'acao'
  ];
  livros: Livro[] = [];


}
