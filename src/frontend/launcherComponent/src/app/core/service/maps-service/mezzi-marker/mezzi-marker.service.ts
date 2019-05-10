import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_MEZZI = environment.apiUrl.maps.markers.mezzi;

@Injectable()
export class MezziMarkerService {

    constructor(private http: HttpClient) {
    }

    public getMezziMarkers(signalRConnectionId: string): Observable<any> {
        return this.http.get(API_URL_MEZZI + `?id=${signalRConnectionId}`).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
