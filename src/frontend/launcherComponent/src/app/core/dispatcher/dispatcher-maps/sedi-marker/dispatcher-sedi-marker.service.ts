import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SediMarkerService } from '../../../service/maps-service/';
import { SedeMarker } from '../../../../features/home/maps/maps-model/sede-marker.model';

@Injectable()
export class DispatcherSediMarkerService {

    private updateSedeMarker$ = new Subject<SedeMarker>();
    private newSedeMarker$ = new Subject<SedeMarker>();
    private deleteSedeMarker$ = new Subject<SedeMarker>();
    private subjectSediMarkers$ = new Subject<SedeMarker[]>();

    constructor(private sediMarkersService: SediMarkerService) {
    }

    /**
     *  metodi per richiedere le sedi marker al service
     */

    onNewSediMarkersList() {
        this.subjectSediMarkers$.next();
        this.sediMarkersService.getSediMarkers()
            .subscribe({
                next: data => this.subjectSediMarkers$.next(data),
                error: data => console.log(`Errore: ${data}`)
            });
        return this.subjectSediMarkers$.asObservable();
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
