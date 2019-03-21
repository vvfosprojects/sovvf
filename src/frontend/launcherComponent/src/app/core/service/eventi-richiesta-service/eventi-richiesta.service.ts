import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventoRichiesta } from '../../../features/home/eventi/eventi-model/evento-richiesta.model';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.eventiRichieste;

@Injectable()
export class EventiRichiestaService {

    constructor(private http: HttpClient) {
    }

    getEventiRichiesta(idRichiesta: string): Observable<EventoRichiesta[]> {
        return this.http.get<EventoRichiesta[]>(API_URL).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
