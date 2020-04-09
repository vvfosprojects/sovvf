import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';

const BASE_URL = environment.baseUrl;
const API_MARKER_CHIAMATE = BASE_URL + environment.apiUrl.markerChiamataInCorso;

@Injectable()
export class ChiamateMarkerService {

    constructor(private http: HttpClient) {
    }

    getChiamateMarkers(): Observable<any> {
        return this.http.get(API_MARKER_CHIAMATE).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    setChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_MARKER_CHIAMATE + '/Add', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    deleteChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_MARKER_CHIAMATE + '/Delete', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    updateChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_MARKER_CHIAMATE + '/Update', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
