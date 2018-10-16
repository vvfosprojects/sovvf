import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaService {
    unitaOperative: Sede[] = [
        new Sede('1', 'Comando di Roma', new Coordinate(41.900170, 12.491000), 'Comando'),
        new Sede('2', 'Comando di Latina', new Coordinate(41.474260, 12.903250), 'Comando'),
        new Sede('3', 'Comando di Frosinone', new Coordinate(41.634870, 13.328760), 'Comando'),
        new Sede('4', 'Comando di Rieti', new Coordinate(42.397130, 12.858720), 'Comando'),
        new Sede('4', 'Comando di Viterbo', new Coordinate(42.437820, 12.093420), 'Comando')
    ];
    private unitaAttuale = new Subject<any>();

    preLoader: boolean;

    constructor() {
        this.preLoader = true;
    }

    getUnitaOperative() {
        return of(this.unitaOperative);
    }

    sendUnitaOperativaAttuale(sede) {
        this.unitaAttuale.next(sede);
    }

    clearUnitaOperativaAttuale() {
        this.unitaAttuale.next();
    }

    getUnitaOperativaAttuale(): Observable<any> {
        return this.unitaAttuale.asObservable();
    }
}

