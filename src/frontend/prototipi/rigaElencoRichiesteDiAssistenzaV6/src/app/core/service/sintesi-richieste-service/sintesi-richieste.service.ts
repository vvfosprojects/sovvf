import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste.fake;

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getRichieste(): Observable<any> {
        let a;
        return this.http.get(API_URL_RICHIESTE).pipe(
            map(data => {
                a = data;
                return a;
            }),
            retry(3),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('Si è verificato un errore:', error.error.message);
        } else {
            console.error(
                `Errore response: ${error.status}, ` +
                `Messaggio body: ${error.error.message}`);
        }
        return throwError(
            'Qualcosa è andato storto, per favore riprova più tardi.');
    }
}
