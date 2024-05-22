import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { JwtService } from './shared/services/jwt.service';
import {MatBadgeModule} from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { LoginStore } from './store';
import { LoginButtonComponent } from './shared/components/login-button/login-button.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ActivityService } from './user/services/activity.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatBadgeModule,
    NgClass,
    RouterLink,
    MatSnackBarModule,
    LoginButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'game-app';

  public totalActivities = signal<number>(0)

  readonly store = inject(LoginStore);
  private router = inject(Router)
  private activitySvc = inject(ActivityService)
  public decodedToken = inject(JwtService).getDecodedToken();


  constructor(){
    effect(()=>{
      if(this.decodedToken==undefined){
        return
      }
      this.store.setLogin(this.decodedToken.userId)
      this.activitySvc.getActivitiesByUser().subscribe({
        next:r=>this.totalActivities.set(r.length)
      })
    },{
      allowSignalWrites:true
    })
  }

  public isHidden = signal<boolean>(false);

  onLogout() {
    localStorage.removeItem('token');
    this.store.setLogout();
    this.router.navigate(['/'])
  }

  toggleMenu() {
    this.isHidden.set(!this.isHidden());
  }

  goToMyActivities(){
    this.router.navigate(['/user/mis-actividades'])
  }

}
