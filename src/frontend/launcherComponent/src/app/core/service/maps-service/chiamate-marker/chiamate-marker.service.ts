import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';

const API_URL_CHIAMATE_IN_CORSO = environment.apiUrl.maps.markers.chiamate;
const API_URL_MARKER_IN_CORSO = environment.apiUrl.chiamata.marker;

@Injectable()
export class ChiamateMarkerService {

    constructor(private http: HttpClient) {
    }

    getChiamateMarkers(): Observable<any> {
        return this.http.get(API_URL_CHIAMATE_IN_CORSO).pipe(
            retry(3),
            catchError(handleError)
        );
    }


    setChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_URL_MARKER_IN_CORSO + '/Add', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

    deleteChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_URL_MARKER_IN_CORSO + '/Delete', marker).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
