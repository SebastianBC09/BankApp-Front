import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DatabaseUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  auth0Id: string;
}

export interface MeResponse {
  message: string;
  auth0UserSub: string;
  databaseUser: DatabaseUser;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3001/api/test/me';

  getMe(): Observable<MeResponse> {
    console.log('DEBUG HttpClient URL EXACTA:', this.apiUrl);
    return this.http.get<MeResponse>(this.apiUrl);
  }
}
