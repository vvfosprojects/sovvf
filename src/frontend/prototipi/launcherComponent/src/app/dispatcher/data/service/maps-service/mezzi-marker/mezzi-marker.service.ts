import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { MezzoMarker } from '../../../../../maps/maps-model/mezzo-marker.model';

@Injectable({
    providedIn: 'root'
})
export class MezziMarkerService {

    private mezzi: MezzoMarker[] = [];

    /**
     *
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor() {
    }

    public getMezzi(): Observable<MezzoMarker[]> {
        // chiamata http ....
        return of(this.mezzi);
    }
}
