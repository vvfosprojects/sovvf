export class ClearRichiesteEspanse {
    static readonly type = '[Richieste Espanse] Clear Richieste Espanse';
}

export class ReducerRichiesteEspanse {
    static readonly type = '[Richieste Espanse] Reducer Richieste Espanse';

    constructor(public idRichiesta: string) {
    }
}

export class AddRichiestaEspansa {
    static readonly type = '[Richieste Espanse] Add Richiesta Espansa';

    constructor(public idRichiesta: string) {
    }
}

export class RemoveRichiestaEspansa {
    static readonly type = '[Richieste Espanse] Remove Richiesta Espansa';

    constructor(public idRichiesta: string) {
    }
}
