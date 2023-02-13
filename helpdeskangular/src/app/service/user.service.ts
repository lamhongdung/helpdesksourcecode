import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../entity/user';
import { CustomHttpRespone } from '../entity/custom-http-response';
import { IUserDTO } from '../entity/IUserDTO';

@Injectable({providedIn: 'root'})
export class UserService {

  // 'http://localhost:8080'
  private host = environment.apiUrl;
  // number of lines per page(= 5)
  numOfLinesPerPage = environment.numOfLinesPerPage;

  constructor(private http: HttpClient) {}

  // // get all users from backend
  // public getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.host}/user-list`);
  // }

  // get all users and paginate
  getAllUsers(page: number): Observable<IUserDTO[]> {

    console.log(`${this.host}/user-list?page=${page}&size=${this.numOfLinesPerPage}`);
    // ex: http://localhost:8080/user-list?page=0&size=5
    return this.http.get<IUserDTO[]>(`${this.host}/user-list?page=${page}&size=${this.numOfLinesPerPage}`)
    
  }

  // getAllUsersNotPagination(): Observable<IUserDTO[]> {
  //   // return this.http.get<IUserDTO[]>(this.API + 'users-not-pagination')
  //   // return this.http.get<IUserDTO[]>(`${this.host}/user/users-not-pagination`)
  //   return this.http.get<IUserDTO[]>(`${this.host}/users-not-pagination`)
  // }

  // get total of users for count total of pages
  getTotalOfUsers(): Observable<number> {
    // ex: http://localhost:8080/total-of-users
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
