import { ChiamataMarker } from '../../maps-model/chiamata-marker.model';

export class GetChiamateMarkers {
    static readonly type = '[Chiamate Marker] Get Chiamate Markers API';
}

export class SetChiamateMarkers {
    static readonly type = '[Chiamate Marker] Insert Chiamate Markers signalR';

    constructor(public chiamateMarkers: ChiamataMarker[]) {
    }
}

export class SetChiamataMarker {
    static readonly type = '[Chiamate Marker] Set Chiamata Marker API';

    constructor(public chiamataMarker: ChiamataMarker, public codCompetenze: string[]) {
    }
}

export class UpdateChiamataMarker {
    static readonly type = '[Chiamate Marker] Update Chiamata Marker API';

    constructor(public chiamataMarker: ChiamataMarker, public codCompetenze: string[]) {
    }
}

export class DelChiamataMarker {
    static readonly type = '[Chiamate Marker] Del Chiamata Marker API';

    constructor(public id: string) {
    }
}

export class InsertChiamataMarker {
    static readonly type = '[Chiamate Marker] Insert Chiamata Marker signalR';

    constructor(public chiamataMarker: ChiamataMarker) {
    }
}

export class UpdateItemChiamataMarker {
    static readonly type = '[Chiamate Marker] Update Item Chiamata Marker signalR';

    constructor(public chiamataMarker: ChiamataMarker) {
    }
}

export class RemoveChiamataMarker {
    static readonly type = '[Chiamate Marker] Remove Chiamata Marker signalR';

    constructor(public id: string) {
    }
}

export class StartLoadingChiamateMarkers {
    static readonly type = '[Chiamate Marker] Start Loading Chiamate Marker';
}

export class StopLoadingChiamateMarkers {
    static readonly type = '[Chiamate Marker] Stop Loading Chiamate Marker';
}

export class ClearChiamateMarkers {
    static readonly type = '[Chiamate Marker] Clear Chiamate Marker State';
}
