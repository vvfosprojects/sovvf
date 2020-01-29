import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utente } from '../../../shared/model/utente.model';
import { ResponseInterface } from '../../../shared/interface/response.interface';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';

@Injectable({
    providedIn: 'root'
})
export class GestioneUtentiServiceFake {

    private utenti: Utente[];

    getUtenti(): Observable<ResponseInterface> {
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
                'mario_rossi'
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

    addUtente(utente: Utente): Observable<Utente> {
        return of(utente);
    }

    removeUtente(id: string): Observable<boolean> {
        return of(true);
    }
}
