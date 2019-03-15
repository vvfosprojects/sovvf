import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';

export class GetMezziMarkers {
    static readonly type = '[Mezzi Marker] Get Mezzi Marker';
}

export class SetMezziMarkers {
    static readonly type = '[Mezzi Marker] Set Mezzi Marker';

    constructor(public mezziMarkers: MezzoMarker[]) {
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
