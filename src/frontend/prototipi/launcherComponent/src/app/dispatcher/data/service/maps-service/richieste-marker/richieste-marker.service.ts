import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { RichiestaMarker } from '../../../../../maps/maps-model/richiesta-marker.model';

@Injectable({
    providedIn: 'root'
})
export class RichiesteMarkerService {

    private richieste: RichiestaMarker[] = [];

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
}
