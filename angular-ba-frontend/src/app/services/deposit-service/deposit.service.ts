import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: any;
  stack?: string;
}

export interface DepositPayload {
  amount: number;
}

export interface DepositSuccessData {
  accountId: string;
  accountNumber: string;
  newBalance: string;
  currency: string;
  amountDeposited: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private apiGatewayBaseUrl = environment.apiGatewayUrl;

  constructor(
    private http: HttpClient
  ) { }

  makeDeposit(payload: DepositPayload): Observable<DepositSuccessData> {
    const depositUrl =  `${this.apiGatewayBaseUrl}/account/deposit`;
    return this.http.post<ApiResponse<DepositSuccessData>>(depositUrl, payload)
      .pipe(
        tap(response => console.log('DepositService: Respuesta cruda del depósito:', response)),
        map(response => {
          if (response.status === 'success' && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'La operación de depósito no fue exitosa.');
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido al procesar el depósito.';
    if (error instanceof HttpErrorResponse) {
      console.error('DepositService: Error en la solicitud HTTP:', error);
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión o intente más tarde.';
      } else if (error.error && typeof error.error.message === 'string') {
        errorMessage = `Error ${error.status}: ${error.error.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Error del servidor ${error.status}. Por favor, intente más tarde.`;
      }
    } else {
      {
        console.error('DepositService: Error procesando la respuesta:', error);
        errorMessage = error.message;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
