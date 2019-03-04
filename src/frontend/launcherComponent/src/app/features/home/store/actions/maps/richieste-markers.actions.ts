import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';

export class GetRichiesteMarkers {
    static readonly type = '[Richieste Marker] Get Richieste Marker';
}

export class SetRichiesteMarkers {
    static readonly type = '[Richieste Marker] Set Richieste Marker';

    constructor(public richiesteMarkers: RichiestaMarker[]) {
    }
}
