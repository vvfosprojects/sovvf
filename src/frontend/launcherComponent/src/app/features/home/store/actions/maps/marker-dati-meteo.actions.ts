import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { MarkerDatiMeteo } from '../../../maps/maps-model/marker-dati-meteo.interface';

export class GetMarkerDatiMeteo {
    static readonly type = '[Marker] Get Meteo Marker from API';

    constructor(public id: string, public coordinate: Coordinate) {
    }
}

export class SetMarkerDatiMeteo {
    static readonly type = '[Marker] Set Marker Dati Meteo';

    constructor(public markerDatiMeteo: MarkerDatiMeteo) {
    }
}
