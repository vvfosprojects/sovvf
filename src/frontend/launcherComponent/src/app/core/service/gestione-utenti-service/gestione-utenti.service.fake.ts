import { Injectable } from '@angular/core';
import { GestioneUtente } from '../../../shared/interface/gestione-utente.interface';
import { Observable, of } from 'rxjs';
import { Role } from '../../../shared/model/utente.model';
import { ResponseInterface } from '../../../shared/interface/response.interface';

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiServiceFake {

    private gestioneUtenti: GestioneUtente[];

    getUtenti(): Observable<ResponseInterface> {
        this.gestioneUtenti = [
            {
                id: '1',
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
                id: '2',
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
            }
        ];

        const response: ResponseInterface = {
            dataArray: this.gestioneUtenti,
            pagination: {
                page: 1
            }
        };
        return of(response);
    }

    updateUtente(utente: GestioneUtente): Observable<GestioneUtente> {
        return of(utente);
    }

    addUtente(utente: GestioneUtente): Observable<GestioneUtente> {
        return of(utente);
    }

    removeUtente(id: string): Observable<boolean> {
        return of(true);
    }
}
