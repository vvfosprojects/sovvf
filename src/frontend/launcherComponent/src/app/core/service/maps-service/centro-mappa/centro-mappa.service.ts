import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_CENTRO = environment.apiUrl.maps.markers.centro;

@Injectable()
export class CentroMappaService {

    constructor(private http: HttpClient) {
    }

    public getCentroMappa(): Observable<any> {
        return this.http.get(API_URL_CENTRO).pipe(
            map((data: any) => {
                return data;
            }),
            retry(3),
            catchError(handleError)
        );
    }

}
