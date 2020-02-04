import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../../shared/helper/handleError';
import { environment } from '../../../../../environments/environment';

const API_MARKER = environment.apiUrl.markers;

@Injectable()
export class SchedeContattoMarkerService {

    constructor(private http: HttpClient) {
    }

    getSchedeContattoMarkers(areaMappa: AreaMappa): Observable<any> {
        return this.http.post(`${API_MARKER}/GetSchedeContatto`, areaMappa).pipe(
            retry(3),
            catchError(handleError));
    }

}
