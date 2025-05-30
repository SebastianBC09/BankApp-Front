import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountBalanceData, BalanceService } from '../../../services/balance-service/balance.service';
import {catchError, Observable, Subject, takeUntil, tap, throwError} from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-balance-inquiry',
  imports: [CommonModule, FormsModule],
  templateUrl: './balance-inquiry.component.html',
  styleUrl: './balance-inquiry.component.css'
})
export class BalanceInquiryComponent {
  accountBalanceData: AccountBalanceData | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isAuthenticated$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(
    public auth: AuthService, // Public para usar en la plantilla con el pipe async
    private balanceService: BalanceService
  ) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  ngOnInit(): void {
    // Podrías cargar algún dato inicial aquí si fuera necesario
    // o verificar el estado de autenticación para alguna lógica específica del componente
  }

  checkBalance(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.accountBalanceData = null;

    this.balanceService.getAccountBalance()
      .pipe(
        takeUntil(this.destroy$), // Para cancelar la suscripción automáticamente en ngOnDestroy
        tap(data => { // tap es útil para efectos secundarios como logging o antes de la asignación
          this.accountBalanceData = data;
          this.isLoading = false;
          // console.log('Balance data received:', data); // Para depuración
        }),
        catchError(err => {
          this.errorMessage = err.message || 'Ocurrió un error al consultar el saldo.';
          this.isLoading = false;
          // console.error('Error fetching balance:', err); // Para depuración
          return throwError(() => err); // Re-lanzar el error para otros manejadores si es necesario
        })
      )
      .subscribe(
        // El 'next' handler ya está cubierto por el 'tap'
        // El 'error' handler ya está cubierto por 'catchError'
        // El 'complete' handler no es estrictamente necesario aquí
      );
  }

  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) {
      return '**** **** **** ****';
    }

    const lastFour = accountNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
