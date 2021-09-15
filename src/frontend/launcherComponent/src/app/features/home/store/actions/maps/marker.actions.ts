/**
 * inizio action richieste
 */
export class SetMarkerRichiestaSelezionato {
    static readonly type = '[Marker] Set Marker Richiesta Selezionato';

    constructor(public markerRichiestaSelezionato: string) {
    }
}

export class ClearMarkerRichiestaSelezionato {
    static readonly type = '[Marker] Clear Marker Richiesta Selezionato';
}

export class SetMarkerRichiestaHover {
    static readonly type = '[Marker] Set Marker Richiesta Hover';

    constructor(public markerRichiestaHover: string) {
    }
}

export class ClearMarkerRichiestaHover {
    static readonly type = '[Marker] Clear Marker Richiesta Hover';
}


/**
 * inizio action sedi
 */
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

/**
 * inizio action schede contatto
 */
export class SetMarkerSCSelezionato {
    static readonly type = '[Marker] Set Marker SC Selezionato';

    constructor(public markerSCSelezionato: string) {
    }
}

export class ClearMarkerSCSelezionato {
    static readonly type = '[Marker] Clear Marker SC Selezionato';
}

export class SetMarkerSCHover {
    static readonly type = '[Marker] Set Marker SC Hover';

    constructor(public markerSCHover: string) {
    }
}

export class ClearMarkerSCHover {
    static readonly type = '[Marker] Clear Marker SC Hover';
}

/**
 * Action Clear marker State
 */
export class ClearMarkerState {
    static readonly type = '[Marker] Clear Marker State';
}
