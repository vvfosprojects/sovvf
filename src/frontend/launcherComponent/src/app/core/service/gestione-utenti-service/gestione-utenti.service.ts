import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../shared/interface/add-ruolo-utente.interface';
import { PaginationInterface } from 'src/app/shared/interface/pagination.interface';
import { FiltersInterface } from 'src/app/shared/interface/filters.interface';
import { GestioneUtentiObjInterface } from '../../../shared/interface/gestione-utenti-obj.interface';

const BASE_URL = environment.baseUrl;
const API_URL = BASE_URL + environment.apiUrl.gestioneUtenti;
const API_URL_RUOLO = BASE_URL + environment.apiUrl.gestioneRuolo;
const API_URL_PERSONALE_VVF = BASE_URL + environment.apiUrl.personaleVVF;

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor(private http: HttpClient) {
    }

    getUtentiVVF(text: string): Observable<UtenteVvfInterface[]> {
        const url = !text ? API_URL_PERSONALE_VVF : API_URL_PERSONALE_VVF + '?text=' + text;
        return this.http.get<UtenteVvfInterface[]>(url);
    }

    getUtente(id: string): Observable<{detUtente: Utente}> {
        return this.http.get<{detUtente: Utente}>(API_URL + '/GetUtente?id=' + id);
    }

    getListaUtentiGestione(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj: GestioneUtentiObjInterface = {
            filters: {
                search: filters.search
            },
            pagination,
            codiciSede: filters.codiciSede.join()
        };
        return this.http.post<ResponseInterface>(API_URL + '/GetUtenti', obj);
    }

    addUtente(addUtente: AddRuoloUtenteInterface): Observable<Utente> {
        return this.http.post<Utente>(API_URL + '/AddUtente', addUtente);
    }

    removeUtente(codFiscale: string) {
        const obj = {
            codFiscale
        };
        return this.http.post<any>(API_URL + '/DeleteUtente', obj);
    }

    addRuoloUtente(addRuolo: AddRuoloUtenteInterface): Observable<Utente> {
        return this.http.post<Utente>(API_URL_RUOLO + '/AddRuolo', addRuolo);
    }

    removeRuoloUtente(codFiscale: string, ruolo: Ruolo) {
        const obj = {
            codFiscale,
            ruolo
        };
        return this.http.post<Utente>(API_URL_RUOLO + '/DeleteRuolo', obj);
    }
}
