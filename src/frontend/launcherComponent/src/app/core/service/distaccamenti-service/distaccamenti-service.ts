import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_DISTACCAMENTI = BASE_URL + environment.apiUrl.distaccamenti;

@Injectable({
    providedIn: 'root'
})
export class DistaccamentiService {

    constructor(private http: HttpClient) {
    }

    // TODO: tipizzare
    getDistaccamenti(): Observable<any> {
        return this.http.get<any>(API_DISTACCAMENTI + '/Get');
    }

}
