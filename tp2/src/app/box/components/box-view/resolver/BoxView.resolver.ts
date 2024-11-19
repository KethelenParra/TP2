import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { BoxService } from '../../../../service/box.service';
import { Box } from '../../../../models/box.model';

export const BoxViewResolver: ResolveFn<Box> = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const nome = route.paramMap.get('nome'); // Obtém diretamente o parâmetro 'titulo'

  if (!nome) {
    throw new Error('O parâmetro nome está ausente na rota.');
  }

  return inject(BoxService).findByNome(nome).pipe(
    map(boxes => boxes[0] || null) // Retorna o primeiro livro ou `null` se não encontrar
  );
};