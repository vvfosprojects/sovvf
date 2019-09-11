import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Utente } from '../../../shared/model/utente.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const API_AUTH = environment.apiUrl.auth;


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    currentUserSubject: BehaviorSubject<Utente>;
    private isLogged: boolean;
    private localName = 'userSO115';

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Utente>(JSON.parse(localStorage.getItem(this.localName)));
    }

    public get currentUserValue(): Utente {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${API_AUTH}/Login`, { 'username': username, 'password': password }).pipe(map(response => {
            if (response && response.token) {
                localStorage.setItem(this.localName, JSON.stringify(response));
                this.currentUserSubject.next(response);
            }
            if (response) {
                return response;
            }
        }));
    }

    _isLogged() {
        return this.isLogged = !!localStorage.getItem(this.localName);
    }

    logout() {
        localStorage.removeItem(this.localName);
        this.currentUserSubject.next(null);
    }
}
