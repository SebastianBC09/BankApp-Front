import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, MeResponse } from '../../../core/services/user.service';
import { Observable, Subject, takeUntil, map, catchError } from 'rxjs';

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

  backendUser$: Observable<MeResponse> | undefined;
  isLoadingBackendUser = false;
  backendUserError: Error | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
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
    this.backendUser$ = this.userService.getMe().pipe(
      map(user => {
        this.isLoadingBackendUser = false;
        return user;
      }),
      catchError(error => {
        this.isLoadingBackendUser = false;
        this.backendUserError = new Error('Failed to load user profile');
        console.error('Error fetching backend user:', error);
        throw error;
      }),
      takeUntil(this.destroy$)
    );
  }
}
