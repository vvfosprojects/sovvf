import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.baseUrl;
const API_MODULI_COLONNA_MOBILE = BASE_URL + environment.apiUrl.moduliColonnaMobile;

@Injectable({
    providedIn: 'root'
})
export class ModuliColonnaMobileService {

    constructor(private http: HttpClient) {
    }

    getListaModuli(nomeModulo: string): Observable<any> {
        return this.http.post<any>(API_MODULI_COLONNA_MOBILE + '/GetListaModuliByCodSede', { nomeModulo });
    }
}
