import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;

const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable({
    providedIn: 'root'
})
export class RichiesteMarkerService {

    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE, httpOptions).pipe(
            map((data: any) => {
                console.log('Service Richieste Marker: ', data.SintesiRichiestaMarker);
                const richiesteMarker = data.SintesiRichiestaMarker;
                return richiesteMarker;
            }),
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
