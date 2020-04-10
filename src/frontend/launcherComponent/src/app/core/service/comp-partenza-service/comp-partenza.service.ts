import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { FiltriComposizione } from '../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ListaComposizioneAvanzata } from '../../../features/home/composizione-partenza/interface/lista-composizione-avanzata-interface';
import { ConfermaPartenze } from '../../../features/home/composizione-partenza/interface/conferma-partenze-interface';
import { IdPreaccoppiati } from '../../../features/home/composizione-partenza/interface/id-preaccoppiati-interface';
import { ComposizioneFilterbar } from '../../../features/home/composizione-partenza/interface/composizione/composizione-filterbar-interface';

const BASE_URL = environment.baseUrl;
const API_URL_PREACCOPPIATI = BASE_URL + environment.apiUrl.composizione.preaccoppiati;
const API_URL_AVANZATA = BASE_URL + environment.apiUrl.composizione.avanzata;
const API_URL_PRENOTAZIONE = BASE_URL + environment.apiUrl.composizione.prenotazione;
const API_URL_CONFERMA_PARTENZA = BASE_URL + environment.apiUrl.composizione.confermaPartenze;

@Injectable()
export class CompPartenzaService {

    constructor(private http: HttpClient) {
    }

    getPreAccoppiati(): Observable<IdPreaccoppiati[]> {
        return this.http.get<IdPreaccoppiati[]>(API_URL_PREACCOPPIATI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    // Todo: modificare nome in getListeComposizione ?
    getListeComposizioneAvanzata(filtri: ComposizioneFilterbar): Observable<ListaComposizioneAvanzata> {
        return this.http.post<ListaComposizioneAvanzata>(API_URL_AVANZATA, filtri).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    setMezzoPrenotato(mezzoPrenotatoObj: any) {
        return this.http.post(`${API_URL_PRENOTAZIONE}/PrenotaMezzo`, mezzoPrenotatoObj).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    removeMezzoPrenotato(mezzoPrenotatoObj: any) {
        return this.http.post(`${API_URL_PRENOTAZIONE}/SbloccaMezzo`, mezzoPrenotatoObj).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    confermaPartenze(partenze: ConfermaPartenze) {
        return this.http.post(API_URL_CONFERMA_PARTENZA, partenze).pipe(
            // retry(3),
            catchError(handleError)
        );
    }
}
