import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

const API_URL = environment.apiUrl.rigaElencoRichieste.fake;

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {
    richieste: SintesiRichiesta[];

    constructor(private http: HttpClient) {
    }

    getSintesiRichieste(): Observable<any> {
        return this.http.get(API_URL).pipe(
            retry(3),
            catchError(this.handleErrorObs)
        );
    }

    addRichiesta() {
        return;
    }

    nuoveRichieste() {
        return [];
    }
    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}
