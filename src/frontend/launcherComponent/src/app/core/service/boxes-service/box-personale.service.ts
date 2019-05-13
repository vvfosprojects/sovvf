import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.personale;

@Injectable()
export class BoxPersonaleService {

    constructor(private http: HttpClient) {
    }

    public getPersonale(): Observable<any> {
        return this.http.get(API_URL).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
