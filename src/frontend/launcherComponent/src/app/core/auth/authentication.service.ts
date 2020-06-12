import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ClearUtente, SetUtente } from '../../features/navbar/store/actions/operatore/utente.actions';
import { Store } from '@ngxs/store';
import { UtenteState } from '../../features/navbar/store/states/operatore/utente.state';
import { StartLoading, StopLoading } from '../../shared/store/actions/loading/loading.actions';
import { RouterState } from '@ngxs/router-plugin';
import { LSNAME } from '../settings/config';
import { Observable } from 'rxjs';
import { Utente } from '../../shared/model/utente.model';

const BASE_URL = environment.baseUrl;
const API_AUTH = BASE_URL + environment.apiUrl.auth;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private http: HttpClient,
                private store: Store) {
        const userLocalStorage = JSON.parse(sessionStorage.getItem(LSNAME.currentUser));
        if (userLocalStorage) {
            this.store.dispatch(new SetUtente(userLocalStorage));
        }
    }

    login(username: string, password: string): Observable<Utente> {
        this.store.dispatch(new StartLoading());
        return this.http.post<Utente>(`${API_AUTH}/Login`, { username, password }).pipe(
            map(response => {
                if (response && response.token) {
                    this.store.dispatch(new SetUtente(response));
                }
                if (response) {
                    return response;
                }
                this.store.dispatch(new StopLoading());
            }));
    }

    ticketLogin(ticket: string, service: string): Observable<Utente> {
        return this.http.post<Utente>(`${API_AUTH}/TicketLogin`, { ticket, service });
    }

    logout() {
        const utente = this.store.selectSnapshot(UtenteState.utente);
        const homeUrl = this.store.selectSnapshot(RouterState.url);
        if (utente) {
            this.store.dispatch(new ClearUtente(homeUrl !== '/home'));
        }
    }
}
