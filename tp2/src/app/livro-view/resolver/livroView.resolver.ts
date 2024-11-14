import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Livro } from '../../models/livro.model';
import { inject } from '@angular/core';
import { LivroService } from '../../service/livro.service';
import { map } from 'rxjs';

export const livroViewResolver: ResolveFn<Livro> = 
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(LivroService).findByTitulo(route.paramMap.get('titulo')!)
    .pipe(map(livros => livros[0])
    );
};
