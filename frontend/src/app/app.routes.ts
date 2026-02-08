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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.Dashboard),
        data: { title: 'Dashboard' }
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./cards/cards').then(m => m.Cards),
        runGuardsAndResolvers: 'always',
        data: { title: 'Cartões' }
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./expenses/expenses').then(m => m.Expenses),
        runGuardsAndResolvers: 'always',
        data: { title: 'Despesas' }
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile').then(m => m.Profile),
        runGuardsAndResolvers: 'always',
        data: { title: 'Perfil' }
      },
      {
        path: 'fixed-commitments',
        loadComponent: () =>
          import('./fixed-commitments/fixed-commitments').then(m => m.FixedCommitments),
        runGuardsAndResolvers: 'always',
        data: { title: 'Compromissos Fixos' }
      },
      {
        path: 'fixed-commitments/new',
        loadComponent: () =>
          import('./fixed-commitments/fixed-commitments-form/fixed-commitment-form')
            .then(m => m.FixedCommitmentForm),
        runGuardsAndResolvers: 'always',
        data: { title: 'Novo Compromisso Fixo' }
      },
      {
        path: 'fixed-commitments/:id/edit',
        loadComponent: () =>
          import('./fixed-commitments/fixed-commitments-form/fixed-commitment-form')
            .then(m => m.FixedCommitmentForm),
        runGuardsAndResolvers: 'always',
        data: { title: 'Editar Compromisso Fixo' }
      },

    ],
  },
];
