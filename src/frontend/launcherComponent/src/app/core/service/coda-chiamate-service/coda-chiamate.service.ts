import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ItemGraficoCodaChiamate } from '../../../shared/interface/item-grafico-coda-chiamate';
import { DataGraficoCodaChiamateDto } from '../../../shared/interface/dto/coda-chiamate/data-grafico-coda-chiamate-dto.interface';
import { DettaglioSedeCodaChiamateDto } from '../../../shared/interface/dto/coda-chiamate/dettaglio-sede-coda-chiamate-dto.interface';

const BASE_URL = environment.baseUrl;
const API_CODA_CHIAMATE = BASE_URL + environment.apiUrl.codaChiamate;

@Injectable()
export class CodaChiamateService {

    constructor(private http: HttpClient) {
    }

    public getDataGrafico(): Observable<DataGraficoCodaChiamateDto> {
        return this.http.get<DataGraficoCodaChiamateDto>(`${API_CODA_CHIAMATE}/GetInfoIstogramma`);
    }

    public getDettaglioSede(codSede: string): Observable<DettaglioSedeCodaChiamateDto> {
        return this.http.get<DettaglioSedeCodaChiamateDto>(`${API_CODA_CHIAMATE}/GetDettaglioSede?codiceSede=` + codSede);
    }

}
