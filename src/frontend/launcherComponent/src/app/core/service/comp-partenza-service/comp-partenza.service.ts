import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL_COMPOSIZIONE = environment.apiUrl.composizione;

@Injectable()
export class CompPartenzaService {

    constructor(private http: HttpClient) {
    }

    getPreAccoppiati(filtri: any): Observable<any> {
        return this.http.post(API_URL_COMPOSIZIONE.preaccoppiati, filtri).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    getListeComposizioneAvanzata(filtri: any): Observable<any> {
        return this.http.post(API_URL_COMPOSIZIONE.avanzata, filtri).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    setMezzoPrenotato(mezzoPrenotatoObj: any) {
        return this.http.post(API_URL_COMPOSIZIONE.addPrenotazioneMezzo, mezzoPrenotatoObj).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    resetMezzoPrenotato(mezzoPrenotatoObj: any) {
        return this.http.post(API_URL_COMPOSIZIONE.resetPrenotazioneMezzo, mezzoPrenotatoObj).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    removeMezzoPrenotato(mezzoPrenotatoObj: any) {
        return this.http.post(API_URL_COMPOSIZIONE.removePrenotazioneMezzo, mezzoPrenotatoObj).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    confermaPartenze(partenze: any) {
        return this.http.post(API_URL_COMPOSIZIONE.confermaPartenze, partenze).pipe(
            // retry(3),
            catchError(handleError)
        );
    }
}
