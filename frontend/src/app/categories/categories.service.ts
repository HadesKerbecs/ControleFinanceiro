import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private categoriesApi = 'https://controlefinanceiro-pgsn.onrender.com/api/categories/';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(this.categoriesApi);
  }

  getSubCategories(categoryId: number) {
    const params = new HttpParams().set('category', categoryId);
    return this.http.get<any[]>(`https://controlefinanceiro-pgsn.onrender.com/api/subcategories/`, { params });
  }
}
