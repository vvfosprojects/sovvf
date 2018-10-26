import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DispatcherSediMarkerService} from '../../../dispatcher/dispatcher-maps/sedi-marker/dispatcher-sedi-marker.service';
import {SedeMarker} from '../../../../maps/maps-model/sede-marker.model';


@Injectable({
    providedIn: 'root'
})
export class SediMarkerManagerService {

    sediMarker: SedeMarker[];

    constructor(private dispatcher: DispatcherSediMarkerService) {

        /**
         * dispatcher sedi
         */
        this.dispatcher.onNewSediMarkersList().subscribe(sedi => {
            this.sediMarker = sedi;
        });

        this.dispatcher.onNewSedeMarker().subscribe(sede => {
            this.sediMarker.push(sede);
        });

        this.dispatcher.onUpdateSedeMarker().subscribe(sede => {
            this.sediMarker = this.sediMarker.map(r => r.codice === sede.codice ? sede : r);
        });

        this.dispatcher.onDeleteSedeMarker().subscribe(sede => {
            this.sediMarker.splice(this.sediMarker.indexOf(sede), 1);
        });

    }

    getSediMarker(): Observable<SedeMarker[]> {
        return of(this.sediMarker);
    }


}
