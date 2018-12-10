import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';
import {RichiesteMarkerService} from '../../../service/maps-service/richieste-marker/richieste-marker.service';
import {RichiestaMarker} from '../../../../maps/maps-model/richiesta-marker.model';


@Injectable({
    providedIn: 'root'
})
export class DispatcherRichiesteMarkerService {
    private newRichiesteMarkersList$ = new Subject<RichiestaMarker[]>();
    private updateRichiestaMarker$ = new Subject<RichiestaMarker>();
    private newRichiestaMarker$ = new Subject<RichiestaMarker>();
    private deleteRichiestaMarker$ = new Subject<RichiestaMarker>();

    richiesteMarkers: RichiestaMarker[] = [];

    constructor(private richiesteMarkersService: RichiesteMarkerService) {
    }

    /**
     *  metodi per richiedere le richieste marker al service
     */

    onNewRichiesteMarkersList(): Observable<RichiestaMarker[]> {
        this.richiesteMarkersService.getRichiesteMarkers().subscribe(val => {
            let newArr;
            val.forEach(item => {
                console.log(item);
                newArr = this.richiesteMarkers;
                newArr.push(item);
            });
            this.newRichiesteMarkersList$.next(newArr);
        });

        return this.newRichiesteMarkersList$.asObservable();
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
