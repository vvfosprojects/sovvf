import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Utente } from '../../../shared/model/utente.model';

const API_URL_USERS = environment.apiUrl; // mancante


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Utente[]>(`${API_URL_USERS}`);
    }

    getById(id: string) {
        return this.http.get<Utente>(`${API_URL_USERS}/${id}`);
    }
}
