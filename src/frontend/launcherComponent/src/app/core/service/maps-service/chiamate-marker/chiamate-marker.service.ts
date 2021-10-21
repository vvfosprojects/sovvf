import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ChiamataMarker } from '../../../../features/maps/maps-model/chiamata-marker.model';
import { Sede } from '../../../../shared/model/sede.model';

const BASE_URL = environment.baseUrl;
const API_MARKER_CHIAMATE = BASE_URL + environment.apiUrl.markerChiamataInCorso;

@Injectable()
export class ChiamateMarkerService {

    constructor(private http: HttpClient) {
    }

    getChiamateMarkers(): Observable<any> {
        return this.http.get(API_MARKER_CHIAMATE);
    }

    setChiamataInCorso(marker: ChiamataMarker, competenze: Sede[]): Observable<any> {
        return this.http.post<any>(API_MARKER_CHIAMATE + '/Add', { marker, competenze });
    }

    deleteChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        return this.http.post<any>(API_MARKER_CHIAMATE + '/Delete', marker);
    }

    updateChiamataInCorso(marker: ChiamataMarker, competenze: Sede[]): Observable<any> {
        return this.http.post<any>(API_MARKER_CHIAMATE + '/Update', { marker, competenze });
    }

}
