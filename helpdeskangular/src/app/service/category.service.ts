import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../entity/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of categories per a page(default = 5)
  pageSize = environment.pageSize;

  constructor(private http: HttpClient) { }

  // get categories by page and based on the search criteria
  searchCategories(pageNumber: number, searchTerm: string, status: string): Observable<Category[]> {

    // ex: url = http://localhost:8080/category-search?pageNumber=0&pageSize=5&searchTerm=""&status=""
    return this.http.get<Category[]>(
      `${this.host}/category-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&status=${status}`
    )
  }

  // calculate total of categories for count total of pages
  getTotalOfCategories(searchTerm: string, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-categories?searchTerm=""&status=""
    return this.http.get<number>(
      `${this.host}/total-of-categories?searchTerm=${searchTerm}&status=${status}`
    );

  }

  //  // create new user
  //  public createUser(user: User): Observable<User> {
  //    return this.http.post<User>(`${this.host}/user-create`, user);
  //  }

  //  // edit existing user
  //  public editUser(user: User): Observable<User> {
  //    return this.http.put<User>(`${this.host}/user-edit`, user);
  //  }

  // find category by id
  findById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.host}/category-list/${id}`);
  }

}
