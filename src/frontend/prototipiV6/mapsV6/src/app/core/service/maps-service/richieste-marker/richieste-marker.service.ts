import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import { Coordinate } from '../../../../shared/model/coordinate.model';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;

@Injectable({
    providedIn: 'root'
})
export class RichiesteMarkerService {


    /**
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE).pipe(
            map((data: any) => {
                return data.SintesiRichiestaMarker;
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
            'API RichiesteMarker: qualcosa è andato storto, per favore riprova più tardi.');
    }
}
