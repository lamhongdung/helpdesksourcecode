import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Priority } from '../entity/Priority';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of priorities per a page(default = 5)
  pageSize = environment.pageSize;

  constructor(private http: HttpClient) { }

  // get priorities by page and based on the search criteria
  // parameters:
  //  - pageNumber: page number
  //  - searchTerm: search term(ID, name)
  //  - reachInOpt: gt(>=), eq(=), lt(<=)
  //  - reachIn: number of hours to complete a ticket
  //  - status: '', 'Active', 'Inactive'  
  searchPriorities(pageNumber: number, searchTerm: string, reachInOpt: string, reachIn: number, status: string): Observable<Priority[]> {

    console.log(`${this.host}/priority-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&reachInOpt=${reachInOpt}&reachIn=${reachIn}&status=${status}`);

    // ex: url = http://localhost:8080/priority-search?pageNumber=0&pageSize=5&searchTerm=""&reachInOpt="gt"&reachIn=0&status=""
    return this.http.get<Priority[]>(
      `${this.host}/priority-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&reachInOpt=${reachInOpt}&reachIn=${reachIn}&status=${status}`
    )
  }

  // calculate total of priorities for count total pages
  // parameters:
  //  - searchTerm: search term(ID, name)
  //  - reachInOpt: gt(>=), eq(=), lt(<=)
  //  - reachIn: number of hours to complete a ticket
  //  - status: '', 'Active', 'Inactive'
  getTotalOfPriorities(searchTerm: string, reachInOpt: string, reachIn: number, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-priorities?searchTerm=""&reachInOpt="gt"&reachIn=0&status=""
    return this.http.get<number>(
      `${this.host}/total-of-priorities?searchTerm=${searchTerm}&reachInOpt=${reachInOpt}&reachIn=${reachIn}&status=${status}`
    );

  }

  // create priority
  public createPriority(priority: Priority): Observable<Priority> {
    return this.http.post<Priority>(`${this.host}/priority-create`, priority);
  }

  // // edit existing category
  // public editCategory(category: Category): Observable<Category> {
  //   return this.http.put<Category>(`${this.host}/category-edit`, category);
  // }

  //  // find category by id
  //  findById(id: number): Observable<Category> {
  //    return this.http.get<Category>(`${this.host}/category-list/${id}`);
  //  }

}