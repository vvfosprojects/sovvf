import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DispatcherSediMarkerService } from '../../../dispatcher/dispatcher-maps';
import { SedeMarker } from '../../../../features/home/maps/maps-model/sede-marker.model';


@Injectable()
export class SediMarkerManagerService {

    sediMarker: SedeMarker[];
    private subjectSediMarkers$ = new Subject<SedeMarker[]>();

    constructor(private dispatcher: DispatcherSediMarkerService) {

        /**
         * dispatcher sedi
         */

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
        this.subjectSediMarkers$.next();
        this.dispatcher.onNewSediMarkersList()
            .subscribe({
                next: data => this.subjectSediMarkers$.next(data),
                error: data => console.log(`Errore: ${data}`)
            });
        return this.subjectSediMarkers$.asObservable();
    }

}
