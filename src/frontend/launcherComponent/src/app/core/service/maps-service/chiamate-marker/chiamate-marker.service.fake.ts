import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';
import { Localita } from '../../../../shared/model/localita.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';


@Injectable()
export class ChiamateMarkerServiceFake {

    private chiamataMarkers: ChiamataMarker[] = [];

    constructor() {
    }

    public getChiamateMarkers(): Observable<ChiamataMarker[]> {
        this.chiamataMarkers = [
            new ChiamataMarker('RM-2-pm72ta4Y', 'Alessandro Battipaglia', new Localita(
                new Coordinate(41.907230, 12.480889), 'Via Alibert, 26, 00187 Roma RM, Italia'
            )),
        ];
        return of(this.chiamataMarkers);
    }

}
