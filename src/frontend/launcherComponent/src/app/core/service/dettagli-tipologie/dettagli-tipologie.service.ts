import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { DettaglioTipologiaDto } from '../../../shared/interface/dto/dettaglio-tipologia-dto.interface';

const BASE_URL = environment.baseUrl;
const API_DETTAGLI_TIPOLOGIE = BASE_URL + environment.apiUrl.dettagliTipologie;

@Injectable({
    providedIn: 'root'
})
export class DetttagliTipologieService {


    constructor(private http: HttpClient) {
    }

    getDettagliTipologie(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj = {
            filters: {
                search: filters.search
            },
            pagination
        };
        return this.http.post(API_DETTAGLI_TIPOLOGIE + '/Get', obj);
    }

    addDettaglioTipologia(dettaglioTipologia: DettaglioTipologiaDto): Observable<ResponseInterface> {
        return this.http.post(API_DETTAGLI_TIPOLOGIE + '/Add', dettaglioTipologia);
    }

    updateDettaglioTipologia(dettaglioTipologia: DettaglioTipologiaDto): Observable<ResponseInterface> {
        return this.http.post(API_DETTAGLI_TIPOLOGIE + '/Modify', dettaglioTipologia);
    }

    deleteDettagliTipologie(codDettaglioTipologia: number): Observable<ResponseInterface> {
        return this.http.post(API_DETTAGLI_TIPOLOGIE + '/Delete', codDettaglioTipologia);
    }

}
