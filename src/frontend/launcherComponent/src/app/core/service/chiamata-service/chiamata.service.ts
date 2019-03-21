import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.chiamata.currentId;


@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public getIdChiamata(): Observable<string> {
        return this.http.get<string>(API_URL).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
