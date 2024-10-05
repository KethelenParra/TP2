import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../service/genero.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './genero-list.component.html',
  styleUrl: './genero-list.component.css'
})
export class GeneroListComponent {
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acao'];
  generos: Genero[] = [];

  constructor(private generoService: GeneroService, private dialog: MatDialog){
  }

  ngOnInit(): void {
    this.generoService.findAll().subscribe(
      data => { this.generos = data }
    );
  }

  excluir(genero: Genero): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        message: 'Deseja realmente excluir este Genero?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result === true ){
        this.generoService.delete(genero).subscribe({
          next: () => {
            this.generos = this.generos.filter(e => e.id !== genero.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o genero', err);
          }
        });
      }
    });
  }
}