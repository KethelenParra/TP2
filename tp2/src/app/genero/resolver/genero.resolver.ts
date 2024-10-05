import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Genero } from '../../models/genero.model';
import { inject } from '@angular/core';
import { GeneroService } from '../../service/genero.service';

export const generoResolver: ResolveFn<Genero> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(GeneroService).findById(route.params['id']);
  };
