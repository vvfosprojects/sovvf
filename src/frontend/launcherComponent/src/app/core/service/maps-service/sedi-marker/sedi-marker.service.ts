import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';

const BASE_URL = environment.baseUrl;
const API_MARKER = BASE_URL + environment.apiUrl.markers;

@Injectable()
export class SediMarkerService {

    constructor(private http: HttpClient) {
    }

    getSediMarkers(areaMappa: AreaMappa): Observable<any> {
        return this.http.post(`${API_MARKER}/GetSedi`, areaMappa);
    }

}
