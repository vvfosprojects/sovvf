import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

// Models
import {SedeMarker} from '../../../../../maps/maps-model/sede-marker.model';
import {Coordinate} from '../../../../../shared/model/coordinate.model';
import {Localita} from '../../../../../shared/model/localita.model';


@Injectable({
    providedIn: 'root'
})
export class SediMarkerServiceFake {

    private sedi: SedeMarker[] = [];

    constructor() {
    }

    public getSedi(): Observable<SedeMarker[]> {
        this.sedi = [
            new SedeMarker('1', 'Comando di Roma', new Coordinate(41.899940, 12.491270), 'Via Genova, 1, 00184 Roma RM', 'Comando'),
            new SedeMarker('2', 'Comando di Latina', new Coordinate(41.474258, 12.903250), 'Piazzale G. Carturan, 1, 04100 Latina LT', 'Comando'),
            new SedeMarker('3', 'Comando di Frosinone', new Coordinate(41.616320, 13.310050), 'Via Dei Monti Lepini, 03100 Frosinone FR', 'Comando'),
            new SedeMarker('4', 'Comando di Rieti', new Coordinate(42.397678, 12.858020), 'Via Sacchetti Sassetti, 1, 02100 Rieti RI', 'Comando'),
            new SedeMarker('5', 'Comando di Viterbo', new Coordinate(42.482290, 12.069130), 'Str. Cassia Nord, km 84, 01100 Viterbo VT', 'Comando')
        ];
        return of(this.sedi);
    }

}
