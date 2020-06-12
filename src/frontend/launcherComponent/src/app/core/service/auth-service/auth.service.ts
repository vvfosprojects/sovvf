import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Utente } from '../../../shared/model/utente.model';

const API_AUTH = environment.baseUrl + environment.apiUrl.auth;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    ticketLogin(ticket: string, service: string): Observable<Utente> {
        return this.http.post<Utente>(`${API_AUTH}/TicketLogin`, { ticket, service });
    }

    login(username: string, password: string): Observable<Utente> {
        return this.http.post<Utente>(`${API_AUTH}/Login`, { username, password });
    }
}
