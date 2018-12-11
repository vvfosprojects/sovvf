import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste.backend;

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getRichieste(): Observable<any> {
        /* Genero le richieste nel backend */
        return this.http.get('http://win10dev-pc/so115/api/GeneraSintesiRichiesteAssistenza').pipe(
            catchError(this.handleError)
        );

        /* Ritorno le richieste "paginate" */
        /* return this.http.get('http://win10dev-pc/so115/api/SintesiRichiesteAssistenza?SearchKey=\'R0\'&RichiestaSingola=true').pipe(
            catchError(this.handleError)
        ); */
        /* const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };

        let body = {
            SearchKey: "R0",
            RichiestaSingola: "true"
        }

        return this.http.post(API_URL_RICHIESTE, JSON.stringify(body), httpOptions).pipe(
            map((data: any) => {
                console.log('Service: ' + data);
                const richieste = data;
                return richieste;
            }),
            // retry(3),
            catchError(this.handleError)
        ); */

        /* return this.http.get(API_URL_RICHIESTE).pipe(
            map((data: any) => {
                console.log('Service: ' + data);
                const richieste = data;
                return richieste;
            }),
            retry(3),
            catchError(this.handleError)
        ); */
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
