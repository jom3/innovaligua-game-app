import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class Auth2Interceptor implements HttpInterceptor {

  constructor(
    private _jwt:JwtService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._jwt.getToken();
    if(token){
      const {exp} = this._jwt.getDecodedToken()
      const now = Date.now()/1000;
      const res = exp-now;
      if(res<0){
        localStorage.clear()
      }
      const TokenRequest = request.clone({
        headers: new HttpHeaders({
          Authorization:`Bearer ${token}`
        })
      })
      return next.handle(TokenRequest)
    }
    return next.handle(request);
  }
}
