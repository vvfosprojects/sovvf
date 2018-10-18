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
            new SedeMarker('1', 'Tuscolano I', new Localita(new Coordinate(41.881490, 12.518700)), 'Distaccamento')
            ,
            new SedeMarker('2', 'Tuscolano II', new Localita(new Coordinate(41.863930, 12.554420)), 'Distaccamento')
            ,
            new SedeMarker('3', 'Roma', new Localita(new Coordinate(41.899940, 12.491270)), 'Comando')
            ,
            new SedeMarker('3', 'Roma', new Localita(new Coordinate(41.8748856, 12.4071855)), 'Direzioni')
        ];
        return of(this.sedi);
    }

}
