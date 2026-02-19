import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private api = 'https://controlefinanceiro-pgsn.onrender.com/api/expenses/';
  private installmentsApi = 'https://controlefinanceiro-pgsn.onrender.com/api/installments/';

  constructor(private http: HttpClient) { }

  getExpenses(filters: any) {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get<any[]>(this.api, { params });
  }

  createExpense(data: any) {
    return this.http.post(this.api, data);
  }

  updateExpense(id: number, data: any) {
    return this.http.patch(`${this.api}${id}/`, data);
  }

  deleteExpense(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }

  unpayInstallment(id: number) {
    return this.http.post(`${this.installmentsApi}${id}/unpay/`, {});
  }

  payInstallment(id: number) {
    return this.http.post(`${this.installmentsApi}${id}/pay/`, {});
  }

  getInstallments(expenseId: number) {
    return this.http.get<any[]>(`${this.installmentsApi}?expense=${expenseId}`);
  }
}
