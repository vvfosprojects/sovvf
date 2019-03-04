import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';

export class GetCentroMappa {
    static readonly type = '[Centro Mappa] Get Centro Mappa';
}

export class SetCentroMappa {
    static readonly type = '[Centro Mappa] Set Centro Mappa';

    constructor(public centroMappa: CentroMappa) {
    }
}
