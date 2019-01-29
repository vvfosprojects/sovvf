import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

const API_URL_TURNO = environment.apiUrl.turno;


@Injectable({
    providedIn: 'root'
})
export class TurnoService {

    constructor(private http: HttpClient) {
    }

    getTurni(): Observable<any> {
        return this.http.get(API_URL_TURNO).pipe(
            map((data: any) => {
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
            'API Turno: qualcosa è andato storto, per favore riprova più tardi.');
    }
}
