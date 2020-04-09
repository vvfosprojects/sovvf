import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { handleError } from 'src/app/shared/helper/handleError';
import { environment } from 'src/environments/environment.prod';
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
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/GetSchede`, filtri).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    mergeSchedeContatto(schedaUnita: SchedaContatto) {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/MergeSchede`, schedaUnita).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    undoMergeSchedeContatto(schedaUnita: SchedaContatto) {
        return this.http.post<SchedaContatto[]>(`${API_SCHEDE_CONTATTO}/UndoMergeSchede`, schedaUnita).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    setSchedaContattoLetta(codiceScheda: string, letta: boolean) {
        const obj = { codiceScheda, letta };
        return this.http.put<any>(`${API_SCHEDE_CONTATTO}/SetLetta`, obj).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    setSchedaContattoGestita(codiceScheda: string, gestita: boolean) {
        const obj = { codiceScheda, gestita };
        return this.http.put<any>(`${API_SCHEDE_CONTATTO}/SetGestita`, obj).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
