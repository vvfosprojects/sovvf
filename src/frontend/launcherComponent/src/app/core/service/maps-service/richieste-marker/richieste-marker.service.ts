import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';
import { FiltroRichieste } from '../../../../features/home/maps/maps-model/filtro-richieste.interface';
import { AreaMappaFiltrata } from '../../../../shared/helper/query-helper';

const BASE_URL = environment.baseUrl;
const API_MARKER = BASE_URL + environment.apiUrl.markers;

@Injectable()
export class RichiesteMarkerService {


    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(areaMappa: AreaMappa, filtroRichieste?: FiltroRichieste): Observable<any> {
        return this.http.post(`${API_MARKER}/GetRichieste`, AreaMappaFiltrata(areaMappa, { filtroRichieste })).pipe(
            retry(3),
            catchError(handleError));
    }

}
