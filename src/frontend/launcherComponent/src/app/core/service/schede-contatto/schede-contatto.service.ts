import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ResponseInterface } from '../../../shared/interface/response.interface';

const BASE_URL = environment.baseUrl;
const API_SCHEDE_CONTATTO = BASE_URL + environment.apiUrl.schedeContatto;

@Injectable({
    providedIn: 'root'
})
export class SchedeContattoService {

    constructor(private http: HttpClient) {
    }

    getSchedeContatto(filters: FiltersInterface, pagination: PaginationInterface): Observable<ResponseInterface> {
        const obj = {
            filters: {
                search: filters.search,
                gestita: filters.gestita,
                rangeVisualizzazione: filters.rangeVisualizzazione,
                classificazione: filters.classificazione
            },
            pagination
        };
        return this.http.post<ResponseInterface>(`${API_SCHEDE_CONTATTO}/GetSchede`, obj);
    }

    getSchedaContatto(codScheda: string): Observable<SchedaContatto> {
        return this.http.get<SchedaContatto>(`${API_SCHEDE_CONTATTO}/GetByCodiceScheda?Codice=` + codScheda);
    }

    mergeSchedeContatto(idSchedeContatto: string[]): Observable<any> {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/MergeSchede`, idSchedeContatto);
    }

    undoMergeSchedeContatto(schedaUnita: SchedaContatto): Observable<any> {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/UndoMergeSchede`, schedaUnita);
    }

    setSchedaContattoLetta(codiceScheda: string, letta: boolean): Observable<any> {
        const obj = { codiceScheda, letta };
        return this.http.put<any>(`${API_SCHEDE_CONTATTO}/SetLetta`, obj);
    }

    setSchedaContattoGestita(scheda: SchedaContatto, gestita: boolean): Observable<any> {
        const obj = { scheda, gestita };
        return this.http.put<any>(`${API_SCHEDE_CONTATTO}/SetGestita`, obj);
    }
}
