import { Routes } from '@angular/router';

import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'videos',
    component: VideoListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'favorites',
    component: FavoriteListComponent,
    canActivate: [authGuard],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];
