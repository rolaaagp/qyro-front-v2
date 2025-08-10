import { Routes } from '@angular/router';
import { authGuard } from '@guards/AuthGuard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('@pages/auth/auth').then((m) => m.Auth),
  },
  {
    path: '',
    loadComponent: () => import('@pages/main/main').then((m) => m.Main),
    canActivate: [authGuard],
    children: [
      {
        path: 'chats',
        loadComponent: () => import('@pages/chat/chat').then((m) => m.Chat),
      },
    ],
  },
];
