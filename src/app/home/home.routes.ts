import { Routes } from "@angular/router";

const routes:Routes = [
  {
    path:'', loadComponent:()=> import('./home-page/home-page.component')
  }
]

export default routes;
