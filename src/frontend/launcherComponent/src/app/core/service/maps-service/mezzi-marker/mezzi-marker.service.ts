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

    public getMezziMarkers(): Observable<any> {
        return this.http.get(API_URL_MEZZI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
