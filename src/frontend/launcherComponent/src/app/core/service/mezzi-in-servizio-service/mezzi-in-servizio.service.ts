import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ResponseInterface } from '../../../shared/interface/response/response.interface';

const BASE_URL = environment.baseUrl;
const API_MEZZI_IN_SERVIZIO = BASE_URL + environment.apiUrl.mezziInServizio;

@Injectable({
    providedIn: 'root'
})
export class MezziInServizioService {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) {
    }

    public getMezziInServizio(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj = {
            filters: {
                search: filters.search,
                statiMezzo: filters.statiMezzo
            },
            pagination
        };
        return this.http.post<ResponseInterface>(`${API_MEZZI_IN_SERVIZIO}/GetListaMezzi`, obj);
    }

    public getGeneriMezzo(): Observable<any> {
        return this.http.get<any>(`${API_MEZZI_IN_SERVIZIO}/GetGeneriMezzo`);
    }
}
