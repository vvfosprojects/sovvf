export class SetMarkerSelezionato {
    static readonly type = '[Marker] Set Marker Selezionato';

    constructor(public markedMarker: any) {
    }
}

export class ClearMarkerSelezionato {
    static readonly type = '[Marker] Clear Marker Selezionato';
}
