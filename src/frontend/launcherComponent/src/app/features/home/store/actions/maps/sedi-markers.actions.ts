import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';

export class GetSediMarkers {
    static readonly type = '[Sedi Marker] Get Sedi Marker';

    constructor(public areaMappa: AreaMappa) {
    }
}

export class SetSediMarkers {
    static readonly type = '[Sedi Marker] Set Sedi Marker';

    constructor(public sediMarkers: SedeMarker[]) {
    }
}

export class PatchSediMarkers {
    static readonly type = '[Sedi Marker] Patch Sedi Markers';

    constructor(public payload: SedeMarker[]) {
    }
}

export class AddSediMarkers {
    static readonly type = '[Sedi Marker] Add Sedi Markers';

    constructor(public payload: SedeMarker[]) {
    }
}

export class InsertSedeMarker {
    static readonly type = '[Sedi Marker] Insert Sede Marker';

    constructor(public payload: SedeMarker, public before?: number) {
    }
}

export class UpdateSedeMarker {
    static readonly type = '[Sedi Marker] Update Sede Marker';

    constructor(public payload: SedeMarker) {
    }
}

export class RemoveSedeMarker {
    static readonly type = '[Sedi Marker] Remove Sede Marker';

    constructor(public payload: string) {
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
