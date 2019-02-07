import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DispatcherCentroMappaService} from '../../../dispatcher/dispatcher-maps';
import {CenterService} from '../../../../features/home/maps/service/center-service/center-service.service';
import {CentroMappa} from '../../../../features/home/maps/maps-model/centro-mappa.model';


@Injectable()
export class CentroMappaManagerService {

    centroMappa: CentroMappa;

    constructor(private dispatcher: DispatcherCentroMappaService, private centroService: CenterService) {

        /**
         * dispatcher centro
         */
        this.dispatcher.onNewCentroMappa().subscribe((centro: CentroMappa) => {
            this.centroMappa = centro;
        });

        this.dispatcher.onUpdateCentroMappa().subscribe((centro: CentroMappa) => {
            this.centroService.clearCentro();
            this.centroService.sendCentro(centro);
        });
    }

    getCentro(): Observable<CentroMappa> {
        return of(this.centroMappa);
    }

    calcCenter() {
        console.log('calcolo il centro');
    }

}
