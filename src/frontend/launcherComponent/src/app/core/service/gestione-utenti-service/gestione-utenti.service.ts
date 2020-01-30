import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../shared/interface/add-ruolo-utente.interface';

const API_URL = environment.apiUrl.utenti;

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor(private http: HttpClient) {
    }

    getUtentiVVF(text: string): Observable<UtenteVvfInterface[]> {
        const url = !text ? API_URL : API_URL + '/?text=' + text;
        return this.http.get<UtenteVvfInterface[]>(url).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    getListaUtentiGestione(filters: any): Observable<ResponseInterface> {
        return this.http.post<ResponseInterface>(API_URL, filters).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    getUtente(id: string): Observable<Utente> {
        return this.http.get<Utente>(API_URL + '/' + id).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    updateUtente(utente: Utente): Observable<Utente> {
        return this.http.post<Utente>(API_URL + '/Update', utente).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    removeUtente(id: string) {
        return this.http.post<Utente>(API_URL + '/RemoveUtente', id).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    addUtente(value: AddRuoloUtenteInterface): Observable<Utente> {
        return this.http.post<Utente>(API_URL + '/AddUtente', value).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    removeRuoloUtente(id: string, ruolo: Ruolo) {
        return this.http.post<Utente>(API_URL + '/RemoveRuolo', id).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
