import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private api = 'http://127.0.0.1:8000/api/expenses/';

  constructor(private http: HttpClient) { }

  getExpenses(filters: any) {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any[]>(this.api, { params });
  }

  createExpense(data: any) {
    return this.http.post(this.api, data);
  }

  updateExpense(id: number, data: any) {
    return this.http.put(`${this.api}/${id}/`, data);
  }

  deleteExpense(id: number) {
    return this.http.delete(`${this.api}/${id}/`);
  }

  payInstallment(id: number) {
    return this.http.post(
      `http://127.0.0.1:8000/api/installments/${id}/pay/`,
      {}
    );
  }

  getInstallments(expenseId: number) {
    return this.http.get<any[]>(
      `http://127.0.0.1:8000/api/installments/?expense=${expenseId}`
    );
  }
}
