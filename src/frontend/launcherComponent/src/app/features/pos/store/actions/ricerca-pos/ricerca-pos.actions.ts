export class SetRicercaPos {
    static readonly type = '[POS] Set Ricerca';

    constructor(public ricerca: any) {
    }
}

export class ClearRicercaPos {
    static readonly type = '[POS] Clear Ricerca';
}
