import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL_CURRENTID = environment.apiUrl.chiamata.currentId;
const API_URL_INSERIMENTO = environment.apiUrl.chiamata.inserimento;

@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public getIdChiamata(): Observable<string> {
        return this.http.get<string>(API_URL_CURRENTID).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public insertChiamata(chiamata: any): Observable<any> {
        return this.http.post<any>(API_URL_INSERIMENTO, chiamata).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
