import { Injectable } from '@angular/core';
import { GestioneUtente } from '../../../shared/model/gestione-utente.model';
import { of } from 'rxjs';
import { Role } from '../../../shared/model/utente.model';

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiServiceFake {

    private gestioneUtenti: GestioneUtente[];

    getGestioneUtenti() {
        this.gestioneUtenti = [
            {
                id_utente: '1',
                nome: 'Mario',
                cognome: 'Rossi',
                ruolo: Role.CallTracker,
                sede: {
                    codice: '1',
                    descrizione: 'Comando di Roma',
                    coordinate: {
                        latitudine: 41.89994,
                        longitudine: 12.49127
                    },
                    indirizzo: 'Via Genova, 1, 00184 Roma RM',
                    tipo: 'Comando',
                    regione: 'Lazio',
                    provincia: 'Roma'
                }
            },
            {
                id_utente: '2',
                nome: 'Teresio',
                cognome: 'Mancini',
                ruolo: Role.GestoreRichieste,
                sede: {
                    codice: '1',
                    descrizione: 'Comando di Roma',
                    coordinate: {
                        latitudine: 41.89994,
                        longitudine: 12.49127
                    },
                    indirizzo: 'Via Genova, 1, 00184 Roma RM',
                    tipo: 'Comando',
                    regione: 'Lazio',
                    provincia: 'Roma'
                }
            },
        ];

        return of(this.gestioneUtenti);
    }

    addUtente(nuovoUtente: GestioneUtente) {
        this.gestioneUtenti.unshift(nuovoUtente);
    }
}
