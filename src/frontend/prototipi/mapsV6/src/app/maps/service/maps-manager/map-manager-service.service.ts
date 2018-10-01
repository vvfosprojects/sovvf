import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {Observable, of} from 'rxjs';
import {DispatcherService} from '../../dispatcher/dispatcher.service';
import {SedeMarker} from '../../maps-model/sede-marker.model';
import {MezzoMarker} from '../../maps-model/mezzo-marker.model';

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
