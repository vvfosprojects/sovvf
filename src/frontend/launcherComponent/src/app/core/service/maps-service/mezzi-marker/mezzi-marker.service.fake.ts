import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MezzoMarker} from '../../../../features/home/maps/maps-model/mezzo-marker.model';
import {Coordinate} from '../../../../shared/model/coordinate.model';
import {Mezzo} from '../../../../shared/model/mezzo.model';
import {Sede} from '../../../../shared/model/sede.model';
import {Tipologia} from '../../../../shared/model/tipologia.model';


@Injectable()
export class MezziMarkerServiceFake {

    private mezziMarkers: MezzoMarker[] = [];

    constructor() {
    }

    public getMezziMarkers(): Observable<MezzoMarker[]> {
        this.mezziMarkers = [
            new MezzoMarker(
                new Coordinate(41.8311007, 12.4686518),
                new Mezzo('1', 'Autobotte', 'ABP', 'InViaggio', 1,
                    new Sede('1', '', null, null, null, null, null), 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente'),
                'RM-12842', [new Tipologia('360', 'Persona che minaccia di buttarsi da un tetto', '')], 'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.82699, 12.4879854),
                new Mezzo('1', 'Autobotte2', 'ABP', 'InRientro', 1,
                    new Sede('1', '', null, null, null, null, null), 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente'),
                'RM-12840', [new Tipologia('2', 'Incendio ed esplosione', 'fa fa-fire')],
                'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.8531486, 12.5418702),
                new Mezzo('1', 'Autobotte3', 'ABP', 'InViaggio'
                    , 5,
                    new Sede('1', '', null, null, null, null, null), 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente'),
                'RM-12841', [new Tipologia('360', 'Allagamento garage con personale da soccorrere', '')],
                'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.8935662, 12.5417044),
                new Mezzo('1', 'Autobotte3', 'ABP', 'SulPosto', 5,
                    new Sede('1', '', null, null, null, null, null), 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente'),
                'RM-12839', [new Tipologia('360', 'Cedimento sede stradale con rimozione veicolo', '')],
                'Mezzo in soccorso'
            )
        ];
        return of(this.mezziMarkers);
    }
}
