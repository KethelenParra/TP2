import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const authClienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isTokenExpired()){
    console.log('Token inválido!');
    authService.removeToken();
    authService.removeUsuarioLogado();
    router.navigate(['/login']);
    return false;
  } else {
    console.log('Token válido!');
    return true;
  }
};