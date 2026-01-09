import { Routes } from '@angular/router';

import { Layout } from './core/layout/layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register').then(m => m.Register),
  },
  {
    path: '',
    component: Layout,
    // canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./cards/cards').then(m => m.Cards),
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./expenses/expenses').then(m => m.Expenses),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' as const,
      },
    ],
  },
];
