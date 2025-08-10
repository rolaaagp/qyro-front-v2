import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces';

interface Response {
  data: {
    user: User | null;
  };
}

interface CheckEmailResponse {
  exists: boolean;
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthQyroService {
  private baseUrl = `${environment.API_URL}/auth`;

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<CheckEmailResponse> {
    return this.http.post<CheckEmailResponse>(`${this.baseUrl}/check-user/`, {
      email,
    });
  }
}
