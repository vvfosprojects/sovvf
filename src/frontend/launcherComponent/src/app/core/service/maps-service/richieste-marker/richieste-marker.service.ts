import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;
const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };
@Injectable()
export class RichiesteMarkerService {


    /**
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE, httpOptions).pipe(
            map((data: any) => {
                console.log('Service Marker Richieste: ', data.SintesiRichiestaMarker);
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
