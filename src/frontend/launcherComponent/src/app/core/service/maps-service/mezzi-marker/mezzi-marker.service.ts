import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import { MezzoMarker } from '../../../../features/home/maps/maps-model/mezzo-marker.model';

const API_URL_MEZZI = environment.apiUrl.maps.markers.mezzi;

@Injectable()
export class MezziMarkerService {

    /**
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor(private http: HttpClient) {
    }

    public getMezziMarkers(): Observable<MezzoMarker[]> {
        return this.http.get<MezzoMarker[]>(API_URL_MEZZI).pipe(
            map((data: MezzoMarker[]) => {
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
            'API MezziMarker: qualcosa è andato storto, per favore riprova più tardi.');
    }
}
