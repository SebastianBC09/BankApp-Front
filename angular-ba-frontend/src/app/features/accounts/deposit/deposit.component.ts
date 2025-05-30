import { Component, OnInit} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepositService, DepositPayload, DepositSuccessData } from '../../../services/deposit-service/deposit.service';
import { Observable} from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule, CommonModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent implements OnInit{
  depositAmount: number | null = null;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  lastDepositDetails: DepositSuccessData | null = null;
  isAuthenticated$: Observable<boolean>;

  constructor(
    public auth: AuthService,
    private depositService: DepositService
  ) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  ngOnInit(): void {
  }

  onSubmitDeposit(depositForm: NgForm) { // Recibe NgForm para poder resetearlo
    if (!depositForm.valid || this.depositAmount === null || this.depositAmount <= 0) {
      this.errorMessage = 'Por favor, ingrese un monto de depósito válido y mayor a cero.';
      this.successMessage = null;
      this.lastDepositDetails = null;
      Object.values(depositForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.lastDepositDetails = null;

    const payload: DepositPayload = {
      amount: this.depositAmount
    };

    this.depositService.makeDeposit(payload).subscribe({
      next: (data: DepositSuccessData) => {
        this.isLoading = false;
        this.successMessage = `Depósito de ${data.amountDeposited} ${data.currency} exitoso. Nuevo saldo: ${data.newBalance}.`;
        this.lastDepositDetails = data;
        // this.depositAmount = null; // Limpiar el campo
        depositForm.resetForm();
        console.log('Respuesta del depósito en el componente:', data);
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Ocurrió un error desconocido al procesar el depósito.';
        console.error('Error en el depósito en el componente:', error);
      },
      complete: () => {
        if (this.isLoading) {
          this.isLoading = false;
        }
        console.log('Operación de depósito completada (observable).');
      }
    });
  }
}
