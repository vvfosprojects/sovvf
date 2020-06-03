export class SetRicercaFilterbar {
    static readonly type = '[RicercaFilterbar] Set Ricerca';

    constructor(public ricerca: any) {}
}

export class ClearRicercaFilterbar {
    static readonly type = '[RicercaFilterbar] Clear Ricerca';
}
