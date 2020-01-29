import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utente, Role } from '../../../shared/model/utente.model';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../shared/interface/add-ruolo-utente.interface';

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiServiceFake {

    private utenti: Utente[];
    private utentiVVF: UtenteVvfInterface[];

    getUtentiVVF(text: string): Observable<UtenteVvfInterface[]> {
        if (text) {
            this.utentiVVF = [
                {
                    codFiscale: 'MRSMXHAJ2AJAC12AC',
                    nominativo: 'Mario Rossi',
                    sede: 'Comando VVF Roma (RM.1000)',
                }
            ];
        } else {
            this.utentiVVF = [];
        }
        return of(this.utentiVVF);
    }

    getListaUtentiGestione(): Observable<ResponseInterface> {
        this.utenti = [
            new Utente(
                '1',
                'Mario',
                'Rossi',
                'AAAAAAAAAAAA',
                new Sede(
                    '1',
                    'Comando di Roma',
                    new Coordinate(
                        11111,
                        111111
                    ),
                    'Via Ignorasi, 3',
                    'Comando',
                    'Lazio',
                    'Roma'
                ),
                'mario_rossi',
                'test',
                [
                    {
                        descrizione: Role.CallTracker,
                        codSede: 'RM.1000',
                        descSede: 'Comando di Roma'
                    },
                    {
                        descrizione: Role.GestoreRichieste,
                        codSede: 'FR.2000',
                        descSede: 'Comando di Frosinone'
                    }
                ]
            )
        ];
        const response = {
            dataArray: this.utenti,
            pagination: {
                page: 1,
                limit: 10,
                totalItems: this.utenti.length,
                totalFilteredItems: this.utenti.length
            }
        };
        return of(response);
    }

    getUtente(id: string): Observable<Utente> {
        return of(this.utenti.filter(x => x.id === id)[0]);
    }

    updateUtente(utente: Utente): Observable<Utente> {
        return of(utente);
    }

    addRuoloUtente(value: AddRuoloUtenteInterface): Observable<Utente> {
        return of(this.utenti[0]);
    }

    removeUtente(id: string): Observable<boolean> {
        return of(true);
    }
}
