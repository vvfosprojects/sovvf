export class SetRicercaRubrica {
    static readonly type = '[RicercaRubrica] Set Ricerca';

    constructor(public ricerca: any) {
    }
}

export class ClearRicercaRubrica {
    static readonly type = '[RicercaRubrica] Clear Ricerca';
}
