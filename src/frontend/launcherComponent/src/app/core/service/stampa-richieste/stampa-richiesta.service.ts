import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RiepilogoInterventiInterface } from '../../../shared/interface/riepilogo-interventi.interface';

const BASE_URL = environment.baseUrl;
const API_STAMPA_RICHIESTA = BASE_URL + environment.apiUrl.stampaRichiesta;
const API_STAMPA_RIEPILOGO_INTERVENTI = BASE_URL + environment.apiUrl.stampaRiepilogoInterventi;
const API_SQUADRE_RIEPILOGO_INTERVENTI = BASE_URL + environment.apiUrl.squadreRiepilogoInterventi;
const API_DISTACCAMENTI_RIEPILOGO_INTERVENTI = BASE_URL + environment.apiUrl.distaccamentiRiepilogoInterventi;

@Injectable({
    providedIn: 'root'
})

export class StampaRichiestaService {

    constructor(private http: HttpClient) {
    }

    getStampaRichiesta(obj: any): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'GET',
            API_STAMPA_RICHIESTA + '/?codice=' + obj.idRichiesta + '&contentType=' + obj.contentType,
            null,
            {
                reportProgress: true,
                responseType: 'blob'
            }));
    }

    getSquadreRiepilogoIntervento(data?: string[]): Observable<any> {
         const codiciSede = data && data.length ? data : null;
         return this.http.post<any>(`${API_SQUADRE_RIEPILOGO_INTERVENTI}`, { codiciSede });
    }

    getDistaccamentiRiepilogoIntervento(): Observable<any> {
        return this.http.get<any>(`${API_DISTACCAMENTI_RIEPILOGO_INTERVENTI}`);
    }

    stampaRiepilogoInterventi(obj: RiepilogoInterventiInterface): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'POST',
            API_STAMPA_RIEPILOGO_INTERVENTI,
            obj,
            {
                reportProgress: true,
                responseType: 'blob'
            }));
    }
}
