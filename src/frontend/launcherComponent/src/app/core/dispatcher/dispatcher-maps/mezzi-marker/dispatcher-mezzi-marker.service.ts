import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MezziMarkerService } from '../../../service/maps-service/mezzi-marker/mezzi-marker.service';
import { MezzoMarker } from '../../../../features/home/maps/maps-model/mezzo-marker.model';


@Injectable()
export class DispatcherMezziMarkerService {

    private updateMezzoMarker$ = new Subject<MezzoMarker>();
    private newMezzoMarker$ = new Subject<MezzoMarker>();
    private deleteMezzoMarker$ = new Subject<MezzoMarker>();
    private subjectMezzoMarkers$ = new Subject<MezzoMarker[]>();

    constructor(private mezziMarkersService: MezziMarkerService) {
    }

    /**
     *  metodi per richiedere i mezzi marker al service
     */

    onNewMezziMarkersList(): Observable<MezzoMarker[]> {
        this.subjectMezzoMarkers$.next();
        this.mezziMarkersService.getMezziMarkers()
            .subscribe({
                next: data => this.subjectMezzoMarkers$.next(data),
                error: data => console.log(`Errore: ${data}`)
            });
        return this.subjectMezzoMarkers$.asObservable();
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
