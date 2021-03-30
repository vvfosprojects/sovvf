export class SetRicercaRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Set Ricerca Personale';

    constructor(public ricerca: any) {
    }
}

export class ClearRicercaRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Clear Ricerca Personale';
}
