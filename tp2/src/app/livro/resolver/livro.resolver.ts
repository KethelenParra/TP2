import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Livro } from '../../models/livro.model';
import { inject } from '@angular/core';
import { LivroService } from '../../service/livro.service';

export const livroResolver: ResolveFn<Livro> = 
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(LivroService).findById(route.paramMap.get('id')!);
};
