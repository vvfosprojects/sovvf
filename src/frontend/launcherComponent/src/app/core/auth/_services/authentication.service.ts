import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Utente } from '../../../shared/model/utente.model';

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
        return this.http.post<any>(`/api/auth/Login`, { 'username': username, 'password': password });
    }

    _isLogged() {
        return this.isLogged = !!localStorage.getItem(this.localName);
    }

    logout() {
        localStorage.removeItem(this.localName);
        this.currentUserSubject.next(null);
    }
}
