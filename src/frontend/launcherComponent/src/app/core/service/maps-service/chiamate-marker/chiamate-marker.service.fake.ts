import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';
import { Localita } from '../../../../shared/model/localita.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Store } from '@ngxs/store';
import { InsertChiamataMarker, InsertChiamateMarkers, RemoveChiamataMarker } from '../../../../features/home/store/actions/maps/chiamate-markers.actions';


@Injectable()
export class ChiamateMarkerServiceFake {

    private chiamataMarkers: ChiamataMarker[] = [
        new ChiamataMarker('RM-2-pm72ta4Y', 'Alessandro Battipaglia', 'RM.1000', new Localita(
            new Coordinate(41.907230, 12.480889), 'Via Alibert, 26, 00187 Roma RM, Italia'
        )),
    ];

    constructor(private store: Store) {
    }

    getChiamateMarkers(): Observable<ChiamataMarker[]> {
        this.store.dispatch(new InsertChiamateMarkers(this.chiamataMarkers));
        return of();
    }

    setChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        this.store.dispatch(new InsertChiamataMarker(marker));
        return of();
    }

    deleteChiamataInCorso(marker: ChiamataMarker): Observable<any> {
        this.store.dispatch(new RemoveChiamataMarker(marker.id));
        return of();
    }

}
