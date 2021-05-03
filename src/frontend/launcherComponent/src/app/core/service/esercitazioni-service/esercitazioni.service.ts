import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.baseUrl;
// TODO: rivedere
const API_URL = BASE_URL + environment.apiUrl.eventiRichieste;

@Injectable()
export class EsercitazioniService {

    constructor(private http: HttpClient) {
    }

    // TODO: rivedere
    getEsercitazioni(): Observable<any> {
        return this.http.get<any>(`${API_URL}`);
    }

    // TODO: rivedere
    addEsercitazione(obj: any): Observable<any> {
        return this.http.post<any>(`${API_URL}/add`, obj);
    }

}
