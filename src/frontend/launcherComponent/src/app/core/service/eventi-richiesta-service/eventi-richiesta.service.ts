import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.baseUrl;
const API_URL = BASE_URL + environment.apiUrl.eventiRichieste;

@Injectable()
export class EventiRichiestaService {

    constructor(private http: HttpClient) {
    }

    getEventiRichiesta(idRichiesta: string): Observable<EventoRichiesta[]> {
        return this.http.get<EventoRichiesta[]>(`${API_URL}?id=${idRichiesta}`);
    }

}
