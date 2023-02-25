import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../entity/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginUser } from '../entity/LoginUser';
import { CustomHttpRespone } from '../entity/custom-http-response';
import { ResetPassword } from '../entity/ResetPassword';


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
  // public login(user: User): Observable<HttpResponse<User>> {
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
    // this.loggedInUsername = null;
    this.loggedInEmail = null;

    // clear all saved data in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // localStorage.removeItem('users');
  }

  // public resetPassword(email: string): Observable<CustomHttpRespone> {
  public resetPassword(resetPassword: ResetPassword): Observable<CustomHttpRespone> {

    // return this.http.get<CustomHttpRespone>(`${this.host}/reset-password/${email}`);
    return this.http.put<CustomHttpRespone>(`${this.host}/reset-password`, resetPassword);

  }
  
  // // edit existing user
  // public editUser(user: User): Observable<User> {
  //   return this.http.put<User>(`${this.host}/user-edit`, user);
  // }

  // save token into the local storage and local variable
  public saveTokenToLocalStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // add the logged in user into the local strorage
  // public addUserToLocalCache(user: User): void {
  public saveUserToLocalStorage(user: User): void {
    // save user object with json string format
    localStorage.setItem('user', JSON.stringify(user));
  }

  // get user from local storage
  // public getUserFromLocalCache(): User {
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
  public isUserLoggedIn(): boolean {

    // load token from localStorage to attribute(token)
    this.loadToken();

    // if token is existing in the local storage
    if (this.token != null && this.token !== '') {

      // get value subject in the token(it means the email id).
      // if email is not empty
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {

        // if token has not yet expired
        if (!this.jwtHelper.isTokenExpired(this.token)) {

          // set loggedInUsername = email id
          // this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          this.loggedInEmail = this.jwtHelper.decodeToken(this.token).sub;

          return true;

        }
      }
    } else {
      this.logOut();
      return false;
    }
  }

  // get email of the logged in user
  public getEmailFromLocalStorage(): string {

    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).email;

    }

    return "";
  }

  // get role of the logged in user
  public getRoleFromLocalStorage(): string {

    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).role;

    }

  }

  // get token from local storage
  public getTokenFromLocalStorage(): string {

    return localStorage.getItem("token");

  }

}
