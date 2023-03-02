import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../entity/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginUser } from '../entity/LoginUser';


@Injectable({ providedIn: 'root' })
// the LoginService
export class AuthenticationService {

  // apiUrl = 'http://localhost:8080'
  public host = environment.apiUrl;

  public urlAfterLogin = environment.urlAfterLogin;

  public token: string;

  // the logged in email
  public loggedInEmail: string;


  public loggedInUsername: string;
  public jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  // POST method: /login
  // when user click the "Login" button
  public login(login: LoginUser): Observable<HttpResponse<User>> {

    // { observe: 'response' }: want to receive whole response(include header,...)
    // return this.http.post<User>(`${this.host}/user/login`, user, { observe: 'response' });

    // return this.http.post<User>(`${this.host}/login`, user, { observe: 'response' });
    return this.http.post<User>(`${this.host}/login`, login, { observe: 'response' });
  }

  // clear all data in the local storage and local variable
  public logOut(): void {

    // clear all local variables contain the logged in information
    this.token = null;

    this.loggedInEmail = null;

    // clear all saved data in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // save token into the local storage and local variable
  public saveTokenToLocalStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // add the logged in user into the local strorage
  public saveUserToLocalStorage(user: User): void {

    // save user object with json string format
    localStorage.setItem('user', JSON.stringify(user));

  }

  // get user from local storage
  public getUserFromLocalStorage(): User {

    return JSON.parse(localStorage.getItem('user'));

  }

  // assign token from local storage to attribute
  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  // get token from attribute
  public getToken(): string {
    return this.token;
  }

  // check whether user logged in or not?
  // return:
  //    - true: user already logged in
  //    - false: user has not yet logged in
  public isLoggedInUser(): boolean {

    // load token from localStorage to attribute(token)
    this.loadToken();

    // if token is existing in the local storage
    if (this.token != null && this.token !== '') {

      // get value subject in the token(it means the email id).
      // if email is not empty
      // if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null) {

        // if token has not yet expired
        if (!this.jwtHelper.isTokenExpired(this.token)) {

          this.loggedInEmail = this.jwtHelper.decodeToken(this.token).sub;

          return true;

        }
      }
    } else {
      this.logOut();
      return false;
    }
  }

  // get id of the logged in user
  public getIdFromLocalStorage(): string {

    // if user is existing in the local storage
    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).id;

    }

    return "";
  }

  // get email of the logged in user
  public getEmailFromLocalStorage(): string {

    // if user is existing in the local storage
    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).email;

    }

    return "";
  }

  // get role of the logged in user
  public getRoleFromLocalStorage(): string {

    // if user is existing in the local storage
    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).role;

    }

  }

  // get token from local storage
  public getTokenFromLocalStorage(): string {

    return localStorage.getItem("token");

  }

}
