import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherRichiesteMarkerService } from '../../../dispatcher/dispatcher-maps/richieste-marker/dispatcher-richieste-marker.service';
import { RichiestaMarker } from '../../../../maps/maps-model/richiesta-marker.model';


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

    /**
     * metodo che opacizza i marker
     * @param action
     * @param stringSearch
     */
    cambiaOpacitaMarker(action: boolean, stringSearch?: string[]) {
        if (action) {
            /**
             * annullo la precedente ricerca e ritorno null tutte le opacità
             */
            this.richiesteMarker.forEach(r => {
                r.opacita = null;
            });
            /**
             * opacizzo i marker con id diverso a quelli della ricerca
             */
            this.richiesteMarker.forEach( r => {
                stringSearch.forEach( c => {
                    if (r.id === c) {
                        // console.log(r.id);
                        r.opacita = false;
                    } else if (r.opacita !== false ) {
                        r.opacita = true;
                    }
                });
            });
        } else {
            /**
             * ritorno null a tutti i marker e tolgo l'opacità
             */
            this.richiesteMarker.forEach(r => {
                r.opacita = null;
            });
        }
    }

}
