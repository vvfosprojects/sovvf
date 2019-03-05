import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { Coordinate } from '../../../../../shared/model/coordinate.model';

export class GetCentroMappa {
    static readonly type = '[Centro Mappa] Get Centro Mappa';
}

export class SetCentroMappa {
    static readonly type = '[Centro Mappa] Set Centro Mappa';

    constructor(public centroMappa: CentroMappa) {
    }
}

export class SetZoomCentroMappa {
    static readonly type = '[Centro Mappa] Set Zoom Centro Mappa';

    constructor(public zoom: number) {
    }
}

export class SetCoordCentroMappa {
    static readonly type = '[Centro Mappa] Set Coordinate Centro Mappa';

    constructor(public coordinate: Coordinate) {
    }
}
