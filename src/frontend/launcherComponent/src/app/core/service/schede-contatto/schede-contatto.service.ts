import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltriSchedeContatto } from '../../../shared/interface/filtri-schede-contatto.interface';

const BASE_URL = environment.baseUrl;
const API_SCHEDE_CONTATTO = BASE_URL + environment.apiUrl.schedeContatto;

@Injectable({
    providedIn: 'root'
})
export class SchedeContattoService {

    constructor(private http: HttpClient) {
    }

    getSchedeContatto(filtri: FiltriSchedeContatto): Observable<SchedaContatto[]> {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/GetSchede`, filtri);
    }

    mergeSchedeContatto(schedaUnita: SchedaContatto) {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/MergeSchede`, schedaUnita);
    }

    undoMergeSchedeContatto(schedaUnita: SchedaContatto) {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/UndoMergeSchede`, schedaUnita);
    }

    setSchedaContattoLetta(codiceScheda: string, letta: boolean) {
        const obj = { codiceScheda, letta };
        return this.http.put<any>(`${API_SCHEDE_CONTATTO}/SetLetta`, obj);
    }

    setSchedaContattoGestita(scheda: SchedaContatto, gestita: boolean) {
        const obj = { scheda, gestita };
        return this.http.put<any>(`${API_SCHEDE_CONTATTO}/SetGestita`, obj);
    }
}
