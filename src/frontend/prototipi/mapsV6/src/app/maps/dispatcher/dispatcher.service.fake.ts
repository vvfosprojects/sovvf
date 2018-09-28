import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Observable, of, Subject} from 'rxjs';
import {MapsService} from '../service/maps-service/maps-service.service';
import {SedeMarker} from '../maps-model/sede-marker.model';
import {MezzoMarker} from '../maps-model/mezzo-marker.model';

@Injectable({
    providedIn: 'root'
})
export class DispatcherServiceFake {

    private newRichiestaMarker$ = new Subject<RichiestaMarker>();
    private updateRichiestaMarker$ = new Subject<RichiestaMarker>();
    private deleteRichiestaMarker$ = new Subject<RichiestaMarker>();

    richiesteMarker: RichiestaMarker[];
    sediMarker: SedeMarker[];
    mezziMarker: MezzoMarker[];

    constructor(private mapsService: MapsService) {
    }

    onNewRichiesteMarkersList(): Observable<RichiestaMarker[]> {
        this.mapsService.getRichiesteMarker().subscribe((richiesteMarker: RichiestaMarker[]) => {
            this.richiesteMarker = richiesteMarker;

        });
        return of(this.richiesteMarker);
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
     *  TESTING METHOD
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
