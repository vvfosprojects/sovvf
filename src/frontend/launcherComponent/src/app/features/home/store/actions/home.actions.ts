import { Tipologia } from '../../../../shared/model/tipologia.model';
import { LatLngBoundsLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { AreaMappa } from '../../maps/maps-model/area-mappa-model';
import { makeLatLngBounds } from '../../../../shared/helper/function';

export class ClearDataHome {
    static readonly type = '[Home] Clear Data';
}

export class GetDataHome {
    static readonly type = '[Home] Get Data from API';
}

export class SetDataTipologie {
    static readonly type = '[Home] Set Data Tipologie';

    constructor(public tipologie: Tipologia[]) {
    }
}

export class SetBoundsIniziale {
    static readonly type = '[Home] Set Bounds Iniziale';
    bounds: LatLngBoundsLiteral;
    constructor(areaMappa: AreaMappa) {
        this.bounds = makeLatLngBounds(areaMappa);
    }
}
