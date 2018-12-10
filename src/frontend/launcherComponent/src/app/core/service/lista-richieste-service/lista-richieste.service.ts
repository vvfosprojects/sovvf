import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste.backend;

const headers = new HttpHeaders({
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getRichieste(): Observable<any> {
        const body = new HttpParams().set('SearchKey', 'R0').set('RichiestaSingola', 'false');
        /* const body = {
            'SearchKey': 'R0',
            'RichiestaSingola': 'false'
        }; */
        return this.http.post(API_URL_RICHIESTE, body, httpOptions).pipe(
            map((data: any) => {
                console.log('Service: ' + data.SintesiRichiesta);
                const richieste = data.SintesiRichiesta;
                return richieste;
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
