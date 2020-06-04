import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const BASE_URL = environment.baseUrl;
const API_URL = BASE_URL + environment.apiUrl.attivitaUtente;

@Injectable()
export class AttivitaUtenteService {


    constructor(private http: HttpClient) {
    }

    public addInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/AddInLavorazione', sintesiRichiesta);
    }

    public deleteInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/DeleteInLavorazione', sintesiRichiesta);
    }

    public addPresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/AddPresaInCarico', sintesiRichiesta);
    }

    public deletePresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(API_URL + '/DeletePresaInCarico', sintesiRichiesta);
    }

}
