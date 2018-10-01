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
            this.richiesteMarker = this.richiesteMarker.map(r => r.id_richiesta === richiesta.id_richiesta ? richiesta : r);
        });

        this.dispatcher.onDeleteRichiestaMarker().subscribe(richiesta => {
            this.richiesteMarker = this.richiesteMarker.filter(x => x.id_richiesta === richiesta.id_richiesta);
        });

        /**
         * dispatcher sedi
         */
        this.dispatcher.onNewSediMarkersList().subscribe(s => {
            this.sediMarker = s;
        });

        this.dispatcher.onNewSedeMarker().subscribe(s => {
            this.sediMarker.push(s);
        });

        this.dispatcher.onUpdateSedeMarker().subscribe(s => {
            this.sediMarker = this.sediMarker.map(r => r.sede.codice === s.sede.codice ? s : r);
        });

        this.dispatcher.onDeleteSedeMarker().subscribe(s => {
            this.sediMarker = this.sediMarker.filter(x => x.sede.codice === s.sede.codice);
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
            this.mezziMarker = this.mezziMarker.filter(x => x.id_richiesta === mezzi.id_richiesta);
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
