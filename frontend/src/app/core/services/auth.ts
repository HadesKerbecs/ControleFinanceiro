import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://controlefinanceiro-pgsn.onrender.com/api/auth';
  private expirationTimer: any;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  /* =========================
     LOGIN
  ========================= */
  login(data: { username: string; password: string }) {
    return this.http.post<any>(`${this.api}/login/`, data).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);

        localStorage.setItem(
          'auth_user',
          JSON.stringify({ username: data.username })
        );

        this.startTokenExpirationWatcher();
      })
    );
  }

  /* =========================
     REGISTER
  ========================= */
  register(data: any) {
    return this.http.post(`${this.api}/register/`, {
      username: data.username,
      email: data.email,
      password: data.password
    });
  }

  /* =========================
     LOGOUT
  ========================= */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  /* =========================
     AUTH STATUS
  ========================= */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  /* =========================
     TOKEN EXPIRATION
  ========================= */
  private getTokenExpiration(): number | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  startTokenExpirationWatcher() {
    const expiration = this.getTokenExpiration();
    if (!expiration) return;

    const now = Date.now();
    const timeLeft = expiration - now;

    // avisa 2 minutos antes
    const warnBefore = 2 * 60 * 1000;

    if (timeLeft <= 0) {
      this.logout();
      return;
    }

    if (timeLeft > warnBefore) {
      this.expirationTimer = setTimeout(() => {
        this.toastr.warning(
          'Sua sessão vai expirar em breve.',
          'Atenção'
        );
      }, timeLeft - warnBefore);
    }
  }
}
