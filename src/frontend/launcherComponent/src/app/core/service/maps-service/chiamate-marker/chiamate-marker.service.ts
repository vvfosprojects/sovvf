import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';

const API_CHIAMATE_MARKER = environment.apiUrl.chiamata.marker;

@Injectable()
export class ChiamateMarkerService {

    constructor(private http: HttpClient) {
    }

    getChiamateMarkers(): Observable<any> {
        return this.http.get(API_CHIAMATE_MARKER).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    setChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_CHIAMATE_MARKER + '/Add', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    deleteChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_CHIAMATE_MARKER + '/Delete', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    updateChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_CHIAMATE_MARKER + '/Update', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
