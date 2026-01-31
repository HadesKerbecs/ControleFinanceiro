import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'http://127.0.0.1:8000/api/users/';

  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get<any[]>(this.api);
  }
}
