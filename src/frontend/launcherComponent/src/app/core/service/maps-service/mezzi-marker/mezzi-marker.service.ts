import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MezzoMarker } from '../../../../features/home/maps/maps-model/mezzo-marker.model';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_MEZZI = environment.apiUrl.maps.markers.mezzi;

@Injectable()
export class MezziMarkerService {

    constructor(private http: HttpClient) {
    }

    public getMezziMarkers(): Observable<MezzoMarker[]> {
        return this.http.get<MezzoMarker[]>(API_URL_MEZZI).pipe(
            map((data: MezzoMarker[]) => {
                return data;
            }),
            retry(3),
            catchError(handleError)
        );
    }

}
