import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Coordinate} from '../../../../shared/model/coordinate.model';
import {CentroMappa} from '../../../../features/home/maps/maps-model/centro-mappa.model';


@Injectable({
    providedIn: 'root'
})
export class CentroMappaServiceFake {

    private centroMappa: CentroMappa = null;

    constructor() {
    }

    getCentroMappa(): Observable<CentroMappa> {
        this.centroMappa = new CentroMappa(new Coordinate(41.8917098, 12.5005402), 12);
        return of(this.centroMappa);
    }
}
