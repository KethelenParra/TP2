import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  autor() {
    this.router.navigateByUrl('/admin/autores/new');
  }

  fornecedor() {
    this.router.navigateByUrl('/admin/fornecedores/new');
  }

  box() {
    this.router.navigateByUrl('/admin/boxes/new');
  }

  editora() {
    this.router.navigateByUrl('/admin/editoras/new');
  }

  livro() {
    this.router.navigateByUrl('/admin/livros/new');
  }

  genero(){
    this.router.navigateByUrl('/admin/generos/new')
  }
}