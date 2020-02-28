import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utente, Role, Ruolo } from '../../../shared/model/utente.model';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../shared/interface/add-ruolo-utente.interface';
import { makeCopy } from '../../../shared/helper/function';
import { PaginationInterface } from 'src/app/shared/interface/pagination.interface';

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
                    nominativo: 'Mario Rossi'
                }
            ];
        } else {
            this.utentiVVF = [];
        }
        return of(this.utentiVVF);
    }

    getListaUtentiGestione(filters: any, pagination: PaginationInterface): Observable<ResponseInterface> {
        this.utenti = [
            new Utente(
                '1',
                'Mario',
                'Rossi',
                'MRSMXHAJ2AJAC12AC',
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
                        descrizione: Role.GestoreChiamate,
                        codSede: 'RM.1000',
                        descSede: 'Comando di Roma',
                        ricorsivo: false
                    },
                    {
                        descrizione: Role.GestoreRichieste,
                        codSede: 'FR.2000',
                        descSede: 'Comando di Frosinone',
                        ricorsivo: true
                    }
                ]
            ),
            new Utente(
                '2',
                'Francesco',
                'Verdi',
                'TESTCODICEFISCALE',
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
                        descrizione: Role.GestoreChiamate,
                        codSede: 'RM.1000',
                        descSede: 'Comando di Roma',
                        ricorsivo: true
                    },
                    {
                        descrizione: Role.GestoreRichieste,
                        codSede: 'LT.1001',
                        descSede: 'Distaccamento di Latina',
                        ricorsivo: false
                    },
                    {
                        descrizione: Role.GestoreRichieste,
                        codSede: 'FR.1002',
                        descSede: 'Distaccamento di Frosinone',
                        ricorsivo: false
                    },
                    {
                        descrizione: Role.GestoreRichieste,
                        codSede: 'FN.2000',
                        descSede: 'Distaccamento di Fondi',
                        ricorsivo: false
                    }
                ]
            )
        ];
        const response = {
            dataArray: this.utenti,
            pagination: {
                page: 1,
                pageSize: 10,
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

    addUtente(value: AddRuoloUtenteInterface): Observable<Utente> {
        return of(this.utenti[0]);
    }

    removeUtente(id: string): Observable<boolean> {
        return of(true);
    }

    removeRuoloUtente(id: string, ruolo: Ruolo): Observable<Utente> {
        let utente = this.utenti.filter(x => x.id === id)[0];
        if (utente) {
            utente = makeCopy(utente);
            utente.ruoli = utente.ruoli.filter((r: Ruolo) => r.descrizione !== ruolo.descrizione && r.codSede !== ruolo.codSede);
        }
        return of(utente);
    }
}
