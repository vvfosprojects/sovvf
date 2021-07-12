import { AreaMappa } from '../../maps/maps-model/area-mappa-model';
import { makeLatLngBounds } from '../../../../shared/helper/mappa/function-mappa';

export class GetDataHome {
    static readonly type = '[Home] Get Data from API';
}

export class ClearDataHome {
    static readonly type = '[Home] Clear Data';
}

export class SetBoundsIniziale {
    static readonly type = '[Home] Set Bounds Iniziale';
    bounds: any;
    constructor(areaMappa: AreaMappa) {
        this.bounds = makeLatLngBounds(areaMappa);
    }
}
