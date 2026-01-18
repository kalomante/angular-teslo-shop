import { computed, inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { firstValueFrom, map, of } from "rxjs";

export const isAdminGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);

  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authService.checkStatus())

    if (isAuthenticated){
      if(!authService.user()?.roles.includes('admin')){
        router.navigateByUrl('/');
        return false;
      }
    }
  return true;
};
