import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';
import {MezziMarkerService} from '../../../service/maps-service/mezzi-marker/mezzi-marker.service';
import {MezzoMarker} from '../../../../features/home/maps/maps-model/mezzo-marker.model';


@Injectable()
export class DispatcherMezziMarkerServiceFake {

    private updateMezzoMarker$ = new Subject<MezzoMarker>();
    private newMezzoMarker$ = new Subject<MezzoMarker>();
    private deleteMezzoMarker$ = new Subject<MezzoMarker>();

    mezziMarkers: MezzoMarker[];

    constructor(private mezziMarkersService: MezziMarkerService) {
    }

    /**
     *  metodi per richiedere i mezzi marker al service
     */

    onNewMezziMarkersList(): Observable<MezzoMarker[]> {
        this.mezziMarkersService.getMezziMarkers().subscribe((mezzoMarker: MezzoMarker[]) => {
            this.mezziMarkers = mezzoMarker;
        });
        return of(this.mezziMarkers);
    }

    onNewMezzoMarker(): Observable<MezzoMarker> {
        return this.newMezzoMarker$;
    }

    onUpdateMezzoMarker(): Observable<MezzoMarker> {
        return this.updateMezzoMarker$;
    }

    onDeleteMezzoMarker(): Observable<MezzoMarker> {
        return this.deleteMezzoMarker$;
    }

}
