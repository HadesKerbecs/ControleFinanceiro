import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  username = '';
  title = '';

    constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('auth_user');

    if (user) {
      this.username = JSON.parse(user).username;
    }

    this.title = this.getRouteTitle(this.route);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.route.data.subscribe(() => {
          this.title = this.getRouteTitle(this.route);
        })
      });
  }

  private getRouteTitle(route: ActivatedRoute): string {
    let child = route.firstChild;
    while (child?.firstChild) {
      child = child.firstChild;
    }
    return child?.snapshot.data['title'] ?? '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
