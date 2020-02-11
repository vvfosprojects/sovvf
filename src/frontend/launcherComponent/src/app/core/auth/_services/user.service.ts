import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Utente } from '../../../shared/model/utente.model';
import { Observable } from 'rxjs';

const API_URL_USERS = environment.apiUrl.utenti;


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Utente[]> {
        return this.http.get<Utente[]>(`${API_URL_USERS}`);
    }

    getById(id: string): Observable<Utente> {
        return this.http.get<Utente>(`${API_URL_USERS}/${id}`);
    }
}
