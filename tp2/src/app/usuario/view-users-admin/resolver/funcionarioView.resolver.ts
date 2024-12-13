import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { FuncionarioService } from '../../../service/funcionario.service';
import { Funcionario } from '../../../models/funcionario.model';

export const funcionarioResolver: ResolveFn<Funcionario> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(FuncionarioService).findById(route.params['id']);
};
