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
import { PaginationInterface } from 'src/app/shared/interface/pagination.interface';
import { FiltersInterface } from 'src/app/shared/interface/filters.interface';

const API_URL = environment.apiUrl.gestioneUtenti;
const API_URL_RUOLO = environment.apiUrl.gestioneRuolo;
const API_URL_PERSONALE_VVF = environment.apiUrl.personaleVVF;

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor(private http: HttpClient) {
    }

    getUtentiVVF(text: string): Observable<UtenteVvfInterface[]> {
        const url = !text ? API_URL_PERSONALE_VVF : API_URL_PERSONALE_VVF + '?text=' + text;
        return this.http.get<UtenteVvfInterface[]>(url).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    getListaUtentiGestione(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj = {
            filters,
            pagination
        };
        return this.http.post<ResponseInterface>(API_URL + '/GetUtenti', obj).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    addUtente(addUtente: AddRuoloUtenteInterface): Observable<Utente> {
        return this.http.post<Utente>(API_URL + '/AddUtente', addUtente).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    removeUtente(codFiscale: string) {
        return this.http.delete<any>(API_URL + '?codFiscale=' + codFiscale).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    addRuoloUtente(addRuolo: AddRuoloUtenteInterface): Observable<Utente> {
        return this.http.post<Utente>(API_URL_RUOLO + '/AddRuolo', addRuolo).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    removeRuoloUtente(codFiscale: string, ruolo: Ruolo) {
        const obj = {
            codFiscale,
            ruolo
        };
        return this.http.post<Utente>(API_URL_RUOLO + '/DeleteRuolo', obj).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
