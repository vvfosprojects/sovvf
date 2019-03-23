import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { MarkerDatiMeteo } from '../../../maps/maps-model/marker-dati-meteo.interface';

export class GetMarkerDatiMeteo {
    static readonly type = '[Marker Info Window] Get Meteo Marker from API';
    date: Date;

    constructor(public id: string, public coordinate: Coordinate) {
        this.date = new Date;
    }
}

export class SetMarkerDatiMeteo {
    static readonly type = '[Marker Info Window] Set Marker Dati Meteo';

    constructor(public payload: MarkerDatiMeteo) {
    }
}
