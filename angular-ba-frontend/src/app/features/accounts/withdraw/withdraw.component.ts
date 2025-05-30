import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import {
  WithdrawPayload,
  WithdrawService,
  WithdrawSuccessData
} from '../../../services/withdraw-service/withdraw.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-withdraw',
  imports: [FormsModule, CommonModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent implements OnInit{
  withdrawAmount: number | null = null;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  lastWithdrawDetails: WithdrawSuccessData | null = null;
  isAuthenticated$: Observable<boolean>;

  constructor(
    public auth: AuthService,
    private withdrawService: WithdrawService
  ) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  ngOnInit(): void {
  }

  onSubmitWithdraw(withdrawForm: NgForm) {
    if(!withdrawForm.valid || this.withdrawAmount === null || this.withdrawAmount <= 0) {
      this.errorMessage = 'Por favor, ingrese un monto de retiro válido y mayor a cero.';
      this.successMessage = null;
      this.lastWithdrawDetails = null;
      Object.values(withdrawForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.lastWithdrawDetails = null;

    const payload: WithdrawPayload = {
      amount: this.withdrawAmount
    };

    this.withdrawService.makeWithdrawal(payload).subscribe({
      next: (data: WithdrawSuccessData) => {
        this.isLoading = false;
        this.successMessage = `Retiro de ${data.amountWithdrawn} ${data.currency} exitoso. Nuevo saldo: ${data.newBalance}.`;
        this.lastWithdrawDetails = data;
        // this.withdrawAmount = null; // Limpiar el campo
        withdrawForm.resetForm();
        console.log('Respuesta del retiro en el componente:', data);
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Ocurrió un error desconocido al procesar el retiro.';
        console.error('Error en el retiro en el componente:', error);
      },
      complete: () => {
        if(this.isLoading) {
          this.isLoading = false;
        }
        console.log('Operación de retiro completada (observable).');
      }
    });
  }
}
