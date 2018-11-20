import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

const API_URL_MEZZI = environment.apiUrl.maps.markers.mezzi;

@Injectable({
    providedIn: 'root'
})
export class MezziMarkerService {

    /**
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor(private http: HttpClient) {
    }

    public getMezziMarkers(): Observable<any> {
        return this.http.get(API_URL_MEZZI).pipe(
            map((data: any) => {
                const mezziMarker = data;
                return mezziMarker;
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
            'API MezziMarker: qualcosa è andato storto, per favore riprova più tardi.');
    }
}
