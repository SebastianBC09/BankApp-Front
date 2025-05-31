import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-button',
  imports: [CommonModule],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.css'
})
export class LoginButtonComponent {
  isLoading = false;

  constructor(public auth: AuthService) {}

  async handleLogin() {
    try {
      this.isLoading = true;
      await this.auth.loginWithRedirect();
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
