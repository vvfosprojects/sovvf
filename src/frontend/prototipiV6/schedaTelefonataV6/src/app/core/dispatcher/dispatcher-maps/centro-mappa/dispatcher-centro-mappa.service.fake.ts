import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';
import {CentroMappaService} from '../../../service/maps-service/centro-mappa/centro-mappa.service';
import {CentroMappa} from '../../../../maps/maps-model/centro-mappa.model';

@Injectable({
    providedIn: 'root'
})
export class DispatcherCentroMappaServiceFake {

    private updateCentroMappa$ = new Subject<CentroMappa>();

    centroMappa: CentroMappa;

    constructor(private centroMappaService: CentroMappaService) {
    }

    /**
     * metodo per richiedere il centro della mappa
     */

    onNewCentroMappa(): Observable<CentroMappa> {
        this.centroMappaService.getCentroMappa().subscribe((centro: CentroMappa) => {
            this.centroMappa = centro;
        });
        return of(this.centroMappa);
    }

    onUpdateCentroMappa(): Observable<CentroMappa> {
        return this.updateCentroMappa$;
    }

    /**
     *  TESTING METHOD PER CENTRO MAPPA
     */

    updateCentro(centro: CentroMappa) {
        this.updateCentroMappa$.next(centro);
    }

}
