import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private categoriesApi = 'http://127.0.0.1:8000/api/categories/';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(this.categoriesApi);
  }

  getSubCategories(categoryId: number) {
    const params = new HttpParams().set('category', categoryId);
    return this.http.get<any[]>(`http://127.0.0.1:8000/api/subcategories/`, { params });
  }
}
