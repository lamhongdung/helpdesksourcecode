import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpRespone } from '../model/custom-http-response';
import { IUserDTO } from '../entity/IUserDTO';

@Injectable({providedIn: 'root'})
export class UserService {

  // 'http://localhost:8080'
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // get all users from backend
  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user-list`);
  }

  // get all users and paginate
  getAllUsers(index: number): Observable<IUserDTO[]> {
    // console.log(`${this.host}/user-list?index=${index}`);
    return this.http.get<IUserDTO[]>(`${this.host}/user-list?index=${index}`)
    // return this.http.get<IUserDTO[]>(`${this.host}/user/list`)
  }

  getAllUsersNotPagination(): Observable<IUserDTO[]> {
    // return this.http.get<IUserDTO[]>(this.API + 'users-not-pagination')
    // return this.http.get<IUserDTO[]>(`${this.host}/user/users-not-pagination`)
    return this.http.get<IUserDTO[]>(`${this.host}/users-not-pagination`)
  }

  getTotalOfUsers(): Observable<number> {
    // return this.http.get<IUserDTO[]>(this.API + 'users-not-pagination')
    // return this.http.get<IUserDTO[]>(`${this.host}/user/users-not-pagination`)
    return this.http.get<number>(`${this.host}/total-of-users`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${username}`);
  }

  // add users to localStorage for searching user
  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('users')) {
        return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

  // public createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData {
  //   const formData = new FormData();
  //   formData.append('currentUsername', loggedInUsername);
  //   formData.append('firstName', user.firstName);
  //   formData.append('lastName', user.lastName);
  //   formData.append('username', user.username);
  //   formData.append('email', user.email);
  //   formData.append('role', user.role);
  //   // formData.append('profileImage', profileImage);
  //   formData.append('isActive', JSON.stringify(user.active));
  //   // formData.append('isNonLocked', JSON.stringify(user.notLocked));
  //   return formData;
  // }

}
