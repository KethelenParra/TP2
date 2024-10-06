import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Editora } from '../../models/editora.model';
import { EditoraService } from '../../service/editora.service';
import { inject } from '@angular/core';

export const editoraResolver: ResolveFn<Editora> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(EditoraService).findById(route.params['id']);
};
