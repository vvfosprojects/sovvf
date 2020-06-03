// SET
export class SetRicercaRichieste {
    static readonly type = '[RicercaRichieste] Set Ricerca';

    constructor(public ricerca: any) {}
}

export class ClearRicercaRichieste {
    static readonly type = '[RicercaRichieste] Clear Ricerca';
}
