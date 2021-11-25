import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.baseUrl;
const API_URL_EVENTI = BASE_URL + environment.apiUrl.eventiRichieste;
const API_URL_GESTIONE_RICHIESTA = BASE_URL + environment.apiUrl.gestioneRichiesta;

@Injectable()
export class EventiRichiestaService {

    constructor(private http: HttpClient) {
    }

    getEventiRichiesta(codice: string): Observable<EventoRichiesta[]> {
        return this.http.get<EventoRichiesta[]>(`${API_URL_EVENTI}?id=${codice}`);
    }

    addEventoRichiesta(eventoPayload: { codice: string, text: string }): Observable<any> {
        return this.http.post<any>(API_URL_GESTIONE_RICHIESTA + '/AddLogBook', eventoPayload);
    }

}
