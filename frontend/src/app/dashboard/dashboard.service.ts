import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = 'http://127.0.0.1:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get<any>(`${this.api}/summary/`);
  }

  getAlerts() {
  return this.http.get<any>('http://127.0.0.1:8000/api/dashboard/alerts/');
  }

  getGoals() {
  return this.http.get<any>(`${this.api}/goals/`);
  }
}
