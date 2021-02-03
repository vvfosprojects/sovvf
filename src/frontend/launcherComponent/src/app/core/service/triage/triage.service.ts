import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { ItemTriageData } from '../../../shared/interface/item-triage-data.interface';

const BASE_URL = environment.baseUrl;
const API_TRIAGE = BASE_URL + environment.apiUrl.triage;

@Injectable({
    providedIn: 'root'
})

export class TriageService {

    constructor(private http: HttpClient) {
    }

    get(codTipologia: number, codDettaglioTipologia: number): Observable<any> {
        const obj = {
            codTipologia,
            codDettaglioTipologia
        };
        return this.http.post<any>(API_TRIAGE + '/Get', obj);
    }

    add(codTipologia: number, codDettaglioTipologia: number, triage: TreeviewItem, triageData: ItemTriageData[]): Observable<any> {
        const obj = {
            codTipologia,
            codDettaglioTipologia,
            triage,
            triageData: triageData?.length ? triageData : null
        };
        console.log('Add Triage =>', obj);
        return this.http.post<any>(API_TRIAGE + '/Add', obj);
    }

    update(codTipologia: number, codDettaglioTipologia: number, triage: TreeviewItem, triageData: ItemTriageData[]): Observable<any> {
        const obj = {
            codTipologia,
            codDettaglioTipologia,
            triage,
            triageData: triageData?.length ? triageData : null
        };
        console.log('Update Triage =>', obj);
        return this.http.post<any>(API_TRIAGE + '/Update', obj);
    }

    delete(codTipologia: number, codDettaglioTipologia: number): Observable<any> {
        const obj = {
            codTipologia,
            codDettaglioTipologia
        };
        console.log('Delete Triage =>', obj);
        return this.http.post<any>(API_TRIAGE + '/Delete', obj);
    }
}
