import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;

@Injectable()
export class RichiesteMarkerService {


    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(areaMappa: AreaMappa): Observable<any> {
        return this.http.post(API_URL_RICHIESTE, areaMappa).pipe(
            retry(3),
            catchError(handleError));
    }

}
