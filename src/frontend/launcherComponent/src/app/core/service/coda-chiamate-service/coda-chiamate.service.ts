import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ItemGraficoCodaChiamate } from '../../../shared/interface/item-grafico-coda-chiamate';

const BASE_URL = environment.baseUrl;
const API_CODA_CHIAMATE = BASE_URL + environment.apiUrl.codaChiamate;

@Injectable()
export class CodaChiamateService {

    constructor(private http: HttpClient) {
    }

    public getDataGrafico(): Observable<ItemGraficoCodaChiamate[]> {
        return this.http.get<ItemGraficoCodaChiamate[]>(`${API_CODA_CHIAMATE}/GetInfoIstogramma`);
    }

    public dettaglioSede(): Observable<ItemGraficoCodaChiamate[]> {
        return this.http.get<ItemGraficoCodaChiamate[]>(`${API_CODA_CHIAMATE}/GetDettaglioSede`);
    }

}
