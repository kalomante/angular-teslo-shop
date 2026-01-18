import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: ()=> import('./admin-dashboard/admin-dashboard.routes')
  },
  {
    path: 'auth',
    loadChildren: ()=> import("./auth/auth.routes"),
    // Cada vez que se navegue a la autenticación se comprobará el guard
    // TODO: GUARDS
    canMatch: [
      NotAuthenticatedGuard
    ]
  },
  {
    path:'',
    loadChildren: ()=> import('./store-front/store-front.routes')
  },
];
