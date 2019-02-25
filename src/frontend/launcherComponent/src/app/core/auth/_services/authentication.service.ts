import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utente } from '../../../shared/model/utente.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Utente>;
    private currentUser: Observable<Utente>;
    private isLogged: boolean;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Utente>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Utente {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`/users/authenticate`, { username, password })
            .pipe(map(user => {
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
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
