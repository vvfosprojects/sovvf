import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const BASE_URL = environment.baseUrl;
const API_CHIAMATA = BASE_URL + environment.apiUrl.chiamata;

@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public insertChiamata(chiamata: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(`${API_CHIAMATA}/Add`, chiamata).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
