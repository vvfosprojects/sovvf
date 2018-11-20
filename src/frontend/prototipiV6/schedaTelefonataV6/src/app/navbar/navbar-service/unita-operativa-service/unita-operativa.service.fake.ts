import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaServiceFake {

    unitaOperative: Sede[];

    constructor() {
    }

    getUnitaOperative() {
        this.unitaOperative = [
            new Sede('1', 'Comando di Roma', new Coordinate(41.899940, 12.491270), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma'),
            new Sede('2', 'Comando di Latina', new Coordinate(41.474258, 12.903250), 'Piazzale G. Carturan, 1, 04100 Latina LT', 'Comando', 'Lazio', 'Latina'),
            new Sede('3', 'Comando di Frosinone', new Coordinate(41.616320, 13.310050), 'Via Dei Monti Lepini, 03100 Frosinone FR', 'Comando', 'Lazio', 'Frosinone'),
            new Sede('4', 'Comando di Rieti', new Coordinate(42.397678, 12.858020), 'Via Sacchetti Sassetti, 1, 02100 Rieti RI', 'Comando', 'Lazio', 'Rieti'),
            new Sede('5', 'Comando di Viterbo', new Coordinate(42.482290, 12.069130), 'Str. Cassia Nord, km 84, 01100 Viterbo VT', 'Comando', 'Lazio', 'Viterbo')
        ];
        return of(this.unitaOperative);
    }

}
