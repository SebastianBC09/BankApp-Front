import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-logout-button',
  imports: [CommonModule],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css'
})
export class LogoutButtonComponent {
  isLoading = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  async handleLogout(): Promise<void> {
    try {
      this.isLoading = true;
      this.auth.logout({
        logoutParams: {
          returnTo: this.document.location.origin
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
