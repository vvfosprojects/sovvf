import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {SedeMarker} from '../../maps-model/sede-marker.model';
import {MezzoMarker} from '../../maps-model/mezzo-marker.model';
import {Observable, of} from 'rxjs';
import {DispatcherService} from '../../dispatcher/dispatcher.service';


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

    constructor(private dispatcher: DispatcherService) {

        /**
         * dispatcher richieste
         */
        this.dispatcher.onNewRichiesteMarkersList().subscribe(richieste => {
            this.richiesteMarker = richieste;
        });

        this.dispatcher.onNewRichiestaMarker().subscribe(richiesta => {
            this.richiesteMarker.push(richiesta);
        });

        this.dispatcher.onUpdateRichiestaMarker().subscribe(richiesta => {
            this.richiesteMarker = this.richiesteMarker.map(r => r.id === richiesta.id ? richiesta : r);
        });

        this.dispatcher.onDeleteRichiestaMarker().subscribe(richiesta => {
            this.richiesteMarker.splice(this.richiesteMarker.indexOf(richiesta), 1);
        });

        /**
         * dispatcher sedi
         */
        this.dispatcher.onNewSediMarkersList().subscribe(sedi => {
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
        this.dispatcher.onNewMezziMarkersList().subscribe(mezzi => {
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

}
