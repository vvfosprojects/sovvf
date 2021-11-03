import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

const BASE_URL = environment.baseUrl;
const API_ZONE_EMERGENZA = BASE_URL + environment.apiUrl.zoneEmergenza;

@Injectable({
    providedIn: 'root'
})
export class ZoneEmergenzaService {

    constructor(private http: HttpClient) {
    }

    getZoneEmergenza(pagination: PaginationInterface): Observable<any> {
        const obj = {
            pagination
        };
        return this.http.post(API_ZONE_EMERGENZA, obj);
    }

    add(zonaEmergenzaParams: any): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/Add', zonaEmergenzaParams);
    }

    edit(zonaEmergenzaParams: any): Observable<any> {
        return this.http.post<any>(API_ZONE_EMERGENZA + '/Edit', zonaEmergenzaParams);
    }

    delete(id: string, codSede: string): Observable<any> {
        return this.http.get<any>(API_ZONE_EMERGENZA + '/Delete?Id=' + id);
    }
}
