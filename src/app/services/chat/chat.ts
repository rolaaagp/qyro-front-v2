import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type { IChat } from '@interfaces/chat.interface';
import { UserContextService } from '@context/user.context';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IChat[]> {
    return this.http.get<IChat[]>(
      `${this.baseUrl}/app/chat?uId=${UserContextService.user?.id}`
    );
  }

  create(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
