import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';

const BASE_URL = environment.baseUrl;
const API_DISTACCAMENTI = BASE_URL + environment.apiUrl.distaccamenti;

@Injectable({
    providedIn: 'root'
})
export class DistaccamentiService {

    constructor(private http: HttpClient) {
    }

    getDistaccamenti(): Observable<Sede[]> {
        return this.http.get<Sede[]>(API_DISTACCAMENTI + '/Get');
    }

    getSediAllerta(): Observable<Sede[]> {
        return this.http.get<Sede[]>(API_DISTACCAMENTI + '/GetSediAllerta');
    }

    getSediTrasferimenti(): Observable<Sede[]> {
        return this.http.get<Sede[]>(API_DISTACCAMENTI + '/GetSediTrasferimenti');
    }

}
