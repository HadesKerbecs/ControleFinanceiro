import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = 'http://127.0.0.1:8000/api/dashboard/';

  constructor(private http: HttpClient) { }

  getSummary() {
    return this.http.get<any>(`${this.api}summary/`);
  }

  getAlerts() {
    return this.http.get<any>(`${this.api}alerts/`);
  }

  getGoals() {
    return this.http.get<any>(`${this.api}goals/`);
  }

  getCategoryGoals() {
    return this.http.get<any[]>(`${this.api}categories-goals/`);
  }

  getMonthlyEvolution() {
    return this.http.get<any>(`${this.api}monthly-evolution/`);
  }

  getByCard() {
    return this.http.get<any>(`${this.api}by-card/`);
  }

  getMonthComparison() {
    return this.http.get<any>(`${this.api}month-comparison/`);
  }

  getFixedCommitments() {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/fixed-commitments/');
  }

  getCategoryTotals() {
    return this.http.get<any>(`${this.api}categories-total/`);
  }

  getByCardTotal() {
    return this.http.get<any>(`${this.api}by-card-total/`);
  }

  getMonthlyRealCost() {
    return this.http.get<any>(`${this.api}monthly-real-cost-fixed/`);
  }

  getFuturePlanning() {
    return this.http.get<any>(`${this.api}future-planning/`);
  }

  getSubcategoryTotals() {
    return this.http.get<any>(`${this.api}subcategories-total/`);
  }

  getThirdPartyGauge() {
    return this.http.get<any>(`${this.api}third-party-gauge/`);
  }
}
