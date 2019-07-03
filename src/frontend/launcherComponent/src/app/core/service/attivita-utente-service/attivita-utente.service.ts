import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const API_URL = environment.apiUrl.attivitaUtente;


@Injectable()
export class AttivitaUtenteService {


    constructor(private http: HttpClient) {
    }

    public addInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<string>(API_URL + '/AddInLavorazione', { id: sintesiRichiesta.id }).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public deleteInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<string>(API_URL + '/DeleteInLavorazione', { id: sintesiRichiesta.id }).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public addPresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<string>(API_URL + '/AddPresaInCarico', { id: sintesiRichiesta.id }).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public deletePresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<string>(API_URL + '/DeletePresaInCarico', { id: sintesiRichiesta.id }).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
