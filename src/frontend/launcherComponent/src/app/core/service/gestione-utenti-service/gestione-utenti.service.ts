import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GestioneUtente } from '../../../shared/interface/gestione-utente.interface';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl.eventiRichieste;

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor(private http: HttpClient) {
    }

    getGestioneUtenti(): Observable<GestioneUtente[]> {
        const url = `${API_URL}`;
        return this.http.get<GestioneUtente[]>(url).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    addUtente(nuovoUtente: GestioneUtente) {
        return nuovoUtente;
    }
}
