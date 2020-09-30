export class SetRicercaTrasferimentoChiamata {
    static readonly type = '[RicercaTrasferimentoChiamata] Set Ricerca';

    constructor(public ricerca: any) {
    }
}

export class CleaRicercaTrasferimentoChiamata {
    static readonly type = '[RicercaTrasferimentoChiamata] Clear Ricerca';
}