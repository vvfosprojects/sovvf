export class SetMarkerOpachiRichieste {
    static readonly type = '[Marker Opachi] Set Marker Opachi Richieste';

    constructor(public payload: string[]) {
    }
}

export class ClearMarkerOpachiRichieste {
    static readonly type = '[Marker Opachi] Clear Marker Opachi Richieste';
}

export class SetMarkerOpachiMezzi {
    static readonly type = '[Marker Opachi] Set Marker Opachi Mezzi';

    constructor(public payload: string[]) {
    }
}

export class ClearMarkerOpachiMezzi {
    static readonly type = '[Marker Opachi] Clear Marker Opachi Mezzi';
}

export class SetMarkerOpachiSC {
    static readonly type = '[Marker Opachi] Set Marker Opachi SC';

    constructor(public payload: string[]) {
    }
}

export class ClearMarkerOpachiSC {
    static readonly type = '[Marker Opachi] Clear Marker Opachi SC';
}
