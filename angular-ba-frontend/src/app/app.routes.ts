import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { UserProfileComponent } from './features/profile/user-profile/user-profile.component';
import {HomeComponent} from './features/home/home/home.component';

export const routes: Routes = [
  { path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  }
];
