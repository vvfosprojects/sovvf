import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

const API_URL_SEDI = environment.apiUrl.maps.markers.sedi;

@Injectable({
    providedIn: 'root'
})
export class SediMarkerService {

    /**
     *
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor(private http: HttpClient) {
    }

    getSediMarkers(): Observable<any> {
        return this.http.get(API_URL_SEDI).pipe(
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
