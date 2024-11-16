import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Livro } from '../../models/livro.model';
import { inject } from '@angular/core';
import { LivroService } from '../../service/livro.service';
import { map } from 'rxjs';

export const livroViewResolver: ResolveFn<Livro> = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const titulo = route.paramMap.get('titulo'); // Obtém diretamente o parâmetro 'titulo'

  if (!titulo) {
    throw new Error('O parâmetro titulo está ausente na rota.');
  }

  return inject(LivroService).findByTitulo(titulo).pipe(
    map(livros => livros[0] || null) // Retorna o primeiro livro ou `null` se não encontrar
  );
};