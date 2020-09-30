export class SetRicercaSquadreComposizione {
    static readonly type = '[RicercaComposizione] Set Ricerca Squadre Composizione';

    constructor(public ricerca: string) {
    }
}

export class ResetRicercaSquadreComposizione {
    static readonly type = '[RicercaComposizione] Reset Ricerca Squadre Composizione';
}

export class SetRicercaMezziComposizione {
    static readonly type = '[RicercaComposizione] Set Ricerca Mezzi Composizione';

    constructor(public ricerca: string) {
    }
}

export class ResetRicercaMezziComposizione {
    static readonly type = '[RicercaComposizione] Reset Ricerca Mezzi Composizione';
}
