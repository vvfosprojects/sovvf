import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_CHIAMATE_IN_CORSO = environment.apiUrl.maps.markers.chiamate;

@Injectable()
export class ChiamateMarkerService {

    constructor(private http: HttpClient) {
    }

    getChiamateMarkers(): Observable<any> {
        return this.http.get(API_URL_CHIAMATE_IN_CORSO).pipe(
            map((data: any) => {
                return data;
            }),
            retry(3),
            catchError(handleError)
        );
    }

}
