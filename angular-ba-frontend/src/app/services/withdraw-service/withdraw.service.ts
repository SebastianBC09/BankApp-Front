import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: any;
  stack?: string;
}

export interface WithdrawPayload {
  amount: number;
}

export interface WithdrawSuccessData {
  accountId: string;
  accountNumber: string;
  newBalance: string;
  currency: string;
  amountWithdrawn: string;
}

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {
  private apiGatewayBaseUrl = environment.apiGatewayUrl;

  constructor(
    private http: HttpClient
  ) { }

  makeWithdrawal(payload: WithdrawPayload): Observable<WithdrawSuccessData> {
    const withdrawalUrl = `${this.apiGatewayBaseUrl}/account/withdraw`;
    return this.http.post<ApiResponse<WithdrawSuccessData>>(withdrawalUrl, payload)
      .pipe(
        tap(response =>console.log('WithdrawService: Respuesta cruda del retiro:', response)),
        map(response => {
          if (response.status === 'success' && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'La operación de retiro no fue exitosa.');
        }),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido al procesar el retiro.';
    if(error instanceof HttpErrorResponse) {
      console.error('WithdrawService: Error en la solicitud HTTP:', error);
      if(error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión o intente más tarde.';
      } else if(error.error && typeof error.error.message === 'string') {
        errorMessage = `Error ${error.status}: ${error.error.message}`;
      } else if(error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Error del servidor ${error.status}. Por favor, intente más tarde.`;
      }
    } else {
      {
        console.error('WithdrawService: Error procesando la respuesta:', error);
        errorMessage = error.message;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
