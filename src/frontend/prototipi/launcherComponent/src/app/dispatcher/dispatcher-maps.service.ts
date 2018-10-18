import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';

import {RichiesteMarkerService} from './data/service/maps-service/richieste-marker/richieste-marker.service';
import {SediMarkerService} from './data/service/maps-service/sedi-marker/sedi-marker.service';
import {MezziMarkerService} from './data/service/maps-service/mezzi-marker/mezzi-marker.service';

import {RichiestaMarker} from '../maps/maps-model/richiesta-marker.model';
import {SedeMarker} from '../maps/maps-model/sede-marker.model';
import {MezzoMarker} from '../maps/maps-model/mezzo-marker.model';


@Injectable({
    providedIn: 'root'
})
export class DispatcherMapsService {
    private updateRichiestaMarker$ = new Subject<RichiestaMarker>();
    private newRichiestaMarker$ = new Subject<RichiestaMarker>();
    private deleteRichiestaMarker$ = new Subject<RichiestaMarker>();

    private updateSedeMarker$ = new Subject<SedeMarker>();
    private newSedeMarker$ = new Subject<SedeMarker>();
    private deleteSedeMarker$ = new Subject<SedeMarker>();

    private updateMezzoMarker$ = new Subject<MezzoMarker>();
    private newMezzoMarker$ = new Subject<MezzoMarker>();
    private deleteMezzoMarker$ = new Subject<MezzoMarker>();

    marker: RichiestaMarker[];
    sedi: SedeMarker[];
    mezzi: MezzoMarker[];

    constructor(private richiesteMarkerS: RichiesteMarkerService,
                private sediMarkerS: SediMarkerService,
                private mezziMarkerS: MezziMarkerService) {
    }

    // Richieste
    onNewRichiesteMarkerList(): Observable<RichiestaMarker[]> {
        this.richiesteMarkerS.getRichieste().subscribe((marker: RichiestaMarker[]) => {
            this.marker = marker;
        });
        return of(this.marker);
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

    // Sedi
    onNewSediMarkerList(): Observable<SedeMarker[]> {
        this.sediMarkerS.getSedi().subscribe((sedi: SedeMarker[]) => {
            this.sedi = sedi;
        });
        return of(this.sedi);
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

    // Mezzi
    onNewMezziMarkerList(): Observable<MezzoMarker[]> {
        this.mezziMarkerS.getMezzi().subscribe((mezzi: MezzoMarker[]) => {
            this.mezzi = mezzi;
        });
        return of(this.mezzi);
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
