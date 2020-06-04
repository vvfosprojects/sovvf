import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const BASE_URL = environment.baseUrl;
const API_CHIAMATA = BASE_URL + environment.apiUrl.chiamata;

@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public insertChiamata(chiamata: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(`${API_CHIAMATA}/Add`, chiamata);
    }

}
