import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SetUtente } from '../../../features/navbar/store/actions/operatore/utente.actions';
import { Store } from '@ngxs/store';
import { UtenteState } from '../../../features/navbar/store/states/operatore/utente.state';

const API_AUTH = environment.apiUrl.auth;


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private isLogged: boolean;
    localName: string;

    constructor(private http: HttpClient,
                private store: Store) {
        this.localName = this.store.selectSnapshot(UtenteState.localName);
        this.store.dispatch(new SetUtente(JSON.parse(localStorage.getItem(this.localName))));
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${API_AUTH}/Login`, { 'username': username, 'password': password }).pipe(map(response => {
            if (response && response.token) {
                this.store.dispatch(new SetUtente(response));
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
        return;
    }
}
