import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './shared/components/login-button/login-button.component';
import { LogoutButtonComponent } from './shared/components/logout-button/logout-button.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, LoginButtonComponent, LogoutButtonComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ba-frontend';

  public auth = inject(AuthService);

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getYear() {
    return new Date().getFullYear();
  }
}
