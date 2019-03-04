import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';

export class GetSediMarkers {
    static readonly type = '[Sedi Marker] Get Sedi Marker';
}

export class SetSediMarkers {
    static readonly type = '[Sedi Marker] Set Sedi Marker';

    constructor(public sediMarkers: SedeMarker[]) {
    }
}
