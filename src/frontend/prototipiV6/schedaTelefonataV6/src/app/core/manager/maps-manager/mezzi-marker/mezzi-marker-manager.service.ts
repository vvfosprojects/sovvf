import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DispatcherMezziMarkerService} from '../../../dispatcher/dispatcher-maps/mezzi-marker/dispatcher-mezzi-marker.service';
import {MezzoMarker} from '../../../../maps/maps-model/mezzo-marker.model';


@Injectable({
    providedIn: 'root'
})
export class MezziMarkerManagerService {

    mezziMarker: MezzoMarker[];

    constructor(private dispatcher: DispatcherMezziMarkerService) {

        /**
         * dispatcher mezzi
         */
        this.dispatcher.onNewMezziMarkersList().subscribe(mezzi => {
            this.mezziMarker = mezzi;
        });

        this.dispatcher.onNewMezzoMarker().subscribe(mezzi => {
            this.mezziMarker.push(mezzi);
        });

        this.dispatcher.onUpdateMezzoMarker().subscribe(mezzi => {
            this.mezziMarker = this.mezziMarker.map(r => r.id_richiesta === mezzi.id_richiesta ? mezzi : r);
        });

        this.dispatcher.onDeleteMezzoMarker().subscribe(mezzi => {
            this.mezziMarker.splice(this.mezziMarker.indexOf(mezzi), 1);
        });

    }

    getMezziMarker(): Observable<MezzoMarker[]> {
        return of(this.mezziMarker);
    }

}
