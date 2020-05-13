import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const BASE_URL = environment.baseUrl;
const API_URL = BASE_URL + environment.apiUrl.attivitaUtente;

@Injectable()
export class AttivitaUtenteService {


    constructor(private http: HttpClient) {
    }

    public addInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/AddInLavorazione', sintesiRichiesta).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    public deleteInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/DeleteInLavorazione', sintesiRichiesta).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    public addPresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/AddPresaInCarico', sintesiRichiesta).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    public deletePresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/DeletePresaInCarico', sintesiRichiesta).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
