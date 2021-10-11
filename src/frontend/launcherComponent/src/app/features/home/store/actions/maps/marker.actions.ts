export class SetMarkerSedeSelezionato {
    static readonly type = '[Marker] Set Marker Sede Selezionato';

    constructor(public markerSedeSelezionato: string) {
    }
}

export class ClearMarkerSedeSelezionato {
    static readonly type = '[Marker] Clear Marker Sede Selezionato';
}

export class SetMarkerSedeHover {
    static readonly type = '[Marker] Set Marker Sede Hover';

    constructor(public markerSedeHover: string) {
    }
}

export class ClearMarkerSedeHover {
    static readonly type = '[Marker] Clear Marker Sede Hover';
}

export class ClearMarkerState {
    static readonly type = '[Marker] Clear Marker State';
}
