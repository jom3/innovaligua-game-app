import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { authComponentsGuard } from './shared/guards/auth-components.guard';

export const routes: Routes = [
  {
    path:'', loadChildren:()=> import('./home/home.routes')
  },
  {
    path:'', loadChildren:()=> import('./auth/auth.routes'), canActivate:[authGuard]
  },
  {
    path:'user', loadChildren:()=> import('./user/user.routes'), canActivate:[authComponentsGuard]
  }
];
