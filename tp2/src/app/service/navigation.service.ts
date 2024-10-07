import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  autor() {
    this.router.navigateByUrl('/autores/new');
  }

  fornecedor() {
    this.router.navigateByUrl('fornecedores/new');
  }

  box() {
    this.router.navigateByUrl('/boxes/new');
  }

  editora() {
    this.router.navigateByUrl('/editoras/new');
  }

  livro() {
    this.router.navigateByUrl('/livros/new');
  }

  genero(){
    this.router.navigateByUrl('/generos/new')
  }
}