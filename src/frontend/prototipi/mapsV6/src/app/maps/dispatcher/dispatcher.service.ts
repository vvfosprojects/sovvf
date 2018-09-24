import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MapsService} from '../service/maps-service/maps-service.service';

@Injectable({
    providedIn: 'root'
})
export class DispatcherService {

    private updateMarker$ = new Subject<RichiestaMarker>();
    private newMarker$ = new Subject<RichiestaMarker>();
    private deleteMarker$ = new Subject<RichiestaMarker>();

    richiesteMarker: RichiestaMarker[];

    constructor(private mapsService: MapsService) {
    }

    onNewMarkerList(): Observable<RichiestaMarker[]> {
        this.mapsService.getData().subscribe((richiesteMarker: RichiestaMarker[]) => {
            this.richiesteMarker = richiesteMarker;
        });
        return of(this.richiesteMarker);
    }

    onNewMarker(): Observable<RichiestaMarker> {
        return this.newMarker$;
    }

    onUpdateMarker(): Observable<RichiestaMarker> {
        return this.updateMarker$;
    }

    onDeleteMarker(): Observable<RichiestaMarker> {
        return this.deleteMarker$;
    }

    /**
     *  TESTING METHOD
     */

    addMarker(marker: RichiestaMarker) {
        this.newMarker$.next(marker);
    }

    updateMarker(marker: RichiestaMarker) {
        this.updateMarker$.next(marker);
    }

    deleteMarker(marker: RichiestaMarker) {
        this.deleteMarker$.next(marker);
    }
}
