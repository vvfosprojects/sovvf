import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.genera;
const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable({
    providedIn: 'root'
})
export class GeneraTestService {

    constructor(private http: HttpClient) {
    }

    public getRichiesteStatus(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE, httpOptions).pipe(
            map((data: any) => {
                // console.log(data);
                return data;
            }),
            retry(3),
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
            'API Richieste Status: qualcosa è andato storto, per favore riprova più tardi.');
    }
}
