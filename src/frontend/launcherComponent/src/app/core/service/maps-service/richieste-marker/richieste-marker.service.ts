import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';
import { FiltroRichieste } from '../../../../features/home/maps/maps-model/filtro-richieste.interface';
import { AreaMappaFiltrata } from '../../../../shared/helper/query-helper';
import { Markers } from '../../../../shared/enum/markers.enum';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;

@Injectable()
export class RichiesteMarkerService {


    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(areaMappa: AreaMappa, filtroRichieste?: FiltroRichieste): Observable<any> {
        return this.http.post(API_URL_RICHIESTE, AreaMappaFiltrata(areaMappa, filtroRichieste, Markers.Richieste)).pipe(
            retry(3),
            catchError(handleError));
    }

}
