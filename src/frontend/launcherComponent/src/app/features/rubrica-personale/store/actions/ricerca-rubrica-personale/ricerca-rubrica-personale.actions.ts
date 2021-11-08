export class SetRicercaRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Set Ricerca Personale';

    constructor(public ricerca: any) {
    }
}

export class SetStatoRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Set Stato Personale';

    constructor(public stato: string) {
    }
}

export class SetTipoRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Set Tipo Personale';

    constructor(public tipo: string) {
    }
}

export class ClearRicercaRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Clear Ricerca Personale';
}

export class ClearStatoRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Clear Stato Personale';
}

export class ClearTipoRubricaPersonale {
    static readonly type = '[RicercaRubricaPersonale] Clear Tipo Personale';
}
