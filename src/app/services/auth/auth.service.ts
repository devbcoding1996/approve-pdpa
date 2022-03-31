import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {
  token: string;
  constructor(public jwtHelper: JwtHelperService) {}
  isAuthenticated() {
    const token = localStorage.getItem('token');
    console.log(token);
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired();
  }
}
