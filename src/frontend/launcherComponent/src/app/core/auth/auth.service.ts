import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { StartLoading, StopLoading } from '../../shared/store/actions/loading/loading.actions';
import { RouterState } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { Utente } from '../../shared/model/utente.model';
import { Logout, SetCurrentJwt, SetCurrentUser } from '../../features/auth/store/auth.actions';

const BASE_URL = environment.baseUrl;
const API_AUTH = BASE_URL + environment.apiUrl.auth;
const API_URL_CHIAMATA = BASE_URL + environment.apiUrl.markerChiamataInCorso;

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient,
                private store: Store) {
    }

    login(username: string, password: string): Observable<Utente> {
        this.store.dispatch(new StartLoading());
        return this.http.post<Utente>(`${API_AUTH}/Login`, { username, password }).pipe(
            map(response => {
                if (response && response.token) {
                    this.store.dispatch([
                        new SetCurrentJwt(response.token),
                        new SetCurrentUser(response),
                    ]);
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

    clearUserData(): Observable<any> {
        return this.http.get<any>(`${API_URL_CHIAMATA}/DeleteAll`);
    }

    logout() {
        const homeUrl = this.store.selectSnapshot(RouterState.url);
        this.store.dispatch(new Logout(homeUrl));
    }
}
