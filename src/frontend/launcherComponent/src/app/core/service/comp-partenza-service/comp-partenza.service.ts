import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { MezzoPrenotatoInterface } from '../../../shared/interface/mezzo-prenotato.interface';

const API_URL_COMPOSIZIONE = environment.apiUrl.composizione;

@Injectable()
export class CompPartenzaService {

    constructor(private http: HttpClient) {
    }

    public getPreAccoppiati(): Observable<any> {
        return this.http.get(API_URL_PREACCOPPIATI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    getListeComposizioneAvanzata(object: any): Observable<any> {
        const obj = {
            'CodiceDistaccamento': [],
            'CodiceTipoMezzo': [],
            'CodiceStatoMezzo': [],
            'CodiceMezzo': [],
            'CodiceSquadra': []
        };

        return this.http.post(API_URL_AVANZATA, object).pipe(
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
}
