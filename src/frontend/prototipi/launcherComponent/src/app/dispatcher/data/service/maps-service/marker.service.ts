import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { SedeMarker } from '../../../../maps/maps-model/sede-marker.model';
import { RichiestaMarker } from '../../../../maps/maps-model/richiesta-marker.model';
import { MezzoMarker } from '../../../../maps/maps-model/mezzo-marker.model';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    private richieste: RichiestaMarker[] = [];
    private sedi: SedeMarker[] = [];
    private mezzi: MezzoMarker[] = [];

    /**
     *
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor() {
    }

    public getRichieste(): Observable<RichiestaMarker[]> {
        // chiamata http ....
        return of(this.richieste);
    }

    public getSedi(): Observable<SedeMarker[]> {
        // chiamata http ....
        return of(this.sedi);
    }

    public getMezzi(): Observable<MezzoMarker[]> {
        // chiamata http ....
        return of(this.mezzi);
    }

}
