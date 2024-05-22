import { Component, inject } from '@angular/core';
import { LoginButtonComponent } from '../../shared/components/login-button/login-button.component';
import { LoginStore } from '../../store';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [LoginButtonComponent, MatButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export default class HomePageComponent {
  readonly store = inject(LoginStore)
  private router = inject(Router)

  goToMyActivities(){
    this.router.navigate(['/user/mis-actividades'])
  }
}
