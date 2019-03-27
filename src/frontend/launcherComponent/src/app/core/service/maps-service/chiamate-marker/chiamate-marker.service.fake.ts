import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';


@Injectable()
export class ChiamateMarkerServiceFake {

    private chiamataMarkers: ChiamataMarker[] = [];

    constructor() {
    }

    public getChiamateMarkers(): Observable<ChiamataMarker[]> {
        this.chiamataMarkers = [];
        return of(this.chiamataMarkers);
    }

}
