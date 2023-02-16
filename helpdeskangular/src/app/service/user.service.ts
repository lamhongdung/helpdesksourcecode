import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../entity/User';
import { CustomHttpRespone } from '../entity/custom-http-response';
// import { IUserDTO } from '../entity/IUserDTO';

@Injectable({ providedIn: 'root' })
export class UserService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of users per a page(default = 5)
  pageSize = environment.pageSize;

  constructor(private http: HttpClient) { }

  // get users by page and based on the search criteria
  searchUsers(page: number, searchTerm: string, role: string, status: string): Observable<User[]> {

    return this.http.get<User[]>(
      `${this.host}/user-search?page=${page}&size=${this.pageSize}&searchTerm=${searchTerm}&role=${role}&status=${status}`
    )
  }

  // calculate total of users for count total of pages
  getTotalOfUsers(searchTerm: string, role: string, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-users?searchTerm=""&role=""&status=""
    return this.http.get<number>(
      `${this.host}/total-of-users?searchTerm=${searchTerm}&role=${role}&status=${status}`
    );

  }

  // public addUser(formData: FormData): Observable<User> {
  //   return this.http.post<User>(`${this.host}/user/add`, formData);
  // }

  // create new user
  public createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user-create`, user);
  }

  // edit existing user
  public editUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.host}/user-edit`, user);
  }

  // public updateUser(formData: FormData): Observable<User> {
  //   return this.http.post<User>(`${this.host}/user/update`, formData);
  // }

  // find user by user id
  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.host}/user-list/${id}`);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);
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


}
