import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';
import {RichiesteMarkerService} from '../../../service/maps-service/richieste-marker/richieste-marker.service';
import {RichiestaMarker} from '../../../../features/home/maps/maps-model/richiesta-marker.model';


@Injectable()
export class DispatcherRichiesteMarkerServiceFake {
    private updateRichiestaMarker$ = new Subject<RichiestaMarker>();
    private newRichiestaMarker$ = new Subject<RichiestaMarker>();
    private deleteRichiestaMarker$ = new Subject<RichiestaMarker>();

    richiesteMarkers: RichiestaMarker[];

    constructor(private richiesteMarkersService: RichiesteMarkerService) {
    }

    /**
     *  metodi per richiedere le richieste marker al service
     */

    onNewRichiesteMarkersList(): Observable<RichiestaMarker[]> {
        this.richiesteMarkersService.getRichiesteMarkers().subscribe((richiesteMarker: RichiestaMarker[]) => {
            this.richiesteMarkers = richiesteMarker;
        });
        return of(this.richiesteMarkers);
    }

    onNewRichiestaMarker(): Observable<RichiestaMarker> {
        return this.newRichiestaMarker$;
    }

    onUpdateRichiestaMarker(): Observable<RichiestaMarker> {
        return this.updateRichiestaMarker$;
    }

    onDeleteRichiestaMarker(): Observable<RichiestaMarker> {
        return this.deleteRichiestaMarker$;
    }

    /**
     *  TESTING METHOD PER RICHIESTE MARKER
     */

    addMarker(marker: RichiestaMarker) {
        // console.log(this.richiesteMarker);
        this.newRichiestaMarker$.next(marker);
    }

    updateMarker(marker: RichiestaMarker) {
        // console.log(this.richiesteMarker);
        this.updateRichiestaMarker$.next(marker);
    }

    deleteMarker(marker: RichiestaMarker) {
        // console.log(this.richiesteMarker);
        this.deleteRichiestaMarker$.next(marker);
    }

}
