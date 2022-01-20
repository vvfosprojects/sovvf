import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { TipologiaEmergenza, ZonaEmergenza } from '../../../features/zone-emergenza/model/zona-emergenza.model';
import { Cra } from '../../../features/zone-emergenza/interface/cra.interface';

const BASE_URL = environment.baseUrl;
const API_ZONE_EMERGENZA = BASE_URL + environment.apiUrl.zoneEmergenza;

@Injectable({
    providedIn: 'root'
})
export class ZoneEmergenzaService {

    constructor(private http: HttpClient) {
    }

    getTipologieEmergenze(): Observable<{ listaTipologie: TipologiaEmergenza[] }> {
        return this.http.get<{ listaTipologie: TipologiaEmergenza[] }>(API_ZONE_EMERGENZA + '/GetTipologieEmergenza');
    }

    getZoneEmergenza(pagination: PaginationInterface): Observable<any> {
        const obj = {
            pagination
        };
        return this.http.post<any>(API_ZONE_EMERGENZA + '/GetListaEmergenzeByCodSede ', obj);
    }

    getById(idZonaEmergenza: string): Observable<{ emergenza: ZonaEmergenza }> {
        return this.http.get<{ emergenza: ZonaEmergenza }>(API_ZONE_EMERGENZA + '/GetEmergenzaById?Id=' + idZonaEmergenza);
    }

    setEventoGestito(obj: any): Observable<any> {
        return this.http.post<ZonaEmergenza>(API_ZONE_EMERGENZA + '/GestisciRichiestaEmergenza', obj);
    }

    add(zonaEmergenza: ZonaEmergenza): Observable<ZonaEmergenza> {
        return this.http.post<ZonaEmergenza>(API_ZONE_EMERGENZA + '/InsertEmergenza', zonaEmergenza);
    }

    edit(zonaEmergenza: ZonaEmergenza): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/UpdateEmergenza', zonaEmergenza);
    }

    annulla(params: { id: string, motivazione: string }): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/AnnullaEmergenza', params);
    }

    allertaEmergenzaCON(params: { id: string, descrizioneEmergenza: string }): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/AllertaEmergenza', params);
    }

    requestTipologieModuli(params: { id: string, tipologieModuli: string[] }): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/AddRichiestaEmergenza', params);
    }

    requestCra(params: { id: string, dirigenti: string[], numeroDOA: number }): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/AddRichiestaCreazioneCraEmergenza', params);
    }

    addCra(params: { idEmergenza: string, cra: Cra }): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/CreazioneCra', params);
    }
}
