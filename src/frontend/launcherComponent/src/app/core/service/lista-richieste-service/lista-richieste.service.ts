import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste;
const API_URL_MODIFICA = environment.apiUrl.updateRichiesta;
const API_URL_AGGIORNA_STATO_MEZZO = environment.apiUrl.gestionePartenza.aggiornaStatoMezzo;

@Injectable()
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getRichieste(idUltimaRichiesta?: string): Observable<any> {
        return this.http.get(API_URL_RICHIESTE).pipe(
            retry(3),
            catchError(handleError));
    }

    // public getRichiestaById(): Observable<any> {
    //     return;
    // }

    public patchRichiesta(richiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<any>(API_URL_MODIFICA, richiesta).pipe(
            retry(3),
            catchError(handleError));
    }

    public setMezzoArrivatoSulPosto(obj: any): Observable<any> {
        return this.http.post<any>(API_URL_AGGIORNA_STATO_MEZZO, obj).pipe(
            retry(3),
            catchError(handleError));
    }
}
