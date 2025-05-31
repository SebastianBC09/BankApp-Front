import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { HomeComponent } from './features/home/home/home.component';
import { UserProfileComponent } from './features/profile/user-profile/user-profile.component';
import {BalanceInquiryComponent} from './features/accounts/balance-inquiry/balance-inquiry.component';
import {DepositComponent} from './features/accounts/deposit/deposit.component';
import {WithdrawComponent} from './features/accounts/withdraw/withdraw.component';

export const routes: Routes = [
  { path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/balance',
    component: BalanceInquiryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/deposit',
    component: DepositComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/withdraw',
    component: WithdrawComponent,
    canActivate: [AuthGuard],
  }
];
