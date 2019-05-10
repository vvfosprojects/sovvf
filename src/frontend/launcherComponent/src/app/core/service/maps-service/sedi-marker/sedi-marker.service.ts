import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_SEDI = environment.apiUrl.maps.markers.sedi;

@Injectable()
export class SediMarkerService {

    constructor(private http: HttpClient) {
    }

    getSediMarkers(signalRConnectionId: string): Observable<any> {
        console.log(API_URL_SEDI + `?id=${signalRConnectionId}`);
        return this.http.get(API_URL_SEDI + `?id=${signalRConnectionId}`).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
