import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChiamataMarker } from '../../../../maps/maps-model/chiamata-marker.model';


@Injectable({
    providedIn: 'root'
})
export class ChiamataMarkerManagerService {

    chiamataMarker: ChiamataMarker[];

    constructor() {
        this.chiamataMarker = [];
    }

    getChiamataMarker(): Observable<ChiamataMarker[]> {
        return of(this.chiamataMarker);
    }


}
