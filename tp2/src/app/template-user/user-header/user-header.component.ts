import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../service/sidebar.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LivroService } from '../../service/livro.service';
import { Livro } from '../../models/livro.model';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, FormsModule, MatSelectModule, MatSelect, MatButtonModule, MatFormFieldModule, MatInputModule, RouterModule],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  filtro: string = "";
  tipoFiltro: string = "titulo";
  livros: Livro[] = [];
  totalRecords = 0; 

  constructor(private sidebarService: SidebarService, private livroService: LivroService) {
  }

  ngOnInit(): void {
    this.buscar();  
  }
  clickMenu() {
    this.sidebarService.toggle();
  }

  buscar() {
    if (this.filtro) {
      if (this.tipoFiltro === 'autor') {
        this.livroService.countByAutor(this.filtro).subscribe(data => {
          {this.totalRecords = data; }
        });
      } else {
        this.livroService.countByNome(this.filtro).subscribe(data => {
          {this.totalRecords = data; }
        });
      }
    } else {
      this.livroService.count().subscribe(
        data => {this.totalRecords = data; }
      );
    }
  }

  filtrar(): void {
    this.buscar();
  }
}
