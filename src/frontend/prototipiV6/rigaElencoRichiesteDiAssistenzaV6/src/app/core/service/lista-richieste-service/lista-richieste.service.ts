import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste;

const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getRichieste(idUltimaRichiesta?: any): Observable<any> {
        return this.http.get(API_URL_RICHIESTE + '?SearchKey=' + idUltimaRichiesta + '&RichiestaSingola=false', httpOptions).pipe(
            map((data: any) => {
                const richieste = data.SintesiRichiesta;
                return richieste;
                // TEST
                // console.log('Service Lista Richieste: ', data.SintesiRichiesta);
            }),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('Si è verificato un errore:', error.message);
        } else {
            console.error(
                `Errore response: ${error.status}, ` +
                `Messaggio body: ${error.message}`);
        }
        return throwError(
            'API Richieste: Qualcosa è andato storto, per favore riprova più tardi.');
    }
}
