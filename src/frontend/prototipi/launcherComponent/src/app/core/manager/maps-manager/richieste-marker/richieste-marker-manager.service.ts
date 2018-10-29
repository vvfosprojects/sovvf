import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DispatcherRichiesteMarkerService} from '../../../dispatcher/dispatcher-maps/richieste-marker/dispatcher-richieste-marker.service';
import {RichiestaMarker} from '../../../../maps/maps-model/richiesta-marker.model';


@Injectable({
    providedIn: 'root'
})
export class RichiesteMarkerManagerService {

    richiesteMarker: RichiestaMarker[];

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    constructor(private dispatcher: DispatcherRichiesteMarkerService) {

        /**
         * dispatcher marker richieste
         */
        this.dispatcher.onNewRichiesteMarkersList().subscribe((marker: RichiestaMarker[]) => {
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

    }

    getRichiesteMarker(): Observable<RichiestaMarker[]> {
        return of(this.richiesteMarker);
    }

    getMarkerFromId(id) {
        return this.richiesteMarker.find(x => x.id === id);
    }

}
