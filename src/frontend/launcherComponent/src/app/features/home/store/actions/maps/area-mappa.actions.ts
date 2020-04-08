import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';

export class SetAreaMappa {
    static readonly type = '[Area Mappa] Set Area Mappa';

    constructor(public areaMappa: AreaMappa) {
    }
}

export class GetMarkersMappa {
    static readonly type = '[Area Mappa] Get Markers Mappa';
}
