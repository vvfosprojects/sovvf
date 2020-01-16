import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GestioneUtente } from '../../../shared/interface/gestione-utente.interface';

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiService {

    constructor() {
    }

    getGestioneUtenti(): Observable<GestioneUtente[]> {
        return;
    }

    addUtente(nuovoUtente: GestioneUtente) {
        return nuovoUtente;
    }
}
