import { Routes } from '@angular/router';
import { Main } from '@pages/main/main';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    // can activate
    children: [
      {
        path: '',
        redirectTo: 'chats',
        pathMatch: 'full',
      },
      {
        path: 'chats',
        loadComponent: () => import('@pages/chat/chat').then((m) => m.Chat),
      },
    ],
  },
];
