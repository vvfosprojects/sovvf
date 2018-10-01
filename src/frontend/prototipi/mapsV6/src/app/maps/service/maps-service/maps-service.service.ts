import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;
const API_URL_SEDI = environment.apiUrl.maps.markers.sedi;
const API_URL_MEZZI = environment.apiUrl.maps.markers.mezzi;

@Injectable({
    providedIn: 'root'
})
export class MapsService {

    constructor(private http: HttpClient) {
    }

    getRichiesteMarker(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getSediMarker(): Observable<any> {
        return this.http.get(API_URL_SEDI).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getMezziMarker(): Observable<any> {
        return this.http.get(API_URL_MEZZI).pipe(
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
