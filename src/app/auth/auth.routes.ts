import { Routes } from "@angular/router";
import { authGuard } from "../shared/guards/auth.guard";

const routes:Routes=[
  {
    path:'login', loadComponent:()=>import('./login/login.component')
  }
]

export default routes
