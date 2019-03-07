import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';

export class GetRichiesteMarkers {
    static readonly type = '[Richieste Marker] Get Richieste Marker';
}

export class SetRichiesteMarkers {
    static readonly type = '[Richieste Marker] Set Richieste Marker';

    constructor(public richiesteMarkers: RichiestaMarker[]) {
    }
}

export class OpacizzaRichiesteMarkers {
    static readonly type = '[Richieste Marker] Opacizza Richieste Marker';

    constructor(public stato?: string[]) {
    }
}

export class OpacizzaRichiesteMarkersById {
    static readonly type = '[Richieste Marker] Opacizza Richieste Marker By Id';

    constructor(public id?: string[]) {
    }
}
