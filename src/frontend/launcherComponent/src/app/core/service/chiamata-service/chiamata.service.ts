import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl.chiamata.currentId;



@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    private static handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }

    public getIdChiamata(): Observable<string> {
        return this.http.get<string>(API_URL).pipe(
            retry(3),
            catchError(ChiamataService.handleErrorObs)
        );
    }
}
