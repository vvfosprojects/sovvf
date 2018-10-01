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

    private newSedeMarker$ = new Subject<SedeMarker>();
    private updateSedeMarker$ = new Subject<SedeMarker>();
    private deleteSedeMarker$ = new Subject<SedeMarker>();

    private newMezzoMarker$ = new Subject<MezzoMarker>();
    private updateMezzoMarker$ = new Subject<MezzoMarker>();
    private deleteMezzoMarker$ = new Subject<MezzoMarker>();

    richiesteMarker: RichiestaMarker[];
    sediMarker: SedeMarker[];
    mezziMarker: MezzoMarker[];

    constructor(private mapsService: MapsService) {
    }

    /**
     *  metodi per richiedere le richieste marker al service
     */

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
     *  metodi per richiedere le sedi marker al service
     */

    onNewSediMarkersList(): Observable<SedeMarker[]> {
        this.mapsService.getSediMarker().subscribe((sediMarker: SedeMarker[]) => {
            this.sediMarker = sediMarker;

        });
        return of(this.sediMarker);
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

    /**
     *  metodi per richiedere i mezzi marker al service
     */

    onNewMezziMarkersList(): Observable<MezzoMarker[]> {
        this.mapsService.getMezziMarker().subscribe((mezzoMarker: MezzoMarker[]) => {
            this.mezziMarker = mezzoMarker;

        });
        return of(this.mezziMarker);
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
