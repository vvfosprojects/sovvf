
// GET
export class SetRichiestaFissata {
    static readonly type = '[RichiestaFissata] Set Richiesta Fissata';

    constructor(public idRichiesta: string) {}
}

// CLEAR
export class ClearRichiestaFissata {
    static readonly type = '[RichiestaFissata] Clear Richiesta Fissata';
}
