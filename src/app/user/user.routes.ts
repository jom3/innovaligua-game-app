import { Routes } from "@angular/router";
import { authGuard } from "../shared/guards/auth.guard";

const routes:Routes = [
  {
    path:'mis-actividades', loadComponent:()=>import('./pages/activity-page/activity-page.component')
  },
  {
    path:'juego/:id', loadComponent:()=>import('./pages/game-page/game-page.component')
  }
]

export default routes
