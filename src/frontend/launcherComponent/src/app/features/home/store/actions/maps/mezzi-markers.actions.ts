import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';

export class GetMezziMarkers {
    static readonly type = '[Mezzi Marker] Get Mezzi Marker';

    constructor(public areaMappa: AreaMappa) {
    }
}

export class SetMezziMarkers {
    static readonly type = '[Mezzi Marker] Set Mezzi Marker';

    constructor(public mezziMarkers: MezzoMarker[]) {
    }
}

export class UpdateMezzoMarker {
    static readonly type = '[Mezzi Marker] Update Mezzi Marker';

    constructor(public mezzo: MezzoMarker) {
    }
}


export class SetMezzoMarkerById {
    static readonly type = '[Mezzi Marker] Set Mezzi Marker by ID';

    constructor(public id?: string) {
    }
}

export class OpacizzaMezziMarkers {
    static readonly type = '[Mezzi Marker] Opacizza Mezzi Marker';

    constructor(public stato?: string[]) {
    }
}

export class ClearMezziMarkers {
    static readonly type = '[Mezzi Marker] Clear Mezzi Marker';
}
