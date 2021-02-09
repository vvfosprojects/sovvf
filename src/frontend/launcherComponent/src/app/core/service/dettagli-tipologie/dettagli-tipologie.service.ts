import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { DeleteDettaglioTipologiaDto, DettaglioTipologiaDto, GetDettaglioTipologiaByCodTipologiaDto } from '../../../shared/interface/dto/dettaglio-tipologia-dto.interface';
import { UpdateDettaglioTipologiaDto } from '../../../shared/interface/dto/dettaglio-tipologia-dto.interface';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';

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
                search: filters.search,
                codTipologia: filters.codTipologia
            },
            pagination
        };
        return this.http.post<ResponseInterface>(API_DETTAGLI_TIPOLOGIE + '/Get', obj);
    }

    getDettaglioTipologiaByCodTipologia(codTipologia: number): Observable<GetDettaglioTipologiaByCodTipologiaDto> {
        return this.http.get<GetDettaglioTipologiaByCodTipologiaDto>(API_DETTAGLI_TIPOLOGIE + '/GetByIdTipologia?idTipologia=' + codTipologia);
    }

    addDettaglioTipologia(dettaglioTipologia: DettaglioTipologiaDto): Observable<ResponseInterface> {
        return this.http.post<ResponseInterface>(API_DETTAGLI_TIPOLOGIE + '/Add', dettaglioTipologia);
    }

    updateDettaglioTipologia(dettaglioTipologia: UpdateDettaglioTipologiaDto): Observable<ResponseInterface> {
        return this.http.post<ResponseInterface>(API_DETTAGLI_TIPOLOGIE + '/Modify', dettaglioTipologia);
    }

    deleteDettagliTipologie(dettaglioTipologia: DeleteDettaglioTipologiaDto): Observable<ResponseInterface> {
        return this.http.post<ResponseInterface>(API_DETTAGLI_TIPOLOGIE + '/Delete', dettaglioTipologia);
    }

}
