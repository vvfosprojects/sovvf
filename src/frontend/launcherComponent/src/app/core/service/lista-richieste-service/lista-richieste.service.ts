import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste;
const API_CHIAMATA = environment.apiUrl.chiamata;
const API_GESTIONE_RICHIESTA = environment.apiUrl.gestioneRichiesta;
const API_GESTIONE_PARTENZA = environment.apiUrl.gestionePartenza;

@Injectable()
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    // TodoBackEnd: check esistenza controller
    public getRichieste(idUltimaRichiesta?: string): Observable<any> {
        return this.http.get(API_URL_RICHIESTE).pipe(
            retry(3),
            catchError(handleError));
    }

    public getRichiestaById(id: string): Observable<SintesiRichiesta> {
        return this.http.get<SintesiRichiesta>(`${API_GESTIONE_RICHIESTA}/GetRichiesta?idRichiesta=${id}`).pipe(
            retry(3),
            catchError(handleError));
    }

    public patchRichiesta(richiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<any>(`${API_CHIAMATA}/UpdateIntervento`, richiesta).pipe(
            retry(3),
            catchError(handleError));
    }

    public aggiornaStatoRichiesta(obj: any): Observable<any> {
        return this.http.post<any>(`${API_GESTIONE_RICHIESTA}/AggiornaStato`, obj).pipe(
            retry(3),
            catchError(handleError));
    }

    public aggiornaStatoMezzo(obj: any): Observable<any> {
        return this.http.post<any>(`${API_GESTIONE_PARTENZA}/AggiornaPartenza`, obj).pipe(
            retry(3),
            catchError(handleError));
    }
}
