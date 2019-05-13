import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.mezzi;

@Injectable()
export class BoxMezziService {

    constructor(private http: HttpClient) {
    }


    public getMezzi(): Observable<any> {
        return this.http.get(API_URL).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
