import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../../shared/helper/handleError';
import { environment } from '../../../../../environments/environment';
import { AreaMappaFiltrata } from '../../../../shared/helper/query-helper';
import { FiltroSchedeContatto } from '../../../../features/home/maps/maps-model/filtro-schede-contatto';

const BASE_URL = environment.baseUrl;
const API_MARKER = BASE_URL + environment.apiUrl.markers;

@Injectable()
export class SchedeContattoMarkerService {

    constructor(private http: HttpClient) {
    }

    getSchedeContattoMarkers(areaMappa: AreaMappa, filtroSchedeContatto?: FiltroSchedeContatto): Observable<any> {
        return this.http.post(`${API_MARKER}/GetSchedeContatto`, AreaMappaFiltrata(areaMappa, { filtroSchedeContatto })).pipe(
            retry(3),
            catchError(handleError));
    }

}
