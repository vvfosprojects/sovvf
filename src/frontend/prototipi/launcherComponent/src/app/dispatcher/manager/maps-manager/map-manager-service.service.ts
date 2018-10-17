import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {DispatcherMapsService} from '../../dispatcher-maps.service';

import {RichiestaMarker} from '../../../maps/maps-model/richiesta-marker.model';
import {SedeMarker} from '../../../maps/maps-model/sede-marker.model';
import {MezzoMarker} from '../../../maps/maps-model/mezzo-marker.model';


@Injectable({
    providedIn: 'root'
})
export class MapManagerService {

    richiesteMarker: RichiestaMarker[];
    sediMarker: SedeMarker[];
    mezziMarker: MezzoMarker[];

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    constructor(private dispatcher: DispatcherMapsService) {

        /**
         * dispatcher marker richieste
         */
        this.dispatcher.onNewRichiesteMarkerList().subscribe((marker: RichiestaMarker[]) => {
            this.richiesteMarker = marker;
        });

        this.dispatcher.onNewRichiestaMarker().subscribe((marker: RichiestaMarker) => {
            this.richiesteMarker.push(marker);
        });

        this.dispatcher.onUpdateRichiestaMarker().subscribe((marker: RichiestaMarker) => {
            this.richiesteMarker = this.richiesteMarker.map(r => r.id === marker.id ? marker : r);
        });

        this.dispatcher.onDeleteRichiestaMarker().subscribe((marker: RichiestaMarker) => {
            this.richiesteMarker.splice(this.richiesteMarker.indexOf(marker), 1);
        });

        /**
         * dispatcher sedi
         */
        this.dispatcher.onNewSediMarkerList().subscribe(sedi => {
            this.sediMarker = sedi;
        });

        this.dispatcher.onNewSedeMarker().subscribe(sede => {
            this.sediMarker.push(sede);
        });

        this.dispatcher.onUpdateSedeMarker().subscribe(sede => {
            this.sediMarker = this.sediMarker.map(r => r.codice === sede.codice ? sede : r);
        });

        this.dispatcher.onDeleteSedeMarker().subscribe(sede => {
            this.sediMarker.splice(this.sediMarker.indexOf(sede), 1);
        });

        /**
         * dispatcher mezzi
         */
        this.dispatcher.onNewMezziMarkerList().subscribe(mezzi => {
            this.mezziMarker = mezzi;
        });

        this.dispatcher.onNewMezzoMarker().subscribe(mezzi => {
            this.mezziMarker.push(mezzi);
        });

        this.dispatcher.onUpdateMezzoMarker().subscribe(mezzi => {
            this.mezziMarker = this.mezziMarker.map(r => r.id_richiesta === mezzi.id_richiesta ? mezzi : r);
        });

        this.dispatcher.onDeleteMezzoMarker().subscribe(mezzi => {
            this.mezziMarker.splice(this.mezziMarker.indexOf(mezzi), 1);
        });
    }

    getRichiesteMarker(): Observable<RichiestaMarker[]> {
        return of(this.richiesteMarker);
    }

    getSediMarker(): Observable<SedeMarker[]> {
        return of(this.sediMarker);
    }

    getMezziMarker(): Observable<MezzoMarker[]> {
        return of(this.mezziMarker);
    }

    getMarkerFromId(id) {
        return this.richiesteMarker.find(x => x.id === id);
    }
}
