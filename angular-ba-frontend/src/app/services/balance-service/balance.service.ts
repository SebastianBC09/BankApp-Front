import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AccountBalanceData {
  accountId: string;
  accountNumber: string;
  accountType: string;
  balance: string;
  currency: string;
  status: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private apiGatewayBaseUrl = environment.apiGatewayUrl; // ej. http://localhost:3000/api

  constructor(private http: HttpClient) {}

  getAccountBalance(): Observable<AccountBalanceData> {
    // El token se adjuntará automáticamente por AuthHttpInterceptor si está configurado
    // para las rutas del API Gateway.

    // La ruta completa que expone el API Gateway
    const fullEndpointUrl = `${this.apiGatewayBaseUrl}/account/balance`;

    return this.http.get<ApiResponse<AccountBalanceData>>(fullEndpointUrl).pipe(
      map(response => {
        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Error al obtener el saldo desde el servicio Angular');
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en BalanceService (Angular):', error);
    const errorMessage = error.error?.message || error.message || 'Error desconocido del servidor al llamar a la API';
    return throwError(() => new Error(errorMessage));
  }
}
