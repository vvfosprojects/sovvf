import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const BASE_URL = environment.baseUrl;
const API_URL = BASE_URL + environment.apiUrl.eventiRichieste;

@Injectable()
export class EventiRichiestaService {

    constructor(private http: HttpClient) {
    }

    getEventiRichiesta(idRichiesta: string): Observable<EventoRichiesta[]> {
        const url = `${API_URL}?id=${idRichiesta}`;
        console.log(url);
        return this.http.get<any>(url).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
