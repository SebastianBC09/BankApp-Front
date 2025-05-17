import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  public auth = inject(AuthService);
  private router = inject(Router);

  userProfile: any = null;
  lastLogin = new Date();
  mainAccountBalance = 2584.75;
  savingsBalance = 5210.50;
  lastFourDigits = '4321';

  quickActions = [
    {
      title: 'Transferencias',
      description: 'Envía dinero fácilmente',
      icon: 'fa-exchange-alt',
      iconClass: 'transfer-icon',
      route: '/transfers'
    },
    {
      title: 'Pagos',
      description: 'Paga servicios y facturas',
      icon: 'fa-file-invoice-dollar',
      iconClass: 'payment-icon',
      route: '/payments'
    },
    {
      title: 'Movimientos',
      description: 'Revisa tus transacciones',
      icon: 'fa-history',
      iconClass: 'history-icon',
      route: '/transactions'
    },
    {
      title: 'Inversiones',
      description: 'Haz crecer tu dinero',
      icon: 'fa-chart-line',
      iconClass: 'investment-icon',
      route: '/investments'
    }
  ];

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userProfile = user;
      }
    });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  register(): void {
    this.auth.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  }

  getUserInitials(): string {
    if (this.userProfile?.name) {
      return this.userProfile.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  viewSavingsDetails(): void {
    this.router.navigate(['/savings']);
  }
}
