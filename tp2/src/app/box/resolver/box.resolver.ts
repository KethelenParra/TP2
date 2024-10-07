import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { BoxService } from '../../service/box.service';
import { inject } from '@angular/core';
import { Box } from '../../models/box.model';

export const boxResolver: ResolveFn<Box> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(BoxService).findById(route.paramMap.get('id')!);
};
