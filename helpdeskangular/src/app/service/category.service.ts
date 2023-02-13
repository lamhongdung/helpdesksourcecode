import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../entity/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.host}/categories`);
  }

}
