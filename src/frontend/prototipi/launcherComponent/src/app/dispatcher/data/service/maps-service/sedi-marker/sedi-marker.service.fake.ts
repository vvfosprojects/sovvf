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
        /* this.sedi = [
            new SedeMarker('1', 'Tuscolano I', new Localita(new Coordinate(41.881490, 12.518700)), 'Distaccamento')
            ,
            new SedeMarker('2', 'Tuscolano II', new Localita(new Coordinate(41.863930, 12.554420)), 'Distaccamento')
            ,
            new SedeMarker('3', 'Roma', new Localita(new Coordinate(41.899940, 12.491270)), 'Comando')
            ,
            new SedeMarker('3', 'Roma', new Localita(new Coordinate(41.8748856, 12.4071855)), 'Direzioni')
        ]; */
        this.sedi = [
            new SedeMarker('1', 'Roma', new Localita(new Coordinate(41.899940, 12.491270)), 'Comando'),
            new SedeMarker('2', 'Latina', new Localita(new Coordinate(41.474258, 12.903250)), 'Comando'),
            new SedeMarker('3', 'Frosinone', new Localita(new Coordinate(41.616320, 13.310050)), 'Comando'),
            new SedeMarker('4', 'Rieti', new Localita(new Coordinate(42.397678, 12.858020)), 'Comando'),
            new SedeMarker('5', 'Viterbo', new Localita(new Coordinate(42.482290, 12.069130)), 'Comando')
        ];
        return of(this.sedi);
    }

}
