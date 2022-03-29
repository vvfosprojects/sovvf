import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

const BASE_URL = environment.baseUrl;
const API_AREA_DOCUMENTALE = BASE_URL + environment.apiUrl.areaDocumentale;

@Injectable({
    providedIn: 'root'
})
export class AreaDocumentaleService {

    constructor(private http: HttpClient) {
    }

    getDocumenti(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
        const obj = {
            filters: {
                search: filters.search,
                descCategorie: [filters.descCategoria]
            },
            pagination
        };
        return this.http.post(API_AREA_DOCUMENTALE, obj);
    }

    getDocumentoById(id: string): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'GET',
            API_AREA_DOCUMENTALE + '/GetDocumentoById?Id=' + id,
            null,
            {
                reportProgress: true,
                responseType: 'blob'
            }));
    }

    add(formData: FormData): Observable<any> {
        return this.http.post<any>(API_AREA_DOCUMENTALE + '/Add', formData);
    }

    edit(formData: FormData): Observable<any> {
        return this.http.post<any>(API_AREA_DOCUMENTALE + '/Edit', formData);
    }

    delete(id: string): Observable<any> {
        return this.http.get<any>(API_AREA_DOCUMENTALE + '/Delete?Id=' + id);
    }
}
