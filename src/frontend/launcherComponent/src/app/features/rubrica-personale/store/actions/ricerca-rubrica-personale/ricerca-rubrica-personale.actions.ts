export class SetRicercaRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Set Ricerca Personale';

    constructor(public ricerca: any) {
    }
}

export class SetStatoRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Set Stato Personale';

    constructor(public stato: string[]) {
    }
}

export class ClearRicercaRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Clear Ricerca Personale';
}

export class ClearStatoRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Clear Stato Personale';
}
