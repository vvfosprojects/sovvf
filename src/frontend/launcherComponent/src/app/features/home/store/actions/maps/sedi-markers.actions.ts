import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';

export class GetSediMarkers {
    static readonly type = '[Sedi Marker] Get Sedi Marker';

    constructor(public connectionId: string) {
    }
}

export class SetSediMarkers {
    static readonly type = '[Sedi Marker] Set Sedi Marker';

    constructor(public sediMarkers: SedeMarker[]) {
    }
}

export class SetSedeMarkerById {
    static readonly type = '[Sedi Marker] Set Sede Marker by ID';

    constructor(public id?: string) {
    }
}

export class ClearSediMarkers {
    static readonly type = '[Sedi Marker] Clear Sedi Marker';
}
