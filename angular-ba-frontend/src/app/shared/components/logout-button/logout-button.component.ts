import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-logout-button',
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css'
})
export class LogoutButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

  handleLogout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.document.location.origin
      }
      }
    )
  }
}
