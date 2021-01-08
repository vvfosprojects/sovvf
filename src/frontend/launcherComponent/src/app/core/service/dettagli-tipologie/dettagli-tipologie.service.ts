import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ResponseInterface } from '../../../shared/interface/response.interface';

const BASE_URL = environment.baseUrl;
const API = BASE_URL + '';

@Injectable({
    providedIn: 'root'
})
export class DetttagliTipologieService {


    constructor(private http: HttpClient) {
    }

    // todo: completare
    getDettagliTipologie(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj = {
            filters: {
                search: filters.search
            },
            pagination
        };
        return this.http.post(API, obj);
    }

}
