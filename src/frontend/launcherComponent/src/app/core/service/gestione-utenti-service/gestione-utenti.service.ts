import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GestioneUtente } from '../../../shared/interface/gestione-utente.interface';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from '../../../shared/interface/response.interface';

const API_URL = environment.apiUrl.utentiGestione;

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor(private http: HttpClient) {
    }

    getUtenti(filters: any): Observable<ResponseInterface> {
        return this.http.post<ResponseInterface>(API_URL, filters).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    getUtente(id: string): Observable<GestioneUtente> {
        return this.http.get<GestioneUtente>(API_URL + '/' + id).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    updateUtente(utente: GestioneUtente): Observable<GestioneUtente> {
        return this.http.post<GestioneUtente>(API_URL + '/Update', utente).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    addUtente(utente: GestioneUtente) {
        return this.http.post<GestioneUtente>(API_URL + '/Add', utente).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    removeUtente(id: string) {
        return this.http.post<GestioneUtente>(API_URL + '/Remove', id).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
