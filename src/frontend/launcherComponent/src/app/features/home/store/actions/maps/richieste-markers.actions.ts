import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';

export class GetRichiesteMarkers {
    static readonly type = '[Richieste Marker] Get Richieste Markers';

    constructor(public areaMappa: AreaMappa) {
    }
}

export class SetRichiesteMarkers {
    static readonly type = '[Richieste Marker] Set Richieste Markers';

    constructor(public richiesteMarkers: RichiestaMarker[]) {
    }
}

export class PatchRichiesteMarkers {
    static readonly type = '[Richieste Marker] Patch Richieste Markers';

    constructor(public payload: RichiestaMarker[]) {
    }
}

export class AddRichiesteMarkers {
    static readonly type = '[Richieste Marker] Add Richieste Markers';

    constructor(public payload: RichiestaMarker[]) {
    }
}

export class InsertRichiestaMarker {
    static readonly type = '[Richieste Marker] Insert Richiesta Marker';

    constructor(public payload: RichiestaMarker, public before?: number) {
    }
}

export class UpdateRichiestaMarker {
    static readonly type = '[Richieste Marker] Update Richiesta Marker';

    constructor(public payload: RichiestaMarker) {
    }
}

export class RemoveRichiestaMarker {
    static readonly type = '[Richieste Marker] Remove Richiesta Marker';

    constructor(public payload: string) {
    }
}

export class SetRichiestaMarkerById {
    static readonly type = '[Richieste Marker] Set Richiesta Marker by ID';

    constructor(public id?: string) {
    }
}

export class OpacizzaRichiesteMarkers {
    static readonly type = '[Richieste Marker] Opacizza Richieste Marker';

    constructor(public stato?: string[]) {
    }
}

export class ClearRichiesteMarkers {
    static readonly type = '[Richieste Marker] Clear Richieste Marker';
}
