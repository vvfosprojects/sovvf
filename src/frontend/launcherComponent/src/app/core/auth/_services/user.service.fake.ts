import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utente } from '../../../shared/model/utente.model';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';

@Injectable({ providedIn: 'root' })
export class UserServiceFake {

    utenti = [];

    constructor() {
    }

    getAll(): Observable<Utente[]> {
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
        return of(this.utenti);
    }

    getById(id: string): Observable<Utente> {
        const utente = this.utenti.filter(u => u.id === id)[0];
        if (!utente) {
            return of(null);
        }
        return of(utente);
    }
}
