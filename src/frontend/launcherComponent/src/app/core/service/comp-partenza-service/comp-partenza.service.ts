import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { FiltriComposizione } from '../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ListaComposizioneAvanzata } from '../../../features/home/composizione-partenza/interface/lista-composizione-avanzata-interface';
import { ConfermaPartenze } from '../../../features/home/composizione-partenza/interface/conferma-partenze-interface';

const API_URL_COMPOSIZIONE = environment.apiUrl.composizione;

@Injectable()
export class CompPartenzaService {

    constructor(private http: HttpClient) {
    }

    getPreAccoppiati(): Observable<null> {
        // Todo: modificare perchè i filtri non vengono passati, tutti i dati arrivano con il controller getListeComposizioneAvanzata
        return this.http.get<null>(API_URL_COMPOSIZIONE.preaccoppiati).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    // Todo: modificare nome in getListeComposizione ?
    getListeComposizioneAvanzata(filtri: FiltriComposizione): Observable<ListaComposizioneAvanzata> {
        return this.http.post<ListaComposizioneAvanzata>(API_URL_COMPOSIZIONE.avanzata, filtri).pipe(
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

    confermaPartenze(partenze: ConfermaPartenze) {
        return this.http.post(API_URL_COMPOSIZIONE.confermaPartenze, partenze).pipe(
            // retry(3),
            catchError(handleError)
        );
    }
}
