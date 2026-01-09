import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private api = 'http://127.0.0.1:8000/api/expenses';

  constructor(private http: HttpClient) {}

  getExpenses(filters: any) {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any[]>(this.api, { params });
  }
}
