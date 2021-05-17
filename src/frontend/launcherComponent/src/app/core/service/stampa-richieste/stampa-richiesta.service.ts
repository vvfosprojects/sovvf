import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_STAMPA_RICHIESTA = BASE_URL + environment.apiUrl.stampaRichiesta;

@Injectable({
    providedIn: 'root'
})

export class StampaRichiestaService {

    constructor(private http: HttpClient) {
    }

    getStampaRichiesta(obj: any): Observable<any> {
        return this.http.get<any>(API_STAMPA_RICHIESTA + '/Get?codice=' + obj.idRichiesta);
    }

    stampaRiepilogoInterventi(obj: any): Observable<any> {
        return this.http.post<any>(API_STAMPA_RICHIESTA, obj);
    }
}
