import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AddVoceRubricaInterface } from '../../../shared/interface/rubrica.interface';
import { FiltersInterface } from '../../../shared/interface/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

const BASE_URL = environment.baseUrl;
const API_ENTE = BASE_URL + environment.apiUrl.enti;


@Injectable({
    providedIn: 'root'
})
export class RubricaService {

    constructor(private http: HttpClient) {
    }

    getRubrica(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
        const obj = {
            filters: {
                search: filters.search
            },
            pagination
        };
        return this.http.post(API_ENTE + '/', obj);
    }

    addVoceRubrica(voceRubrica: AddVoceRubricaInterface): Observable<any> {
        return this.http.post<any>(API_ENTE + '/Add', voceRubrica);
    }

    updateVoceRubrica(voceRubrica: any): Observable<any> {
        return this.http.post<any>(API_ENTE + '/Update', voceRubrica);
    }

    deleteVoceRubrica(idVoceRubrica: any): Observable<any> {
        return this.http.post<any>(API_ENTE + '/Delete', idVoceRubrica);
    }
}
