import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Livro } from '../../models/livro.model';
import { inject } from '@angular/core';
import { LivroService } from '../../service/livro.service';
import { map } from 'rxjs';

export const livroViewResolver: ResolveFn<Livro> = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const formattedTitulo = route.paramMap.get('formattedTitulo')!;
  const titulo = formattedTitulo.split('-').slice(0, -1).join('-');
  const normalizedTitulo = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/-/g, ' ') // Reverte os hífens para espaços
    .replace(/[^\w\s]/g, ''); // Remove caracteres especiais
  return inject(LivroService).findByTitulo(normalizedTitulo)
    .pipe(map(livros => livros[0]));
};