import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';
import {SediMarkerService} from '../../../service/maps-service/';
import {SedeMarker} from '../../../../features/home/maps/maps-model/sede-marker.model';


@Injectable()
export class DispatcherSediMarkerServiceFake {

    private updateSedeMarker$ = new Subject<SedeMarker>();
    private newSedeMarker$ = new Subject<SedeMarker>();
    private deleteSedeMarker$ = new Subject<SedeMarker>();

    sediMarkers: SedeMarker[];

    constructor(private sediMarkersService: SediMarkerService) {
    }

    /**
     *  metodi per richiedere le sedi marker al service
     */

    onNewSediMarkersList(): Observable<SedeMarker[]> {
        this.sediMarkersService.getSediMarkers().subscribe((sediMarker: SedeMarker[]) => {
            this.sediMarkers = sediMarker;
        });
        return of(this.sediMarkers);
    }

    onNewSedeMarker(): Observable<SedeMarker> {
        return this.newSedeMarker$;
    }

    onUpdateSedeMarker(): Observable<SedeMarker> {
        return this.updateSedeMarker$;
    }

    onDeleteSedeMarker(): Observable<SedeMarker> {
        return this.deleteSedeMarker$;
    }

}
