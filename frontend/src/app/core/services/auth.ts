import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) { }

  login(data: { username: string; password: string }) {
    return this.http.post<any>(`${this.api}/login/`, data).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);

        localStorage.setItem(
          'auth_user',
          JSON.stringify({
            username: data.username
          })
        );
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.api}/register/`, {
      username: data.username,
      email: data.email,
      password: data.password
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }
}
