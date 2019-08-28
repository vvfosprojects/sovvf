import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetCentroMappa } from '../../store/actions/maps/centro-mappa.actions';
import { AreaMappa } from '../maps-model/area-mappa-model';
import { SetAreaMappa } from '../../store/actions/maps/area-mappa.actions';


@Injectable()
export class AgmService {

    map: any;
    centro$ = new Subject();
    area$ = new Subject<AreaMappa>();

    constructor(private store: Store) {
        /**
         * subscribe che tiene aggiornato il centro mappa, quando questo viene cambiato dall'utente
         */
        this.centro$.pipe(
            debounceTime(500)).subscribe(
            coordinate => {
                const centroMappa = new CentroMappa(
                    new Coordinate(coordinate['lat'], coordinate['lng']),
                    this.map.getZoom());
                this.store.dispatch(new SetCentroMappa(centroMappa));
            }
        );
        /**
         * observable area Mappa
         */
        this.area$.pipe(debounceTime(500)).subscribe( area => this.store.dispatch(new SetAreaMappa(area)));
    }
}
