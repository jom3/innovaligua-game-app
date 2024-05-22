import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginStore } from '../../store';
import { JwtService } from '../../shared/services/jwt.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authSvc = inject(AuthService);
  private jwtSvc = inject(JwtService);
  readonly store = inject(LoginStore);
  private _snackBar = inject(MatSnackBar)


  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  openSnackBar(error:any) {
    this._snackBar.open(error.error.message, '', {
      duration:5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.getRawValue()!;
    this.authSvc.login({ username: username!, password: password! }).subscribe({
      next: (r) => {
        localStorage.setItem('token', r.access_token);
        this.store.setLogin(this.jwtSvc.getDecodedToken().userId);
        this.router.navigate(['/']);
      },
      error: (e) => this.openSnackBar(e),
    });
  }
}
