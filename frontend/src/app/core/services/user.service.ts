import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'https://controlefinanceiro-pgsn.onrender.com/api/users/';

  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get<any[]>(this.api);
  }
}
