import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {

  const authService = inject(AuthService);
  // Si la persona no está autenticada necesitamos sacarlo de la ruta con el router
  const router = inject(Router);

  // firstValueFrom permite esperar a que el observable emita una respuesta
  const isAuthenticated = await firstValueFrom(authService.checkStatus())

  if (isAuthenticated){
    router.navigateByUrl('/');
    return false;
  }
  return true;
}
