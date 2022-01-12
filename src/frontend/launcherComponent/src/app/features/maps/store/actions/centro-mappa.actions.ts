import { CentroMappa } from '../../maps-model/centro-mappa.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';

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

export class SetZoomCentroMappaByKilometers {
    static readonly type = '[Centro Mappa] Set Zoom Centro Mappa By Kilometers';

    constructor(public totalKilometers: number) {
    }
}

export class SetCoordCentroMappa {
    static readonly type = '[Centro Mappa] Set Coordinate Centro Mappa';

    constructor(public coordinate: Coordinate) {
    }
}

export class GetInitCentroMappa {
    static readonly type = '[Centro Mappa] Get Init Centro Mappa';
}


export class GetInitZoomCentroMappa {
    static readonly type = '[Centro Mappa] Get Init Zoom Centro Mappa';
}

export class GetInitCoordCentroMappa {
    static readonly type = '[Centro Mappa] Get Init Coordinate Centro Mappa';
}

export class SetInitCentroMappa {
    static readonly type = '[Centro Mappa] Set Init Centro Mappa';

    constructor(public centroMappa: CentroMappa) {
    }
}

export class ClearCentroMappa {
    static readonly type = '[Centro Mappa] Clear Centro Mappa';
}

