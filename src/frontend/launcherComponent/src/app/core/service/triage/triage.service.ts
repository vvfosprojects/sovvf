import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_TRIAGE = BASE_URL + environment.apiUrl.triage;

@Injectable({
    providedIn: 'root'
})

export class TriageService {

    constructor(private http: HttpClient) {
    }

    get(codDettaglioTipologia: number): Observable<any> {
        const obj = {
            codDettaglioTipologia
        };
        return this.http.post<any>(API_TRIAGE + '/Get', obj);
    }

    save(triage: any, triageData: any[]): Observable<any> {
        const obj = {
            triage,
            triageData
        };
        console.log('Save Triage =>', obj);
        return this.http.post<any>(API_TRIAGE + '/Save', obj);
    }
}
