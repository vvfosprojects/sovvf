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

    add(formData: FormData): Observable<any> {
        return this.http.post<any>(API_POS + '/Add', formData);
    }

    edit(formData: FormData): Observable<any> {
        return this.http.post<any>(API_POS + '/Edit', formData);
    }

    delete(id: string): Observable<any> {
        return this.http.post<any>(API_POS + '/Delete', id);
    }
}
