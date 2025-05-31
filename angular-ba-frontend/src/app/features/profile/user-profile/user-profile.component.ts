import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    JsonPipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  standalone: true
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly auth: AuthService;

  showTechnicalDetails = false;
  isLoadingBackendUser = false;

  constructor(
    private readonly authService: AuthService,
  ) {
    this.auth = this.authService;
  }

  ngOnInit(): void {
    this.initializeUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTechnicalDetails(): void {
    this.showTechnicalDetails = !this.showTechnicalDetails;
  }

  private initializeUserProfile(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.loadBackendUser();
        }
      });
  }

  private loadBackendUser(): void {
    this.isLoadingBackendUser = true;
    setTimeout(() => {
      this.isLoadingBackendUser = false;
    }, 1000);
  }
}
