import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MezzoMarker } from '../../../../features/home/maps/maps-model/mezzo-marker.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Mezzo } from '../../../../shared/model/mezzo.model';
import { Sede } from '../../../../shared/model/sede.model';
import { Tipologia } from '../../../../shared/model/tipologia.model';


@Injectable()
export class MezziMarkerServiceFake {

    private mezziMarkers: MezzoMarker[] = [];

    constructor() {
    }

    public getMezziMarkers(): Observable<MezzoMarker[]> {

        this.mezziMarkers = [
            new MezzoMarker(
                new Coordinate(41.8311007, 12.4686518),
                new Mezzo('1', 'Autobotte', 'ABP', 'In Viaggio', 1,
                    new Sede('1', '', null, null, null, null, null), null, 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente', null, 'RM-12842')
            ),
            new MezzoMarker(
                new Coordinate(41.82699, 12.4879854),
                new Mezzo('2', 'Autobotte2', 'ABP', 'In Rientro', 1,
                    new Sede('1', '', null, null, null, null, null),  null, 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente', null, 'RM-12840')
            ),
            new MezzoMarker(
                new Coordinate(41.8531486, 12.5418702),
                new Mezzo('3', 'Autobotte3', 'ABP', 'In Viaggio'
                    , 5,
                    new Sede('1', '', null, null, null, null, null), null, 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente', null, 'RM-12841')
            ),
            new MezzoMarker(
                new Coordinate(41.8935662, 12.5417044),
                new Mezzo('4', 'Autobotte3', 'ABP', 'Sul Posto', 5,
                    new Sede('1', '', null, null, null, null, null), null, 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente', null, 'RM-12839')
            )
        ];

        return of(this.mezziMarkers);
    }
}
