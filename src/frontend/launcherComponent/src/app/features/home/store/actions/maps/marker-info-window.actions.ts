import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { MarkerDatiMeteo } from '../../../maps/maps-model/marker-dati-meteo.interface';

export class GetMarkerDatiMeteo {
    static readonly type = '[Marker Info Window] Get Meteo Marker';
    date: Date;

    constructor(public id: string, public coordinate: Coordinate) {
        this.date = new Date;
    }
}

export class GetMarkerDatiMeteoFromApi {
    static readonly type = '[Marker Info Window] Get Meteo Marker from API';
    date: Date;

    constructor(public id: string, public coordinate: Coordinate) {
        this.date = new Date;
    }
}

export class AddMarkerDatiMeteo {
    static readonly type = '[Marker Info Window] Add Marker Dati Meteo';

    constructor(public payload: MarkerDatiMeteo) {
    }
}

export class UpdateMarkerDatiMeteo {
    static readonly type = '[Marker Info Window] Update Marker Dati Meteo';

    constructor(public payload: MarkerDatiMeteo) {
    }
}
