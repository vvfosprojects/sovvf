import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

const API_URL_CENTRO = environment.apiUrl.maps.markers.centro;

@Injectable({
    providedIn: 'root'
})
export class CentroMappaService {

    constructor(private http: HttpClient) {
    }

    public getCentroMappa(): Observable<any> {
        return this.http.get(API_URL_CENTRO).pipe(
            map((data: any) => {
                const centroMappa = data;
                return centroMappa;
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
            'API CentroMappa: qualcosa è andato storto, per favore riprova più tardi.');
    }
}
