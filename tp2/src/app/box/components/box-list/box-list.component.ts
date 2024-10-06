import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { BoxService } from '../../../service/box.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Box } from '../../../models/box.model';
// import { LivroService } from '../../../service/livro.service';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [MatToolbarModule, NgFor, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent {
  displayedColumns: string[] = ['id', 'nome', 'descricaoBox', 'livros', 'quantidadeEstoque', 'fornecedor', 'acao'];
  boxes: Box[] = [];
  // livros: Livro[] = [];

  constructor(
    private boxService: BoxService, 
    private dialog: MatDialog, 
    // private livroService: LivroService
  ){}

  ngOnInit(): void {
    this.boxService.findAll().subscribe( data => 
      { this.boxes = data }
    );
  }

  // getLivros(): void{
  //   this.livroService
  // }

  excluir(box: Box): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        message: 'Deseja realmente excluir este Genero?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result === true ){
        this.boxService.delete(box).subscribe({
          next: () => {
            this.boxes = this.boxes.filter(e => e.id !== box.id);
          },
          error: (err) => {
            console.error('Erro ao tentar excluir o genero', err);
          }
        });
      }
    });
  }
}