import { LatLngBoundsLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { AreaMappa } from '../../maps/maps-model/area-mappa-model';
import { makeLatLngBounds } from '../../../../shared/helper/function';

export class GetDataHome {
    static readonly type = '[Home] Get Data from API';
}

export class ClearDataHome {
    static readonly type = '[Home] Clear Data';
}

export class SetBoundsIniziale {
    static readonly type = '[Home] Set Bounds Iniziale';
    bounds: LatLngBoundsLiteral;
    constructor(areaMappa: AreaMappa) {
        this.bounds = makeLatLngBounds(areaMappa);
    }
}
