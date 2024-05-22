import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getIsActiveToken(){
    if(localStorage.getItem('token')){
      return true
    }
    return false
  }

  getToken(){
    return localStorage.getItem('token') ?? ''
  }

  getDecodedToken(){
    const accessToken = localStorage.getItem('token')
    if(accessToken){
      const decodedToken = jwtDecode<any>(accessToken)
      return decodedToken;
    }
  }
}
