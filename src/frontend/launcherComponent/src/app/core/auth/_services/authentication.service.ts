import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utente } from '../../../shared/model/utente.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Utente>;
    private isLogged: boolean;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Utente>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public get currentUserValue(): Utente {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`/api/auth/Login`, { 'username': username, 'password': password })
            .pipe(map(response => {
                if (response._user && response._user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(response._user));
                    this.currentUserSubject.next(response._user);
                }
                return response._user;
            }));
    }

    _isLogged() {
        return this.isLogged = !!localStorage.getItem('currentUser');
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
