import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';

export class GetChiamateMarkers {
    static readonly type = '[Chiamate Marker] Get Chiamate Markers';
}

export class SetChiamataMarker {
    static readonly type = '[Chiamate Marker] Set Chiamata Marker';

    constructor(public chiamataMarker: ChiamataMarker) {
    }
}

export class DelChiamataMarker {
    static readonly type = '[Chiamate Marker] Del Chiamata Marker';

    constructor(public id: string) {
    }
}

export class InsertChiamateMarkers {
    static readonly type = '[Chiamate Marker] Add Chiamate Markers';

    constructor(public chiamateMarkers: ChiamataMarker[]) {
    }
}

export class InsertChiamataMarker {
    static readonly type = '[Chiamate Marker] Insert Chiamata Marker';

    constructor(public chiamataMarker: ChiamataMarker) {
    }
}

export class RemoveChiamataMarker {
    static readonly type = '[Chiamate Marker] Remove Chiamata Marker';

    constructor(public id: string) {
    }
}

export class ClearChiamateMarkers {
    static readonly type = '[Chiamate Marker] Clear Chiamate Marker';
}
