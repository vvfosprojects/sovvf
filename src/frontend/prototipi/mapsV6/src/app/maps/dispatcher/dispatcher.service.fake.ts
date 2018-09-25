import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Observable, of, Subject} from 'rxjs';
import {MapsService} from '../service/maps-service/maps-service.service';

@Injectable({
    providedIn: 'root'
})
export class DispatcherServiceFake {

    private newMarker$ = new Subject<RichiestaMarker>();
    private updateMarker$ = new Subject<RichiestaMarker>();
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
        // console.log(this.richiesteMarker);
        this.newMarker$.next(marker);
    }

    updateMarker(marker: RichiestaMarker) {
        // console.log(this.richiesteMarker);
        this.updateMarker$.next(marker);
    }

    deleteMarker(marker: RichiestaMarker) {
        // console.log(this.richiesteMarker);
        this.deleteMarker$.next(marker);
    }

}
