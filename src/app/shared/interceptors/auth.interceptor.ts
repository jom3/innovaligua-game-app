import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtSvc = inject(JwtService)
  const token = jwtSvc.getToken()
  if(token){
    req = req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      },
    })
  }
  return next(req).pipe(
    catchError((error)=>{
      return throwError(()=>error)
    })
  );
};
