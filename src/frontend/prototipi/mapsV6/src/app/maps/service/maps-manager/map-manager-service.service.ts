import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {Observable, of} from 'rxjs';
import {DispatcherService} from '../../dispatcher/dispatcher.service';

@Injectable({
    providedIn: 'root'
})
export class MapManagerService {

    richiesteMarker: RichiestaMarker[];

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    constructor(private dispatcher: DispatcherService) {

        this.dispatcher.onNewMarkerList().subscribe(richieste => {
            this.richiesteMarker = richieste;
        });

        this.dispatcher.onNewMarker().subscribe(richiesta => {
            this.richiesteMarker.push(richiesta);
        });

        this.dispatcher.onUpdateMarker().subscribe(richiesta => {
            this.richiesteMarker = this.richiesteMarker.map(r => r.id_richiesta === richiesta.id_richiesta ? richiesta : r);
        });

        this.dispatcher.onDeleteMarker().subscribe(richiesta => {
            this.richiesteMarker = this.richiesteMarker.filter(x => x.id_richiesta === richiesta.id_richiesta);
        });

    }

    getData(): Observable<RichiestaMarker[]> {
        return of(this.richiesteMarker);
    }

}
