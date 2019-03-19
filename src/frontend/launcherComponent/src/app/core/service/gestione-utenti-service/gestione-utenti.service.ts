import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GestioneUtente } from '../../../shared/model/gestione-utente.model';

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor() {
    }

    getGestioneUtenti(): Observable<GestioneUtente[]> {
        return;
    }
}
