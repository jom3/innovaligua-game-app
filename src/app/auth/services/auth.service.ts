import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../../shared/interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _http = inject(HttpClient)

  login(user:Auth):Observable<any>{
    return this._http.post('http://localhost:3000/api/auth/login',user)
  }
}
