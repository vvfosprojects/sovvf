import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';

export class GetChiamateMarkers {
    static readonly type = '[Chiamate Marker] Get Chiamate Markers';
}

export class SetChiamateMarkers {
    static readonly type = '[Chiamate Marker] Set Chiamate Markers';

    constructor(public chiamateMarkers: ChiamataMarker[]) {
    }
}

export class AddChiamateMarkers {
    static readonly type = '[Chiamate Marker] Add Chiamate Markers';

    constructor(public payload: ChiamataMarker[]) {
    }
}

export class InsertChiamataMarker {
    static readonly type = '[Chiamate Marker] Insert Chiamata Marker';

    constructor(public payload: ChiamataMarker, public mySelf?: boolean) {
    }
}

export class UpdateChiamataMarker {
    static readonly type = '[Chiamate Marker] Update Chiamata Marker';

    constructor(public payload: ChiamataMarker) {
    }
}

export class RemoveChiamataMarker {
    static readonly type = '[Chiamate Marker] Remove Chiamata Marker';

    constructor(public payload: string) {
    }
}

export class SetChiamataMarkerById {
    static readonly type = '[Chiamate Marker] Set Chiamata Marker by ID';

    constructor(public id?: string) {
    }
}

export class ClearChiamateMarkers {
    static readonly type = '[Chiamate Marker] Clear Chiamate Marker';
}
