import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MapsService} from '../service/maps-service/maps-service.service';
import {SedeMarker} from '../maps-model/sede-marker.model';
import {MezzoMarker} from '../maps-model/mezzo-marker.model';

@Injectable({
    providedIn: 'root'
})
export class DispatcherService {

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
        this.newRichiestaMarker$.next(marker);
    }

    updateMarker(marker: RichiestaMarker) {
        this.updateRichiestaMarker$.next(marker);
    }

    deleteMarker(marker: RichiestaMarker) {
        this.deleteRichiestaMarker$.next(marker);
    }
}
