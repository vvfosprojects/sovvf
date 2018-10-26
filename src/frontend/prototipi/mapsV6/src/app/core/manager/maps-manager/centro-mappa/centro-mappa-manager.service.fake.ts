import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DispatcherCentroMappaService} from '../../../dispatcher/dispatcher-maps/centro-mappa/dispatcher-centro-mappa.service';
import {CenterService} from '../../../../maps/service/center-service/center-service.service';
import {CentroMappa} from '../../../../maps/maps-model/centro-mappa.model';


@Injectable({
    providedIn: 'root'
})
export class CentroMappaManagerServiceFake {

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
