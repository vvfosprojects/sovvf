import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

const BASE_URL = environment.baseUrl;
const API_POS = BASE_URL + environment.apiUrl.pos;

@Injectable({
    providedIn: 'root'
})
export class PosService {

    constructor(private http: HttpClient) {
    }

    getPos(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
        const obj = {
            filters: {
                search: filters.search
            },
            pagination
        };
        return this.http.post(API_POS, obj);
    }

    add(obj: any): Observable<any> {
        return this.http.post(API_POS, obj);
    }
}
