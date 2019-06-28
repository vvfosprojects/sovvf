import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl.attivitaUtente;


@Injectable()
export class AttivitaUtenteService {


    constructor(private http: HttpClient) {
    }

    public addInLavorazione(idRichiesta: string): Observable<any> {
        return this.http.post<string>(API_URL + '/AddInLavorazione', idRichiesta).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public deleteInLavorazione(idRichiesta: string): Observable<any> {
        return this.http.post<string>(API_URL + '/DeleteInLavorazione', idRichiesta).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public addPresaInCarico(idRichiesta: string): Observable<any> {
        return this.http.post<string>(API_URL + '/AddPresaInCarico', idRichiesta).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public deletePresaInCarico(idRichiesta: string): Observable<any> {
        return this.http.post<string>(API_URL + '/DeletePresaInCarico', idRichiesta).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
