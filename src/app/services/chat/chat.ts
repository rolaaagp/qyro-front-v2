import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type { IChat, IMessages } from '@interfaces/chat.interface';
import { UserContextService } from '@context/user.context';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IChat[]> {
    return this.http.get<IChat[]>(
      `${this.baseUrl}/app/chat?uId=${UserContextService.user?.id}`,
    );
  }

  create(payload: {
    username: string;
    message: string;
  }): Observable<IMessages> {
    return this.http.post<IMessages>(`${this.baseUrl}/app/chat`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/app/chat/${id}`);
  }

  getAllMessages(chat_id: number): Observable<IMessages[]> {
    return this.http.get<IMessages[]>(
      `${this.baseUrl}/app/messages?chat_id=${chat_id}`,
    );
  }

  createMessage(payload: {
    chat_id: number;
    message: string;
  }): Observable<IMessages> {
    return this.http.post<IMessages>(`${this.baseUrl}/app/messages`, payload);
  }
}
