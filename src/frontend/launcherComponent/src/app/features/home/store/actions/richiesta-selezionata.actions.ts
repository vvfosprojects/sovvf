
// GET
export class SetRichiestaSelezionata {
    static readonly type = '[RichiestaSelezionata] Set Richiesta Selezionata';

    constructor(public idRichiesta: string) {}
}

// CLEAR
export class ClearRichiestaSelezionata {
    static readonly type = '[RichiestaSelezionata] Clear Richiesta Selezionata';
}
