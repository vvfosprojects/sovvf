import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltersInterface } from 'src/app/shared/interface/filters.interface';
import { PaginationInterface } from 'src/app/shared/interface/pagination.interface';
import { Observable } from 'rxjs';
import { ResponseInterface } from '../../../shared/interface/response.interface';

const BASE_URL = environment.baseUrl;
const API_TRASFERIMENTI_CHIAMATE = BASE_URL + environment.apiUrl.trasferimentoChiamata;

@Injectable({
    providedIn: 'root'
})

export class TrasferimentoChiamataService {

    constructor(private http: HttpClient) {
    }

    getTrasferimentiChiamate(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj = {
            // filters: {
            //     search: filters.search
            // },
            pagination
        };
        return this.http.post<ResponseInterface>(API_TRASFERIMENTI_CHIAMATE, obj);
    }

    getRichiesteTrasferibili(): Observable<string[]> {
        return this.http.get<string[]>(API_TRASFERIMENTI_CHIAMATE + '/GetCodiciChiamate');
    }

}
