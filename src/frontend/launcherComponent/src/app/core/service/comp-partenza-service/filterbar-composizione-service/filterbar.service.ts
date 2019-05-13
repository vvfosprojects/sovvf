import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_FILTRI = environment.apiUrl.composizione.filtri;

@Injectable()
export class FilterbarService {

    constructor(private http: HttpClient) {
    }

    getFiltri(): Observable<any> {
        return this.http.get(API_URL_FILTRI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
