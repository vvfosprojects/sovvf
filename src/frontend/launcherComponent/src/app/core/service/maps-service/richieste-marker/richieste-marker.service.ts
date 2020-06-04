import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
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
        return this.http.post(`${API_MARKER}/GetRichieste`, AreaMappaFiltrata(areaMappa, { filtroRichieste }));
    }

}
