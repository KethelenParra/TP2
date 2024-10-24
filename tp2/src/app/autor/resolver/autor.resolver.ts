import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Autor } from '../../models/autor.model';
import { inject } from '@angular/core';
import { AutorService } from '../../service/autor.service';

export const autorResolver: ResolveFn<Autor> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    console.log('ID do Autor:', route.params['id']);
    return inject(AutorService).findById(route.params['id']);
  };
