import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const API_URL_INSERIMENTO = environment.apiUrl.chiamata.inserimento;


@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public insertChiamata(chiamata: SintesiRichiesta): Observable<any> {
        return this.http.post<SintesiRichiesta>(API_URL_INSERIMENTO, chiamata).pipe(
            // retry(3),
            catchError(handleError)
        );
    }

}
