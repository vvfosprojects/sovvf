import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_RICHIESTE = environment.apiUrl.genera;
const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable({
    providedIn: 'root'
})
export class GeneraTestService {

    constructor(private http: HttpClient) {
    }

    public getRichiesteStatus(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE, httpOptions).pipe(
            map((data: any) => {
                // console.log(data);
                return data;
            }),
            retry(3),
            catchError(handleError)
        );
    }
}
