import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';

export class GetMezziMarkers {
    static readonly type = '[Mezzi Marker] Get mezzi Marker';
}

export class SetMezziMarkers {
    static readonly type = '[Mezzi Marker] Set mezzi Marker';

    constructor(public mezziMarkers: MezzoMarker[]) {
    }
}
