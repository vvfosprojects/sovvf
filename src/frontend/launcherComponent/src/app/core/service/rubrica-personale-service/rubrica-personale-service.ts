import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

const BASE_URL = environment.baseUrl;
const API_ENTE = BASE_URL + environment.apiUrl.rubricaPersonale;


@Injectable({
    providedIn: 'root'
})
export class RubricaPersonaleService {

    constructor(private http: HttpClient) {
    }

    getRubricaPersonale(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
        const obj = {
            filters: {
                search: filters.search,
                stato: filters.stato,
                tipo: filters.tipo
            },
            pagination
        };
        return this.http.post(API_ENTE, obj);
    }
}
