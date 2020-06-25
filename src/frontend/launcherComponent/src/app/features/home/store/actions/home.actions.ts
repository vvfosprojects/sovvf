import { Tipologia } from '../../../../shared/model/tipologia.model';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';

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

    constructor(public bounds: LatLngBounds) {
    }
}
