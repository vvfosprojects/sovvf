import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_URL_CHIAMATA = BASE_URL + environment.apiUrl.markerChiamataInCorso;


@Injectable({ providedIn: 'root' })
export class ClearUserDataService {

    constructor(private http: HttpClient) {
    }

    clearUserData(): Observable<any> {
        return this.http.get<any>(`${API_URL_CHIAMATA}/DeleteAll`);
    }
}
