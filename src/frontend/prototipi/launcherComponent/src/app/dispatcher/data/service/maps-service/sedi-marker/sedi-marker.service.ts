import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

// Models
import {SedeMarker} from '../../../../../maps/maps-model/sede-marker.model';

@Injectable({
    providedIn: 'root'
})
export class SediMarkerService {

    private sedi: SedeMarker[] = [];

    /**
     *
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor() {
    }

    public getSedi(): Observable<SedeMarker[]> {
        // chiamata http ....
        return of(this.sedi);
    }
}
